// A generic sprite class

var Sprite = function(src, width, height, offsetX, offsetY, frames, duration, badGuyType, startPositionX, startPositionY, health, experience, level) {
	
	this.badGuyType = badGuyType;
		// create the speed object
	// need to move into sprite
	this.Speed = {
		x: 0,
		y: 0,
		MAX: 2,
		FRICTION: 0.25,
		INCREASE: 0.25
	}

	//create hero position object with x, y and z
	// need to move into sprite
	this.Position = {
		x: 285,
		y: 290,
		z: 0
	}
	this.startPosition = this.Position;
	
	if (startPositionX) {
		this.Position.x = startPositionX; 
	}
	
	if (startPositionY) {
		this.Position.y = startPositionY;
	}
	
	this.health = 100;
	if (health) {
		 this.health = health;
	}
	this.experience = 0;
	if (experience) {
		 this.experience = experience;
	}

	this.level = 0;
	if (level) {
		 this.level = level;
	}

	this.magic = 100;
	this.damage = 5;
	this.dead = false;

	this.communication = [];
	this.fireballs = [];
	this.fireballCount = 0;
	this.direction = Direction.LEFT;
	this.action = Action.STANDING;
	
	this.spritesheet = null;
	this.offsetX = 0;
	this.offsetY = 0;
	this.width = width;
	this.height = height;
	this.frames = 1;
	this.currentFrame = 0;
	this.duration = 1;
	this.posX = 0;
	this.posY = 0;
	this.shown = true;
	this.zoomLevel = 1;
	this.shadow = null;

	this.setSpritesheet(src);
	this.setOffset(offsetX, offsetY);
	this.setFrames(frames);
	this.setDuration(duration);
	
	var d = new Date();
	if (this.duration > 0 && this.frames > 0) {
		this.ftime = d.getTime() + (this.duration / this.frames);
	} else {
		this.ftime = 0;	
	}
	
}

Sprite.prototype.setSpritesheet = function(src) {
	if (src instanceof Image) {
		this.spritesheet = src;
	} else {
		this.spritesheet = new Image();
		this.spritesheet.src = src;
	}
}

Sprite.prototype.hit = function(attackAmount) {
    this.health = this.health - attackAmount;
	return this.health;
}

Sprite.prototype.shootFireball = function(e, eX, eY, eDirection) {
	var successful = false;
	if (this.fireballCount < 10) {
		this.magic = this.magic - 10;
		e.direction = eDirection;
		e.Position.x = eX;
		e.Position.y = eY;
		e.startPosition = { x: eX, y: eY };
		this.fireballs[this.fireballCount] = e;
		this.fireballCount = this.fireballCount + 1;
	}
	return successful;
}

Sprite.prototype.attack = function(eX, eY) {
	var hitCount = 0;
	if (this.fireballCount > 0) {
		for (var f = 0; f < this.fireballs.length; f++) {
			var fireball = this.fireballs[f];
			if (fireball && fireball.collisionDection(eX, eY)) {
				hitCount = hitCount + 1;
			}
		}
	}
	else if ((this.action == Action.Kick || this.action == Action.Punch) && this.collisionDection(eX, eY)) {
		hitCount = hitCount + 1;
	}
	return hitCount;
}

Sprite.prototype.collisionDection = function(bX, bY) {
	var collision = false;
	if ((Math.round(this.Position.x) == Math.round(bX)) && (Math.round(this.Position.y) == Math.round(bY))) {
		collision = true;
	}
	return collision;
}

Sprite.prototype.simpleCollisionDection = function(aX, aY, bX, bY) {
	var collision = false;
	if ((Math.round(aX) == Math.round(bX)) && (Math.round(aY) == Math.round(bY))) {
		collision = true;
	}
	return collision;
}

Sprite.prototype.setPosition = function(x, y) {
	this.posX = x;
	this.posY = y;
}

Sprite.prototype.getPosition = function() {
	return { x: this.posX, y: this.posY };
}

Sprite.prototype.setOffset = function(x, y) {
	this.offsetX = x;
	this.offsetY = y;
}

Sprite.prototype.setFrames = function(fcount) {
	this.currentFrame = 0;
	this.frames = fcount;
}

Sprite.prototype.setDuration = function(duration) {
	this.duration = duration;
}

Sprite.prototype.animate = function(c, t) {
	if (t.getMilliseconds() > this.ftime) {
		this.nextFrame ();
	}
}

Sprite.prototype.nextFrame = function() {	
	if (this.duration > 0) {
		var d = new Date();

		if (this.duration > 0 && this.frames > 0) {
			this.ftime = d.getTime() + (this.duration / this.frames);
		} else {
			this.ftime = 0;	
		}

		this.offsetX = this.width * this.currentFrame;
		
		if (this.currentFrame === (this.frames - 1)) {
			this.currentFrame = 0;
		} else {
			this.currentFrame++;
		}
	}
}

Sprite.prototype.draw = function(c, drawShadow) {
	if (this.shown) {
		if (drawShadow !== undefined && drawShadow) {
			if (this.shadow === null) { // Shadow not created yet
				var sCnv = document.createElement("canvas");
  				var sCtx = sCnv.getContext("2d");

  				sCnv.width = this.width;
  				sCnv.height = this.height;

  				sCtx.drawImage(this.spritesheet, 
					this.offsetX, 
					this.offsetY, 
					this.width,
					this.height, 
					0, 
					0, 
					this.width * this.zoomLevel, 
					this.height * this.zoomLevel);

				var idata = sCtx.getImageData(0, 0, sCnv.width, sCnv.height);

				for (var i = 0, len = idata.data.length; i < len; i += 4) {
			        idata.data[i] = 0; // R
			        idata.data[i + 1] = 0; // G
			        idata.data[i + 2] = 0; // B
			    }

			    sCtx.clearRect(0, 0, sCnv.width, sCnv.height);
				sCtx.putImageData(idata, 0, 0);

				this.shadow = sCtx;
			}

			c.save();
			c.globalAlpha = 0.1;
			var sw = this.width * this.zoomLevel;
			var sh = this.height * this.zoomLevel;
			c.drawImage(this.shadow.canvas, this.posX, this.posY - sh, sw, sh * 2);
			c.restore();
		}

		c.drawImage(this.spritesheet, 
					this.offsetX, 
					this.offsetY, 
					this.width,
					this.height, 
					this.posX, 
					this.posY, 
					this.width * this.zoomLevel, 
					this.height * this.zoomLevel);
	}
}