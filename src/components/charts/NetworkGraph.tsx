import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { ConnectionNode, ConnectionEdge } from '../../types/analytics';
import { useData } from '../../hooks/useData';
import { Info } from 'lucide-react';

interface NetworkGraphProps {
  nodes: ConnectionNode[];
  edges: ConnectionEdge[];
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({ nodes, edges }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { openEvidenceModal, allReceipts } = useData();

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const width = svgRef.current.clientWidth || 800;
    const height = 550;

    // Clear existing graph
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto;');

    // Zoom container
    const container = svg.append('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 4])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    // Deep clone nodes and edges for D3 simulation mutation
    const simNodes = nodes.map(d => ({ ...d }));
    const simLinks = edges.map(d => ({ ...d }));

    const simulation = d3
      .forceSimulation(simNodes as any)
      .force(
        'link',
        d3.forceLink(simLinks)
          .id((d: any) => d.id)
          .distance(90)
      )
      .force('charge', d3.forceManyBody().strength(-140))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(25));

    // Render Edges
    const link = container
      .append('g')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(simLinks)
      .join('line')
      .attr('stroke', (d: any) => {
        return d.weight > 0.7 ? '#a855f7' : '#334155';
      })
      .attr('stroke-width', (d: any) => Math.max(1, d.weight * 3));

    // Render Nodes
    const nodeGroup = container
      .append('g')
      .selectAll('g')
      .data(simNodes)
      .join('g')
      .style('cursor', 'pointer')
      .on('click', (_, d: any) => {
        const receipt = allReceipts.find(r => r.id === d.receiptId);
        if (receipt) {
          openEvidenceModal(`Connection Evidence: ${d.title}`, [receipt]);
        }
      })
      .call(
        d3
          .drag<any, any>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Circles
    nodeGroup
      .append('circle')
      .attr('r', (d: any) => (d.amount ? Math.min(18, 8 + Math.sqrt(d.amount) / 10) : 8))
      .attr('fill', (d: any) => {
        if (d.source === 'finance') return '#f97316';
        if (d.source === 'spotify') return '#a855f7';
        return '#10b981';
      })
      .attr('stroke', '#0b0d12')
      .attr('stroke-width', 2)
      .attr('class', 'transition-all hover:scale-125');

    // Labels
    nodeGroup
      .append('text')
      .text((d: any) => (d.title.length > 12 ? d.title.slice(0, 12) + '…' : d.title))
      .attr('x', 12)
      .attr('y', 4)
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-family', 'sans-serif');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      nodeGroup.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, edges, allReceipts, openEvidenceModal]);

  return (
    <div className="relative w-full bg-surface/60 border border-surfaceBorder rounded-2xl overflow-hidden glass-panel p-2">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3 bg-background/80 p-2 rounded-xl border border-surfaceBorder text-xs">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-accentFinance"></span>
          <span className="text-gray-300">Finance</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-accentMusic"></span>
          <span className="text-gray-300">Spotify</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-accentHousehold"></span>
          <span className="text-gray-300">Household</span>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10 text-[11px] text-gray-400 flex items-center gap-1 bg-background/80 px-3 py-1 rounded-full border border-surfaceBorder">
        <Info className="w-3.5 h-3.5 text-accentCyan" />
        <span>Click node to view evidence drawer • Drag to rearrange • Scroll to zoom</span>
      </div>

      <svg ref={svgRef} className="w-full h-[550px] cursor-grab active:cursor-grabbing" />
    </div>
  );
};
