var Svg = Matter.Svg;
function createWorld() {
    var worldAABB = new b2AABB();
    worldAABB.minVertex.Set(-1000, -1000);
    worldAABB.maxVertex.Set(1000, 1000);
    var gravity = new b2Vec2(0, 300);
    var doSleep = true;
    var world = new b2World(worldAABB, gravity, doSleep);
    createGround(world);
    createBox(world, 0, 125, 10, 250);
    createBox(world, 500, 125, 10, 250);
    return world;
}

function createBox(world, x, y, width, height, fixed) {
    if (typeof(fixed) == 'undefined') fixed = true;
    var boxSd = new b2BoxDef();
    if (!fixed) boxSd.density = 1.0;
    boxSd.extents.Set(width, height);
    var boxBd = new b2BodyDef();
    boxBd.AddShape(boxSd);
    boxBd.position.Set(x,y);
    return world.CreateBody(boxBd)
}

function createGround(world) {
    var groundSd = new b2BoxDef();
    groundSd.extents.Set(1000, 50);
    groundSd.restitution = 0.2;
    var groundBd = new b2BodyDef();
    groundBd.AddShape(groundSd);
    groundBd.position.Set(-500, 340);
    return world.CreateBody(groundBd)
}

function createSVG(world, x, y, path, fixed, ctx) {
    // TODO: type check
    jQuery.get(path).done(function(data) {
        var vertexSets = [];
        jQuery(data).find('path').each(function(i, path) {
            vertexSets.push(Svg.pathToVertices(path, 30));
        });

        for (var i=0; i<vertexSets.length; i++) {
            var vs = vertexSets[i];
            createEdgesFromVertexSet(world, vs);
        }
    });
}

function createEdgesFromVertexSet(world, vs) {
    if (vs.length < 2) return;
    var i;
    for(i=0; i<vs.length-1; i++) {
        var v1 = vs[i];
        var v2 = vs[i+1];
        world.CreateBody(createEdgeBody(v1, v2));
    }
    world.CreateBody(createEdgeBody(vs[i], vs[0]));

}

function createEdgeBody(v1, v2) {
    var edgeSd = new b2EdgeDef();
    edgeSd.vertex1 = b2Vec2.Make(v1.x, v1.y);
    edgeSd.vertex2 = b2Vec2.Make(v2.x, v2.y);

    var edgeBd = new b2BodyDef();
    edgeBd.AddShape(edgeSd);
    edgeBd.position.Set(100, 100);
    return edgeBd;
}

function createParticle(world) {
    var points = [[-30, 0], [30, 0], [0, 15]];
    var polySd = new b2PolyDef();
    polySd.density = 1.0;
    polySd.friction = 0;
    polySd.vertexCount = points.length;
    for (var i = 0; i < points.length; i++) {
        polySd.vertices[i].Set(points[i][0], points[i][1]);
    }
    var polyBd = new b2BodyDef();
    polyBd.AddShape(polySd);
    polyBd.position.Set(200, 200);
    world.CreateBody(polyBd);
}

function createBall(world, x, y) {
	var ballSd = new b2CircleDef();
	ballSd.density = 1.0;
	ballSd.radius = 20;
	ballSd.restitution = 1.0;
	ballSd.friction = 0;
	var ballBd = new b2BodyDef();
	ballBd.AddShape(ballSd);
	ballBd.position.Set(x,y);
	return world.CreateBody(ballBd);
}

function createBox(world, x, y, width, height, fixed) {
	if (typeof(fixed) == 'undefined') fixed = true;
	var boxSd = new b2BoxDef();
	if (!fixed) boxSd.density = 1.0;
	boxSd.extents.Set(width, height);
	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.position.Set(x,y);
	return world.CreateBody(boxBd)
}
