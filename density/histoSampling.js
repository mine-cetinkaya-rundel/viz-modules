import * as d3 from 'https://cdn.skypack.dev/d3';

function randomNormal(mean=0, scale=1) {
    let u = 1 - Math.random(); //Converting [0,1) to (0,1)
    let v = Math.random();
    return mean + scale * Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

export function regenerateData(numPoints = 1000) {
  let data = [];
  for(let i = 0; i < numPoints; i++) {
    data.push(randomNormal(-1, 0.5));
    data.push(randomNormal(2, 0.75));
    data.push(randomNormal(2, 0.75));
  }
  return data;
}

/**
 * Primitive KDE
 **/
function kde(data, evaluateAt) {
  const IQR = d3.quantile(data, 0.75) - d3.quantile(data, 0.25);
  const sd = d3.deviation(data);
  const silvermans = 0.9 * d3.min([sd, IQR/1.34]) * Math.pow(data.length, -0.2);
  const constantTerm = 1/ (Math.sqrt(2 * Math.PI) * silvermans);
  return evaluateAt.map(d => [d, d3.mean(data, d2 =>  constantTerm * Math.exp(-1 / (2 * silvermans * silvermans) * (d - d2) * (d-d2)))]);
}

let lastData;
let lastBinWidth;
export function* plotNewData(data, binWidth) {
  if(lastData === undefined) {
    lastData = data;
    lastBinWidth = binWidth;
  }

  // Do not used regenerated data if we only changed binWidth
  if(binWidth != lastBinWidth) {
    data = lastData;
  }
  lastData = data;
  lastBinWidth = binWidth;

  const w = 600;
  const h = 470;
  const result = d3.create("svg").attr("width", w).attr("height", h);
  const margin = 20;
  const xScale = d3.scaleLinear().domain([-3, 6]).range([margin, w - margin]);
  const numBins = Math.ceil((6 - (-3)) / binWidth);
  const thresholds = [...Array(numBins + 1).keys()].map(i => -3 + i * binWidth);
  const bins = d3.bin()
    .domain(xScale.domain())
    .thresholds(thresholds)
  (data);
  const maxY = d3.max(bins, d => d.length) / data.length;
  const yScale = d3.scaleLinear().domain([0, maxY]).range([h - margin, margin]);

  result.append("g")
      .attr("fill", "#bbb")
    .selectAll("rect")
    .data(bins)
    .join("rect")
      .attr("x", d => xScale(d.x0) + 1)
      .attr("y", d => yScale(d.length / data.length))
      .attr("width", d => xScale(d.x1) - xScale(d.x0) - 1)
      .attr("height", d => yScale(0) - yScale(d.length / data.length));

  const density = kde(data, xScale.ticks(600));
  density.sort((d1, d2) => d1[0] - d2[0]);
  const maxDensity = d3.max(density, d => d[1]);
  const line = d3.line()
    .curve(d3.curveBasis)
    .x(d => xScale(d[0]))
    .y(d => yScale(d[1] / maxDensity * maxY));

  result.append("path")
      .datum(density)
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("d", line);

  const xAxis = d3.axisBottom(xScale).ticks(10);
  result.append("g")
    .attr("transform", `translate(0, ${yScale(0)})`)
    .call(xAxis);

  // not really needed
  //const yAxis = d3.axisLeft(yScale).ticks(10);
  //result.append("g")
  //  .attr("transform", `translate(${xScale(-3)}, 0)`)
  //  .call(yAxis);

  yield result.node();
}