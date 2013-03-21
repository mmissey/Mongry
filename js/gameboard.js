var lightcanvas = $('<canvas>').attr({
	height: 2000,
	width: 2000
});
var floorcanvas = $('#floorcanvas');     
var fog = new Image();
fog.src = 'img/black_mist.png';

var beam = new Image();
beam.src = 'img/beam.png';

var lightlifespan = 3;
var lightbulbs = 3;
var fadespeed = 0.07;
var lightalpha = 0.1; 
var wallsize = 37.5; 
var prevroom = 0;
var player;  

function startle(){
	if(player.items.length > 0){
		audioManager.playSound(audioManager.sounds['startle']);
	}else{
		audioManager.playSound(audioManager.sounds['startle2']);
	}    
	$('#playboard').trigger('startRumble'); 
	
	hud.updateSupply(0);
	setTimeout(function(){
		$('#playboard').trigger('stopRumble');
	}, 1600);  
	$('#impress').hide();
	$('body').addClass('whiteout');
	lightcanvas[0].getContext('2d').clearRect(0,0,lightcanvas[0].width, lightcanvas[0].height); 
	
	$('#impress').hide();
	$('body').addClass('whiteout');
	
	setTimeout(function(){ 
		 $('#impress').show(); 
		$('body').removeClass('whiteout');
	}, 100);
	
for(var i = 0; i < 2; i++){
	setTimeout(function(){
		$('#impress').hide();
		$('body').addClass('whiteout');
		lightcanvas[0].getContext('2d').clearRect(0,0,lightcanvas[0].width, lightcanvas[0].height); 
		setTimeout(function(){ 
			 $('#impress').show(); 
			$('body').removeClass('whiteout');
		}, 100);
	}, Math.random()* 1600);  
	
	 } 
	
	for(var i = 0; i < player.items.length; i++){
		badguys.create(player.items[i], player.GetPosition().x, player.GetPosition().y, true);
	} 
	
	player.items = [];  
	setTimeout(startle, (Math.random() * 48000) + 14000); 
} 

setTimeout(startle, (Math.random() * 48000) + 14000); 

function init() {

	world = new b2World(
	new b2Vec2(0, 0) //gravity
	, true //allow sleep
	);

	world.deleters = [];
    hud.startBar();
	//COLLISION
	audioManager.initSounds();
	
	if(listener){
		delete listener;
	}
	var listener = new Box2D.Dynamics.b2ContactListener();
	listener.BeginContact = function(contact) {

		function whois(type, a, b) {
			if (a.type === type) return a;
			if (b.type === type) return b;
			return -1;
		}

		var a = contact.GetFixtureA().GetBody();
		var b = contact.GetFixtureB().GetBody();
		if (a.type === null || b.type === null) return;
		if ((a.type !== 'player' && b.type !== 'player') && (a.type !== 'light' && b.type !== 'light')) return;

		if (a.type === 'a' || b.type === 'a') {
			var badie = whois('a', a, b);
			if(badie.fleeing) return;
			world.deleters.push(badie); 
			audioManager.playSound(audioManager.sounds['stuff']);
			player.items.push(badie.type);
			hud.updateSupply(player.items.length);
		} else if (a.type === 'b' || b.type === 'b') {
			var badie = whois('b', a, b);
			if(badie.fleeing) return;
			world.deleters.push(badie);
			audioManager.playSound(audioManager.sounds['stuff']);
			player.items.push(badie.type);
			hud.updateSupply(player.items.length);
		} else if (a.type === 'light' || b.type === 'light'){
			var light = whois('light', a, b);
			world.deleters.push(light);
			this.EndContact(contact);
		} else if(a.type === 'door' || b.type == 'door'){
			var door = whois('door', a, b);
			if(door.json.index == 0){
				prevroom = currentRoom; 
			}else{
				prevroom = 0;
			}
			
			currentRoom = door.json.index;
			console.log(currentRoom); 
			
			levelManager.navigate(door.json); 
			var room = levelManager.rooms[currentRoom];
			if(room){
				world.changeroom = true;    
			}
			
		}
	}
	world.SetContactListener(listener);
	b2World.prototype.roombounds = function(json){ 

		var fixDef = new b2FixtureDef;
		fixDef.density = 1.0;
		fixDef.friction = 4;
		fixDef.restitution = 0.01;

		var bodyDef = new b2BodyDef;
		bodyDef.type = b2Body.b2_staticBody;   

		//Top Wall
		bodyDef.position.x = json.roomWidth/2;//json.wallDepth*4;
		bodyDef.position.y = json.wallDepth/2;
		fixDef.shape = new b2PolygonShape;
		fixDef.shape.SetAsBox(json.roomWidth/2, json.wallDepth/2);
		fixDef.filter.categoryBits = 0x00100;
		fixDef.filter.maskBits = 0x11111;
		world.CreateBody(bodyDef).CreateFixture(fixDef);
		
		//left Wall
		bodyDef.position.x = json.wallDepth/2;
		bodyDef.position.y = json.roomHeight/2;//json.wallDepth * 4;
		fixDef.shape = new b2PolygonShape;
		fixDef.shape.SetAsBox(json.wallDepth/2, json.roomHeight/2);
		fixDef.filter.categoryBits = 0x00100;
		fixDef.filter.maskBits = 0x11111;
		world.CreateBody(bodyDef).CreateFixture(fixDef);
		
		//right Wall
		bodyDef.position.x = json.roomWidth - json.wallDepth/2;//json.roomWidth + (json.wallDepth * 3);
		bodyDef.position.y = json.roomHeight/2;//json.wallDepth * 4;
		fixDef.shape = new b2PolygonShape;
		fixDef.shape.SetAsBox(json.wallDepth/2, json.roomHeight/2);
		fixDef.filter.categoryBits = 0x00100;
		fixDef.filter.maskBits = 0x11111;
		world.CreateBody(bodyDef).CreateFixture(fixDef);   

		// 
		// //bottom Wall
		bodyDef.position.x = json.roomWidth/2;//json.wallDepth*4;
		bodyDef.position.y = json.roomHeight - json.wallDepth/2;//json.roomHeight + (json.wallDepth * 3);
		fixDef.shape = new b2PolygonShape;
		fixDef.shape.SetAsBox(json.roomWidth/2, json.wallDepth/2);
		fixDef.filter.categoryBits = 0x00100;
		fixDef.filter.maskBits = 0x11111;
		world.CreateBody(bodyDef).CreateFixture(fixDef);    

        //create some sample furniture 
		var furn;
		bodyDef.type = b2Body.b2_dynamicBody;
		var maxX = json.roomWidth-json.wallDepth;
		var maxY = json.roomHeight-json.wallDepth;
		for (var i = 0; i < json.obstacles.length; ++i) {
			fixDef.shape = new b2PolygonShape;
			fixDef.shape.SetAsBox(json.obstacles[i].width/2 //half width
			, json.obstacles[i].height/2 //half height
			);
			
			bodyDef.position.x = Math.min(Math.max((~~(Math.random() * json.roomWidth)), json.wallDepth), maxX);
			bodyDef.position.y = Math.min(Math.max((~~(Math.random() * json.roomHeight)), json.wallDepth), maxY);
			fixDef.filter.categoryBits = 0x01000;
			fixDef.filter.maskBits = 0x11101;
			furn = world.CreateBody(bodyDef);
			furn.type = 'ofloor'; 
			furn.json = json.obstacles[i];
			furn.CreateFixture(fixDef);
		}           
		
		var type = 'a';

		for(var i = 0; i < json.enemies.length; i++){
			if (Math.random() > .5){
				type = 'b';
			}else{
				type = 'a';
			}  
			
			badguys.create(type, 500, 500);    //TODO: pull from JSON        
		}       
	    var door;
	 	bodyDef.type = b2Body.b2_staticBody;  
		for(keys in json.doors){
			
			bodyDef.position.x = json.doors[keys].x + json.doors[keys].width/2  || json.roomWidth/2 + json.doors[keys].width/2;
			bodyDef.position.y = json.doors[keys].y +json.doors[keys].height/2 || (json.roomHeight + 99) + json.doors[keys].height/2; 
			fixDef.shape = new b2PolygonShape;
			fixDef.shape.SetAsBox(json.doors[keys].width/2, json.doors[keys].height/2);
			fixDef.filter.categoryBits = 0x00100;
			fixDef.filter.maskBits = 0x11111;
			door = world.CreateBody(bodyDef);
			door.type = 'door'; 
			door.json = json.doors[keys];
			door.CreateFixture(fixDef);
		}    

	} 
	
	b2World.prototype.LightBurst = function(){  
		player.lburst--;
		var light;
		var fixDef = new b2FixtureDef;
		var bodyDef = new b2BodyDef;
		
		if(!player.dead){		
			if(player.lburst < 0){   
				for(var i = 0; i < lightbulbs; i++){
					bodyDef.type = b2Body.b2_dynamicBody;
					bodyDef.position.x = player.GetPosition().x;
					bodyDef.position.y = player.GetPosition().y;
					fixDef.shape = new b2PolygonShape; 
					fixDef.shape.SetAsBox(10 //half width
					, 10 //half height
					);
					
					light = world.CreateBody(bodyDef);
					light.SetFixedRotation(true);
					light.type = 'light'; 
					fixDef.density = 0;
					fixDef.friction = 0;
					fixDef.restitution = 0.00;
					fixDef.filter.categoryBits = 0x10000;
					fixDef.filter.maskBits = 0x01100;
					fixDef.isSensor = true;
					light.CreateFixture(fixDef);
					light.SetAngle( ((i/3) ) +  player.GetAngle());
					light.life = 30;  

					light.SetLinearVelocity(new b2Vec2(
						(light.GetTransform().R.col2.x) * 100000000,
						(light.GetTransform().R.col2.y) * 100000000)); 
				} 
				player.lburst = player.lburstreset;                           
			}
		}
	}

	b2World.prototype.DrawReally = function() {

		this.m_debugDraw.m_sprite.graphics.clear();
		var flags = this.m_debugDraw.GetFlags();
		var i = 0;
		var b;
		var f;
		var s;
		var j;
		var bp;
		var ctx = document.getElementById('playcanvas').getContext('2d');
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 
		
		var ctx2 = lightcanvas[0].getContext('2d'); 
		ctx2.fillStyle = 'rgba(0,0,0,'+fadespeed+')';
		ctx2.fillRect(0,0,ctx2.canvas.width,ctx2.canvas.height);
		
		// ctx2.save();
		// ctx2.globalAlpha = 0.3;
		// for(i = 0; i < 10; i++){
		// 	ctx2.drawImage(fog, Math.random() * ctx2.canvas.width, Math.random() * ctx2.canvas.height);
		// }
		// ctx2.restore();    

		if (flags & b2DebugDraw.e_shapeBit) {
			for (b = this.m_bodyList; b; b = b.m_next) {
				xf = b.m_xf;

				switch (b.type) {
				case 'player':
					b.Advance(2);
					ctx.save();
					ctx.translate(xf.position.x, xf.position.y);
					ctx.rotate(b.GetAngle() + 3.15);
					ctx.drawImage(b.image, -20, -20);
					ctx.restore();
				break;
				case 'a':
					b.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(
					b.GetLinearVelocity().x * 0.99, b.GetLinearVelocity().y * 0.99));
					b.SetAngularVelocity(b.GetAngularVelocity() * 0.9);

					ctx.save();
					ctx.translate(xf.position.x, xf.position.y);
					ctx.rotate(b.GetAngle());
					ctx.drawImage(badguys.images[b.type].imgs[b.myFrame], -(badguys.images[b.type].imgs[b.myFrame].width / 2), -(badguys.images[b.type].imgs[b.myFrame].height / 2));
					ctx.restore();
					break;
				case 'b':
					b.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(
					b.GetLinearVelocity().x * 0.99, b.GetLinearVelocity().y * 0.99));
					b.SetAngularVelocity(b.GetAngularVelocity() * 0.6);
					ctx.save();
					ctx.translate(xf.position.x, xf.position.y);
					ctx.rotate(b.GetAngle()+ 1.57);
					ctx.drawImage(badguys.images[b.type].imgs[b.myFrame], -70, -10);
					ctx.restore();  
					break;
				case 'ofloor':
					b.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(
					b.GetLinearVelocity().x * 0.5, b.GetLinearVelocity().y * 0.5));
					b.SetAngularVelocity(b.GetAngularVelocity() * 0.5);
					ctx.save();
					ctx.translate(xf.position.x, xf.position.y);
					ctx.rotate(b.GetAngle());
					ctx.drawImage(b.json.img, -(b.json.width/2) , -(b.json.height/2)-10);
					ctx.restore();
					break; 
				case 'light':
					b.life --;
					if(b.life < 0){
						world.deleters.push(b); 
					} 
					b.Advance(7); 
					ctx2.save(); 
					var scale = Math.max(1, 2.2 * (1-(b.life/ 30)));
					ctx2.globalAlpha = lightalpha * Math.max((b.life/ 30) * .7, 0);
					ctx2.globalCompositeOperation = 'destination-out';
					ctx2.translate(xf.position.x-50, xf.position.y-50);
					
					ctx2.scale(scale, scale);
					ctx2.drawImage(beam, 0,0);
					// var spread = (lightlifespan-life);
					// ctx2.drawImage(beam, xf.position.x-50 + spread, xf.position.y-50 + spread);
					ctx2.restore();
					break;
				}
			}
		} 

	     ctx.drawImage(ctx2.canvas, 0, 0);  	//FLASHLIGHT //comment this line to turn on the lights

	} 
	navigateRooms(0);
	world.roombounds(levelManager.rooms[currentRoom]);
    drawFloor(levelManager.rooms[currentRoom]); 

	var fixDef = new b2FixtureDef;
	fixDef.density = 1.0;
	fixDef.friction = 4;
	fixDef.restitution = 0.01;

	var bodyDef = new b2BodyDef;

	//Making the player
	bodyDef.type = b2Body.b2_dynamicBody;
	bodyDef.position.x = 364;
	bodyDef.position.y = 364;
	fixDef.shape = new b2CircleShape(20);

	player = world.CreateBody(bodyDef);
	player.SetFixedRotation(true);
	fixDef.filter.categoryBits = 0x00001;
	fixDef.filter.maskBits = 0x11111;
	player.CreateFixture(fixDef);
	player.moving = false;
	player.SetSleepingAllowed(false);
	player.type = 'player';
	player.lburst = 1;
	player.lburstreset = lightlifespan;
	player.items = [];
	player.foundItems = [];
	player.image = new Image();
	player.image.src = "img/char.png";

	function moveplayer(directvec) {
		player.SetLinearVelocity(directvec);
		// directvec.Normalize();
		var negate = 0;
		if (directvec.y < 0) negate = Math.PI;
		var rotate = Math.atan(-(directvec.x) / (directvec.y)) + negate;
		player.SetAngle(rotate);

	}

	//Mouse Events
	$('#playcanvas').on('mousedown touchstart', function(e) {

		player.moving = !player.moving;
		var directvec = new Box2D.Common.Math.b2Vec2((e.offsetX - player.m_xf.position.x), (e.offsetY - player.m_xf.position.y));
		moveplayer(directvec);

	}).on('mousemove touchmove', function(e) {
		if (player.moving) {
			var directvec = new Box2D.Common.Math.b2Vec2((e.offsetX - player.m_xf.position.x), (e.offsetY - player.m_xf.position.y));
			moveplayer(directvec);
		}
	}).on('mouseup touchend', function(e) {
		// player.moving = false;

	});

	//Key Events
	document.addEventListener("keydown", function(event) {
		if (event.keyCode === 9 || (event.keyCode >= 32 && event.keyCode <= 34) || (event.keyCode >= 37 && event.keyCode <= 40)) {
			var vel = player.GetLinearVelocity();
			player.moving = true;
			switch (event.keyCode) {
			case 37:
				// left
				moveplayer(new Box2D.Common.Math.b2Vec2(vel.x - 500, vel.y));
				break;
			case 38:
				// up 
				moveplayer(new Box2D.Common.Math.b2Vec2(vel.x, vel.y - 500));
				break;
			case 39:
				// right
				moveplayer(new Box2D.Common.Math.b2Vec2(vel.x + 500, vel.y));
				break;
			case 40:
				// down
				moveplayer(new Box2D.Common.Math.b2Vec2(vel.x, vel.y + 50000));
				break;
			}

			event.preventDefault();
		}
	}, false);

	document.addEventListener("keyup", function(event) {
		if (event.keyCode === 9 || (event.keyCode >= 32 && event.keyCode <= 34) || (event.keyCode >= 37 && event.keyCode <= 40)) {

			var vel = player.GetLinearVelocity();
			player.moving = true;
			switch (event.keyCode) {
			case 37:
				// left
			case 38:
				// up 
			case 39:
				// right
			case 40:
				// down
				player.moving = false;
				break;
			}

			event.preventDefault();
		}
	}, false);

	//setup debug draw
	var debugDraw = new b2DebugDraw();
	debugDraw.SetSprite(document.getElementById("playcanvas").getContext("2d"));
	debugDraw.SetDrawScale(1.0);
	debugDraw.SetFillAlpha(0.3);
	debugDraw.SetLineThickness(1.0);
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	world.SetDebugDraw(debugDraw);

	updateInterval = window.setInterval(update, 1000 / 60);
    // $("#impress").data("gameUpdateInterval", updateInterval);
};

function update() {
	if (world.deleters.length > 0) {
		for (var i = 0; i < world.deleters.length; i++) {
			world.DestroyBody(world.deleters[i]);
		}
		world.deleters = [];
	}
	
	if (world.changeroom){

		for (b = world.m_bodyList; b; b = b.m_next){
			if(b.type !== 'player')
			world.DestroyBody(b);
		}  
		
		var room = levelManager.rooms[currentRoom];  
		world.roombounds(room);
		drawFloor(room);
		var x, y;
		
		switch(room.doors[prevroom].direction){
			case 'north':
				x = 0;
				y = 100;
			break;
			case 'south':
				x = 0;
				y = -100;				
			break;
			case 'east':
				x = -100;
				y = 0;    		
			break;
			case 'west':
				x = 100;
				y = 0;	    		
			break;			
		}
		player.SetPosition(new b2Vec2(room.doors[prevroom].x + x, room.doors[prevroom].y + y));
		world.changeroom = false;
		
		return;
	}

	world.Step(
	1 / 60 //frame-rate
	, 10 //velocity iterations
	, 10 //position iterations
	);

	for (var i = 0; i < badguys.badies.length; i++) {
		if (badguys.badies[i].update) badguys.badies[i].update();
	}

	world.DrawReally();
    //world.DrawDebugData();
	world.ClearForces(); 
    world.LightBurst();
	if (!player.moving) player.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(
	player.GetLinearVelocity().x * .9, player.GetLinearVelocity().y * .9));

	$('#mover').css({
		'-webkit-transform': 'translate3d(' + (-player.m_xf.position.x + 364).toFixed(1) + 'px,' + (-player.m_xf.position.y + 364).toFixed(1) + 'px,0)',
		'-moz-transform': 'translate3d(' + (-player.m_xf.position.x + 364).toFixed(1) + 'px,' + (-player.m_xf.position.y + 364).toFixed(1) + 'px,0)'
	});

};
