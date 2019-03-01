let $container = d3.select('#scroll');
let $graphic = d3.select('.scroll__graphic');
let $chart = d3.select('.chart');
let $text = d3.select('.scroll__text');
let $step = $text.selectAll('.step');
var info_state = L.control();
var IconStyleOne = L.icon({
    iconUrl: './data/selected_icon.png'
});
var IconStyleTwo = L.icon({
    iconUrl: './data/all_icons.png'
});
var legend = L.control({position: 'bottomright'});

// initialize the scrollama

// Scrollama 1
var scroller = scrollama();

// resize function to set dimensions on load and on page resize
function handleResize() {
    // 1. update height of step elements for breathing room between steps
    var stepHeight = Math.floor(window.innerHeight * 0.15);

    $step.style('height', stepHeight + 'px');

    // 2. update height of graphic element
    var bodyWidth = d3.select('body').node().offsetWidth;

    // $graphic
    // .style('height', 100  + 'px');

    //window.innerHeight

    // 3. update width of chart by subtracting from text width
    var chartMargin = 32;
    var textWidth = $text.node().offsetWidth;
    // var chartWidth = $graphic.node().offsetWidth - textWidth - chartMargin;
    // make the height 1/2 of viewport
    var chartHeight = Math.floor(window.innerHeight);
    console.log(window.innerHeight)
    let $textarea = d3.select("#t1");

    $textarea.attr('style', `padding-top: ${chartHeight/2-100}px`);
    console.log(d3.select("textarea"))
    $chart
    // .style('width', chartWidth + 'px')
        .style('height', chartHeight * 0.95 + 'px');

    // 4. tell scrollama to update new element dimensions
    scroller.resize();
}


// scrollama event handlers
function handleStepEnter(response) {
    // response = { element, direction, index }
    console.log("Step entering " + response.index)

    $step.classed('is-active', function (d, i) {
        return i === response.index;
    })
    console.log(response.index)

    // update graphic based on step
    if (response.index === 0) {
        center_layer.addTo(map);
        info.remove(map);
        map.flyTo([37.8, -100], 5);
    }
    if (response.index === 1) {
        map.removeLayer(center_layer);
        info.addTo(map);
        subset_layer.addTo(map);
        map.flyTo(pan_LatLng, 6);
    }
    if (response.index === 2) {

        map.removeLayer(subset_layer);
        info.remove(map);
        user_state_layer.addTo(map);
        map.flyTo(pan_LatLng, 6);
    }
    if(response.index === 3){
        map.removeLayer(user_state_layer);
        georgia_layer.addTo(map);
        map.flyTo([32.1656, -82.9001], 6);
    }
    if(response.index === 4){
        map.removeLayer(georgia_layer);
        california_layer.addTo(map);
        map.flyTo([36.7783, -119.4179], 6);
    }
    if(response.index === 5){
        map.removeLayer(california_layer);
        alabama_layer.addTo(map);
        map.flyTo([32.3182,-86.9023], 6);
    }
    if(response.index === 6){
        map.removeLayer(alabama_layer);
        state_layer.addTo(map);
        info_state.addTo(map);
        legend.addTo(map);
        map.flyTo([37.8, -110], 4);
    }

    // if (response.index === 4){
    //     stop = false;
    // }
}

function handleStepExit(e){
    if(e.index==0){
        map.removeLayer(center_layer);
    }
    if(e.index==1){
        info.remove(map);
        map.removeLayer(subset_layer);
    }
    if(e.index==2){
        map.removeLayer(user_state_layer);

    }
    if(e.index==3){
        map.removeLayer(georgia_layer);
    }
    if(e.index==4){
        map.removeLayer(california_layer);
    }
    if(e.index==5){
        map.removeLayer(alabama_layer);
    }
    if(e.index==6){
        map.removeLayer(state_layer)
        info_state.remove(map);
        legend.remove(map);
    }

}

function handleContainerEnter(response) {
    // response = { direction }
    console.log(response.index + "entering")
    // sticky the graphic
    $graphic.classed('is-fixed', true);
    $graphic.classed('is-bottom', false);
}


function handleContainerExit(response) {

    // if (response.index === 6){
    //     stop = true;
    // }
    // response = { direction }
    console.log(response.index + "exiting")
    // un-sticky the graphic, and pin to top/bottom of container
    // $graphic.classed('is-fixed', false);
    // $graphic.classed('is-bottom', response.direction === 'down');
// }
}


// kick-off code to run once on load
function init() {
    // 1. call a resize on load to update width/height/position of elements
    handleResize();

    // 2. setup the scrollama instance
    // 3. bind scrollama event handlers (this can be chained like below)
    scroller
        .setup({
            container: '#scroll', // our outermost scrollytelling element
            graphic: '.scroll__graphic', // the graphic
            text: '.box', // the step container
            step: '.scroll__text .box', // the step elements
            offset: 0.5, // set the trigger to be 1/2 way down screen
            debug: false, // display the trigger offset for testing
        })

        .onStepEnter(handleStepEnter)

        .onStepExit(handleStepExit)
        .onContainerEnter(handleContainerEnter)
        .onContainerExit(handleContainerExit);

    // setup resize event
    window.addEventListener('resize', handleResize);
}

// start it up
init();

let scroller2 = scrollama();
init2();
// Scrollama 2

// Resize
let stopAt100 = false;

function init2() {
    // 1. call a resize on load to update width/height/position of elements
    handleResize2();

    // 2. setup the scrollama instance
    // 3. bind scrollama event handlers (this can be chained like below)
    scroller2
        .setup({
            container: '#scroll', // our outermost scrollytelling element
            graphic: '.scroll__graphic', // the graphic
            text: '.scroll__text', // the step container
            step: '.scroll__text .boxvis3', // the step elements
            offset: 0.5, // set the trigger to be 1/2 way down screen
        })

        .onStepEnter(handleStepEnter2)

        .onStepExit(handleStepExit2)
        .onContainerEnter(handleContainerEnter2)
        .onContainerExit(handleContainerExit2);

    // setup resize event
    window.addEventListener('resize', handleResize2);
}

function handleStepEnter2(response) {
    // response = { element, direction, index }

    // fade in current step
    $step.classed('is-active', function (d, i) {
        console.log("vis3"+ response.index)
        return i === response.index;
    });

    if (response.index === 0) {
        // still stop
    } else if (response.index === 1){
        // move to 2017

        startYear = 2017;
        updateNumber(startYear);
        computePointsAndColor();
        stop=true;

    }  else if (response.index === 2){
        // change color
        // stop at 100
        stop = false;
        stopAt100 = true;

    }
    else if (response.index === 3){
        // Move pixels
        stopAt100 = false;
    }
    else if (response.index === 4){
        // move to 1995
        startYear = 1995;
        updateNumber(startYear);
        computePointsAndColor();
        stop=true;
        document.getElementById("main").className = "vis3part";
        document.getElementById("vis3_svg_container").className = 'vis3part';
        document.getElementById("vis3").className = "vis3_container";
        document.getElementById("pauseButton").className="pauseButtonClass disable";
    }
    else if (response.index === 5) {
        setTimeout(() => { stop=false}, 2);
        document.getElementById("main").className += ' zoomout';
        document.getElementById("vis3_svg_container").className += ' zoomout';
        document.getElementById("vis3").className += ' shiftleft';
        document.getElementById("pauseButton").className="pauseButtonClass";
    }
}

function handleStepExit2(response){

    console.log(response.index + "step exiting")
    // if (response.index === 5) {
    //     document.getElementById("main").className = "vis3part";
    //     document.getElementById("vis3_svg_container").className = 'vis3part';
    //     document.getElementById("vis3").className = "vis3_container";
    // }
}

function handleContainerEnter2(response) {
    console.log('container_enter2')
}

function handleContainerExit2(response) {
    console.log('container_exist2')
}

function handleResize2() {
    // 1. update height of step elements for breathing room between steps
    var stepHeight = Math.floor(window.innerHeight * 0.15);

    $step.style('height', stepHeight + 'px');

    // 2. update height of graphic element
    var bodyWidth = d3.select('body').node().offsetWidth;

    // $graphic
    // .style('height', 100  + 'px');

    //window.innerHeight

    // 3. update width of chart by subtracting from text width
    var chartMargin = 32;
    var textWidth = $text.node().offsetWidth;
    // var chartWidth = $graphic.node().offsetWidth - textWidth - chartMargin;
    // make the height 1/2 of viewport
    var chartHeight = Math.floor(window.innerHeight);
    console.log(window.innerHeight)
    let $textarea = d3.select("#t1");

    $textarea.attr('style', `padding-top: ${chartHeight/2-100}px`);
    console.log(d3.select("textarea"))
    $chart
    // .style('width', chartWidth + 'px')
        .style('height', chartHeight * 0.95 + 'px');

    // 4. tell scrollama to update new element dimensions
    scroller.resize();
}







/*
  Vis 1
*/

let centerFeatures = [];
let center_layer;
let subset_layer;
let state_layer;
let pan_LatLng;
let last_zipcode_state;
let user_state_layer;
let georgia_layer;
let california_layer;
let check_val=2010;
let blood_string= "ABO"
let bmi_string="0"
let k=0;
let check_value= 0;

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

let info = L.control({
    position : 'topright'
});

let map = L.map('map', {zoomControl: false}).setView([37.8, -100], 5);

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
        let center = {center_name: row['Center Name'], LatLng: [+row['Latitude'],+row['Longitude']], wait_list: +row['Waiting List'],
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
    .defer(d3.json,'./data/shape_GA.geojson')
    .defer(d3.json,'./data/shape_CA.geojson')
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

let center_data = null;
let zipcode_data = null;
let states_data = null;
let alabama_layer = null;
let data_vis2 = null;
let all_state = null;


function readyToDraw(error, centers,zipcodes,states,georgia_data,california_data, albama_data,data_2010, data_2011, data_2012, data_2013, data_2014, data_2015, data_2016, data_2017, data_2018) {
    if(error) {
        console.error('Error while loading datasets.');
        console.error(error);
        return;
    }

    center_data = centers;
    zipcode_data = zipcodes;
    states_data = states;
    let centerCollection = turf.featureCollection(centerFeatures);
    center_layer = L.geoJson(centerCollection);
    georgia_layer = L.geoJson(georgia_data, {style:style});
    california_layer = L.geoJson(california_data, {style:style});
    alabama_layer = L.geoJson(albama_data,{style:style});

    data_vis2 = [data_2010, data_2011, data_2012, data_2013, data_2014, data_2015, data_2016, data_2017, data_2018];
    all_state = states;
    updateMap('30318');
    concat(blood_string,bmi_string,check_val);

    let container = d3.select('#scroll');
    let graphic = container.select('.scroll__graphic');
    let chart = graphic.select('.chart');
    let text = container.select('.scroll__text');
    let step = text.selectAll('.step');

    let inputBox = $("#probleminput");
    let submitButton = $("#problemsubmit");
    let c=0;

    submitButton.click(function(){
        c++;
        let getval = ($("#zip").val()?$("#zip").val():alert('please fill the text field'))
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
        $(".btn-group-1 > .btn").removeClass("active");
        $(this).addClass("active");
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
        $(".btn-group-2 > .btn").removeClass("active");
        $(this).addClass("active");
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

    let slider2 = d3.sliderHorizontal()
        .min(2010)
        .max(2018)
        .step(1)
        .width(300)
        .displayValue(false)
        .tickFormat(d3.format("d"))
        .on('onchange', val => {
            check(val);

        });

    let group2 = d3.select("#slider").append("svg")
        .attr("width", 500)
        .attr("height", 100)
        .append("g")
        .attr("transform", "translate(30,30)");

    group2.call(slider2);

//Function that is called whenever the slider is changed.................................
    function check(value){
        check_val= value;
        k++;
        let x = {index: 6}
        if(k>=1){
            //console.log(subset_layer)
            map.removeLayer(state_layer)
        };

        concat(blood_string, bmi_string, check_val);
        handleStepEnter(x);
    }


}

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = props ? '<b></b>'
        : '<b>Click a center</b>';
    var ScatterPlotDiv = this._div.appendChild(document.createElement("div"));
    ScatterPlotDiv.className="scatterplot_box";
    var LineChartDiv = this._div.appendChild(document.createElement("div"));
    LineChartDiv.className="linechart_box";
};

function updateMap(myzipcode){

    center_layer.on('mouseover', function (e) {
        var point = map.latLngToContainerPoint(e.latlng);
        //console.log(point)
        var tooltip = d3.select(map.getContainer())
            .append("div")
            .attr("class", "center_tooltip")
            // Calculating according to marker and tooltip size
            .style("left", point.x + 40 + "px")
            .style("top", point.y - 60 + "px")
            .style("position", "absolute")
            .style("background", "white")
            .style("opacity", "1")
            .style("padding", "0 10px")
            .style("z-index", "999")
            .style("filter", "url(#drop-shadow)")
            .html('<p><span style="color: gray;">CENTER NAME</span><br>'+e.layer.feature.properties.center_name+
                '<br><span style="color: gray;">CITY</span><br>'+ e.layer.feature.properties.city+'<br><span style="color: gray;">COUNTY</span><br>'
                +e.layer.feature.properties.county+'<br><span style="color: gray;">STATE</span><br>'+e.layer.feature.properties.state+'</p>')
            .node();
        //console.log(e.layer.feature.properties);
    });
    center_layer.on('mouseout',function(e){
        //console.log("bye");
        d3.select(map.getContainer()).select(".center_tooltip").remove();
    });

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

    var clickedMarker;
    var subsetCollection = turf.featureCollection(subsetFeatures);
    subset_layer = L.geoJson(subsetCollection);
    subset_layer.on('click', function (e) {
        info.update(e.layer.feature.properties)
        createScatterPlot(subset_data,e.layer.feature.properties);
        createLineChart(new_data,e.layer.feature.properties.center_name);

        if(clickedMarker) {
            clickedMarker.setIcon(IconStyleTwo);
        }
        var layer = e.layer;
        e.layer.setIcon(IconStyleOne);
        clickedMarker = e.layer;
    });
    /*subset_layer.on("mouseout",function(){
        //d3.select(".scatterplot").remove();
        info.update();
    });*/
    subset_layer.on('mouseover', function (e) {
        var point = map.latLngToContainerPoint(e.latlng);
        //console.log(point)
        var subset_tooltip = d3.select(map.getContainer())
            .append("div")
            .attr("class", "center_tooltip")
            // Calculating according to marker and tooltip size
            .style("left", point.x + 40 + "px")
            .style("top", point.y - 60+ "px")
            .style("position", "absolute")
            .style("background", "white")
            .style("opacity", "1")
            .style("padding", "0 10px")
            .style("z-index", "999")
            .style("filter", "url(#drop-shadow)")
            .html('<p><span style="color: gray;">CENTER NAME</span><br>'+e.layer.feature.properties.center_name+
                '<br><span style="color: gray;">CITY</span><br>'+ e.layer.feature.properties.city+'<br><span style="color: gray;">COUNTY</span><br>'
                +e.layer.feature.properties.county+'<br><span style="color: gray;">STATE</span><br>'+e.layer.feature.properties.state+'</p>')
            .node();
        //console.log(e.layer.feature.properties);
    });
    subset_layer.on('mouseout',function(e){
        //console.log("bye");
        d3.select(map.getContainer()).select(".center_tooltip").remove();
    });

    function stateFilter(feature) {
        if (feature.properties.NAME === last_zipcode_state) return true
    }
    user_state_layer = L.geoJson(states_data,{filter: stateFilter, style:style});

}
info_state.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info_state.update = function (props) {
    this._div.innerHTML = '<h4>Waitlist to Donor Ratio</h4>' +  (props ?
        '<b>' + props.NAME + '</b><br />' + props.value.slice(0,5) + ''
        : 'Hover over a state');
};

function concat(str1,str2,year){


    let temp_data = data_vis2[year-2010];
    let concat_value= str1+"_"+str2;

    // Filtering the data as per user query based  on the concat-value and year............................
    let temp= [];
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
        let current_state= all_state['features'][i]['properties']['NAME'];
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

    state_layer.on('mouseover', function (e) {
        console.log(e.layer.feature.properties)
        info_state.update(e.layer.feature.properties);
    });
    state_layer.on('mouseout',function(e){
        info_state.update();
    });

    function getColor(d) {
        return d > 25  ? '#084594' :
            d > 13  ? '#2171b5' :
                d > 8  ? '#4292c6' :
                    d > 5  ? '#6baed6' :
                        d > 3   ? '#9ecae1' :
                            d > 2   ? '#c6dbef' :
                                d > 1   ?  '#deebf7' :
                                    d == 0 ? '#d3d9dd':
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
   legend.onAdd = function (map) {

          var div = L.DomUtil.create('div', 'info legend'),
              // grades = [0, 10, 20, 50,100,200,300,400],
              ///////////////////////////////////
              grades= [25, 13, 8, 5, 3, 2, 1],
              ////////////////////////////////////
              labels = [];

          // loop through our density intervals and generate a label with a colored square for each interval
          for (var i = 0; i < grades.length; i++) {
              div.innerHTML +=
                  '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                  grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
          }
          //////////////////////////
            div.innerHTML += '<br><i style="background:' + getColor(0) + '"></i> ' +
                  '0';
        //////////////////////////////
          return div;
      };

}













/*
       This is the code for Vis 3
 */

/*
/*
  tags: basic
  <p>This example demonstrates how to use batch mode commands</p>
<p> To use a command in batch mode, we pass in an array of objects.  Then
 the command is executed once for each object in the array. </p>
*/

let waitingTime = 0;

let startYear = 1995;

let animated = true;
let stop = true;

let wlListBaseX = 320;
let wlListBaseHeight = 200;
let cycleTime = 300;
let parseTime = d3.timeParse("%Y");
let svg = d3.select('#vis3_svg');
let chartWidth = svg.attr('width');
let chartHeight = svg.attr('height');
let yearIntervalInSVG = null;
let marginLeft = 30;

let horizontalLineTop = 502;

let yearScale = null;
let sliderDragging = false;

// Road map, change all of the color. Done
// Add grey area to the addition. Done
// Change the leaving point color
// Change the position of leaving points color in bar. Done
// Change the position of all bars. Done
// Add grey area to the leaving points (Last year stuff). This is hard
// Add mark. Figure out a design decision for year overlap. Put it on the top?? I can't do hover
// Add the scale to those tables

// Add an svg, and use d3 to get the line chart at the end
// One line is wl length
// One line is donar

// Wrap everything into a Point
// Have a start coordinate, and target coordinate
// No need for collison detect then
// how to calculate target coordinate?
// One way is to include those point

// How to do a collision? Hard to do it. One way is to maintain a large
// Hashtable. But you can't dynamically check
//

// change how things work out

// Basically how that sankey works
// Create a bunch of

// New work.
// Rewrite the logic for creating right hand stuff
// Now we won't generate the bar one by one
// We will generate the bar together.
// And then when the logic change, at each point, I will add the height to array. And then assign it

// Label change
// Also need to change the label to the right
// And format the number


let canvas = document.getElementById("canvas");
let pointWidth = 1;
let pointNumber = 1000;
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
let main = document.getElementById("main");
let pointRegl = null;

let normalizeRGB = (color) => [color[0] / 255, color[1] / 255, color[2] / 255];

let dataset = [];

let nodePositionOrderRect = ["cured","other", "died", "deteriorated"];
let nodePositionOrder = ["wl"];
let flatPoints =  null;

let yearMarkPosition = {};
let scaleMarkPosition = {};

let pauseButton = document.getElementById("pauseButton");
pauseButton.addEventListener("click", ()=>{
    stop = !stop;

    if (stop) {
        pauseButton.textContent = "Resume";
    }else{
        pauseButton.textContent = "Pause";
    }

    console.log("Click, Click, Click")

});

let additionStartX = 70;
let nodePositionArrayLastYear = {
    cured: {
        name: "curedGrey",
        description: "cured",
        startX: 1075,
        startY: 10,
        width: 55,
        height: 490,
        pointNumber: 0,
        color: "#c0ff5b",
        // color_rgb: normalizeRGB([192.0, 255.0, 91.0]),
        color_rgb: normalizeRGB([241.0, 242.0, 242.0]),
        cx: 900,
        cy: 450
    },

    died: {
        name: "diedGrey",
        description: "died",
        startX: 945,
        startY: 10,
        cx: 900 ,
        cy: 240,
        width: 55,
        height: 490,
        pointNumber: 0,
        color: "#af5b5b",
        color_rgb: normalizeRGB([216.0, 216.0, 216.0])
    },

    // 880, 945, 1010, 1075
    deteriorated: {
        name: "deterioratedGrey",
        description: "worse",
        startX: 880,
        startY: 10,
        width: 55,
        height: 490,
        pointNumber: 5000,
        color: "#1f599b",
        // color_rgb: normalizeRGB([201.0, 201.0, 201.0])
        color_rgb: normalizeRGB([230.0, 230.0, 230.0])
    },

    other: {
        name: "otherGrey",
        description: "other",
        startX: 1010,
        startY: 10,
        width: 55,
        height: 490,
        pointNumber: 5000,
        color: "#1f599b",
        color_rgb: normalizeRGB([229.0, 229.0, 230.0])
    },
};

let nodePositionArray = {

    additions: {
        name: "additions",
        description: "New additions",
        startX: additionStartX,
        startY: 30,
        width: 90,
        height: 470,
        pointNumber: 0,
        cx: 50,
        cy: 150,
        color: "#F6F4F3",
        // color_rgb: normalizeRGB([246.0, 244.0, 243.0])
        // color_rgb:normalizeRGB([242.0, 50.0, 29.0])
        color_rgb: normalizeRGB([0, 98.0, 138.0])
    },

    wl: {
        name: "wl",
        description: "Waiting list number",
        startX: wlListBaseX,
        startY: 300,
        width: 600,
        height: 200,
        cx: 500,
        cy: 400,
        pointNumber: 0,

        color_rgb: normalizeRGB([99, 174, 229])
    },

    cured: {
        name: "cured",
        description: "cured",
        startX: 1075,
        startY: 10,
        width: 55,
        height: 490,
        pointNumber: 0,
        // color_rgb: normalizeRGB([192.0, 255.0, 91.0]),
        color_rgb: normalizeRGB([127.0, 203.0, 222.0]),
        cx: 900,
        cy: 450
    },

    died: {
        name: "died",
        description: "died ",
        startX: 945,
        startY: 10,
        cx: 900 ,
        cy: 240,
        width: 55,
        height: 490,
        pointNumber: 0,
        color: "#af5b5b",
        color_rgb: normalizeRGB([178.0, 96.0, 59.0])
    },

    // 880, 945, 1010, 1075
    deteriorated: {
        name: "deteriorated",
        description: "worse",
        startX: 880,
        startY: 10,
        width: 55,
        height: 490,
        pointNumber: 5000,
        color: "#1f599b",
        color_rgb: normalizeRGB([232.0, 192.0, 158.0])
    },

    other: {
        name: "other",
        description: "other",
        startX: 1010,
        startY: 10,
        width: 55,
        height: 490,
        pointNumber: 5000,
        color: "#1f599b",
        color_rgb: normalizeRGB([72.0, 174.0, 208.0])
    }
};

let colors = [];
let points = [];
let movingPointsColors = [];
let stayPointsColors = [];
let allColors = [];
class Point {

    constructor(x, y, color_rgb, currentCategory ) {
        this.currentX = x;
        this.currentY = y;
        this.color_rgb = [color_rgb[0],color_rgb[1],color_rgb[2]] ;
        this.targetX = x;
        this.targetY = y;
        this.currentCategory = currentCategory; // used for locate future color
        this.futureCategory = null; // used for locate future
        this.futureColor = null; // used for next place
        this.direction = [0,0];
        this.requiredFrame = math.randomInt(100) + 50
        this.colorFadeDirectionUnit = null;
        this.colorFadeFrame = 40;
    }

    computeDirectionVector (){
        this.direction = [this.targetX - this.currentX, this.targetY- this.currentY]
    }

    computeColorVector (){
        if (this.futureColor === null){
            return
        }
        this.colorFadeDirectionUnit = this.color_rgb.map( (c,i) =>
            (this.futureColor[i] - this.color_rgb[i])/this.colorFadeFrame
        )
    }

    setFutureColor (futureColor) {
        this.futureColor = [futureColor[0], futureColor[1], futureColor[2]];
        this.computeColorVector();
        // console.log(this.colorFadeDirectionUnit)
    }
}

// Next step: create a cured square
// Shown
// Get all of points
// Random pick one from the

let allPoints = {

    additions: [],
    wl: [],
    died: [],
    deteriorated: [],
    other: [],
    cured: [],

    diedGrey: [],
    deterioratedGrey: [],
    otherGrey: [],
    curedGrey: [],

    movingPoints: [],
    stayPoints: [],
    wlAdditions:[],
    additionsGrey: [],
    leavingPointGrey: []

};


let changeSlider = (waitingTime) => {

    let slider = d3.select("#slider_vis3")
    let dx = waitingTime * (yearScale(parseTime('1996')) - yearScale(parseTime('1995'))) / cycleTime;

    slider.attr("x1", yearScale(parseTime('' + startYear)) + dx)
    slider.attr("x2", yearScale(parseTime('' + startYear)) + dx)
    slider.attr("y1", slider.attr("y1"))
    slider.attr("y2", slider.attr("y2"))
}

// I will create another way
let populatePointsInRect = (p)=>{
    let pointCount = 0;

    let pointList = allPoints[p.name];

    while (pointCount < p.pointNumber) {
        for (let y = p.startY - 2 * pointWidth; y < p.height + p.startY - 2 * pointWidth; y += (pointWidth + 0)) {
            if (pointCount > p.pointNumber) return;

            for (let x = p.startX - 2 * pointWidth; x < p.width + p.startX - 2 * pointWidth; x += (pointWidth + 0)) {
                // I want a tons of points on the line
                pointList.push(new Point(x, y, p.color_rgb,p.name));
                pointCount++;

                if (pointCount > p.pointNumber) return
            }
        }
    }
}

let populatePointsInRectBottomToUpAdditions = (p)=>{
    if (p.name !== "additions"){
        return
    }

    let pointCount = 0;

    let pointList = allPoints[p.name];
    let greyPoints = allPoints["additionsGrey"];

    while (pointCount < p.pointNumber) {
        for (let y = p.height + p.startY - 2 * pointWidth; y > p.startY - 2 * pointWidth; y -= (pointWidth + 0)) {
            if (pointCount > p.pointNumber) return;

            for (let x = p.startX - 2 * pointWidth; x < p.width + p.startX - 2 * pointWidth; x += (pointWidth + 0)) {
                // I want a tons of points on the line
                pointList.push(new Point(x, y, p.color_rgb,p.name));
                greyPoints.push(new Point(x, y, normalizeRGB([230, 230,230]), "additionsGrey"));

                pointCount++;

                if (pointCount > p.pointNumber) return
            }
        }
    }
}

let populatePointsInRectBottomToUp = (p)=>{
    let pointCount = 0;
    console.log(p)
    let pointList = allPoints[p.name];


    while (pointCount < p.pointNumber) {
        for (let y = p.height + p.startY - 2 * pointWidth; y > p.startY - 2 * pointWidth; y -= (pointWidth + 0)) {
            if (pointCount > p.pointNumber) return;

            for (let x = p.startX - 2 * pointWidth; x < p.width + p.startX - 2 * pointWidth; x += (pointWidth + 0)) {
                // I want a tons of points on the line
                pointList.push(new Point(x, y, p.color_rgb,p.name));
                pointCount++;

                if (pointCount > p.pointNumber) return
            }
        }
    }
}

let leavingStartY = 10;
let leavingStartX = 1000;
let heightvis3 = 490;
let widthvis3 = 90;

let populatePointsInRectBottomToUpTotal = (nodePositionArray)=>{

    let pointCount = 0;

    let nodeIndex = 0;

    let pointNumberList = nodePositionOrderRect.map(v => nodePositionArray[v]).map(_ => _.pointNumber);
    let allPointNumber = pointNumberList.reduce( (x,y) => x+y, 0);

    console.log( "All point number "+ allPointNumber);

    let countTrack = pointNumberList[nodeIndex];
    let p = nodePositionArray[ nodePositionOrderRect[nodeIndex] ];
    p.labelY = 490;

    let pointList = allPoints[p.name];


    while (pointCount < allPointNumber) {
        for (let y = heightvis3 + leavingStartY - 2 * pointWidth; y > leavingStartY - 2 * pointWidth; y -= pointWidth) {
            if (pointCount > allPointNumber ) return;

            for (let x = leavingStartX - 2 * pointWidth; x < widthvis3 + leavingStartX - 2 * pointWidth; x += pointWidth ) {

                // I want a tons of points on the line
                pointList.push(new Point(x, y, p.color_rgb,p.name));
                pointCount++;
                if (pointCount > allPointNumber) return
                if (pointCount > countTrack) {
                    nodeIndex +=1;
                    p =  nodePositionArray[ nodePositionOrderRect[nodeIndex] ];
                    pointList = allPoints[p.name];
                    p.labelY = y;
                    countTrack += p.pointNumber;
                }
            }

        }
    }
};


let populatePointsInRectBottomToUpLeavingGrey = (nodePositionArrayLastYear)=>{

    let pointCount = 0;

    let nodeIndex = 0;

    let pointNumberList = nodePositionOrderRect.map(v => nodePositionArrayLastYear[v]).map(_ => _.pointNumber);
    let allPointNumber = pointNumberList.reduce( (x,y) => x+y, 0);

    console.log( "All point number "+ allPointNumber);

    let countTrack = pointNumberList[nodeIndex];
    let p = nodePositionArrayLastYear[ nodePositionOrderRect[nodeIndex] ];
    console.log("Where am I ")
    console.log(pointNumberList)
    let pointList = allPoints[p.name];

    while (pointCount < allPointNumber) {
        for (let y = heightvis3 + leavingStartY - 2 * pointWidth; y > leavingStartY - 2 * pointWidth; y -= pointWidth) {
            if (pointCount > allPointNumber ) return;

            for (let x = leavingStartX - 2 * pointWidth; x < widthvis3 + leavingStartX - 2 * pointWidth; x += pointWidth ) {

                pointList.push(new Point(x, y, p.color_rgb,p.name));
                pointCount++;
                if (pointCount > allPointNumber) return

                if (pointCount > countTrack) {
                    nodeIndex +=1;
                    p =  nodePositionArrayLastYear[ nodePositionOrderRect[nodeIndex] ];
                    pointList = allPoints[p.name];
                    countTrack += p.pointNumber;
                }
            }
        }
    }
};


// another simple way to populate WL Points.
// What if we has the same base height and weight, and go from there
let populatePointsInRectWL = (p, pAdditions)=>{
    let pointCount = 0;

    let totalNumber = getEndOfYearWlLength(nodePositionArray);


    let pointList = allPoints[p.name];
    let pAddtionTargets= allPoints["wlAdditions"];

    while (pointCount < totalNumber) {

        for (let x = p.startX - 2 * pointWidth; x < p.width + p.startX - 2 * pointWidth; x += (pointWidth + 0)) {
            if (pointCount > Math.max(totalNumber, p.pointNumber)) return;
            for (let y = p.startY - 2 * pointWidth; y < p.height + p.startY - 2 * pointWidth; y += (pointWidth + 0)) {
                // The problem is that when 2008 data is shown, 2007 tick will show. This 2007 is the end of the,
                // but also the start of the 2008

                // I want a tons of points on the line
                if (pointCount < p.pointNumber) {
                    pointList.push(new Point(x, y, p.color_rgb, p.name));
                }else{
                    pAddtionTargets.push(new Point(x, y, p.color_rgb, p.name));
                }
                pointCount++;

                if (pointCount > Math.max(totalNumber, p.pointNumber)) {
                    return
                }
            }
        }
    }
}

let populateWlPoints = (p, pAdditions, colors)=>{
    let pointCount = 0;
    let r = 1;
    let cursorX = p.cx;
    let cursorY = p.cy;

    let totalNumber = getEndOfYearWlLength(nodePositionArray);
    console.log(totalNumber)
    // if (p.name === "additions"){
    //     console.log('hello')
    // }

    let pointList = allPoints[p.name];
    let pAddtionTargets= allPoints["wlAdditions"]
    pointList.push(new Point(p.cx, p.cy, p.color_rgb,p.name));
    pointCount++;
    // points.push(p.cx);
    // points.push(p.cy);
    // p.color_rgb.forEach(c => colors.push(c));

    while (pointCount < totalNumber) {
        // Then move to right, add 1 radius
        cursorX += 1;
        // pointList.push(new Point(cursorX, cursorY , p.color_rgb,p.name));

        // There is a bug for setting the point

        // Add an if statement, if pointCount > p.pointNumber
        // Push to another point.
        if (pointCount < p.pointNumber) {
            pointList.push(new Point(cursorX, cursorY, p.color_rgb, p.name));
        }else{
            pAddtionTargets.push(new Point(cursorX, cursorY, p.color_rgb, p.name));
        }

        // pointsPush(points, cursorX, cursorY);
        pointCount++;
        if (pointCount > totalNumber) return;

        for (let i = 0; i < r; i ++){
            cursorY -= 1;
            // pointList.push(new Point(cursorX, cursorY , p.color_rgb,p.name));
            if (pointCount < p.pointNumber) {
                pointList.push(new Point(cursorX, cursorY, p.color_rgb, p.name));
            }else{
                pAddtionTargets.push(new Point(cursorX, cursorY, p.color_rgb, p.name));
            }
            pointCount++;
            if (pointCount > totalNumber) return;
        }

        // Then move left with 2 radius
        for (let i = 0; i < 2 * r; i ++){
            cursorX -= 1;
            // pointList.push(new Point(cursorX, cursorY , p.color_rgb,p.name));
            if (pointCount < p.pointNumber) {
                pointList.push(new Point(cursorX, cursorY, p.color_rgb, p.name));
            }else{
                pAddtionTargets.push(new Point(cursorX, cursorY, p.color_rgb, p.name));
            }

            pointCount++;
            if (pointCount > totalNumber) return;
        }

        for (let i = 0; i < 2*r; i++) {
            cursorY += 1;
            // pointList.push(new Point(cursorX, cursorY , p.color_rgb,p.name));
            if (pointCount < p.pointNumber) {
                pointList.push(new Point(cursorX, cursorY, p.color_rgb, p.name));
            }else{
                pAddtionTargets.push(new Point(cursorX, cursorY, p.color_rgb, p.name));
            }

            pointCount++;
            if (pointCount > totalNumber) return;
        }

        for (let i = 0; i < 2*r; i++) {
            cursorX += 1;
            // pointList.push(new Point(cursorX, cursorY , p.color_rgb,p.name));
            if (pointCount < p.pointNumber) {
                pointList.push(new Point(cursorX, cursorY, p.color_rgb, p.name));
            }else{
                pAddtionTargets.push(new Point(cursorX, cursorY, p.color_rgb, p.name));
            }

            pointCount++;
            if (pointCount > totalNumber) return;
        }

        for (let i = 0; i < r; i++) {
            cursorY -= 1;
            // pointList.push(new Point(cursorX, cursorY , p.color_rgb,p.name));
            if (pointCount < p.pointNumber) {
                pointList.push(new Point(cursorX, cursorY, p.color_rgb, p.name));
            }else{
                pAddtionTargets.push(new Point(cursorX, cursorY, p.color_rgb, p.name));
            }

            pointCount++;
            if (pointCount > totalNumber) return;
        }
        r += 1;
    }

}

// Let's randomly pick some points in our wl (the length should be the same as the cured one)
// Go through each point in cured
// For each point in cured, find a random point in wl to map onto it
// Assign wl x,y to the targetX, targetY
// assign the color to the future color
// Assign future category to the cured category

let assignRandomPointsToANumber = (sourcePoints, targetPoints, leavingPointPositionSet, reverseStartPoint, leavingGrey ) => {

    // console.log(targetPoints.length)
    for (let i =0 ; i<targetPoints.length; i ++ ){

        // Get random number
        // let position = math.randomInt(sourcePoints.length);
        //
        // while (leavingPointPositionSet.has(position)){
        //     position = math.randomInt(sourcePoints.length);
        // }

        let t = targetPoints[i];
        let position =  reverseStartPoint + i -1 ;
        // let position = i;
        if (position >= sourcePoints.length) {
            position -= sourcePoints.length;
        }
        leavingPointPositionSet.add(position);

        // console.log(targetPoints.length);
        let randomSourcePoint = sourcePoints[position];

        // randomSourcePoint.color_rgb = normalizeRGB([246.0, 244.0, 243.0])
        randomSourcePoint.targetX = t.currentX;
        randomSourcePoint.targetY = t.currentY;
        randomSourcePoint.futureCategory = t.currentCategory
        randomSourcePoint.setFutureColor(t.color_rgb);
        randomSourcePoint.computeDirectionVector()

        leavingGrey.push( new Point(randomSourcePoint.currentX, randomSourcePoint.currentY,normalizeRGB([230, 230, 230]),randomSourcePoint.name))

    }
}

let additionToWL = (sourcePoints,  targetPoints, leavingPointSet, wlExtraAdditions, reverseStartPoint) => {

    // let l = Math.min(sourcePoints.length, targetPoints.length);

    let l = Array.from(leavingPointSet);
    console.log("sorting")
    l.sort( (x,y) => parseInt(x) - parseInt(y));
    console.log(l)

    let n = 0;

    // For each point in source, map onto target
    // So should go through each point in source, and then pick one in the set.
    //
    // Or for each element in WL leaving, get the point and then pick one from sourcepoints, and then set the currentX
    // Increase the index


    l.forEach(i =>{
        if (n === sourcePoints.length) return;

        let t = targetPoints[i];
        // let position = i;
        // let position = i;
        // if (position >= sourcePoints.length) {
        //     position -= sourcePoints.length;
        // }

        let sourcePoint = sourcePoints[n];
        // sourcePoint.color_rgb = normalizeRGB([246.0, 244.0, 243.0]);
        sourcePoint.targetX = t.currentX;
        sourcePoint.targetY = t.currentY;
        sourcePoint.futureCategory = t.currentCategory;
        sourcePoint.setFutureColor(sourcePoint.color_rgb);
        sourcePoint.computeDirectionVector()
        // console.log(targetPoints);
        n++;

    });

    // Start from the end of the leaving point.
    let leavingPointsLength  = leavingPointSet.size;
    console.log(wlExtraAdditions.length)
    console.log(sourcePoints.length)
    console.log(leavingPointsLength)

    console.log("difference is  " + (wlExtraAdditions.length - sourcePoints.length + leavingPointsLength));

    for (let i = 0; i < Math.min(wlExtraAdditions.length, sourcePoints.length - leavingPointsLength); i++ ){

        let sourcePoint = sourcePoints[leavingPointsLength + i];
        let t = wlExtraAdditions[i];
        sourcePoint.targetX = t.currentX;
        sourcePoint.targetY = t.currentY;
        sourcePoint.futureCategory = sourcePoint.currentCategory;
        sourcePoint.setFutureColor(sourcePoint.color_rgb);
        sourcePoint.computeDirectionVector()
    }

};

let getEndOfYearWlLength = (nodes) =>
    nodes["wl"].pointNumber + nodes["additions"].pointNumber - nodes["cured"].pointNumber - nodes["died"].pointNumber -
    nodes["deteriorated"].pointNumber - nodes["other"].pointNumber ;

let fontFamily = "Ariel"

class WlLabelController{

    constructor(label, lastyearWl, thisyearWl, cycleTime){
        this.label = label;
        this.lastyearWl = lastyearWl;
        this.thisyearWl = thisyearWl;
        this.wlShown = lastyearWl;
        this.difference = thisyearWl - lastyearWl;
        this.cycleTime = cycleTime;
        this.delta = this.difference/ this.cycleTime;
        this.updateTickNumber = 30;
        this.tickTracker = -1;

    }

    reset(lastyearWl, thisyearWl){
        this.lastyearWl = lastyearWl;
        this.thisyearWl = thisyearWl;
        this.difference = thisyearWl - lastyearWl;
        this.delta = this.difference/ this.cycleTime;
        this.wlShown = this.lastyearWl;
        this.tickTracker = -1;
        this.renderLabelContent()
    }

    renderLabelContent(){

        if (this.tickTracker === cycleTime){
            return
        }

        if (this.tickTracker === -1){
            this.label.textContent = `Currently waiting: ${ Math.floor(this.wlShown)}`;
        }

        if (this.tickTracker % 30 === 0) {
            this.label.textContent = `Currently waiting: ${ Math.floor(this.wlShown)}`;
        }

    }

    updateWl(){
        this.wlShown = this.delta+ this.wlShown
        this.tickTracker += 1;
    }

    stop(){
        this.delta = 0;
    }
}

let wlLabelController = null;

// Main function. It also add more element to the screen
let computePointsAndColor = () =>{
    waitingTime = 0;
    points= [];
    colors = [];

    allPoints = {

        additions: [],
        wl: [],
        died: [],
        deteriorated: [],
        other: [],
        cured: [],

        diedGrey: [],
        deterioratedGrey: [],
        otherGrey: [],
        curedGrey: [],

        movingPoints: [],
        stayPoints: [],
        wlAdditions:[],
        additionsGrey:[],
        leavingPointGrey: []
    };

    // Now I need to allocate different group number pixels in different place
    // console.log(p);

    populatePointsInRectWL(nodePositionArray["wl"],nodePositionArray["additions"]);
    //console.log(allPoints['additions'])
    // console.log(pointCount)
    console.log("WLAddition: " + allPoints["wlAdditions"].length)

    populatePointsInRectBottomToUpAdditions(nodePositionArray["additions"]);

    // for (let index in nodePositionOrderRect) {
    //     let key = nodePositionOrderRect[index];
    //     let p = nodePositionArray[key];
    //     // Now I need to allocate different group number pixels in different place
    //
    //     populatePointsInRectBottomToUp(p, colors);
    // }

    populatePointsInRectBottomToUpTotal(nodePositionArray);
    populatePointsInRectBottomToUpLeavingGrey(nodePositionArrayLastYear);
    console.log(allPoints)

    // Last year
    // for (let index in nodePositionOrderRect){
    //     let key = nodePositionOrderRect[index];
    //     let p = nodePositionArrayLastYear[key];
    //     populatePointsInRectBottomToUp(p, colors)
    // }

    let leavingPointsList = [];
    let reverseStartPoint = allPoints["wl"].length;
    reverseStartPoint -= allPoints["cured"].length;
    reverseStartPoint -= allPoints["other"].length;
    reverseStartPoint -= allPoints["died"].length;
    reverseStartPoint -= allPoints["deteriorated"].length;

    let s = new Set();

    assignRandomPointsToANumber(allPoints["wl"], allPoints["deteriorated"], s, reverseStartPoint, allPoints["leavingPointGrey"]);
    reverseStartPoint += allPoints["deteriorated"].length;

    assignRandomPointsToANumber(allPoints['wl'], allPoints['died'], s, reverseStartPoint, allPoints["leavingPointGrey"]);
    reverseStartPoint += allPoints["died"].length;

    assignRandomPointsToANumber(allPoints["wl"], allPoints["other"], s, reverseStartPoint, allPoints["leavingPointGrey"]);
    reverseStartPoint += allPoints["other"].length;

    assignRandomPointsToANumber(allPoints["wl"], allPoints["cured"], s, reverseStartPoint, allPoints["leavingPointGrey"]);

    // Assign
    additionToWL(allPoints['additions'], allPoints['wl'], s, allPoints["wlAdditions"] ,allPoints['additions'].length)
    points =  allPoints["leavingPointGrey"].concat(allPoints["additionsGrey"].concat(allPoints["wl"].concat(allPoints["additions"])));
    points = points.concat(allPoints["curedGrey"]);
    points = points.concat(allPoints["diedGrey"]);
    points = points.concat(allPoints["otherGrey"]);
    points = points.concat(allPoints["deterioratedGrey"]);
    console.log(allPoints["curedGrey"].length);
    console.log(allPoints["diedGrey"].length);
    console.log(allPoints["otherGrey"].length);

    console.log("All point length" + points.length)
    console.log("addition grey is " + allPoints['additionsGrey'].length)
    allPoints.movingPoints = points.filter( p =>  (p.currentX !== p.targetX|| p.currentY !== p.targetY) );
    allPoints.stayPoints =  points.filter( p =>  (p.direction[0] === 0 && p.direction[1] === 0) );
    console.log(allPoints);

    // Initialize flatPoints
    flatPoints = Array(points.length * 2); // stay first, and movement first

    // Colors
    let updatePointBase = allPoints.stayPoints.length * 2;
    allColors = Array(3 * (allPoints.stayPoints.length + allPoints.movingPoints.length));
    for (let i =0 ; i < allPoints.stayPoints.length; i++){
        let p = allPoints.stayPoints[i];
        flatPoints[2*i] = p.currentX;
        flatPoints[2*i + 1] = p.currentY;

        allColors[3*i] = p.color_rgb[0]
        allColors[3*i + 1] = p.color_rgb[1]
        allColors[3*i + 2] = p.color_rgb[2]
    }
    let colorBase = allPoints.stayPoints.length * 3;
    for (let i =0 ; i < allPoints.movingPoints.length; i++){
        let p = allPoints.movingPoints[i];
        flatPoints[2*i + updatePointBase] = p.currentX;
        flatPoints[2*i + 1 + updatePointBase] = p.currentY;

        allColors[colorBase + 3*i] = p.color_rgb[0];
        allColors[colorBase + 3*i + 1] = p.color_rgb[1];
        allColors[colorBase + 3*i + 2] = p.color_rgb[2]
    }

    // Add the label
    for (let key in nodePositionArray) {
        let p = nodePositionArray[key];
        let node = document.getElementById(key);
        if (node=== null){
            node = document.createElement("div");
            node.classList.add("node");
            node.setAttribute("id", key);

            if (p.name === "additions"){
                node.style.width = `120px`;
                node.style.left = `${p.startX-20}px`;
                node.style.height = `30px`;
                node.style.top = `${p.startY + p.height + 2}px`;
                node.style.textAlign = `center`;
            } else if (p.name === "wl") {
                node.style.width = `200px`;
                node.style.left = `${p.startX- 40}px`;
                node.style.height = `30px`;
                node.style.top = `${p.startY + p.height + 2}px`;
                node.style.textAlign = `center`;
            }
            else {
                node.style.width = `120px`;
                node.style.left = `${leavingStartX + 100}px`;
                node.style.top = `${p.labelY - 20}px`;
                node.style.textAlign = `left`;
            }

            node.style.height = `30px`;
            // node.style.fontStyle.
            node.style.color = "black";
            // node.style.borderColor = "blue";
            node.style.borderWidth= "0px";
            // node.style.strokeOpacity = '0%';
            if (p.name === "additions"){
                node.textContent = `${p.description} ${p.pointNumber}`
            }else if (p.name === "wl"){
                node.textContent = `${p.description}`
            }else{
                node.textContent = `${p.description}`
            }

            node.style.fontFamily = fontFamily;
            main.insertAdjacentElement("afterbegin", node);
            node.style.fontSize= `14px`;
        }else{
            node.style.top=`${p.labelY - 20}px`;

            if (p.name === "additions"){
                node.textContent = `${p.description} ${p.pointNumber}`
            }else if (p.name === "wl"){
                node.textContent = `${p.description}`
            }else{
                node.textContent = `${p.description}`
            }
        }
    }

    for (let key in nodePositionOrderRect) {
        let nodeKey = nodePositionOrderRect[key]

        let p = nodePositionArray[nodeKey];
        let node = document.getElementById(nodeKey+"_number");
        if (node=== null){
            node = document.createElement("div");
            node.classList.add("node");
            node.setAttribute("id", nodeKey+"_number");

            node.style.width = `120px`;
            node.style.left = `${leavingStartX + 140}px`;
            node.style.top = `${p.labelY - 20}px`;
            node.style.textAlign = `left`;

            node.style.height = `30px`;
            // node.style.fontStyle.
            node.style.color = "black";
            // node.style.borderColor = "blue";
            node.style.borderWidth= "0px";
            // node.style.strokeOpacity = '0%';
            node.textContent = `${p.pointNumber}`
            node.style.fontFamily = fontFamily;
            main.insertAdjacentElement("afterbegin", node);
            node.style.fontSize= `14px`;
        }else{
            node.style.top=`${p.labelY - 20}px`;
            node.textContent = `${p.pointNumber}`
        }
    }



    // The label on the right hand bottom
    let patientLeftLabel = document.getElementById("patientLeft");
    if (patientLeftLabel === null){
        patientLeftLabel = document.createElement("div")
        patientLeftLabel.classList.add("node")
        patientLeftLabel.setAttribute("id", "patientLeft")
        patientLeftLabel.style.left = "993px";
        patientLeftLabel.style.fontSize= `14px`;
        patientLeftLabel.style.top = "502px";
        patientLeftLabel.style.width = "100px";
        patientLeftLabel.style.height = "40px";
        patientLeftLabel.style.textAlign = "center";
        patientLeftLabel.style.color = "black";
        patientLeftLabel.style.borderWidth= "0px";
        patientLeftLabel.style.fontFamily = "Georgia";
        patientLeftLabel.textContent = `Patients left ${nodePositionArray["died"].pointNumber +
        nodePositionArray["deteriorated"].pointNumber + nodePositionArray["cured"].pointNumber +
        nodePositionArray["other"].pointNumber}`;
        main.insertAdjacentElement("afterbegin", patientLeftLabel);
    }else {
        patientLeftLabel.textContent = `Patients left ${nodePositionArray["died"].pointNumber +
        nodePositionArray["deteriorated"].pointNumber + nodePositionArray["cured"].pointNumber +
        nodePositionArray["other"].pointNumber}`;
    }

    // Render vertical line onto it
    for (let i = 1995; i < startYear; i++){
        let tickForYear = document.getElementById(`${i}_tick`)
        if (tickForYear === null){
            tickForYear = document.createElement("div");
            tickForYear.classList.add("tick");
            tickForYear.style.left = `${yearMarkPosition[i]}px`;
            tickForYear.style.top = `${horizontalLineTop}px`;
            tickForYear.style.width = `2px`;
            tickForYear.style.height = `5px`;
            tickForYear.style.position = "absolute"
            tickForYear.setAttribute("id", `${i}_tick`);
            tickForYear.style.background = "black";
            main.insertAdjacentElement("afterbegin", tickForYear);
        }
    }

    for (let i = 1995; i < startYear; i++){
        let labelForYear = document.getElementById(`${i}_label`);
        if (labelForYear=== null){
            labelForYear= document.createElement("div");
            // labelForYear.classList.add("tick");
            labelForYear.style.left = `${yearMarkPosition[i]-4}px`;

            if (i >= 2015)
                labelForYear.style.top = `${horizontalLineTop + 14}px`;
            else
                labelForYear.style.top = `${horizontalLineTop + 6}px`;

            labelForYear.setAttribute("id", `${i}_label`);
            labelForYear.style.fontSize = "8px";
            labelForYear.textContent = `${ i.toString().slice(2,4) }`;
            labelForYear.style.borderWidth= "0px";
            labelForYear.style.position = "absolute";
            labelForYear.style.fontFamily = fontFamily;
            main.insertAdjacentElement("afterbegin", labelForYear);
        }
    }

    // get rid of 13 for 15
    let label13 = document.getElementById("13_label");
    let label15 = document.getElementById("15_label");


    // let yScale = document.getElementById("yScale");
    // if(yScale === null){
    //     let yScale = document.createElement("div");
    //     yScale.classList.add("verticalline");
    //     yScale.setAttribute("id", "yScale");
    //     yScale.style.width = `2px`;
    //     yScale.style.height = `400px`;
    //     yScale.style.left = `40px`;
    //     yScale.style.top = `100px`;
    //     yScale.style.background = "black";
    //     yScale.style.position = "absolute";
    //     main.insertAdjacentElement("afterbegin", yScale);
    // }

    let markValue = Object.keys(scaleMarkPosition);

    // calculate the highest one. No need to run it at any time
    // addition number
    // run an algorithm to determine the closet number in the mark value
    // first sort and run
    // we will use the new key to run

    // in place sort
    let additionNumber = nodePositionArray["additions"].pointNumber;
    markValue.sort( (a,b) => parseInt(a) - parseInt(b) );
    let newMarkValue = [];
    let tempMin = Infinity;
    for (let i =0; i < markValue.length; i++){
        let a = Math.abs(additionNumber - parseInt(markValue[i]));
        if (a < tempMin){
            tempMin = a
            newMarkValue.push(markValue[i])
        }
    }

    for (let i = 0; i < newMarkValue.length; i++){
        let value = newMarkValue[i];
        let tickForValue = document.getElementById(`${value}_tick`);
        if (tickForValue === null){
            tickForValue = document.createElement("div");
            tickForValue.classList.add("tick");
            tickForValue.style.left = `${additionStartX - 14}px`;
            tickForValue.style.top = `${scaleMarkPosition[value] -2}px`;
            tickForValue.style.width = `4px`;
            tickForValue.style.height = `1px`;
            tickForValue.setAttribute("id", `${value}_tick`);
            tickForValue.style.background = "black";
            tickForValue.style.position = "absolute";
            // tickForYear .style.fontSize = "8px";
            // tickForYear .textContent = `${ i.toString().slice(2,4) }`;
            // tickForYear.style.borderWidth= "0px";
            main.insertAdjacentElement("afterbegin", tickForValue );
        }
    }

    for (let i = 0; i < newMarkValue.length; i++){
        let value = newMarkValue[i];
        let labelForValue = document.getElementById(`${value}_label`);
        if (labelForValue === null){
            labelForValue = document.createElement("div");
            labelForValue.classList.add("label_vis3");
            labelForValue.style.left = `${additionStartX-43}px`;
            labelForValue.style.top = `${scaleMarkPosition[value]-10}px`;
            labelForValue.style.position = "absolute";
            labelForValue.setAttribute("id", `${value}_label`);
            labelForValue .style.fontSize = "9px";
            labelForValue .textContent = `${ value }`;
            labelForValue.style.fontFamily = fontFamily;
            labelForValue.style.borderWidth= "0px";
            main.insertAdjacentElement("afterbegin", labelForValue );
        }else{
            labelForValue .textContent = `${ value }`;
        }

    }

    let title = document.getElementById("title")
    if (title === null){
        title = document.createElement("div")
        title.classList.add("titlevis3")
        title.setAttribute("id", "title")
        title.style.left = `350px`;
        title.style.top = `100px`;
        title.style.textAlign = `center`;
        title.style.position = "absolute";
        title.style.fontFamily = fontFamily;
        title.textContent = `Waiting list change in ${startYear}`;
        title.style.width = "500px";
        title.style.height = "100px";
        title.style.fontSize = "40px";
        title.style.borderWidth= "0px";
        main.insertAdjacentElement("afterbegin", title);
    }else{
        title.textContent = `Waiting list change in ${startYear}`
    }

    let wlnumberLabel = document.getElementById("wlnumber")
    if (wlnumberLabel === null){
        wlnumberLabel = document.createElement("div")
        wlnumberLabel.classList.add("wlnumber")
        wlnumberLabel.setAttribute("id", "wlnumber")
        wlnumberLabel.style.left = `460px`;
        wlnumberLabel.style.top = `170px`;
        wlnumberLabel.style.textAlign = `center`;
        wlnumberLabel.style.position = "absolute";
        wlnumberLabel.style.fontFamily = fontFamily;
        // wlnumberLabel.textContent = `Currently on waiting list: ${nodePositionArrayLastYear["wl"].pointNumber}`;
        wlnumberLabel.style.width = "300px";
        wlnumberLabel.style.height = "50px";
        wlnumberLabel.style.fontSize = "20px";
        wlnumberLabel.style.borderWidth= "0px";
        main.insertAdjacentElement("afterbegin", wlnumberLabel);
    }
    if (wlLabelController === null){
        wlLabelController = new WlLabelController(wlnumberLabel, nodePositionArray["wl"].pointNumber,
            getEndOfYearWlLength(nodePositionArray)
            , cycleTime)
    }
    else{
        wlLabelController.reset(nodePositionArray["wl"].pointNumber, getEndOfYearWlLength(nodePositionArray))
    }

    // let addingLabel = document.getElementById("addingTotalNumber")
    // if (addingLabel === null){
    //     addingLabel = document.createElement("div")
    //     addingLabel .classList.add("addingTotalNumber")
    //     addingLabel .setAttribute("id", "addingTotalNumber")
    //     addingLabel.style.left = `340px`;
    //     addingLabel.style.top = `180px`;
    //     addingLabel.style.textAlign = `center`;
    //     addingLabel.style.position = "absolute";
    //     addingLabel.style.fontFamily = fontFamily;
    //     addingLabel.textContent = `Total new adding: ${nodePositionArray["additions"].pointNumber}`;
    //     addingLabel.style.width = "250px";
    //     addingLabel.style.height = "50px";
    //     addingLabel.style.fontSize = "20px";
    //     addingLabel.style.borderWidth= "0px";
    //     main.insertAdjacentElement("afterbegin", addingLabel);
    // }else{
    //     addingLabel.textContent = `Total new adding: ${nodePositionArray["additions"].pointNumber}`
    // }

    // let leavingLabel = document.getElementById("leavingTotalNumber")
    // if (leavingLabel=== null){
    //     leavingLabel= document.createElement("div")
    //     leavingLabel.classList.add("leavingTotalNumber")
    //     leavingLabel.setAttribute("id", "leavingTotalNumber")
    //     leavingLabel.style.left = `640px`;
    //     leavingLabel.style.top = `180px`;
    //     leavingLabel.style.textAlign = `center`;
    //     leavingLabel.style.position = "absolute";
    //     leavingLabel.style.fontFamily = fontFamily;
    //     leavingLabel.textContent = `Total patients left: ${nodePositionArray["died"].pointNumber +
    //         nodePositionArray["deteriorated"].pointNumber + nodePositionArray["cured"].pointNumber +
    //         nodePositionArray["other"].pointNumber}`;
    //     leavingLabel.style.width = "250px";
    //     leavingLabel.style.height = "50px";
    //     leavingLabel.style.fontSize = "20px";
    //     leavingLabel.style.borderWidth= "0px";
    //     main.insertAdjacentElement("afterbegin", leavingLabel);
    // }
    //     leavingLabel.textContent = `Total patients left: ${nodePositionArray["died"].pointNumber +
    //         nodePositionArray["deteriorated"].pointNumber + nodePositionArray["cured"].pointNumber +
    //         nodePositionArray["other"].pointNumber
    //     }`;


};

let updateNumber = (year) =>{

    let y = (year);
    let lasty = (year-1);
    console.log(lasty)
    // In place change of nodePositionArray
    let year_data = dataset.filter(d => d.time === y)[0];
    let last_year_data = dataset.filter(d => d.time === lasty)[0];
    console.log(year_data);
    console.log(last_year_data)

    for (let k in nodePositionArray){
        let n = nodePositionArray[k];

        if (k === "wl"){

            n.pointNumber = parseInt(last_year_data[k])
        }
        else{
            n.pointNumber = parseInt(year_data[k])
        }
    }

    for (let k in nodePositionArrayLastYear){

        let n = nodePositionArrayLastYear[k];

        if ( lasty !== 1994 ){
            n.pointNumber = parseInt(last_year_data[k])
        } else {
            n.pointNumber = 0;
        }
    }

    console.log("last year data")
    console.log(nodePositionArray)
}

let calculateYearTickX = (dset) =>{

    dset.forEach( d => {
            yearMarkPosition[d.time] = Math.floor(wlListBaseX + d.wl/wlListBaseHeight);
        }
    )
}

let calculateNumberScale = (dset) =>{

    let highestTick = 37000;
    let tickNumber = 20;
    let numberInterval = 37000 / tickNumber;
    let totalHeight = highestTick / 90;
    let interval = totalHeight / tickNumber;
    let baseHeight = 500;
    for (let i = 0; i < tickNumber; i++ ){
        // {"value of people":"Pixel at height"}
        //  { 1750,570 - interval}
        scaleMarkPosition[i * numberInterval] = baseHeight-i*interval;
    }
    console.log("Scale: " );
    console.log(scaleMarkPosition)
}

let changeSlidePosition = (slideId, x) => {
    let line = d3.select("#"+slideId);
    // Update the line properties
    line.attr("x1", parseInt(x));
    line.attr("y1", parseInt(line.attr("y1")));
    line.attr("x2", parseInt(x));
    line.attr("y2", parseInt(line.attr("y2")));
}

let createChart = (dset) =>{

    let formattedData = []
    dset.sort((a,b) => a.time - b.time );
    dset.forEach( (d, i) =>{
            let newd = {}
            console.log(d.time);
            if (d.time + "" !== "1994") {
                newd["time"] = parseTime(d.time + "");
                newd["wl"] = parseInt( dset[i-1].wl);
                newd["donars"] = parseInt(d.donars);
                formattedData.push(newd)
            }
        }
    );

    let x = d3.scaleTime().range([50, chartWidth-30]);
    yearScale = x;
    let y = d3.scaleLinear().range([chartHeight-20, 10]);
    let line = d3.line()
        .x(d=>x(d.time))
        .y(d=>y(d.wl));

    let numberExtent = d3.extent(formattedData, d=>d.wl);
    console.log("Number Extent");
    console.log(numberExtent);

    let yearExtent = d3.extent(formattedData, d=>d.time);
    console.log("Year Extent");
    console.log(yearExtent);

    x.domain(yearExtent);
    y.domain([0, numberExtent[1]]);

    svg.append("path")
        .datum(formattedData)
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("fill", "none")
        .attr("d", line);

    svg.append("text")
        .attr("x", `${chartWidth-60}px`)
        .attr("y", `${chartHeight-50}px`)
        .text('donor')
        .attr("fill", "brown")
        .attr("font-size", "14px")
        .attr("font-family", fontFamily);

    svg.append("text")
        .attr("x", `${chartWidth-60}px`)
        .attr("y", `${chartHeight-115}px`)
        .text('patient')
        .attr("fill", "steelblue")
        .attr("font-size", "14px")
        .attr("font-family", fontFamily);


    let line2 = d3.line()
        .x(d=>x(d.time))
        .y(d=>y(d.donars));

    svg.append("path")
        .datum(formattedData)
        .attr("stroke", "brown")
        .attr("stroke-width", 1.5)
        .attr("fill", "none")
        .attr("d", line2);

    console.log(line2)

    svg.append("g")
        .style("font-family", fontFamily)
        .attr("transform", `translate(0, ${chartHeight - 20} )`)
        .call(d3.axisBottom(x).ticks(24));

    svg.append("g")
        .style("font-family", fontFamily)
        .attr("transform", `translate(${50},` + 0+ ")")
        .call(d3.axisLeft(y));

    let dragStarted = (d) =>{
        sliderDragging = true
        console.log("drag started")
    }

    let dragged = (d) => {
        let x = d3.event.x
        let y = d3.event.y
        changeSlidePosition("slider_vis3", x )
    }

    let dragended = (d) =>{
        // We have to reset
        console.log("drag ended")
        // Find the closest year. Attach to it
        // First question: How to find the closest year
        // Stupid answer, minus by everything, and compare the one closest to 0
        let x = d3.event.x;
        let prevDistance = Infinity;
        let positionOfAYear = (yearNumber) => yearScale(parseTime(""+yearNumber));

        if (x < yearScale(parseTime("1994"))){
            // move slide to 1994
            changeSlidePosition("slider_vis3", positionOfAYear(1994))

        } else if (x > yearScale(parseTime("2018"))) {
            // move slide to 2018
            changeSlidePosition("slider_vis3", positionOfAYear(2018))
        }else {
            for (let i = 1995; i < 2019; i ++){

                let currentDistance = Math.abs(x - positionOfAYear(i));
                if (currentDistance < prevDistance){
                    prevDistance = currentDistance;
                }else{
                    // decide that the last one is the closest one
                    // move slide to that year
                    changeSlidePosition("slider_vis3", positionOfAYear(i-1))
                    console.log("The effect of change slider is " +  i -1);
                    startYear = i-1;

                    updateNumber(startYear);
                    computePointsAndColor();
                    break

                }
            }
        }
        sliderDragging = false;
    }

    let drag = d3.drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragended);

    svg.append('line')
        .attr("id", "slider_vis3")
        .attr("x1", x(parseTime('1994')))
        .attr("y1", 0)
        .attr('x2', x(parseTime('1994')))
        .attr("y2", 130)
        .attr("stroke-width", 6)
        .attr("stroke", "red")
        .call(drag)


    yearIntervalInSVG = x(parseTime('1996')) - x(parseTime('1995'))

};

let data = d3.csv('./vis3/waitlist-change.csv',
    d =>
        // This callback formats each row of the data
    {
        console.log(d);
        return {
            time: parseInt(d.Time),
            died: parseInt(d.Died),
            deteriorated: d.Deteriorated,
            cured: d.Cured,
            other: d.Other,
            additions: d.Additions,
            wl: parseInt(d["WL Length"]),
            donars: parseInt(d["Donor Number"])
        }

    } , (err, dset) =>{
        // console.log(dset);
        dataset = dset;
        //create chart below
        createChart(dset)

        calculateYearTickX(dset);
        calculateNumberScale(dset);
        updateNumber(1995);
        computePointsAndColor();
        run(dataset)
    } )


let run = (dataset) => {

    let regl = createREGL({canvas: canvas});
    const draw = regl({
        frag: `
    precision mediump float;
    varying vec3 vColor;
    void main() {
      gl_FragColor = vec4(vColor, 1);
    }`,

        vert: `
    precision mediump float;
    attribute vec2 position;
    uniform float angle;
    uniform vec2 offset;
    uniform float pointWidth;
    uniform float canvasWidth;
    uniform float canvasHeight;
    attribute vec3 color;
    varying vec3 vColor;

    vec2 normalizeCoords(float x, float y) {
          return vec2(
          2.0 * ((x / canvasWidth) - 0.5),
          // invert y to treat [0,0] as bottom left in pixel space
          -(2.0 * ((y / canvasHeight) - 0.5)));
    }

    void main() {
      gl_PointSize = pointWidth;
      vColor = color;
      gl_Position = vec4(
        normalizeCoords(position.x,position.y), 0, 1);
    }`,

        attributes: {
            position: (context, props) => {
                if (!props.animated){

                    let allNames = [ "wl", "other", "additions", "died", "deteriorated", "cured" ];

                    let allPointsNumber = props.allPoints["wl"].length +
                        props.allPoints["other"].length + props.allPoints["additions"].length
                        + props.allPoints["died"].length +props.allPoints["deteriorated"].length
                        + props.allPoints['cured'].length

                    let a = Array(allPointsNumber * 2)

                    let pointer = 0;
                    for (let i in allNames){

                        let p = props.allPoints[allNames[i]]
                        p.forEach( (eachPoint,j) => {

                            a[j*2 + pointer] = eachPoint.currentX;
                            a[j*2 + 1 + pointer] = eachPoint.currentY;
                        } )

                        pointer += p.length * 2;
                    }

                    return regl.buffer(a)
                }

                let a =props.flatPoints;
                let base = 2* props.stayPoints.length;

                // if animated

                for (let i =0; i < props.movingPoints.length; i ++){

                    let p = props.movingPoints[i];

                    if (props.waitingTime >= 40 && (props.waitingTime < (40 + p.colorFadeFrame)) && !stop){
                        p.color_rgb[0] += p.colorFadeDirectionUnit[0];
                        p.color_rgb[1] += p.colorFadeDirectionUnit[1];
                        p.color_rgb[2] += p.colorFadeDirectionUnit[2];
                        // p.color_rgb = p.futureColor
                    } else if (props.waitingTime === (40 + p.colorFadeFrame)){
                        p.color_rgb = p.futureColor
                    }

                    if ( Math.abs(p.currentX - p.targetX) < 0.3 && Math.abs(p.currentY - p.targetY) < 0.3){
                        p.direction = [0,0];
                        // p.color_rgb = p.futureColor;
                    }

                    if (p.direction.x === 0 && p.direction.y === 0){

                    }

                    else {
                        // let t = math.randomInt(20) + 180;
                        if ( props.waitingTime >= 100 && !stop ) {
                            p.currentX += p.direction[0] / p.requiredFrame;
                            p.currentY += p.direction[1] / p.requiredFrame;
                        }
                    }

                    a[2*i + base] = p.currentX;
                    a[2*i + 1 + base] = p.currentY
                    // console.log(p.direction[0]/10)
                }

                return a

                    ;


            } ,
            color: (context, props) => {

                if (!props.animated){

                    let allNames = [ "wl", "other", "additions", "died", "deteriorated", "cured" ];

                    let allPointsNumber = props.allPoints["wl"].length +
                        props.allPoints["other"].length + props.allPoints["additions"].length
                        + props.allPoints["died"].length +props.allPoints["deteriorated"].length
                        + props.allPoints['cured'].length

                    let a = Array(allPointsNumber * 3)

                    let pointer = 0;
                    for (let i in allNames){

                        let p = props.allPoints[allNames[i]]
                        p.forEach( (eachPoint,j) => {

                            a[j*2 + pointer] = eachPoint.currentX;
                            a[j*2 + 1 + pointer] = eachPoint.currentY;
                        } )

                        pointer += p.length * 3;
                    }

                    return regl.buffer(a)
                }

                // Calculate the color for the moving parts
                let allColors = props.allColors;
                let base = props.stayPoints.length * 3;
                for (let i = 0; i < props.movingPoints.length; i++){

                    for (let j = 0; j < 3; j++){
                        allColors[ base + 3*i + j ] = props.movingPoints[i].color_rgb[j];
                    }
                }
                // Calculate
                return allColors
            }
        },

        uniforms: {
            // color: [1.00, 0.001, 0.001],
            angle: ({tick}) => 0.01 * tick,
            offset: regl.prop('offset'),
            pointWidth: regl.prop('pointWidth'),
            canvasHeight: regl.prop('canvasHeight'),
            canvasWidth: regl.prop('canvasWidth'),
        },

        depth: {
            enable: false
        },

        count: (context, props) => props.points.length,
        primitive: "points",
    })

    regl.frame((time) => {
        regl.clear({
            color: [255/255, 255/255, 255/255, 1]
        });

        if (waitingTime > cycleTime && startYear !== 2018) {
            startYear += 1;

            if (startYear !== 2018) {
                updateNumber(startYear);
                computePointsAndColor();
            }else{
                if (wlLabelController !== null){
                    wlLabelController.stop()
                }
            }
        }

        if (!sliderDragging)
            if (startYear !== 2018)
                changeSlider(waitingTime);

        // Update label
        // wlnumberLabel

        if (!stop) {

            if (stopAt100 === true && waitingTime === 99){

            }else{
                waitingTime += 1;
                if (wlLabelController !== null){
                    wlLabelController.updateWl();
                    wlLabelController.renderLabelContent();
                }
            }
        }

        // This tells regl to execute the command once for each object
        draw({pointWidth: pointWidth, canvasHeight: canvasHeight, canvasWidth: canvasWidth, time: time, points: points,allPoints: allPoints,
            colors: colors, movingPoints: allPoints.movingPoints, flatPoints: flatPoints, stayPoints:allPoints.stayPoints,
            movingPointsColors: movingPointsColors, allColors: allColors, waitingTime: waitingTime, animated: animated, stop: stop
        })
    })
}
