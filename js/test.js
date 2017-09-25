var world;
var ctx;
var canvasWidth;
var canvasHeight;
var canvasTop;
var canvasLeft;

function init() {
    createGround(world);
}

function step(cnt) {
    var stepping = false;
    var timeStep = 1.0/60;
    var iteration = 1;
    world.Step(timeStep, iteration);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawWorld(world, ctx);
    setTimeout('step(' + (cnt || 0) + ')', 10);
}

Event.observe(window, 'load', function() {
    console.log("loaded");
    world = createWorld();
    init();
    ctx = $('canvas').getContext('2d');
    var canvasElm = $('canvas');
    canvasWidth = parseInt(canvasElm.width);
    canvasHeight = parseInt(canvasElm.height);
    canvasTop = parseInt(canvasElm.style.top);
    canvasLeft = parseInt(canvasElm.style.left);
    console.log(canvasWidth, canvasHeight, canvasTop, canvasLeft);
    createSVG(world, 200, 200, "./svg/svg.svg", true, ctx);
    createParticle(world);
    Event.observe('canvas', 'click', function(e) {
        if (Math.random() < 0.5)
            createBall(world, Event.pointerX(e) - canvasLeft, Event.pointerY(e) - canvasTop);
        else
            createBox(world, Event.pointerX(e) - canvasLeft, Event.pointerY(e) - canvasTop, 10, 10, false);
        drawWorld(world, ctx);
    });
    step();
});
