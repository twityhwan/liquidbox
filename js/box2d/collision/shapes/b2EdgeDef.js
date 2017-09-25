var b2EdgeDef = Class.create();
Object.extend(b2EdgeDef.prototype, b2ShapeDef.prototype);
Object.extend(b2EdgeDef.prototype,
{
    initialize: function() {
        // The constructor for b2ShapeDef
        this.type = b2Shape.e_unknownShape;
        this.userData = null;
        this.localPosition = new b2Vec2(0.0, 0.0);
        this.localRotation = 0.0;
        this.friction = 0.2;
        this.restitution = 0.0;
        this.density = 0.0;
        this.categoryBits = 0x0001;
        this.maskBits = 0xFFFF;
        this.groupIndex = 0;
        //

    	this.type = b2Shape.e_edgeShape;
        this.extents = new b2Vec2(1.0, 1.0);
        // added by twityhwan
        this.vertex1 = new b2Vec2();
        this.vertex2 = new b2Vec2();
        //
    },
    extents: null});
