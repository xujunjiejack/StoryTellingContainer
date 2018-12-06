function padExtent(e, p) {
    if (p === undefined) p = 0.05;
    return ([e[0] - p, e[1] + p]);
}

function createScatterPlot(data, selected){

  var margin = {
  top: 20,
  right: 32,
  bottom: 20,
  left: 32
};


  var width = 300;
  var height = 300;
  var svg_scatter = d3.select('.scatterplot_box')
                      .append("svg")
                      .attr('class','vis1')
                      .attr("width", width + margin.left + margin.right)
                      .attr("height", height + margin.top + margin.bottom);
  var g_scatter = svg_scatter.append("g")
                    .attr("transform", "translate(" + margin.top + "," + margin.top + ")");

   var x = d3.scaleLinear()
    .domain(padExtent(d3.extent(data,function(d){ return d.transplant_rate_center;})))
    .range(padExtent([0, width]));

  var y = d3.scaleLinear()
    .domain(padExtent(d3.extent(data,function(d){ return d.death_rate_center;})))
    .range(padExtent([height, 0]));

  var size_extent = d3.extent(data,function(d){ return d.wait_list;})

  var sizeScale = d3.scaleSqrt()
                        .domain(size_extent)
                        .range([5,15]);

  g_scatter.append("rect")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .attr("fill", "#F6F6F6")
          .style("fill-opacity",0.2);

  g_scatter.selectAll("circle")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", function(d) {return sizeScale(d.wait_list);})
      .attr("cx", function(d) { return x(d.transplant_rate_center); })
      .attr("cy", function(d) { return y(d.death_rate_center); })
      .style("fill", function(d) {
        if(selected.LatLng == d.LatLng){
          return '#F78888';
        }
        else{ return '#5DA2D5';}})
      .style("fill-opacity", 0.5)
      .style("stroke",'black')
      .style("stroke-width", 1);

  g_scatter.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + y.range()[0] / 2 + ")")
      .call(d3.axisBottom(x).tickSizeOuter(0).tickValues([]));

    g_scatter.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + x.range()[1] / 2 + ", 0)")
      .call(d3.axisLeft(y).tickSizeOuter(0).tickValues([]));

    svg_scatter.append("text")
   .attr("x", 320)
   .attr("y", 167)
   .attr("class", "myLabel")//easy to style with CSS
   .text("High 3-Year")
   .attr('fill', 'black')
   .attr('font-size', '7.5px');

   svg_scatter.append("text")
   .attr("x", 320)
   .attr("y", 177)
   .attr("class", "myLabel")//easy to style with CSS
   .text("Survival Rate")
   .attr('fill', 'black')
   .attr('font-size', '7px');

   svg_scatter.append("text")
   .attr("x", 130)
   .attr("y", 15)
   .attr("class", "myLabel")//easy to style with CSS
   .text("High WaitList Death Rate")
   .attr('fill', 'black')
   .attr('font-size', '7px');

   svg_scatter.append("text")
   .attr("x", 130)
   .attr("y", 330)
   .attr("class", "myLabel")//easy to style with CSS
   .text("Low WaitList Death Rate")
   .attr('fill', 'black')
   .attr('font-size', '7px');

   svg_scatter.append("text")
   .attr("x", 0)
   .attr("y", 167)
   .attr("class", "myLabel")//easy to style with CSS
   .text("Low 3-Year")
   .attr('fill', 'black')
   .attr('font-size', '7px');

   svg_scatter.append("text")
   .attr("x", 0)
   .attr("y", 177)
   .attr("class", "myLabel")//easy to style with CSS
   .text("Survival Rate")
   .attr('fill', 'black')
   .attr('font-size', '7px');
   
   svg_scatter.append("line")
  .style("stroke", "red")
  .attr("x1", x(0.186361012))
  .attr("y1",20)
  .attr("y2", height+20)
  .attr("x2", x(0.186361012))

  svg_scatter.append("text")
        .attr("x", x(0.186361012)-35)
        .attr("y", 15)
        .attr("fill", "red")
        .text("Median Survival Rate of U.S")
        .attr('font-size', '7px');

  svg_scatter.append("line")
  .style("stroke", "red")
  .attr("x1", 20)
  .attr("y1",y(0.054763277))
  .attr("y2", y(0.054763277))
  .attr("x2", width+20)

  svg_scatter.append("text")
        .attr("x", width-20)
        .attr("y", y(0.054763277)-5)
        .attr("fill", "red")
        .text("Median Death Rate of U.S")
        .attr('font-size', '7px');

}