/*
  tags: basic
  <p>This example demonstrates how to use batch mode commands</p>
<p> To use a command in batch mode, we pass in an array of objects.  Then
 the command is executed once for each object in the array. </p>
*/

let waitingTime = 0;

let startYear = 1995

let animated = true;
let stop = true;

let wlListBaseX = 240;
let wlListBaseHeight = 200;
let cycleTime = 300;
let parseTime = d3.timeParse("%Y");
let svg = d3.select('#vis3_svg');
let chartWidth = svg.attr('width');
let chartHeight = svg.attr('height');
let yearIntervalInSVG = null;
let marginLeft = 30

let horizontalLineTop = 502

let yearScale = null;
let sliderDragging = false;
console.log("running experiment")

// $("#yearSlider").slider({
//     tooltip: 'always',
//     tooltip_position:'bottom'
// });
//
//
// // Listens to the on "change" event for the slider
// $("#yearSlider").on('change', function(event){
//     // Update the chart on the new value
//     updateNumber(event.value.newValue);
//     startYear = event.value.newValue;
//     waitingTime = 0;
//     computePointsAndColor();
// });

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

let nodePositionOrderRect = ["other","cured", "died", "deteriorated"];
let nodePositionOrder = ["wl"];
let flatPoints =  null;

let yearMarkPosition = {};
let scaleMarkPosition = {};

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
        color_rgb: normalizeRGB([230.0, 230.0, 230.0]),
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
        color_rgb: normalizeRGB([230.0, 230.0, 230.0])
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
        color_rgb: normalizeRGB([230.0, 230.0, 230.0])
    }
};

let nodePositionArray = {

    additions: {
        name: "additions",
        description: "New additions",
        startX: 20,
        startY: 30,
        width: 100,
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
        color: "#c0ff5b",
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
        color: "#c0ff5b",
        // color_rgb: normalizeRGB([192.0, 255.0, 91.0]),
        color_rgb: normalizeRGB([127.0, 203.0, 222.0]),
        cx: 900,
        cy: 450
    },

    died: {
        name: "died",
        description: "died",
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
        this.color_rgb = color_rgb;
        this.targetX = x;
        this.targetY = y;
        this.currentCategory = currentCategory; // used for locate future color
        this.futureCategory = null; // used for locate future
        this.futureColor = null; // used for next place
        this.direction = [0,0];
        this.requiredFrame = math.randomInt(100) + 50

    }

    computeDirectionVector (){
        this.direction = [this.targetX - this.currentX, this.targetY- this.currentY]
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

    let slider = d3.select("#slider")
    let dx = waitingTime * (yearScale(parseTime('1996')) - yearScale(parseTime('1995'))) / cycleTime;

    slider.attr("x1", yearScale(parseTime('' + startYear-1)) + dx)
    slider.attr("x2", yearScale(parseTime('' + startYear-1)) + dx)
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
let height = 490;
let width = 100;

let populatePointsInRectBottomToUpTotal = (nodePositionArray)=>{

    let pointCount = 0;

    let nodeIndex = 0;

    let pointNumberList = nodePositionOrderRect.map(v => nodePositionArray[v]).map(_ => _.pointNumber);
    let allPointNumber = pointNumberList.reduce( (x,y) => x+y, 0);

    console.log( "All point number "+ allPointNumber);

    let countTrack = pointNumberList[nodeIndex];
    let p = nodePositionArray[ nodePositionOrderRect[nodeIndex] ];
    console.log("Where am I ")
    console.log(pointNumberList)
    let pointList = allPoints[p.name];

    while (pointCount < allPointNumber) {
        for (let y = height + leavingStartY - 2 * pointWidth; y > leavingStartY - 2 * pointWidth; y -= pointWidth) {
            if (pointCount > allPointNumber ) return;

            for (let x = leavingStartX - 2 * pointWidth; x < width + leavingStartX - 2 * pointWidth; x += pointWidth ) {

                // I want a tons of points on the line
                pointList.push(new Point(x, y, p.color_rgb,p.name));
                pointCount++;
                if (pointCount > allPointNumber) return
                if (pointCount > countTrack) {
                    nodeIndex +=1;
                    p =  nodePositionArray[ nodePositionOrderRect[nodeIndex] ];
                    console.log( "name is " + p.name)
                    pointList = allPoints[p.name];
                    countTrack += p.pointNumber;
                    console.log( "count Track is " + countTrack)
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
        randomSourcePoint.futureColor = t.color_rgb;
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
        sourcePoint.futureColor = sourcePoint.color_rgb;
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
        sourcePoint.futureColor = sourcePoint.color_rgb;
        sourcePoint.computeDirectionVector()
    }

};

let getEndOfYearWlLength = (nodes) =>
    nodes["wl"].pointNumber + nodes["additions"].pointNumber - nodes["cured"].pointNumber - nodes["died"].pointNumber -
       nodes["deteriorated"].pointNumber - nodes["other"].pointNumber ;

let b = true

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
    console.log(allPoints)

    // Last year
    for (let index in nodePositionOrderRect){
        let key = nodePositionOrderRect[index];
        let p = nodePositionArrayLastYear[key];
        populatePointsInRectBottomToUp(p, colors)
    }

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

    // reverseStartPoint -= allPoints["other"].length;

    // assignRandomPointsToANumber(allPoints["wl"], allPoints["deteriorated"], s, reverseStartPoint);
    // reverseStartPoint -= allPoints["deteriorated"].length;
    //
    // assignRandomPointsToANumber(allPoints["wl"], allPoints["cured"], s, reverseStartPoint);
    // reverseStartPoint -= allPoints["cured"].length;
    //
    // assignRandomPointsToANumber(allPoints["wl"], allPoints["other"], s, reverseStartPoint);
    // reverseStartPoint -= allPoints["other"].length;
    //
    // assignRandomPointsToANumber(allPoints['wl'], allPoints['died'], s, reverseStartPoint);
    // reverseStartPoint -= allPoints["died"].length;



    // Assign
    additionToWL(allPoints['additions'], allPoints['wl'], s, allPoints["wlAdditions"] ,allPoints['additions'].length)
    points =  allPoints["leavingPointGrey"].concat(allPoints["additionsGrey"].concat(allPoints["wl"].concat(allPoints["additions"])));
    // points = points.concat(allPoints["curedGrey"]);
    // points = points.concat(allPoints["diedGrey"]);
    // points = points.concat(allPoints["otherGrey"]);
    // points = points.concat(allPoints["deterioratedGrey"]);
    // console.log(allPoints["curedGrey"].length);
    // console.log(allPoints["diedGrey"].length);
    // console.log(allPoints["otherGrey"].length);

    console.log("All point length" + points.length)
    console.log("addition grey is " + allPoints['additionsGrey'].length)
    allPoints.movingPoints = points.filter( p =>  (p.currentX !== p.targetX|| p.currentY !== p.targetY) );
    allPoints.stayPoints =  points.filter( p =>  (p.direction[0] === 0 && p.direction[1] === 0) );
    console.log(allPoints);
    //console.log( allPoints["wl"].filter(p => p.futureCategory !==

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
    // console.log(allPoints.movingPoints);
    // console.log(colors.length)

    for (let key in nodePositionArray) {
        let p = nodePositionArray[key];
        let node = document.createElement("div");
        node.classList.add("node");
        // node.setAttribute("style", `width:${p.width}px; height:${p.height}px; left:${p.startX}px;
        // top:${p.startY}px`);
        node.setAttribute("id", key);

        if (p.name === "additions"){
            node.style.width = `130px`;
            node.style.left = `${p.startX-25}px`;
        } else if (p.name === "wl") {
            node.style.width = `200px`;
            node.style.left = `${p.startX- 30}px`;
        }
        else {
            node.style.width = `65px`;
            node.style.left = `${p.startX-6}px`;
        }

        node.style.height = `30px`;
        node.style.textAlign = `center`;
        node.style.top = `${p.startY + p.height + 2}px`;
        // node.style.fontStyle.
        node.style.color = "black";
        // node.style.borderColor = "blue";
        node.style.borderWidth= "0px";
        // node.style.strokeOpacity = '0%';
        node.textContent = p.description;
        main.insertAdjacentElement("afterbegin", node);
        console.log(node)
    }
    // initial. if exists then just change
    // let node = document.getElementById("title");
    // if(node === null){
    //     let node = document.createElement("div")
    //     node.classList.add("node");
    //     node.style.color = "black";
    //     // node.style.borderColor = "blue";
    //     node.style.borderWidth= "0px";
    //     node.setAttribute ("id", "title");
    //     node.textContent = `Waiting list change in ${startYear}`;
    //     node.style.width = `600px`;
    //     node.style.height = `50px`;
    //     node.style.left = `300px`;
    //     node.style.top = `500px`;
    //     node.style.fontSize = "40px";
    //     // main.insertAdjacentElement("afterbegin", node);
    // }
    // else{
    //     node.textContent = `Waiting list change in ${startYear}`;
    // }

    // To-Do List
    // Add the line below the bar y around 370, x around 180

    // add the tick one by one based on the past year. I need to add an array to memorize the x position there

    // add the year below it. (Think the font might be small. I can just use 95 - 15.

    // let markForYear = document.getElementById("timeline");
    // if(markForYear === null){
    //
    //     let markForYear = document.createElement("div");
    //     markForYear.classList.add("horizontalline");
    //     markForYear.style.height = `2px`;
    //     markForYear.style.width = `600px`;
    //     markForYear.style.left = `180px`;
    //     markForYear.style.top = `${horizontalLineTop}px`;
    //     markForYear.style.position = "absolute"
    //     markForYear.setAttribute("id", "timeline");
    //
    //     markForYear.style.background = "black";
    //     main.insertAdjacentElement("afterbegin", markForYear);
    //     console.log(markForYear)
    // }

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
                labelForYear.style.top = `${horizontalLineTop + 10}px`;
            else
                labelForYear.style.top = `${horizontalLineTop + 3}px`;

            labelForYear.setAttribute("id", `${i}_label`);
            labelForYear.style.fontSize = "8px";
            labelForYear.textContent = `${ i.toString().slice(2,4) }`;
            labelForYear.style.borderWidth= "0px";
            labelForYear.style.position = "absolute";
            main.insertAdjacentElement("afterbegin", labelForYear);
        }
    }

    // get rid of 13 for 15
    let label13 = document.getElementById("13_label");
    let label15 = document.getElementById("15_label");



    let yScale = document.getElementById("yScale");
    if(yScale === null){
        let yScale = document.createElement("div");
        yScale.classList.add("verticalline");
        yScale.setAttribute("id", "yScale");
        yScale.style.width = `2px`;
        yScale.style.height = `400px`;
        yScale.style.left = `1140px`;
        yScale.style.top = `100px`;
        yScale.style.background = "black";
        yScale.style.position = "absolute";
        main.insertAdjacentElement("afterbegin", yScale);
    }

    let markValue = Object.keys(scaleMarkPosition);
    for (let i = 0; i < markValue.length; i++){
        let value = markValue[i];
        let tickForValue = document.getElementById(`${value}_tick`);
        if (tickForValue === null){
            tickForValue = document.createElement("div");
            tickForValue.classList.add("tick");
            tickForValue.style.left = `1140px`;
            tickForValue.style.top = `${scaleMarkPosition[value]}px`;
            tickForValue.style.width = `5px`;
            tickForValue.style.height = `2px`;
            tickForValue.setAttribute("id", `${value}_tick`);
            tickForValue.style.background = "black";
            tickForValue.style.position = "absolute"
            // tickForYear .style.fontSize = "8px";
            // tickForYear .textContent = `${ i.toString().slice(2,4) }`;
            // tickForYear.style.borderWidth= "0px";
            main.insertAdjacentElement("afterbegin", tickForValue );
        }
    }

    for (let i = 0; i < markValue.length; i++){
        let value = markValue[i];
        let labelForYear = document.getElementById(`${value}_label`);
        if (labelForYear === null){
            labelForYear = document.createElement("div");
            labelForYear.classList.add("label");
            labelForYear.style.left = `1147px`;
            labelForYear.style.top = `${scaleMarkPosition[value] - 2}px`;
            // labelForYear.style.width = `5px`;
            // labelForYear.style.height = `2px`;
            labelForYear.style.position = "absolute";
            labelForYear.setAttribute("id", `${value}_label`);

            labelForYear .style.fontSize = "8px";
            labelForYear .textContent = `${ value }`;
            labelForYear.style.borderWidth= "0px";
            main.insertAdjacentElement("afterbegin", labelForYear );
        }
    }


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

    // console.log(nodePositionArray)
}

let calculateYearTickX = (dset) =>{

    dset.forEach( d => {
            yearMarkPosition[d.time] = Math.floor(wlListBaseX + d.wl/wlListBaseHeight);
        }
    )
}

let calculateNumberScale = (dset) =>{

    let highestTick = 22000;
    let tickNumber = 20
    let numberInterval = 22000 / tickNumber;
    let totalHeight = highestTick / 55;
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

    dset.forEach( d =>{
        let newd = {}
        newd["time"] = parseTime(d.time + "")
        newd["wl"] = parseInt(d.wl)
        formattedData.push(newd)
    } )

    let x = d3.scaleTime().range([40, chartWidth-30]);
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
    y.domain([30000, numberExtent[1]]);
    svg.append("path")
        .datum(formattedData)
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("fill", "none")
        .attr("d", line);

    svg.append("g")
        .attr("transform", `translate(0, ${chartHeight - 20} )`)
        .call(d3.axisBottom(x).ticks(24));

    svg.append("g")
        .attr("transform", `translate(${40},` + 0+ ")")
        .call(d3.axisLeft(y));

    let dragStarted = (d) =>{
        sliderDragging = true
        console.log("drag started")
    }

    let dragged = (d) => {
        let x = d3.event.x
        let y = d3.event.y
        changeSlidePosition("slider", x )
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
            changeSlidePosition("slider", positionOfAYear(1994))

        } else if (x > yearScale(parseTime("2018"))) {
            // move slide to 2018
            changeSlidePosition("slider", positionOfAYear(2018))
        }else {
            for (let i = 1994; i < 2019; i ++){

                let currentDistance = Math.abs(x - positionOfAYear(i));
                if (currentDistance < prevDistance){
                    prevDistance = currentDistance;
                }else{
                    // decide that the last one is the closest one
                    // move slide to that year
                    changeSlidePosition("slider", positionOfAYear(i-1))
                    console.log(i -1);
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
        .attr("id", "slider")
        .attr("x1", x(parseTime('1994')))
        .attr("y1", 0)
        .attr('x2', x(parseTime('1994')))
        .attr("y2", 130)
        .attr("stroke-width", 6)
        .attr("stroke", "red")
        .call(drag)


    yearIntervalInSVG = x(parseTime('1996')) - x(parseTime('1995'))


};

let data = d3.csv('./waitlist-change.csv',
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
            wl: parseInt(d["WL Length"])
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

                    if (props.waitingTime === 40){
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
                        if ( props.waitingTime >= 100) {
                            p.currentX += p.direction[0] / p.requiredFrame;
                            p.currentY += p.direction[1] / p.requiredFrame;
                        }
                    }

                    a[2*i + base] = p.currentX;
                    a[2*i + 1 + base] = p.currentY
                    // console.log(p.direction[0]/10)
                }
                props.waitingTime = props.waitingTime + 1;

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
            color: [1.0, 1.0, 1.0, 1]
        });

        if (waitingTime > cycleTime && startYear !== 2018) {
            startYear += 1;

            updateNumber(startYear);
            computePointsAndColor();
            $("#yearSlider").slider("value", `${startYear}`);
        }
        if (!sliderDragging)
            if (startYear !== 2018)
                changeSlider(waitingTime);
        if (!stop) {
            waitingTime += 1;
        }
        // This tells regl to execute the command once for each object
        draw({pointWidth: pointWidth, canvasHeight: canvasHeight, canvasWidth: canvasWidth, time: time, points: points,allPoints: allPoints,
            colors: colors, movingPoints: allPoints.movingPoints, flatPoints: flatPoints, stayPoints:allPoints.stayPoints,
            movingPointsColors: movingPointsColors, allColors: allColors, waitingTime: waitingTime, animated: animated,
        })
    })
}

function runAgain() {
    stop = false
}

export {runAgain}