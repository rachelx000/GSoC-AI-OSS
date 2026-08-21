import { useEffect, useId, useMemo, useRef } from 'react';
import { axisLeft, axisTop, max, rollup, scaleBand, scaleLinear, select } from 'd3';
import { aiUseOrder, stanceOrder } from '../data/demographics';
import { wrapLabels } from '../Utils';

export default function AiUseStanceHeatmap({ participants, description, onStanceSelect }) {
  const containerRef = useRef(null);
  const titleId = useId().replaceAll(':', '');
  const chartData = useMemo(() => {
    const matrixCounts = rollup(
      participants,
      (group) => group.length,
      (participant) => participant.aiUse,
      (participant) => participant.stance,
    );
    const stanceCounts = rollup(participants, (group) => group.length, (participant) => participant.stance);
    const useCounts = rollup(participants, (group) => group.length, (participant) => participant.aiUse);

    return {
      matrix: aiUseOrder.flatMap((aiUse) =>
        stanceOrder.map((stance) => ({
          aiUse,
          stance,
          count: matrixCounts.get(aiUse)?.get(stance) ?? 0,
        })),
      ),
      stanceTotals: stanceOrder.map((label) => ({ label, count: stanceCounts.get(label) ?? 0 })),
      useTotals: aiUseOrder.map((label) => ({ label, count: useCounts.get(label) ?? 0 })),
    };
  }, [participants]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const render = () => {
      const width = Math.max(container.clientWidth, 600);
      const height = 450;
      const heatLeft = 160;
      const heatTop = 175;
      const heatRight = 12;
      const heatBottom = 16;
      const heatWidth = width - heatLeft - heatRight;
      const heatHeight = height - heatTop - heatBottom;
      const svg = select(container).select('svg');
      const tooltip = select(container).select('.chart-tooltip');

      svg.selectAll('*').remove();
      svg.attr('viewBox', `0 0 ${width} ${height}`).attr('width', width).attr('height', height);

      const x = scaleBand().domain(stanceOrder).range([0, heatWidth]).padding(0.055);
      const y = scaleBand().domain(aiUseOrder).range([0, heatHeight]).padding(0.055);
      const maxCount = max(chartData.matrix, (item) => item.count) || 1;
      const fill = scaleLinear()
        .domain([0, Math.max(1, maxCount / 2), maxCount])
        .range(['#fff7fa', '#8fb8d5', '#2f6f98']);
      const topBaseline = 90;
      const topY = scaleLinear()
        .domain([0, max(chartData.stanceTotals, (item) => item.count) || 1])
        .range([topBaseline, 16]);
      const leftBarWidth = scaleLinear()
        .domain([0, max(chartData.useTotals, (item) => item.count) || 1])
        .range([0, 48]);
      const chart = svg.append('g').attr('transform', `translate(${heatLeft},${heatTop})`);

      svg
        .append('text')
        .attr('class', 'orientation-axis-title')
        .attr('x', heatLeft + heatWidth / 2)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .text('AI stance frequency');

      svg
        .append('g')
        .attr('class', 'orientation-histogram orientation-histogram-top')
        .selectAll('rect')
        .data(chartData.stanceTotals)
        .join('rect')
        .attr('x', (item) => heatLeft + x(item.label) + x.bandwidth() * 0.22)
        .attr('y', (item) => topY(item.count) + 55)
        .attr('width', x.bandwidth() * 0.56)
        .attr('height', (item) => topBaseline - topY(item.count) - 5)
        .attr('rx', 6);

      svg
        .append('g')
        .attr('class', 'orientation-histogram-values')
        .selectAll('text')
        .data(chartData.stanceTotals)
        .join('text')
        .attr('x', (item) => heatLeft + x(item.label) + x.bandwidth() / 2)
        .attr('y', (item) => topY(item.count) + 50)
        .attr('text-anchor', 'middle')
        .text((item) => item.count);

      chart
        .append('g')
        .attr('class', 'heatmap-axis heatmap-axis-x')
        .call(axisTop(x).tickSize(0).tickPadding(15))
        .call((group) => group.select('.domain').remove())
        .selectAll('.tick text')
        .call(wrapLabels, Math.max(56, x.bandwidth() - 8));

      chart
        .append('g')
        .attr('class', 'heatmap-axis heatmap-axis-y')
        .call(axisLeft(y).tickSize(0).tickPadding(5))
        .call((group) => group.select('.domain').remove());

      svg
        .append('text')
        .attr('class', 'orientation-axis-title orientation-axis-title-left')
        .attr('transform', `translate(-10,${heatTop + heatHeight / 2}) rotate(-90)`)
        .attr('text-anchor', 'middle')
        .text('OSS AI use frequency');

      svg
        .append('g')
        .attr('class', 'orientation-histogram orientation-histogram-left')
        .selectAll('rect')
        .data(chartData.useTotals)
        .join('rect')
        .attr('x', (item) => 75 - leftBarWidth(item.count))
        .attr('y', (item) => heatTop + y(item.label) + y.bandwidth() * 0.2)
        .attr('width', (item) => leftBarWidth(item.count) + 5)
        .attr('height', y.bandwidth() * 0.6)
        .attr('rx', 5);

      svg
        .append('g')
        .attr('class', 'orientation-histogram-values orientation-histogram-values-left')
        .selectAll('text')
        .data(chartData.useTotals)
        .join('text')
        .attr('x', (item) => 70 - leftBarWidth(item.count))
        .attr('y', (item) => heatTop + y(item.label) + y.bandwidth() / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .text((item) => item.count);

      const showTooltip = (event, item) => {
        const containerRect = container.getBoundingClientRect();
        const targetRect = event.currentTarget.getBoundingClientRect();
        const left = event.clientX
          ? event.clientX - containerRect.left
          : targetRect.left - containerRect.left + targetRect.width / 2;
        const top = event.clientY
          ? event.clientY - containerRect.top
          : targetRect.top - containerRect.top;

        tooltip
          .text(`${item.aiUse} × ${item.stance}: ${item.count}`)
          .style('left', `${left}px`)
          .style('top', `${top}px`)
          .attr('data-visible', 'true');

        onStanceSelect?.(item.stance);
      };

      chart
        .append('g')
        .attr('class', 'heatmap-cells')
        .selectAll('rect')
        .data(chartData.matrix)
        .join('rect')
        .attr('x', (item) => x(item.stance))
        .attr('y', (item) => y(item.aiUse))
        .attr('width', x.bandwidth())
        .attr('height', y.bandwidth())
        .attr('rx', 8)
        .attr('fill', (item) => fill(item.count))
        .attr('tabindex', 0)
        .attr('role', 'img')
        .attr('aria-label', (item) => `${item.aiUse}, ${item.stance}: ${item.count} interviews`)
        .on('pointerenter focus', showTooltip)
        .on('pointermove', showTooltip)
        .on('click', (event, item) => onStanceSelect?.(item.stance))
        .on('keydown', (event, item) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onStanceSelect?.(item.stance);
          }
        })
        .on('pointerleave blur', () => tooltip.attr('data-visible', 'false'));

      chart
        .append('g')
        .attr('class', 'heatmap-values')
        .selectAll('text')
        .data(chartData.matrix)
        .join('text')
        .attr('x', (item) => x(item.stance) + x.bandwidth() / 2)
        .attr('y', (item) => y(item.aiUse) + y.bandwidth() / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .attr('fill', (item) => (item.count >= 2 ? '#fff' : '#29445a'))
        .text((item) => item.count);
    };

    render();
    const observer = new ResizeObserver(render);
    observer.observe(container);
    return () => observer.disconnect();
  }, [chartData, onStanceSelect]);

  const accessibleSummary = chartData.matrix
    .filter((item) => item.count > 0)
    .map((item) => `${item.aiUse} and ${item.stance}: ${item.count}`)
    .join('; ');

  return (
    <figure className="orientation-figure">
      <figcaption className="orientation-figure-heading">
        <div className="orientation-figure-copy">
          <p className="orientation-figure-description">{description}</p>
          <h3 id={`${titleId}-title`}>OSS AI use × analyst-coded stance</h3>
          <p className="orientation-figure-guide">
            Top: stance counts · Left: use-frequency counts · Center: cross-tabulated interviews
          </p>
        </div>
        <div className="heatmap-legend" aria-hidden="true">
          <span>0</span>
          <i />
          <i />
          <i />
          <span>3</span>
        </div>
      </figcaption>
      <div className="orientation-figure-scroll" aria-label="Scrollable chart on narrow screens">
        <div ref={containerRef} className="chart-shell orientation-chart-shell">
          <svg
            role="group"
            aria-labelledby={`${titleId}-title`}
            aria-label={`AI use by stance matrix. ${accessibleSummary}`}
          />
          <div className="chart-tooltip" role="presentation" />
        </div>
      </div>
    </figure>
  );
}
