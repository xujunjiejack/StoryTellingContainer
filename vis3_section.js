function init() {
    // 1. call a resize on load to update width/height/position of elements
    handleResize();

    // 2. setup the scrollama instance
    // 3. bind scrollama event handlers (this can be chained like below)
    scroller
        .setup({
            container: '#scroll2', // our outermost scrollytelling element
            // graphic: '.scroll__graphic', // the graphic

            step: '.scroll-step .step', // the step elements

            offset: 0.7, // set the trigger to be 1/2 way down screen
            debug: true, // display the trigger offset for testing
        })
        .onStepEnter(handleStepEnter);
        //
        // .onStepExit(handleStepExit)
        // .onContainerEnter(handleContainerEnter)
        // .onContainerExit(handleContainerExit);

    // setup resize event
    window.addEventListener('resize', handleResize);
}

function handleResize() {}

function handleStepEnter(response){
    console.log("vis3 step entering" + response.index)
}

// start it up
init();