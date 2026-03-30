import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { OntologyNode, OntologyEdge } from '../../types/ontology';
import { MODEL_TYPE_CONFIG } from '../../constants';

interface GraphViewProps {
  nodes: OntologyNode[];
  edges: OntologyEdge[];
}

export const GraphView = ({ nodes, edges }: GraphViewProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g");

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Filter edges to only include those whose source and target exist in nodes
    const validEdges = edges.filter(e => 
      nodes.some(n => n.id === e.source) && 
      nodes.some(n => n.id === e.target)
    ).map(e => ({ ...e })); // Clone to avoid in-place modification issues

    const simulation = d3.forceSimulation<any>(nodes)
      .force("link", d3.forceLink<any, any>(validEdges).id(d => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(60));

    // Arrow marker
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("xoverflow", "visible")
      .append("svg:path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", "#94a3b8")
      .style("stroke", "none");

    const link = g.append("g")
      .selectAll("line")
      .data(validEdges)
      .join("line")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1)
      .attr("marker-end", "url(#arrowhead)");

    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    node.append("circle")
      .attr("r", 20)
      .attr("fill", d => MODEL_TYPE_CONFIG[d.type]?.color || "#94a3b8")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))");

    node.append("text")
      .attr("dy", 35)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("font-weight", "500")
      .attr("fill", "#475569")
      .text(d => d.name);

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as any).x)
        .attr("y1", d => (d.source as any).y)
        .attr("x2", d => (d.target as any).x)
        .attr("y2", d => (d.target as any).y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => simulation.stop();
  }, [nodes, edges]);

  return (
    <div className="w-full h-full bg-slate-50/30 relative overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
      
      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-slate-200 shadow-sm space-y-2">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">图例</div>
        {Object.entries(MODEL_TYPE_CONFIG).map(([type, config]) => (
          <div key={type} className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
            <span className="text-xs text-slate-600">{config.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
