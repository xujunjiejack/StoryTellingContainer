/** map tile **/
/** https://stackoverflow.com/questions/37166172/mapbox-tiles-and-leafletjs **/

////////////////////// Leaflet Map Projection
var centerFeatures = [];
var center_layer;
var subset_layer;
var state_layer;
var pan_LatLng;
var last_zipcode_state;
var user_state_layer;
var georgia_layer;
var california_layer;

function style(feature) {
    return {
        fillColor: '#6baed6',
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}
var info = L.control({
    position : 'topright'
});

var map = L.map('map', {zoomControl: false}).setView([37.8, -96], 5);

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamVmZmV2ZXJoYXJ0MzgzIiwiYSI6IjIwNzVlOTA3ODI2MTY0MjM3OTgxMTJlODgzNjg5MzM4In0.QA1GsfWZccIB8u0FbhJmRg', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 10,
  id: 'mapbox.streets',
  opacity: 0.7,
  accessToken: 'pk.eyJ1IjoiamVmZmV2ZXJoYXJ0MzgzIiwiYSI6ImNqOXI2aDg5ejZhYncyd3M0bHd6cWYxc2oifQ.fzcb7maGkQhAxRZTotB4tg'
  }).addTo(map);

map.scrollWheelZoom.disable();

function padExtent(e, p) {
    if (p === undefined) p = 0.05;
    return ([e[0] - p, e[1] + p]);
}

var margin = {
  top: 20,
  right: 10,
  bottom: 20,
  left: 20
};

var width = 300;
var height = 300;
var domainwidth = width - margin.left - margin.right;
var domainheight = height - margin.top - margin.bottom;


function createScatterPlot(data, selected){
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
      .attr("cx", function(d) { console.log(d.transplant_rate_center); return x(d.transplant_rate_center); })
      .attr("cy", function(d) { console.log(d.death_rate_center); return y(d.death_rate_center); })
      .style("fill", function(d) {
        if(selected.LatLng == d.LatLng){
          return 'orange';
        }
        else{ return 'blue';}})
      .style("fill-opacity", 0.5)
      .style("stroke",'black')
      .style("stroke-width", 1);

  g_scatter.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + y.range()[0] / 2 + ")")
      .call(d3.axisBottom(x).ticks(5));

    g_scatter.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + x.range()[1] / 2 + ", 0)")
      .call(d3.axisLeft(y).ticks(5));
   

}

d3.queue()
    .defer(d3.csv, './data/Viz1.csv', function(row) {
       var center = {center_name: row['Center Name'], LatLng: [+row['Latitude'],+row['Longitude']], wait_list: +row['Waiting List'],
       death_rate_center: +row['Death Rate (center)'],death_rate_nation: +row['Death Rate (nation)'],
       transplant_rate_center: +row['Transplant Rate (center)'], transplant_rate_nation: +row['Transplant Rate (nation)'],
       all_time: +row['All Time'], less_than_30: +row['< 30 Days'],days_30_to_90: +row['30 to < 90 Days'], days_90_to_6_months: +row['90 Days to < 6 Months'],
       months_6_to_1_year: +row['6 Months to < 1 Year'], year_1_to_2: +row['1 Year to < 2 Years'],year_2_to_3: +row['2 Years to < 3 Years'],
       year_3_to_5: +row['3 Years to < 5 Years'],year_5_or_more: +row['5 or More Years'],center_code: +row['Center Code']};

       centerFeatures.push(turf.point([+row['Longitude'], +row['Latitude']], center));
       return center;
    })
    .defer(d3.csv,'./data/zipcodes_1.csv',function(row){
      return { zip_code: row['zip_code'],LatLng: [+row['latitude'],+row['longitude']], state: row['state_name']};
    })
    .defer(d3.json,'./data/states.json')
    .defer(d3.json,'./data/shape_GA.geoJson')
    .defer(d3.json,'./data/shape_CA.geoJson')
    .await(readyToDraw);

function readyToDraw(error, centers,zipcodes,states,georgia_data,california_data) {
    if(error) {
        console.error('Error while loading datasets.');
        console.error(error);
        return;
    }

    center_data = centers;
    zipcode_data = zipcodes;
    states_data = states;
    var centerCollection = turf.featureCollection(centerFeatures);
    center_layer = L.geoJson(centerCollection);
    state_layer = L.geoJson(states);
    georgia_layer = L.geoJson(georgia_data, {style:style});
    california_layer = L.geoJson(california_data, {style:style});

    updateMap('30318');


    var inputBox = $("#probleminput");
    var submitButton = $("#problemsubmit");
    var c=0;

    submitButton.click(function(){
        c++;
        var getval = ($("#zip").val()?$("#zip").val():alert('please fill the text field'))
        console.log(getval)
        var x = {index: 1}
        if(c>=1){
          console.log(subset_layer)
          map.removeLayer(subset_layer)
        };
        updateMap(getval);
        handleStepEnter(x)

});



// instantiate the scrollama
const scroller = scrollama();

function handleResize() {
      // 1. update height of step elements

      var stepHeight = Math.floor(window.innerHeight * 0.75);
      step.style('height', stepHeight + 'px');

      // 2. update width/height of graphic element

      var bodyWidth = d3.select('body').node().offsetWidth;
      graphic
        .style('width', bodyWidth + 'px')
        .style('height', window.innerHeight + 'px');

      
      // 3. tell scrollama to update new element dimensions
      scroller.resize();
    }

  function handleContainerEnter(response) {
  // response = { direction }

  // sticky the graphic (old school)
  graphic.classed('is-fixed', true);
  graphic.classed('is-bottom', false);
}

function handleContainerExit(response) {
  // response = { direction }

  // un-sticky the graphic, and pin to top/bottom of container
  graphic.classed('is-fixed', false);
  graphic.classed('is-bottom', response.direction === 'down');
}



function handleStepEnter(response){
  step.classed('is-active', function (d, i) {
    return i === response.index;
  })
  console.log(response.index)

  // update graphic based on step
  if (response.index == 0) {
    center_layer.addTo(map);
    map.flyTo([37.8, -96], 4);
  }
  if (response.index == 1) {
    map.removeLayer(center_layer);
    info.addTo(map);
    subset_layer.addTo(map);
    map.flyTo(pan_LatLng, 6);
    console.log(c);
  }
  if (response.index == 2) {
      
    map.removeLayer(subset_layer);
    //info.removeFrom(map);
    user_state_layer.addTo(map);
    map.flyTo(pan_LatLng, 6);
  }
  if(response.index == 3){
    map.removeLayer(user_state_layer);
    georgia_layer.addTo(map);
    map.flyTo([32.1656, -82.9001], 6);
  }
  if(response.index == 4){
    map.removeLayer(georgia_layer);
    california_layer.addTo(map);
    map.flyTo([36.7783, -119.4179], 6);
  }
  if(response.index == 5){
    map.removeLayer(california_layer);
    state_layer.addTo(map);
    map.flyTo([37.8, -96], 4);
  }

}

function handleStepExit(e){
  if(e.index==5){
    map.removeLayer(state_layer);
  }
  console.log("Exit")
}

///function init() {
  // 1. force a resize on load to ensure proper dimensions are sent to scrollama
  handleResize();

  // 2. setup the scroller passing options
  // this will also initialize trigger observations
  // 3. bind scrollama event handlers (this can be chained like below)
  scroller.setup({
    container: '#scroll',
    graphic: '.scroll__graphic',
    text: '.scroll__text',
    step: '.scroll__text .step'
  })
    .onStepEnter(handleStepEnter)
    .onStepExit(handleStepExit)
    .onContainerEnter(handleContainerEnter)
    .onContainerExit(handleContainerExit);

  // setup resize event
  window.addEventListener('resize', handleResize);
//}

// kick things off
//init();

}

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
  };

  info.update = function (props) {
    this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
        '<b>' + props.center_name + '</b><br />people / mi<sup>2</sup>'
        : 'Hover over a state');
    var ScatterPlotDiv = this._div.appendChild(document.createElement("div"));
    ScatterPlotDiv.className="scatterplot_box";
  };


function updateMap(myzipcode){

var user_latlng = zipcode_data.filter(function(d){
    if(d['zip_code'] == myzipcode) { return d.LatLng; }
  })

pan_LatLng = user_latlng[0].LatLng;
last_zipcode_state = user_latlng[0].state;
////////// Disable zoom, fixes the map
var nearest = leafletKnn(center_layer).nearestLayer(L.latLng(user_latlng[0].LatLng[0], user_latlng[0].LatLng[1]),10);

var nearest_array=[];
  for(var i=0;i<nearest.length;i++){
  nearest_array.push([nearest[i].layer.feature.geometry.coordinates[1],nearest[i].layer.feature.geometry.coordinates[0]]);
} 
//console.log(nearest_array);

var subset_data = center_data.filter(({LatLng}) => 
   nearest_array.some(f => LatLng.every(l => f.includes(l))))

var subsetFeatures =[];
for (var i=0; i<subset_data.length;i++){
  var point_data = turf.point([subset_data[i].LatLng[1],subset_data[i].LatLng[0]], subset_data[i])
  subsetFeatures.push(point_data);
}
var subsetCollection = turf.featureCollection(subsetFeatures);

subset_layer = L.geoJson(subsetCollection);
subset_layer.on('mouseover', function (e) {
      info.update(e.layer.feature.properties)
      createScatterPlot(subset_data,e.layer.feature.properties);
      console.log(e.layer.feature.properties)
    });
subset_layer.on("mouseout",function(){
    //d3.select(".scatterplot").remove();
    info.update();
   });

function stateFilter(feature) {
      if (feature.properties.NAME === last_zipcode_state) return true
    }
user_state_layer = L.geoJson(states_data,{filter: stateFilter, style:style});

}

