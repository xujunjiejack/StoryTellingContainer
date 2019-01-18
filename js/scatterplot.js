function padExtent(e, p) {
    if (p === undefined) p = 0.05;
    return ([e[0] - p, e[1] + p]);
}

function createScatterPlot(data, selected){

  var margin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};

var div = d3.select(".scatterplot_box").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  var width = 400;
  var height = 400;
  var svg_scatter = d3.select('.scatterplot_box')
                      .append("svg")
                      .attr('class','vis1')
                      .attr("width", width + margin.left)
                      .attr("height", height+20);
  var g_scatter = svg_scatter.append("g")
                   .attr("transform", "translate(" + margin.top/2 + "," + margin.top + ")");
                    

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
          .attr("width", width-30)
          .attr("height", height-30)
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
      .style("stroke",'#5DA2D5')
      .style("stroke-width", 0.3)
      .on("mouseover", function(d) {
            console.log(d);
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html('<div style="height:15px;">'+d.center_name+"</div><table><thead><tr><td>WaitList Size</td><td>Transplate Rate</td><td>Death Rate</td></tr></thead>"
             + "<tbody><tr><td>"+d.wait_list+"</td><td>"+(d.transplant_rate_center).toFixed(4)+"</td><td>"+(d.death_rate_center).toFixed(4)+"</td></tr></tbody></table>")
              .style("right", 40 + "px")
              .style("top", 70 + "px");
            })

        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);

        });

  g_scatter.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + y.range()[0] / 2 + ")")
      .call(d3.axisBottom(x).tickSizeOuter(0).tickValues([]));

    g_scatter.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + x.range()[1] / 2 + ", 0)")
      .call(d3.axisLeft(y).tickSizeOuter(0).tickValues([]));

    svg_scatter.append("text")
   .attr("x", 405)
   .attr("y", 227)
   //.attr("class", "myLabel")//easy to style with CSS
   .text("High")
   .attr('fill', 'black')
   .attr('font-size', '11px');

   svg_scatter.append("text")
   .attr("x", 407)
   .attr("y", 240)
   //.attr("class", "myLabel")//easy to style with CSS
   .text("T.R.")
   .attr('fill', 'black')
   .attr('font-size', '11px');

   svg_scatter.append("text")
   .attr("x", 190)
   .attr("y", 25)
   //.attr("class", "myLabel")//easy to style with CSS
   .text("High D.R.")
   .attr('fill', 'black')
   .attr('font-size', '11px');

   svg_scatter.append("text")
   .attr("x", 192)
   .attr("y", 420)
   //.attr("class", "myLabel")//easy to style with CSS
   .text("Low D.R.")
   .attr('fill', 'black')
   .attr('font-size', '11px');

   svg_scatter.append("text")
   .attr("x", 0)
   .attr("y", 227)
   //.attr("class", "myLabel")//easy to style with CSS
   .text("Low")
   .attr('fill', 'black')
   .attr('font-size', '11px');

   svg_scatter.append("text")
   .attr("x", 2)
   .attr("y", 240)
   //.attr("class", "myLabel")//easy to style with CSS
   .text("T.R.")
   .attr('fill', 'black')
   .attr('font-size', '11px');

   svg_scatter.append('circle')
        .attr('r',12)
        .attr('cx',380)
        .attr('cy',400)
        .attr('fill','#5DA2D5');
    svg_scatter.append('circle')
        .attr('r',8)
        .attr('cx',405)
        .attr('cy',400)
        .attr('fill','#5DA2D5');
    svg_scatter.append('circle')
        .attr('r',3)
        .attr('cx',420)
        .attr('cy',400)
        .attr('fill','#5DA2D5');

    svg_scatter.append("text")
   .attr("x", 370)
   .attr("y", 420)
   //.attr("class", "myLabel")//easy to style with CSS
   .text("WaitList Size")
   .attr('fill', 'black')
   .attr('font-size', '9px');

    svg_scatter.append('rect')
        .attr('width',10)
        .attr('height',10)
        .attr('x',370)
        .attr('y',350)
        .attr('fill','#F78888');

    svg_scatter.append('rect')
        .attr('width',10)
        .attr('height',10)
        .attr('x',370)
        .attr('y',365)
        .attr('fill','#5DA2D5');

    svg_scatter.append('text')
        .attr('x',385)
        .attr('y',357.5)
        //.attr("class", "myLabel")//easy to style with CSS
        .text("Selected")
        .attr('fill', 'black')
        .attr('font-size', '9px');

    svg_scatter.append('text')
        .attr('x',385)
        .attr('y',372.5)
        //.attr("class", "myLabel")//easy to style with CSS
        .text("Others")
        .attr('fill', 'black')
        .attr('font-size', '9px');

   svg_scatter.append("line")
  .style("stroke", "red")
  .attr("x1", x(0.186361012))
  .attr("y1", margin.top)
  .attr("y2", height+margin.bottom)
  .attr("x2", x(0.186361012))
  .style("opacity", 0.5)

  svg_scatter.append("text")
        .attr('transform', 'translate('+ (margin.left+margin.right) + ',' + margin.top+')rotate(90)')
        .attr("fill", "red")
        .text("National Avg. T.R.")
        .attr('font-size', '11px');

  svg_scatter.append("line")
  .style("stroke", "red")
  .attr("x1", margin.left/2)
  .attr("y1",y(0.054763277))
  .attr("y2", y(0.054763277))
  .attr("x2", width+margin.right/2)
  .style("opacity",0.5)

  svg_scatter.append("text")
        .attr("x", 330)
        .attr("y", y(0.054763277)-5)
        .attr("fill", "red")
        .text("National Avg. D.R.")
        .attr('font-size', '11px');

        svg_scatter.append("text")
        .attr("x", 100)
         .attr("y", 10)
         .attr("class", "myLabel")//easy to style with CSS
         .text("Death Rate (D.R.) Vs Transplant Rate(T.R.)")
         .attr('fill', 'black')
         .attr('font-size', '14px');

  

}
