import { select } from 'd3';

export function wrapLabels(selection, width) {
  selection.each(function wrap() {
    const text = select(this);
    const words = text.text().split(/\s+/).reverse();
    const x = Number.parseFloat(text.attr('x') ?? 0);
    const y = text.attr('y');
    const dy = Number.parseFloat(text.attr('dy') || 0);

    text.attr('text-anchor', 'middle');

    let line = [];
    let word;
    let lineNumber = 0;
    let tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', `${dy}em`);

    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(' '));
      if (tspan.node().getComputedTextLength() > width && line.length > 1) {
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        lineNumber += 1;
        tspan = text
          .append('tspan')
          .attr('x', x)
          .attr('y', y)
          .attr('dy', `${lineNumber * 1.05 + dy}em`)
          .text(word);
      }
    }
  });
}