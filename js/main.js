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
var check_val=2010;
var blood_string= "ABO"
var bmi_string="0"
var k=0;
var check_value= 0;

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

var map = L.map('map', {zoomControl: false}).setView([37.8, -100], 5);

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



d3.queue()
    .defer(d3.csv, './data/Viz1.csv', function(row) {
       var center = {center_name: row['Center Name'], LatLng: [+row['Latitude'],+row['Longitude']], wait_list: +row['Waiting List'],
       death_rate_center: +row['Death Rate (center)'],death_rate_nation: +row['Death Rate (nation)'],
       transplant_rate_center: +row['Transplant Rate (center)'], transplant_rate_nation: +row['Transplant Rate (nation)'],
       all: +row['All Time'], less_than_30_time: +row['< 30 Days'],days_30_to_90_time: +row['30 to < 90 Days'], days_90_to_6_months_time: +row['90 Days to < 6 Months'],
       months_6_to_1_year_time: +row['6 Months to < 1 Year'], year_1_to_2_time: +row['1 Year to < 2 Years'],year_2_to_3_time: +row['2 Years to < 3 Years'],
       year_3_to_5_time: +row['3 Years to < 5 Years'],year_5_or_more_time: +row['5 or More Years'],center_code: +row['Center Code']};

       centerFeatures.push(turf.point([+row['Longitude'], +row['Latitude']], center));
       return center;
    })
    .defer(d3.csv,'./data/zipcodes_1.csv',function(row){
      return { zip_code: row['zip_code'],LatLng: [+row['latitude'],+row['longitude']], state: row['state_name']};
    })
    .defer(d3.json,'./data/states.json')
    .defer(d3.json,'./data/shape_GA.geoJson')
    .defer(d3.json,'./data/shape_CA.geoJson')
    .defer(d3.json,'./data/shape_AL.geojson')
    .defer(d3.csv, './data/2010-State-Bloodtype-BMI.csv')
    .defer(d3.csv, './data/2011-State-Bloodtype-BMI.csv')
    .defer(d3.csv, './data/2012-State-Bloodtype-BMI.csv')
    .defer(d3.csv, './data/2013-State-Bloodtype-BMI.csv')
    .defer(d3.csv, './data/2014-State-Bloodtype-BMI.csv')
    .defer(d3.csv, './data/2015-State-Bloodtype-BMI.csv')
    .defer(d3.csv, './data/2016-State-Bloodtype-BMI.csv')
    .defer(d3.csv, './data/2017-State-Bloodtype-BMI.csv')
    .defer(d3.csv, './data/2018-State-Bloodtype-BMI.csv')
    .await(readyToDraw);

function readyToDraw(error, centers,zipcodes,states,georgia_data,california_data, albama_data,data_2010, data_2011, data_2012, data_2013, data_2014, data_2015, data_2016, data_2017, data_2018) {
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
    georgia_layer = L.geoJson(georgia_data, {style:style});
    california_layer = L.geoJson(california_data, {style:style});
    alabama_layer = L.geoJson(albama_data,{style:style});

    var all_data = [data_2010, data_2011, data_2012, data_2013, data_2014, data_2015, data_2016, data_2017, data_2018];
    data = all_data;
    all_state = states;
    updateMap('30318');
    concat(blood_string,bmi_string,check_val);

    var container = d3.select('#scroll');
    var graphic = container.select('.scroll__graphic');
    var chart = graphic.select('.chart');
    var text = container.select('.scroll__text');
    var step = text.selectAll('.step');

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

 $("#blood_button > button").on("click", function() {
  k++;
    var x = {index: 6}
    if(k>=1){
      //console.log(subset_layer)
      map.removeLayer(state_layer)
    };
    blood_string = this.value;
    concat(blood_string, bmi_string, check_val);
    handleStepEnter(x);
  });

   $("#bmi_button > button").on("click", function() {
    k++;
    var x = {index: 6}
    if(k>=1){
      //console.log(subset_layer)
      map.removeLayer(state_layer)
    };
    bmi_string = this.value;
    concat(blood_string, bmi_string, check_val);
    handleStepEnter(x);
  });


// Function that is called when the blood_group button is clicked.
/*function blood_onclick(val) {
    const btnClick = function () {
        this.parentNode.getElementsByClassName("active")[0].classList.remove("active");
        this.classList.add("active");
    };
    document.querySelectorAll(".btn-group .btn").forEach(btn => btn.addEventListener('click', btnClick));
    k++;
    var x = {index: 6}
    if(k>=1){
      //console.log(subset_layer)
      map.removeLayer(state_layer)
    };
    blood_string= val;
    concat(blood_string, bmi_string, check_val);
    handleStepEnter(x);

}
// Function that is called  when the BMI button is  clicked.
function bmi_onclick(val) {
    const btnClick = function () {
        this.parentNode.getElementsByClassName("active")[0].classList.remove("active");
        this.classList.add("active");
    };
    document.querySelectorAll(".btn-group .btn").forEach(btn => btn.addEventListener('click', btnClick));
    k++;
    var x = {index: 6}
    if(k>=1){
      //console.log(subset_layer)
      map.removeLayer(state_layer)
    };
    bmi_string= val;
    concat(blood_string, bmi_string, check_val);
    handleStepEnter(x);
}*/


// Code for the slider.......................................................

var slider2 = d3.sliderHorizontal()
        .min(2010)
        .max(2018)
        .step(1)
        .width(300)
        .displayValue(false)
        .tickFormat(d3.format("d"))
        .on('onchange', val => {
        check(val);

        });

var group2 = d3.select("#slider").append("svg")
                .attr("width", 500)
                .attr("height", 100)
                .append("g")
                .attr("transform", "translate(30,30)");

group2.call(slider2);

//Function that is called whenever the slider is changed.................................
function check(value){
  check_val= value;
  k++;
        var x = {index: 6}
        if(k>=1){
         //console.log(subset_layer)
        map.removeLayer(state_layer)
        };

    concat(blood_string, bmi_string, check_val);
    handleStepEnter(x);
}


// instantiate the scrollama
const scroller = scrollama();

function handleResize() {
      // 1. update height of step elements

      var stepHeight = Math.floor(window.innerHeight * 0.25);
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
    info.remove(map);
    map.flyTo([37.8, -100], 5);
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
     info.remove(map);
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
    alabama_layer.addTo(map);
    map.flyTo([32.3182,-86.9023], 6);
  }
  if(response.index == 6){
    map.removeLayer(alabama_layer);
    state_layer.addTo(map);
    map.flyTo([37.8, -110], 4);
  }

}



function handleStepExit(e){
  if(e.index==6){
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
    this._div.innerHTML = '<h4>Organ Transplant Center</h4>' +  (props ?
        '<b>' + props.center_name + '</b><br />'
        : 'Hover over a center');
    var ScatterPlotDiv = this._div.appendChild(document.createElement("div"));
    ScatterPlotDiv.className="scatterplot_box";
    var LineChartDiv = this._div.appendChild(document.createElement("div"));
    LineChartDiv.className="linechart_box";
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

var new_data = [];       //start with an empty array

//loop through original data item-by-item
subset_data.forEach(function(d){
  var obj = {};                //prepare an empty object
  obj.key = d.center_name;
  obj.values = [];             // prepare internal empty array

  //we need the key values from the object
  Object.keys(d).forEach(function(key){
    // but only keys that contain the word (year)...
    if(key.indexOf("time")>-1){
      //setting up the new data structure
      obj.values.push({interval:key,value:d[key]});
    }
  });
  // finally, pushing the object to the new array
  new_data.push(obj);
});

  console.log(new_data);


var subsetFeatures =[];
for (var i=0; i<subset_data.length;i++){
  var point_data = turf.point([subset_data[i].LatLng[1],subset_data[i].LatLng[0]], subset_data[i])
  subsetFeatures.push(point_data);
}
console.log(subset_data)


var subsetCollection = turf.featureCollection(subsetFeatures);
subset_layer = L.geoJson(subsetCollection);
subset_layer.on('click', function (e) {
      info.update(e.layer.feature.properties)
      createScatterPlot(subset_data,e.layer.feature.properties);
      createLineChart(new_data,e.layer.feature.properties.center_name);

    });
/*subset_layer.on("mouseout",function(){
    //d3.select(".scatterplot").remove();
    info.update();
   });*/

function stateFilter(feature) {
      if (feature.properties.NAME === last_zipcode_state) return true
    }
user_state_layer = L.geoJson(states_data,{filter: stateFilter, style:style});

}

function concat(str1,str2,year){


      var temp_data = data[year-2010];
      concat_value= str1+"_"+str2;

      // Filtering the data as per user query based  on the concat-value and year............................
      var temp= [];
    for (var i=0; i < temp_data.length; i++)
    {
      temp.push
      ({
        'state': temp_data[i]['State'],
        'value': temp_data[i][concat_value]
      })
    }

    // Adding our filtered value to the GeoJson file.......................................................
      for (var i in all_state['features'])
      {
        current_state= all_state['features'][i]['properties']['NAME'];
        for (var j in temp)
        {
          if (temp[j]['state']==current_state)
          {
            all_state['features'][i]['properties']['value']= temp[j]['value'];
            break;
          }
        }
      }


      state_layer = L.geoJson(all_state, {style: style});

      function getColor(d) {
          return d > 25  ? '#084594' :
                 d > 13  ? '#2171b5' :
                 d > 8  ? '#4292c6' :
                 d > 5  ? '#6baed6' :
                 d > 3   ? '#9ecae1' :
                 d > 2   ? '#c6dbef' :
                 d > 1   ?  '#deebf7' :
                            '#f7fbff';
      }

      function style(feature) {

          return {
              fillColor: getColor(feature.properties.value),
              weight: 2,
              opacity: 1,
              color: 'white',
              dashArray: '3',
              fillOpacity: 0.7
          };
      }

}
