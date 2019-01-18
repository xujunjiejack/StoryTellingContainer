function createLineChart(data, selected_center){

var margin = 35;
var width = 430;
var height = 250;
  console.log(data)
  console.log(selected_center)

  data.forEach(function(d) { 
  d.values.forEach(function(d) {
    d.interval = d.interval;
    d.value = +d.value;    
  });
});

  var duration = 250;
  var lineOpacity = "0.25";
  var lineOpacityHover = "0.85";
  var otherLinesOpacityHover = "0.1";
  var lineStroke = "1.5px";
  var lineStrokeHover = "2.5px";

  var circleOpacity = '0.85';
  var circleOpacityOnLineHover = "0.25"
  var circleRadius = 3;
  var circleRadiusHover = 6;

  var x_axis_labels = ["<30D", "30-60D", "90D-6M", "6M-1Y", "1Y-2Y", "2Y-3Y", "Y3-5Y", ">5Y"];
  var mapper = {
    'less_than_30_time': '<30D',
    'days_30_to_90_time': '30-60D',
    'days_90_to_6_months_time': "90D-6M",
    'months_6_to_1_year_time': "6M-1Y",
    'year_1_to_2_time': "1Y-2Y",
    'year_2_to_3_time': "2Y-3Y",
    'year_3_to_5_time': "Y3-5Y",
    'year_5_or_more_time': ">5Y"
  }

  var xScale = d3.scalePoint().domain(['less_than_30_time','days_30_to_90_time','days_90_to_6_months_time','months_6_to_1_year_time','year_1_to_2_time','year_2_to_3_time','year_3_to_5_time',
    'year_5_or_more_time']).range([0,width-margin]);

const list = []
data.every(ele => ele.values.every(ee => list.push(ee.value)))

console.log('Max Value:: ' + Math.max.apply(null, list)); // 194
console.log('Min Value:: ' + Math.min.apply(null, list)); // 0

  var yScale = d3.scaleLinear()
  .domain([Math.min.apply(null, list),Math.max.apply(null, list)])
  .range([height-margin, 0]);

  var svg_line = d3.select(".linechart_box")
                   .append("svg")
                   .attr("width", width + margin)
                   .attr("height", height + margin)
                   .append('g')
                   .attr("transform", "translate(" + margin + "," + margin + ")");


  var line = d3.line()
  .x(d => xScale(d.interval))
  .y(d => yScale(d.value))
  .curve(d3.curveMonotoneX);

  let lines = svg_line.append('g')
  .attr('class', 'lines');

console.log(data)
lines.selectAll('.line-group')
  .data(data).enter()
  .append('g')
  .attr('class', 'line-group')  
  .on("mouseover", function(d, i) { 
      svg_line.append("text")
        .attr("class", "title-text")
        .style("fill", 'black')        
        .text(d.key)
        .attr("text-anchor", "middle")
        .attr("x", (width-margin)/2)
        .attr("y", 15)
        .style("font-size",8);
    })
  .on("mouseout", function(d) {
      svg_line.select(".title-text").remove();
    })
  .append('path')
  .attr('class', 'line')  
  .attr('d', d => line(d.values))
  .style('stroke', function(d, i){ if(d.key == selected_center){return '#F78888';}else{return '#5DA2D5';}})
  .style('opacity', lineOpacity)
  .on("mouseover", function(d) {
      d3.selectAll('.line')
          .style('opacity', otherLinesOpacityHover);
      d3.selectAll('.circle')
          .style('opacity', circleOpacityOnLineHover);
      d3.select(this)
        .style('opacity', lineOpacityHover)
        .style("stroke-width", lineStrokeHover)
        .style("cursor", "pointer");
    })
  .on("mouseout", function(d) {
      d3.selectAll(".line")
          .style('opacity', lineOpacity);
      d3.selectAll('.circle')
          .style('opacity', circleOpacity);
      d3.select(this)
        .style("stroke-width", lineStroke)
        .style("cursor", "none");
    });

var xAxis = d3.axisBottom(xScale).tickFormat(function (d) {
  return mapper[d]
});
var yAxis = d3.axisLeft(yScale).ticks(5);

svg_line.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${height-margin})`)
  .call(xAxis);

svg_line.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append('text')
  .attr("y", 15)
  .attr("transform", "rotate(-90)")
  .attr("fill", "#000")
  .text("No.of Patients Waiting")
  .attr('font-size', '11px');

svg_line.append("text")
        .attr("x", 120)
        .attr("y", 0)
        .attr("fill", "black")
        .attr("class","myLabel")
        .text("Waiting Time Distribution")
        .attr('font-size', '14px');

svg_line.append("text")
        .attr("x", 330)
        .attr("y", 210)
        .attr("fill", "black")
        .text("Waiting Time")
        .attr('font-size', '11px');




}