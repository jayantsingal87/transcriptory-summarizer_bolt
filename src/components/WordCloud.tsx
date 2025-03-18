
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import cloud from 'd3-cloud';

interface WordCloudProps {
  data: { text: string; value: number }[];
  width?: number;
  height?: number;
}

export function WordCloud({ data, width = 500, height = 300 }: WordCloudProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const layout = cloud()
      .size([width, height])
      .words(data.map(d => ({ text: d.text, size: 10 + d.value / 5 })))
      .padding(5)
      .rotate(() => ~~(Math.random() * 2) * 90)
      .fontSize(d => (d as any).size)
      .on("end", draw);

    layout.start();

    function draw(words: any[]) {
      const colorScale = scaleOrdinal<string>(schemeCategory10);
      
      d3.select(svgRef.current)
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1])
        .append("g")
        .attr("transform", `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`)
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", d => `${d.size}px`)
        .style("font-family", "Impact")
        .style("fill", (_, i) => colorScale(i.toString()))
        .attr("text-anchor", "middle")
        .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
        .text(d => d.text);
    }
  }, [data, width, height]);

  return (
    <div className="overflow-hidden">
      <svg ref={svgRef} className="mx-auto" width={width} height={height}></svg>
    </div>
  );
}
