var world = createWorld();
var ctx;
var canvasWidth;
var canvasHeight;
var canvasTop;
var canvasLeft;

function init() {
    createGround(world);
}

Event.observe(window, 'load', function() {
    console.log("loaded");
    init();
    ctx = $('canvas').getContext('2d');
    var canvasElm = $('canvas');
    canvasWidth = parseInt(canvasElm.width);
    canvasHeight = parseInt(canvasElm.height);
    canvasTop = parseInt(canvasElm.style.top);
    canvasLeft = parseInt(canvasElm.style.left);
    console.log(canvasWidth, canvasHeight, canvasTop, canvasLeft);
    ctx.beginPath();
    ctx.rect(canvasLeft, canvasTop, canvasWidth, canvasHeight);
    ctx.fillStyle = 'black';
    ctx.fill();
    createSVG(world, 200, 200, "./svg/svg.svg", true, ctx);
    drawWorld(world, ctx);
    //ctx.stroke();
});
