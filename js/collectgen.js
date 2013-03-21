var badguys = {
	bodyDef: new b2BodyDef,
	fixDef: new b2FixtureDef,
	badies: [],
	images: {},
	fleeingtime: 100,

	create: function(type, x, y, fleeing) { 
		if(fleeing === undefined){
			fleeing = false;
		}
		
		switch (type) {
		case 'a':
			this.fixDef.density = 1.0;
			this.fixDef.friction = 10;
			this.fixDef.restitution = 0.01;
			this.bodyDef.type = b2Body.b2_dynamicBody; 
			if(!fleeing){
				this.bodyDef.position.x = Math.random() * x;
				this.bodyDef.position.y = Math.random() * y; 
			}else{
				this.bodyDef.position.x = x;
				this.bodyDef.position.y = y;	
			}
			this.fixDef.shape = new b2PolygonShape;
			this.fixDef.shape.SetAsBox(
			10, 10);

			var badie = world.CreateBody(this.bodyDef);
			this.fixDef.filter.categoryBits = 0x00010;
			this.fixDef.filter.maskBits = 0x00111;
			if(fleeing){
				this.fixDef.filter.maskBits = this.fixDef.filter.maskBits & 0x10011;	
			}
			badie.CreateFixture(this.fixDef);
			badie.type = type;
			badie.SetFixedRotation(true); 
			badie.uvel = ~~ (Math.random() * 100);
			badie.SetSleepingAllowed(false);
			badie.update = function() {
				this.curframe--; 
				if(this.curframe < 0){
					 this.curframe = this.total;
					 this.myFrame += 1;
					 
					if(this.myFrame > 1){
						this.myFrame = 0;
					}
				}
	
				this.uvel--;

				if (this.uvel <= 0) {
					this.SetActive(true);
					var directvec = new b2Vec2((Math.random() * 1000) - 500, (Math.random() * 1000) - 500);
					this.SetLinearVelocity(directvec);
					directvec.Normalize();
					var negate = 0;
					if (directvec.x < 0 || directvec.y < 0) negate = 0;
			   // 	this.SetAngle(Math.atan((directvec.x) / (1 - directvec.y)) + negate);
					this.uvel = ~~ (Math.random() * 100);
				}
				
				if(this.fleeing){
					 this.fleeingtime--;
					if(this.fleeingtime < 0){
						this.fleeing = false;
					}
				}
			}
			
			badie.curframe = 8;
			badie.total = 8;
			badie.myFrame = 0;

			if (!this.images[type]) {
				this.images[type] = {
					imgs : [],
					framerate : 8
				};
				
				this.images[type].imgs.push(new Image());
				this.images[type].imgs.push(new Image());
				this.images[type].imgs[0].src = 'img/spider_1.png';
				this.images[type].imgs[1].src = 'img/spider_2.png';
			}
			break; 
			
			case 'b':

				this.fixDef.density = 1.0;
				this.fixDef.friction = 10;
				this.fixDef.restitution = 0.01;
				this.bodyDef.type = b2Body.b2_dynamicBody;
				if(!fleeing){
					this.bodyDef.position.x = Math.random() * x;
					this.bodyDef.position.y = Math.random() * y; 
				}else{
					this.bodyDef.position.x = x;
					this.bodyDef.position.y = y;	
				}
				this.fixDef.shape = new b2PolygonShape;
				this.fixDef.shape.SetAsBox(
				10, 20);

				var badie = world.CreateBody(this.bodyDef);
				this.fixDef.filter.categoryBits = 0x00010;
				this.fixDef.filter.maskBits = 0x00111;
				if(fleeing){
					this.fixDef.filter.maskBits = this.fixDef.filter.maskBits & 0x10011;	
				}
				badie.CreateFixture(this.fixDef);
				badie.type = type;
				badie.uvel = ~~ (Math.random() * 100);
				badie.SetSleepingAllowed(false);
				badie.SetFixedRotation(true);
				badie.SetAngle(Math.random() * 2) 
				badie.update = function() { 
					this.curframe--; 
					if(this.curframe < 0){
						 this.curframe = this.total;
						 this.myFrame += 1;

						if(this.myFrame > 1){
							this.myFrame = 0;
						}
					}
					
					badie.uvel--;
					if (badie.uvel <= 0) {
						badie.SetActive(true); 
						if(Math.random()* 100 < 50){
	                        badie.SetAngle(badie.GetAngle() * (Math.random()) - .5);
						}
						
                        var directvec = new b2Vec2(badie.GetTransform().R.col2.x * 500, badie.GetTransform().R.col2.y * 500);
						badie.SetLinearVelocity(directvec);
						badie.uvel = ~~ (Math.random() * 100);
					}
					
					if(badie.fleeing){
						 badie.fleeingtime--;
						if(badie.fleeingtime < 0){
							badie.fleeing = false;
						}
					}
				}

				badie.curframe = 8;
				badie.total = 8;
				badie.myFrame = 0;

				if (!this.images[type]) {
					this.images[type] = {
						imgs : [],
						framerate : 8
					};

					this.images[type].imgs.push(new Image());
					this.images[type].imgs.push(new Image());
					this.images[type].imgs[0].src = 'img/rat_1.png';
					this.images[type].imgs[1].src = 'img/rat_2.png';
				}
 
				break;
		}
		
		 badie.fleeing = fleeing;
		 badie.fleeingtime = this.fleeingtime;
		 this.badies.push(badie);
	}

}
