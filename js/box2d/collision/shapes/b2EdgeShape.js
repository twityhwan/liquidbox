var b2EdgeShape = Class.create();
Object.extend(b2EdgeShape.prototype, b2Shape.prototype);
Object.extend(b2EdgeShape.prototype,
{

	//--------------- Internals Below -------------------
	// Temp vec for b2Shape.EdgeCentroid

	initialize: function(def, body, newOrigin){
		this.m_type = b2Shape.e_edgeShape;
		// initialize instance variables for references
		this.m_R = new b2Mat22();
                this.m_position = new b2Vec2();

		// The constructor for b2Shape
		this.m_userData = def.userData;

		this.m_friction = def.friction;
		this.m_restitution = def.restitution;
		this.m_body = body;

                this.m_localCentroid.x = def.localPosition.x - newOrigin.x;
                this.m_localCentroid.y = def.localPosition.y - newOrigin.y;

                // Apply body def
		this.m_R.SetM(this.m_body.m_R);
		this.m_position.x = this.m_body.m_position.x + (this.m_R.col1.x * this.m_localCentroid.x + this.m_R.col2.x * this.m_localCentroid.y);
		this.m_position.y = this.m_body.m_position.y + (this.m_R.col1.y * this.m_localCentroid.x + this.m_R.col2.y * this.m_localCentroid.y);

		this.m_proxyId = b2Pair.b2_nullProxy;

		this.m_maxRadius = 0.0;

		this.m_categoryBits = def.categoryBits;
		this.m_maskBits = def.maskBits;
		this.m_groupIndex = def.groupIndex;
		//

		// initialize instance variables for references
		this.syncAABB = new b2AABB();
		this.syncMat = new b2Mat22();
		this.m_localCentroid = new b2Vec2();
		this.m_localOBB = new b2OBB();
		//

		var i = 0;

		var hX;
		var hY;

		var tVec;

		var aabb = new b2AABB();

		// Vertices
		this.m_vertices = [def.vertex1, def.vertex2];
                this.m_vertexCount = this.m_vertices.length;

		this.m_coreVertices = new Array(b2Settings.b2_maxEdgeVertices);

		// Normals
		this.m_normals = new Array(b2Settings.b2_maxEdgeVertices);

		var localR = new b2Mat22(def.localRotation);
	},

	// Temp AABB for Synch function
	syncAABB: new b2AABB(),
	syncMat: new b2Mat22(),
	Synchronize: function(position1, R1, position2, R2){
		// The body transform is copied for convenience.
		this.m_R.SetM(R2);
		//this.m_position = this.m_body->this.m_position + b2Mul(this.m_body->this.m_R, this.m_localCentroid)
		this.m_position.x = this.m_body.m_position.x + (R2.col1.x * this.m_localCentroid.x + R2.col2.x * this.m_localCentroid.y);
		this.m_position.y = this.m_body.m_position.y + (R2.col1.y * this.m_localCentroid.x + R2.col2.y * this.m_localCentroid.y);

		if (this.m_proxyId == b2Pair.b2_nullProxy)
		{
			return;
		}

		//b2AABB aabb1, aabb2;
		var hX;
		var hY;

		//b2Mat22 obbR = b2Mul(R1, this.m_localOBB.R);
			var v1 = R1.col1;
			var v2 = R1.col2;
			var v3 = this.m_localOBB.R.col1;
			var v4 = this.m_localOBB.R.col2;
			//this.syncMat.col1 = b2MulMV(R1, this.m_localOBB.R.col1);
			this.syncMat.col1.x = v1.x * v3.x + v2.x * v3.y;
			this.syncMat.col1.y = v1.y * v3.x + v2.y * v3.y;
			//this.syncMat.col2 = b2MulMV(R1, this.m_localOBB.R.col2);
			this.syncMat.col2.x = v1.x * v4.x + v2.x * v4.y;
			this.syncMat.col2.y = v1.y * v4.x + v2.y * v4.y;
		//b2Mat22 absR = b2Abs(obbR);
		this.syncMat.Abs();
		//b2Vec2 center = position1 + b2Mul(R1, this.m_localCentroid + this.m_localOBB.center);
		hX = this.m_localCentroid.x + this.m_localOBB.center.x;
		hY = this.m_localCentroid.y + this.m_localOBB.center.y;
		var centerX = position1.x + (R1.col1.x * hX + R1.col2.x * hY);
		var centerY = position1.y + (R1.col1.y * hX + R1.col2.y * hY);
		//b2Vec2 h = b2Mul(this.syncMat, this.m_localOBB.extents);
		hX = this.syncMat.col1.x * this.m_localOBB.extents.x + this.syncMat.col2.x * this.m_localOBB.extents.y;
		hY = this.syncMat.col1.y * this.m_localOBB.extents.x + this.syncMat.col2.y * this.m_localOBB.extents.y;
		//aabb1.minVertex = center - h;
		this.syncAABB.minVertex.x = centerX - hX;
		this.syncAABB.minVertex.y = centerY - hY;
		//aabb1.maxVertex = center + h;
		this.syncAABB.maxVertex.x = centerX + hX;
		this.syncAABB.maxVertex.y = centerY + hY;

		//b2Mat22 obbR = b2Mul(R2, this.m_localOBB.R);
			v1 = R2.col1;
			v2 = R2.col2;
			v3 = this.m_localOBB.R.col1;
			v4 = this.m_localOBB.R.col2;
			//this.syncMat.col1 = b2MulMV(R1, this.m_localOBB.R.col1);
			this.syncMat.col1.x = v1.x * v3.x + v2.x * v3.y;
			this.syncMat.col1.y = v1.y * v3.x + v2.y * v3.y;
			//this.syncMat.col2 = b2MulMV(R1, this.m_localOBB.R.col2);
			this.syncMat.col2.x = v1.x * v4.x + v2.x * v4.y;
			this.syncMat.col2.y = v1.y * v4.x + v2.y * v4.y;
		//b2Mat22 absR = b2Abs(obbR);
		this.syncMat.Abs();
		//b2Vec2 center = position2 + b2Mul(R2, this.m_localCentroid + this.m_localOBB.center);
		hX = this.m_localCentroid.x + this.m_localOBB.center.x;
		hY = this.m_localCentroid.y + this.m_localOBB.center.y;
		centerX = position2.x + (R2.col1.x * hX + R2.col2.x * hY);
		centerY = position2.y + (R2.col1.y * hX + R2.col2.y * hY);
		//b2Vec2 h = b2Mul(absR, this.m_localOBB.extents);
		hX = this.syncMat.col1.x * this.m_localOBB.extents.x + this.syncMat.col2.x * this.m_localOBB.extents.y;
		hY = this.syncMat.col1.y * this.m_localOBB.extents.x + this.syncMat.col2.y * this.m_localOBB.extents.y;
		//aabb2.minVertex = center - h;
		//aabb2.maxVertex = center + h;

		//aabb.minVertex = b2Min(aabb1.minVertex, aabb2.minVertex);
		this.syncAABB.minVertex.x = Math.min(this.syncAABB.minVertex.x, centerX - hX);
		this.syncAABB.minVertex.y = Math.min(this.syncAABB.minVertex.y, centerY - hY);
		//aabb.maxVertex = b2Max(aabb1.maxVertex, aabb2.maxVertex);
		this.syncAABB.maxVertex.x = Math.max(this.syncAABB.maxVertex.x, centerX + hX);
		this.syncAABB.maxVertex.y = Math.max(this.syncAABB.maxVertex.y, centerY + hY);

		var broadPhase = this.m_body.m_world.m_broadPhase;
		if (broadPhase.InRange(this.syncAABB))
		{
			broadPhase.MoveProxy(this.m_proxyId, this.syncAABB);
		}
		else
		{
			this.m_body.Freeze();
		}
	},

	QuickSync: function(position, R){
		//this.m_R = R;
		this.m_R.SetM(R);
		//this.m_position = position + b2Mul(R, this.m_localCentroid);
		this.m_position.x = position.x + (R.col1.x * this.m_localCentroid.x + R.col2.x * this.m_localCentroid.y);
		this.m_position.y = position.y + (R.col1.y * this.m_localCentroid.x + R.col2.y * this.m_localCentroid.y);
	},

	ResetProxy: function(broadPhase){

		if (this.m_proxyId == b2Pair.b2_nullProxy)
		{
			return;
		}

		var proxy = broadPhase.GetProxy(this.m_proxyId);

		broadPhase.DestroyProxy(this.m_proxyId);
		proxy = null;

		var R = b2Math.b2MulMM(this.m_R, this.m_localOBB.R);
		var absR = b2Math.b2AbsM(R);
		var h = b2Math.b2MulMV(absR, this.m_localOBB.extents);
		//var position = this.m_position + b2Mul(this.m_R, this.m_localOBB.center);
		var position = b2Math.b2MulMV(this.m_R, this.m_localOBB.center);
		position.Add(this.m_position);

		var aabb = new b2AABB();
		//aabb.minVertex = position - h;
		aabb.minVertex.SetV(position);
		aabb.minVertex.Subtract(h);
		//aabb.maxVertex = position + h;
		aabb.maxVertex.SetV(position);
		aabb.maxVertex.Add(h);

		if (broadPhase.InRange(aabb))
		{
			this.m_proxyId = broadPhase.CreateProxy(aabb, this);
		}
		else
		{
			this.m_proxyId = b2Pair.b2_nullProxy;
		}

		if (this.m_proxyId == b2Pair.b2_nullProxy)
		{
			this.m_body.Freeze();
		}
	},


	Support: function(dX, dY, out)
	{
		//b2Vec2 dLocal = b2MulT(this.m_R, d);
		var dLocalX = (dX*this.m_R.col1.x + dY*this.m_R.col1.y);
		var dLocalY = (dX*this.m_R.col2.x + dY*this.m_R.col2.y);

		var bestIndex = 0;
		//float32 bestValue = b2Dot(this.m_vertices[0], dLocal);
		var bestValue = (this.m_coreVertices[0].x * dLocalX + this.m_coreVertices[0].y * dLocalY);
		for (var i = 1; i < this.m_vertexCount; ++i)
		{
			//float32 value = b2Dot(this.m_vertices[i], dLocal);
			var value = (this.m_coreVertices[i].x * dLocalX + this.m_coreVertices[i].y * dLocalY);
			if (value > bestValue)
			{
				bestIndex = i;
				bestValue = value;
			}
		}

		//return this.m_position + b2Mul(this.m_R, this.m_vertices[bestIndex]);
		out.Set(	this.m_position.x + (this.m_R.col1.x * this.m_coreVertices[bestIndex].x + this.m_R.col2.x * this.m_coreVertices[bestIndex].y),
					this.m_position.y + (this.m_R.col1.y * this.m_coreVertices[bestIndex].x + this.m_R.col2.y * this.m_coreVertices[bestIndex].y));

	},


	// Local position of the shape centroid in parent body frame.
	m_localCentroid: new b2Vec2(),

	// Local position oriented bounding box. The OBB center is relative to
	// shape centroid.
	m_localOBB: new b2OBB(),
	m_vertices: null,
	m_coreVertices: null,
	m_vertexCount: 0,
	m_normals: null});

b2EdgeShape.tempVec = new b2Vec2();
b2EdgeShape.tAbsR = new b2Mat22();
