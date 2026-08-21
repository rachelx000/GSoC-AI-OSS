import { useEffect, useId, useRef } from 'react';
import { axisBottom, axisLeft, max, scaleBand, scaleLinear, select } from 'd3';
import { wrapLabels } from '../Utils';

export default function DistributionChart({ title, description, data, color, compact = false }) {
  const containerRef = useRef(null);
  const chartId = useId().replaceAll(':', '');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const render = () => {
      const width = Math.max(container.clientWidth, 280);
      const height = compact ? 218 : 290;
      const margin = compact
        ? { top: 22, right: 12, bottom: 54, left: 30 }
        : { top: 28, right: 14, bottom: 70, left: 32 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
      const svg = select(container).select('svg');
      // const tooltip = select(container).select('.chart-tooltip');
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      svg.selectAll('*').remove();
      svg.attr('viewBox', `0 0 ${width} ${height}`).attr('height', height);

      const x = scaleBand()
        .domain(data.map((item) => item.label))
        .range([0, innerWidth])
        .padding(0.3);
      const y = scaleLinear()
        .domain([0, max(data, (item) => item.count) || 1])
        .nice()
        .range([innerHeight, 0]);
      const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

      chart
        .append('g')
        .attr('class', 'chart-grid')
        .call(
          axisLeft(y)
            .ticks(4)
            .tickSize(-innerWidth)
            .tickFormat((value) => (Number.isInteger(value) ? value : '')),
        )
        .call((group) => group.select('.domain').remove());

      chart
        .append('g')
        .attr('class', 'chart-axis')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(axisBottom(x).tickSize(0).tickPadding(12))
        .call((group) => group.select('.domain').remove())
        .selectAll('.tick text')
        .call(wrapLabels, Math.max(54, x.bandwidth() + 18));

      const bars = chart
        .append('g')
        .attr('class', 'chart-bars')
        .selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', (item) => x(item.label))
        .attr('width', x.bandwidth())
        .attr('y', y(0))
        .attr('height', 0)
        .attr('rx', 8)
        .attr('fill', color);

      bars
        .transition()
        .duration(reducedMotion ? 0 : 420)
        .attr('y', (item) => y(item.count))
        .attr('height', (item) => innerHeight - y(item.count));

      chart
        .append('g')
        .attr('class', 'chart-values')
        .selectAll('text')
        .data(data)
        .join('text')
        .attr('x', (item) => x(item.label) + x.bandwidth() / 2)
        .attr('y', (item) => y(item.count) - 9)
        .attr('text-anchor', 'middle')
        .text((item) => item.count);
    };

    render();
    const observer = new ResizeObserver(render);
    observer.observe(container);
    return () => observer.disconnect();
  }, [color, compact, data]);

  const accessibleSummary = data.map((item) => `${item.label}: ${item.count}`).join('; ');

  return (
    <article className={`chart-card${compact ? ' chart-card-compact' : ''}`}>
      <div className="chart-heading">
        <h3 id={`${chartId}-title`}>{title}</h3>
        <p>{description}</p>
      </div>
      <div ref={containerRef} className="chart-shell">
        <svg
          role="group"
          aria-labelledby={`${chartId}-title`}
          aria-label={`${title}. ${accessibleSummary}`}
        />
      </div>
    </article>
  );
}
