function Game() {
	// create heatmap	
	this.heatMapCanvas = document.createElement("canvas");
	this.heatMapCanvas.height = Constants.canvasHeight;
	this.heatMapCanvas.width = Constants.canvasWidth;
	// get heat map canvas context
	this.heatMapCanvasContext = this.heatMapCanvas.getContext("2d");
	
	// create handle to canvas
	this.canvas = document.getElementById('myCanvas');
	// create handle to (2d) context
	this.convasContext = this.canvas.getContext('2d');
	
	this.setupNewGame(false);
	this.setupNewGame(true);
}

Game.prototype.draw = function(timeStamp) {
	//if game has started
	if (this.timer != undefined) {
		Constants.runTime = Constants.runTime + 1;
		this.timer.update();
		this.drawBackground();
		this.drawBadguys();
		if (!this.isGameOver()) {	
			this.updateHero();
			this.drawHero();
		}
	}
}

Game.prototype.drawBackground = function() {
	this.convasContext.drawImage(this.background, 0, 0, Constants.canvasWidth, Constants.canvasHeight);	
}

Game.prototype.updateHero = function() {
	this.calculateSpriteOffset(this.hero, this.hero.Speed.x, this.hero.Speed.y);
	this.calculateSpriteDirection(this.hero);
	this.caculateSpritePosition(this.hero);	
	this.hero.setPosition(this.hero.Position.x, this.hero.Position.y);
	this.caculateSpriteFireball(this.hero);
	this.caculateSpritePunch(this.hero);
	this.caculateSpriteKick(this.hero);
}

Game.prototype.drawHero = function() {
    this.drawSpriteFireBalls(this.hero);
	this.hero.animate(this.convasContext, this.timer);
	this.hero.draw(this.convasContext);
}

Game.prototype.drawBadguys = function() {
	for (var b=0; b < this.badguys.length; b++) {
		var badguy = this.badguys[b];
		if (!badguy.dead) {
			// collision detection and hit 
			if (this.hero.health > 0) {
				if (badguy.collisionDection(this.hero.Position.x, this.hero.Position.y)) {
					this.hero.hit(badguy.damage);
					if (this.hero.health <= 0) {
						this.gameOver();
					}
				}
				var hitCount = this.hero.attack(badguy.Position.x, badguy.Position.y)
				if (hitCount > 0) {
					badguy.hit(hitCount * this.hero.damage);
					if (badguy.health <= 0) {
						this.setHeroExperience(badguy.experience);
						badguy.dead = true;
						badguy.shown = false;
						constantUtils.removeFromArray(badguy, this.badguys); 
						// no badguys left
                        if (this.badguys.length == 0) {
                        	   this.setupNewLevel();
						}
					}
				}
			}
			badguy = this.caculateBadGuyPosition(badguy);			
			badguy.animate(this.convasContext, this.timer);
			badguy.draw(this.convasContext);		
		}
	}
}

Game.prototype.setHeroExperience = function(experience) {
	this.hero.experience = this.hero.experience + experience;
	if (this.hero.experience > 100) {
		this.hero.level = this.hero.level + 1;
		this.hero.totalExperience = this.hero.totalExperience + this.hero.experience;
		this.hero.experience = 0;
	}	
}

Game.prototype.isGameOver = function() {
	return this.hero.dead;
}

Game.prototype.gameOver = function() {
	this.hero.dead = true;
	this.hero.shown = false;
	alert("Game Over");	
}

Game.prototype.setBackground = function(imageScr) {
	this.background = new Image();
	this.background.src = imageScr;
}

Game.prototype.setHeatMap = function(imageScr) {
	this.heatMapImage = new Image();
	this.heatMapImage.src = imageScr;
	this.heatMapCanvasContext.drawImage(this.heatMapImage, 0, 0, Constants.canvasWidth, Constants.canvasHeight);
}

Game.prototype.showHeatMap = function() {
	this.background.src = this.heatMapImage.src;
}

Game.prototype.calculateSpriteOffset = function(sprite, x, y) {
	if (x === 0 && y === 0) { // standing still
		sprite.setOffset(0, 128);
		sprite.setFrames(1);
		sprite.setDuration(0);
	} 
	else if (x > 0 && y === 0) { // East
		if (sprite.offsetY !== 192) {
			sprite.setOffset(0, 192);
			sprite.setFrames(6);
			sprite.setDuration(500);
		}
	} 
	else if (x < 0 && y === 0) { // West
		if (sprite.offsetY !== 224) {
			sprite.setOffset(0, 224);
			sprite.setFrames(6);
			sprite.setDuration(500);
		}
	} 
	else if (x === 0 && y > 0) { // South
		if (sprite.offsetY !== 128 || sprite.frames !== 4) {
			sprite.setOffset(0, 128);
			sprite.setFrames(4);
			sprite.setDuration(500);
		}
	} 
	else if (x === 0 && y < 0) { // North
		if (sprite.offsetY !== 160) {
			sprite.setOffset(0, 160);
			sprite.setFrames(4);
			sprite.setDuration(500);
		}
	} 
	else if (x > 0 && y < 0) { // North East
		if (sprite.offsetY !== 0) {
			sprite.setOffset(0, 0);
			sprite.setFrames(4);
			sprite.setDuration(500);
		}
	} 
	else if (x > 0 && y > 0) { // South East
		if (sprite.offsetY !== 32) {
			sprite.setOffset(0, 32);
			sprite.setFrames(4);
			sprite.setDuration(500);
		}
	} 
	else if (x < 0 && y < 0) { // North West
		if (sprite.offsetY !== 64) {
			sprite.setOffset(0, 64);
			sprite.setFrames(4);
			sprite.setDuration(500);
		}
	} 
	else if (x < 0 && y > 0) { // South West
		if (sprite.offsetY !== 96) {
			sprite.setOffset(0, 96);
			sprite.setFrames(4);
			sprite.setDuration(500);
		}
	}
}

Game.prototype.calculateSpriteDirection = function(sprite) {
	// Calculate X speed
	if (constantUtils.inArray(Keys.RIGHT, Keys.getDown) || constantUtils.inArray(Keys.D, Keys.getDown)) {
		sprite.Speed.x += (sprite.Speed.x <= sprite.Speed.MAX) ? sprite.Speed.INCREASE : 0;
		sprite.direction = Direction.RIGHT;
	} 
	else if (constantUtils.inArray(Keys.LEFT, Keys.getDown) || constantUtils.inArray(Keys.A, Keys.getDown)) {
		sprite.Speed.x -= (sprite.Speed.x >= (sprite.Speed.MAX * -1)) ? sprite.Speed.INCREASE : 0;
		sprite.direction = Direction.LEFT;
	} 
	else {
		// No right / left keys are being pressed
		if (sprite.Speed.x > 0) {
			sprite.Speed.x += sprite.Speed.FRICTION * -1;
			sprite.Speed.x = (sprite.Speed.x < 0) ? 0 : sprite.Speed.x;
		}
		else if (sprite.Speed.x < 0) {
			sprite.Speed.x += sprite.Speed.FRICTION;
			sprite.Speed.x = (sprite.Speed.x > 0) ? 0 : sprite.Speed.x;
		}
	}
	// Calculate Y speed
	if (constantUtils.inArray(Keys.DOWN, Keys.getDown) || constantUtils.inArray(Keys.S, Keys.getDown)) {
		sprite.Speed.y += (sprite.Speed.y <= sprite.Speed.MAX) ? sprite.Speed.INCREASE : 0;
		sprite.direction = Direction.DOWN;
	} 
	else if (constantUtils.inArray(Keys.UP, Keys.getDown) || constantUtils.inArray(Keys.W, Keys.getDown)) {
		sprite.Speed.y -= (sprite.Speed.y >= (sprite.Speed.MAX * -1)) ? sprite.Speed.INCREASE : 0;
		sprite.direction = Direction.UP;
	} 
	else {
		// No up / down keys are being pressed
		if (sprite.Speed.y > 0) {
			sprite.Speed.y += sprite.Speed.FRICTION * -1;
			sprite.Speed.y = (sprite.Speed.y < 0) ? 0 : sprite.Speed.y;
		} else if (sprite.Speed.y < 0) {
			sprite.Speed.y += sprite.Speed.FRICTION;
			sprite.Speed.y = (sprite.Speed.y > 0) ? 0 : sprite.Speed.y;
		}
	}
}

Game.prototype.caculateSpritePosition = function(sprite) {
	if (this.isValidPath(sprite, sprite.Speed.x, sprite.Speed.y)) {
		sprite.Position.x += sprite.Speed.x;
		sprite.Position.y += sprite.Speed.y;
	}
}

Game.prototype.isValidPath = function(sprite, xOffset, yOffset) {
	var validFound     = false;
	// calculate the future postion of the sprite
	var futurePositionX = sprite.Position.x+xOffset;
	var futurePositionY = sprite.Position.y+yOffset;
	// get the future position point color
	var pointColor = constantUtils.getColorAtPoint(this.heatMapCanvasContext, futurePositionX + Constants.spritePositionX, futurePositionY + Constants.spritePositionY);			

	//if color is yellow - scene change
	if (pointColor[0] == 255 && pointColor[1] == 249 && pointColor[2] == 55) {
		// valid location to move to
		this.setupNewLevel();		
	}	
	//if color is blue - can move
	else if (pointColor[0] != 252 && pointColor[1] != 13 && pointColor[2] != 27) {
    		// valid location to move to
    		validFound = true;
    	}
	//if color is red - can not move
	else if (pointColor[0] == 252 && pointColor[1] == 13 && pointColor[2] == 27) {
		validFound = false;
	}
    	return validFound;
}

Game.prototype.caculateSpriteFireball = function(sprite) {
	if (constantUtils.inArray(Keys.SHIFT, Keys.getDown) || constantUtils.inArray(Keys.SPACE, Keys.getDown)) {
		sprite.shootFireball( new Sprite('img/fireball.png', 36, 36, 0, 0, 5, 0), sprite.Position.x, sprite.Position.y, sprite.direction);
	}
}

Game.prototype.drawSpriteFireBalls = function(sprite) {
	if (sprite.fireballCount > 0) {
		for (var f = 0; f < sprite.fireballs.length; f++) {
			var fb = sprite.fireballs[f];
			if (fb) {
				if (constantUtils.pointDistance(fb.Position.x, fb.Position.y, fb.startPosition.x, fb.startPosition.y) < 100) {
					fb.Position.x = (fb.direction == Direction.LEFT) ? fb.Position.x - 1: fb.Position.x + 1;
					fb.setPosition(fb.Position.x, fb.Position.y);
					fb.animate(this.convasContext, this.timer);
					fb.draw(this.convasContext);
				}
				else {
					constantUtils.removeFromArray(fb, sprite.fireballs);
					sprite.fireballCount = sprite.fireballCount - 1;
					sprite.magic = sprite.magic + 10;
				}
			}
		}
	}
}

Game.prototype.caculateSpriteKick = function(sprite) {
	if (sprite.action == Action.KICK && sprite.actionCount == 0) {
		sprite.action = Action.STANDING;
	}
	if (constantUtils.inArray(Keys.K, Keys.getDown)) {
		if (sprite.direction == Direction.RIGHT) {
			sprite.setOffset(0, 256);
		}
		else if (sprite.direction == Direction.LEFT) {
			sprite.setOffset(0, 288);
		}
		sprite.setFrames(4);
		sprite.setDuration(500);
		sprite.action = Action.KICK;
		sprite.actionCount = 4; // number of Frames  (timeout for the action)
	}
	else if (sprite.action == Action.KICK) {
		sprite.actionCount = sprite.actionCount - 1; 
	}	
}

Game.prototype.caculateSpritePunch = function(sprite) {
	if (sprite.action == Action.PUNCH && sprite.actionCount == 0) {
		sprite.action = Action.STANDING;
	}
	if (constantUtils.inArray(Keys.P, Keys.getDown)) {
		if (sprite.direction == Direction.RIGHT) {
			sprite.setOffset(0, 320);
		}
		else if (sprite.direction == Direction.LEFT) {
			sprite.setOffset(0, 352);
		}
		sprite.setFrames(4);
		sprite.setDuration(500);
		sprite.action = Action.PUNCH;
		sprite.actionCount = 4; // number of Frames  (timeout for the action)
	}
	else if (sprite.action == Action.PUNCH) {
		sprite.actionCount = sprite.actionCount - 1; 
	}	
}

Game.prototype.setupNewGame = function(alertMessage) {
	Constants.boardLevel = 1;
	Constants.runTime = 1;

	this.setHeatMap("img/heatMapLevel1.png");
	this.setBackground("img/backgroundLevel1.png");
		
	// create the hero
	this.hero = new Sprite(Constants.spritesheet[Constants.currentHero], 32, 32, 0, 128, 4, 0, 0, 400, 400);
	// create the bad guys
	//src, width, height, offsetX, offsetY, frames, duration, badGuyType, startPositionX, startPositionY, health, experience
	this.badguys = [
        new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 365, 195, 8, 10),
		new Sprite('img/dwarf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 260, 220, 10, 15),
		new Sprite('img/catfolk.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 475, 100, 8, 10),
		new Sprite('img/dhampir.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 285, 200, 10, 10)
	];
	
	// setup game timer
	this.timer = new Timer();
	// initial draw
	this.draw(this.timer.getSeconds());	
	if (alertMessage) {
		alert("Starting board " + Constants.boardLevel);
	}
	else {
		alert("Setting up board 1");
	}
}

Game.prototype.setupNewLevel = function() {
    // level up
	for (var f = 0; f < this.hero.fireballs.length; f++) {
		var fb = this.hero.fireballs[f];
		constantUtils.removeFromArray(fb, this.hero.fireballs);
	}

	for (var f = 0; f < Keys.getDown.length; f++) {
		var kd = Keys.getDown[f];
		constantUtils.removeFromArray(kd, Keys.getDown)
	}
	
	//image src,            w,  h, oX, oY,  f, d, badGuyType, startPositionX, startPositionY, health, experience,level) {			  
	this.hero = new Sprite(Constants.spritesheet[Constants.currentHero], 32, 32, 0, 128, 4, 0, 0, 400, 400,this.hero.health,this.hero.experience,this.hero.level);
		
	Constants.boardLevel = Constants.boardLevel + 1;
	alert("You WIN!, Now starting board " + Constants.boardLevel);
	if (Constants.boardLevel == 2) {
		this.setHeatMap("img/heatMapLevel2.png");
		this.setBackground("img/backgroundLevel2.png");

		this.badguys = [
	        //image src, width, height, offsetX, offsetY, frames, duration, badGuyType, startPositionX, startPositionY, health, experience) {			  
			new Sprite('img/goblin.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 705, 120, 1, 10)
		];
	}
	else if (Constants.boardLevel == 3) {
		this.setHeatMap("img/heatMapLevel3.png");
		this.setBackground("img/backgroundLevel3.png");
		
		this.badguys = [
	        //image src, width, height, offsetX, offsetY, frames, duration, badGuyType, startPositionX, startPositionY, health, experience) {			  
			new Sprite('img/goblin.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 705, 120, 1, 10),
			new Sprite('img/halfling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 340, 140, 1, 10)
		];	
	}
	else if (Constants.boardLevel == 4) {
		this.setHeatMap("img/heatMapLevel4.png");
		this.setBackground("img/backgroundLevel4.png");

		this.badguys = [
	        //image src, width, height, offsetX, offsetY, frames, duration, badGuyType, startPositionX, startPositionY, health, experience) {			  
			new Sprite('img/goblin.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 705, 120, 1, 10),
			new Sprite('img/orc.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 620, 80, 1, 10),
			new Sprite('img/dwarf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 160, 220, 1, 10)
		];	
	}
	else if (Constants.boardLevel == 5) {
		this.setHeatMap("img/heatMapLevel5.png");
		this.setBackground("img/backgroundLevel5.png");

		this.badguys = [
	        //image src, width, height, offsetX, offsetY, frames, duration, badGuyType, startPositionX, startPositionY, health, experience) {			  
	        new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 125, 180, 1, 10),
			new Sprite('img/dwarf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 160, 220, 1, 10)
		];	
	}
	else if (Constants.boardLevel == 6) {
		this.setHeatMap("img/heatMapLevel6.png");
		this.setBackground("img/backgroundLevel6.png");

		this.badguys = [
	        //image src, width, height, offsetX, offsetY, frames, duration, badGuyType, startPositionX, startPositionY, health, experience) {			  
			new Sprite('img/goblin.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 705, 120, 1, 10),
	        new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 125, 180, 1, 10),
			new Sprite('img/dwarf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 160, 220, 1, 10),
			new Sprite('img/catfolk.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 475, 100, 1, 10)
		];	
	}
	else if (Constants.boardLevel == 7) {
		this.setHeatMap("img/heatMapLevel7.png");
		this.setBackground("img/backgroundLevel7.png");

		this.badguys = [
	        //image src, width, height, offsetX, offsetY, frames, duration, badGuyType, startPositionX, startPositionY, health, experience) {			  
			new Sprite('img/goblin.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 705, 120, 1, 10),
			new Sprite('img/orc.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 620, 80, 1, 10),
			new Sprite('img/dragon.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 435, 120, 1, 10),
			new Sprite('img/halfling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 340, 140, 1, 10),
			new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 135, 180, 1, 10)
		];	
	}
	else if (Constants.boardLevel == 8) {
		this.setHeatMap("img/heatMapLevel8.png");
		this.setBackground("img/backgroundLevel8.png");
	    
		this.badguys = [
	        //image src, width, height, offsetX, offsetY, frames, duration, badGuyType, startPositionX, startPositionY, health, experience) {			  
			new Sprite('img/goblin.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 705, 120, 1, 10),
			new Sprite('img/orc.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 620, 80, 1, 10),
			new Sprite('img/dragon.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 435, 120, 1, 10),
			new Sprite('img/halfling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 340, 140, 1, 10),
			new Sprite('img/dwarf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 160, 220, 1, 10),
			new Sprite('img/catfolk.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 475, 100, 1, 10)
		];	
	}
	else if (Constants.boardLevel == 9) {
		this.setHeatMap("img/heatMapLevel9.png");
		this.setBackground("img/backgroundLevel9.png");

		this.badguys = [
	        //image src, width, height, offsetX, offsetY, frames, duration, badGuyType, startPositionX, startPositionY, health, experience) {			  
			new Sprite('img/goblin.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 705, 120, 1, 10),
			new Sprite('img/orc.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 620, 80, 1, 10),
			new Sprite('img/dragon.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 435, 120, 1, 10),
			new Sprite('img/halfling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 340, 140, 1, 10),
			new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 135, 180, 1, 10),
			new Sprite('img/dhampir.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 180, 200, 1, 10)
		];	
	}
	else if (Constants.boardLevel == 10) {
		this.setHeatMap("img/heatMapLevel10.png");
		this.setBackground("img/backgroundLevel10.png");
	  
		this.badguys = [
	        //image src, width, height, offsetX, offsetY, frames, duration, badGuyType, startPositionX, startPositionY, health, experience) {			  
			new Sprite('img/goblin.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 705, 120, 1, 10),
			new Sprite('img/orc.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 620, 80, 1, 10),
			new Sprite('img/dragon.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 435, 120, 1, 10),
			new Sprite('img/halfling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 340, 140, 1, 10),
			new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 135, 180, 1, 10),
	        new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 125, 180, 1, 10),
			new Sprite('img/dwarf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 160, 220, 1, 10),
			new Sprite('img/catfolk.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 475, 100, 1, 10),
			new Sprite('img/dhampir.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 180, 200, 1, 10)
		];	
	}
	else if (Constants.boardLevel == 11) {
		this.setHeatMap("img/heatMapLevel11.png");
		this.setBackground("img/backgroundLevel11.png");
		
		this.badguys = [
	        //image src, width, height, offsetX, offsetY, frames, duration, badGuyType, startPositionX, startPositionY, health, experience) {			  
			new Sprite('img/goblin.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 705, 120, 1, 10),
			new Sprite('img/orc.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 620, 80, 1, 10),
			new Sprite('img/dragon.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 435, 120, 1, 10),
			new Sprite('img/halfling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 340, 140, 1, 10),
			new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 135, 180, 1, 10),
			new Sprite('img/dwarf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 160, 220, 1, 10),
			new Sprite('img/catfolk.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 475, 100, 1, 10),
			new Sprite('img/dhampir.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 180, 200, 1, 10),
			new Sprite('img/drow.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 595, 300, 1, 10)
		];	
	}
	else if (Constants.boardLevel == 12) {
		this.setHeatMap("img/heatMapLevel12.png");
		this.setBackground("img/backgroundLevel12.png");
		
		this.badguys = [
	        //image src, width, height, offsetX, offsetY, frames, duration, badGuyType, startPositionX, startPositionY, health, experience) {			  
			new Sprite('img/goblin.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 705, 120, 1, 10),
			new Sprite('img/orc.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 620, 80, 1, 10),
			new Sprite('img/dragon.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 435, 120, 1, 10),
			new Sprite('img/halfling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 340, 140, 1, 10),
	        new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 125, 180, 1, 10),
			new Sprite('img/dwarf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 160, 220, 1, 10),
			new Sprite('img/catfolk.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 475, 100, 1, 10),
			new Sprite('img/dhampir.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 180, 200, 1, 10),
			new Sprite('img/drow.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 595, 300, 1, 10),
			new Sprite('img/fetchling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 200, 200, 1, 10)
		];	
	}
	else if (Constants.boardLevel == 13) {
		this.setHeatMap("img/heatMapLevel13.png");
		this.setBackground("img/backgroundLevel13.png");
		
		this.badguys = [
	        //image src, width, height, offsetX, offsetY, frames, duration, badGuyType, startPositionX, startPositionY, health, experience) {			  
			new Sprite('img/goblin.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 705, 120, 1, 10),
			new Sprite('img/orc.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 620, 80, 1, 10),
			new Sprite('img/dragon.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 435, 120, 1, 10),
			new Sprite('img/halfling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 340, 140, 1, 10),
			new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 135, 180, 1, 10),
	        new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 125, 180, 1, 10),
			new Sprite('img/dwarf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 160, 220, 1, 10),
			new Sprite('img/catfolk.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 475, 100, 1, 10)
		];	
	}
	else if (Constants.boardLevel == 14) {
		this.setHeatMap("img/heatMapLevel14.png");
		this.setBackground("img/backgroundLevel14.png");
		
		this.badguys = [
	        //image src, width, height, offsetX, offsetY, frames, duration, badGuyType, startPositionX, startPositionY, health, experience) {			  
			new Sprite('img/goblin.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 705, 120, 1, 10),
			new Sprite('img/orc.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 620, 80, 1, 10),
			new Sprite('img/dragon.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 435, 120, 1, 10),
			new Sprite('img/halfling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 340, 140, 1, 10),
			new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 135, 180, 1, 10),
	        new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 125, 180, 1, 10),
			new Sprite('img/dwarf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 160, 220, 1, 10),
			new Sprite('img/catfolk.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 475, 100, 1, 10)
		];	
	}
	else if (Constants.boardLevel == 15) {
		this.setHeatMap("img/heatMapLevel15.png");
		this.setBackground("img/backgroundLevel15.png");
		
		this.badguys = [
	        //image src, width, height, offsetX, offsetY, frames, duration, badGuyType, startPositionX, startPositionY, health, experience) {			  
			new Sprite('img/goblin.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 705, 120, 1, 10),
			new Sprite('img/orc.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 620, 80, 1, 10),
			new Sprite('img/dragon.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 435, 120, 1, 10),
			new Sprite('img/halfling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 340, 140, 1, 10),
			new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 135, 180, 1, 10),
	        new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 125, 180, 1, 10),
			new Sprite('img/dwarf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 160, 220, 1, 10),
			new Sprite('img/catfolk.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 475, 100, 1, 10),
			new Sprite('img/dhampir.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 180, 200, 1, 10)
		];	
	}
	else if (Constants.boardLevel == 16) {
		this.setHeatMap("img/heatMapLevel16.png");
		this.setBackground("img/backgroundLevel16.png");
		
		this.badguys = [
	        //image src, width, height, offsetX, offsetY, frames, duration, badGuyType, startPositionX, startPositionY, health, experience) {			  
			new Sprite('img/goblin.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 705, 120, 1, 10),
			new Sprite('img/orc.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 620, 80, 1, 10),
			new Sprite('img/dragon.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 435, 120, 1, 10),
			new Sprite('img/halfling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 340, 140, 1, 10),
			new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 135, 180, 1, 10),
	        new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 125, 180, 1, 10),
			new Sprite('img/dwarf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 160, 220, 1, 10),
			new Sprite('img/catfolk.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 475, 100, 1, 10),
			new Sprite('img/dhampir.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 180, 200, 1, 10),
			new Sprite('img/drow.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 595, 300, 1, 10),
			new Sprite('img/fetchling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 200, 200, 1, 10)
		];	
	}
	else if (Constants.boardLevel == 17) {
		this.setHeatMap("img/heatMapLevel17.png");
		this.setBackground("img/backgroundLevel17.png");
		
		this.badguys = [
	        //image src, width, height, offsetX, offsetY, frames, duration, badGuyType, startPositionX, startPositionY, health, experience) {			  
			new Sprite('img/goblin.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 705, 120, 1, 10),
			new Sprite('img/orc.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 620, 80, 1, 10),
			new Sprite('img/dragon.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 435, 120, 1, 10),
			new Sprite('img/halfling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 340, 140, 1, 10),
			new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 135, 180, 1, 10),
	        new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 125, 180, 1, 10),
			new Sprite('img/dwarf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 160, 220, 1, 10),
			new Sprite('img/catfolk.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 475, 100, 1, 10),
			new Sprite('img/dhampir.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 180, 200, 1, 10),
			new Sprite('img/drow.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 595, 300, 1, 10),
			new Sprite('img/fetchling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 200, 200, 1, 10),
			new Sprite(Constants.spritesheet[Constants.badguyPawn], 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 655, 100, 1, 10),
	        new Sprite(Constants.spritesheet[Constants.badguyBoss], 32, 32, 0, 128, 4, 0, BadguyType.Boss, 800, 330, 1, 20)              
		];	
	}
	else if (Constants.boardLevel == 18) {
		this.setHeatMap("img/heatMapLevel18.png");
		this.setBackground("img/backgroundLevel18.png");
		
		this.badguys = [
	        //image src, width, height, offsetX, offsetY, frames, duration, badGuyType, startPositionX, startPositionY, health, experience) {			  
			new Sprite('img/goblin.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 705, 120, 1, 10),
			new Sprite('img/orc.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 620, 80, 1, 10),
			new Sprite('img/dragon.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 435, 120, 1, 10),
			new Sprite('img/halfling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 340, 140, 1, 10),
			new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 135, 180, 1, 10),
	        new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 125, 180, 1, 10),
			new Sprite('img/dwarf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 160, 220, 1, 10),
			new Sprite('img/catfolk.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 475, 100, 1, 10),
			new Sprite('img/dhampir.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 180, 200, 1, 10),
			new Sprite('img/drow.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 595, 300, 1, 10),
			new Sprite('img/fetchling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 200, 200, 1, 10),
			new Sprite(Constants.spritesheet[Constants.badguyPawn], 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 655, 100, 1, 10),
	        new Sprite(Constants.spritesheet[Constants.badguyBoss], 32, 32, 0, 128, 4, 0, BadguyType.Boss, 800, 330, 1, 20)              
		];	
	}
	else if (Constants.boardLevel == 19) {
		this.setHeatMap("img/heatMapLevel19.png");
		this.setBackground("img/backgroundLevel19.png");
		
		this.badguys = [
	        //image src, width, height, offsetX, offsetY, frames, duration, badGuyType, startPositionX, startPositionY, health, experience) {			  
			new Sprite('img/goblin.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 705, 120, 1, 10),
			new Sprite('img/orc.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 620, 80, 1, 10),
			new Sprite('img/dragon.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 435, 120, 1, 10),
			new Sprite('img/halfling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 340, 140, 1, 10),
			new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 135, 180, 1, 10),
	        new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 125, 180, 1, 10),
			new Sprite('img/dwarf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 160, 220, 1, 10),
			new Sprite('img/catfolk.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 475, 100, 1, 10),
			new Sprite('img/dhampir.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 180, 200, 1, 10),
			new Sprite('img/drow.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 595, 300, 1, 10),
			new Sprite('img/fetchling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 200, 200, 1, 10),
			new Sprite(Constants.spritesheet[Constants.badguyPawn], 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 655, 100, 1, 10),
	        new Sprite(Constants.spritesheet[Constants.badguyBoss], 32, 32, 0, 128, 4, 0, BadguyType.Boss, 800, 330, 1, 20)              
		];	
	}
	else if (Constants.boardLevel == 20) {
		this.setHeatMap("img/heatMapLevel20.png");
		this.setBackground("img/backgroundLevel20.png");
		
		this.badguys = [
	        //image src, width, height, offsetX, offsetY, frames, duration, badGuyType, startPositionX, startPositionY, health, experience) {			  
			new Sprite('img/goblin.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 705, 120, 1, 10),
			new Sprite('img/orc.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 620, 80, 1, 10),
			new Sprite('img/dragon.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 435, 120, 1, 10),
			new Sprite('img/halfling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 340, 140, 1, 10),
			new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 135, 180, 1, 10),
	        new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 125, 180, 1, 10),
			new Sprite('img/dwarf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 160, 220, 1, 10),
			new Sprite('img/catfolk.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 475, 100, 1, 10),
			new Sprite('img/dhampir.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 180, 200, 1, 10),
			new Sprite('img/drow.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 595, 300, 1, 10),
			new Sprite('img/fetchling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 200, 200, 1, 10),
			new Sprite(Constants.spritesheet[Constants.badguyPawn], 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 655, 100, 1, 10),
	        new Sprite(Constants.spritesheet[Constants.badguyBoss], 32, 32, 0, 128, 4, 0, BadguyType.Boss, 800, 330, 1, 20)              
		];	
	}
	else if (Constants.boardLevel == 21) {
		this.setHeatMap("img/heatMapLevel21.png");
		this.setBackground("img/backgroundLevel21.png");
		
		this.badguys = [
	        //image src, width, height, offsetX, offsetY, frames, duration, badGuyType, startPositionX, startPositionY, health, experience) {			  
			new Sprite('img/goblin.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 705, 120, 1, 10),
			new Sprite('img/orc.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 620, 80, 1, 10),
			new Sprite('img/dragon.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 435, 120, 1, 10),
			new Sprite('img/halfling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 340, 140, 1, 10),
			new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 135, 180, 1, 10),
	        new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 125, 180, 1, 10),
			new Sprite('img/dwarf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 160, 220, 1, 10),
			new Sprite('img/catfolk.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 475, 100, 1, 10),
			new Sprite('img/dhampir.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 180, 200, 1, 10),
			new Sprite('img/drow.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 595, 300, 1, 10),
			new Sprite('img/fetchling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 200, 200, 1, 10),
			new Sprite(Constants.spritesheet[Constants.badguyPawn], 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 655, 100, 1, 10),
	        new Sprite(Constants.spritesheet[Constants.badguyBoss], 32, 32, 0, 128, 4, 0, BadguyType.Boss, 800, 330, 1, 20)              
		];	
	}
	else if (Constants.boardLevel == 22) {
		this.setHeatMap("img/heatMapLevel22.png");
		this.setBackground("img/backgroundLevel22.png");
		
		this.badguys = [
	        //image src, width, height, offsetX, offsetY, frames, duration, badGuyType, startPositionX, startPositionY, health, experience) {			  
			new Sprite('img/goblin.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 705, 120, 1, 10),
			new Sprite('img/orc.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 620, 80, 1, 10),
			new Sprite('img/dragon.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 435, 120, 1, 10),
			new Sprite('img/halfling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 340, 140, 1, 10),
			new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 135, 180, 1, 10),
	        new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 125, 180, 1, 10),
			new Sprite('img/dwarf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 160, 220, 1, 10),
			new Sprite('img/catfolk.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 475, 100, 1, 10),
			new Sprite('img/dhampir.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 180, 200, 1, 10),
			new Sprite('img/drow.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 595, 300, 1, 10),
			new Sprite('img/fetchling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 200, 200, 1, 10),
			new Sprite(Constants.spritesheet[Constants.badguyPawn], 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 655, 100, 1, 10),
	        new Sprite(Constants.spritesheet[Constants.badguyBoss], 32, 32, 0, 128, 4, 0, BadguyType.Boss, 800, 330, 1, 20)              
		];	
	}
	else if (Constants.boardLevel == 23) {
		this.setHeatMap("img/heatMapLevel23.png");
		this.setBackground("img/backgroundLevel23.png");
		
		this.badguys = [
	        //image src, width, height, offsetX, offsetY, frames, duration, badGuyType, startPositionX, startPositionY, health, experience) {			  
			new Sprite('img/goblin.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 705, 120, 1, 10),
			new Sprite('img/orc.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 620, 80, 1, 10),
			new Sprite('img/dragon.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 435, 120, 1, 10),
			new Sprite('img/halfling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 340, 140, 1, 10),
			new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 135, 180, 1, 10),
	        new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 125, 180, 1, 10),
			new Sprite('img/dwarf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 160, 220, 1, 10),
			new Sprite('img/catfolk.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 475, 100, 1, 10),
			new Sprite('img/dhampir.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 180, 200, 1, 10),
			new Sprite('img/drow.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 595, 300, 1, 10),
			new Sprite('img/fetchling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 200, 200, 1, 10),
			new Sprite(Constants.spritesheet[Constants.badguyPawn], 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 655, 100, 1, 10),
	        new Sprite(Constants.spritesheet[Constants.badguyBoss], 32, 32, 0, 128, 4, 0, BadguyType.Boss, 800, 330, 1, 20)              
		];	
	}
	else if (Constants.boardLevel == 24) {
		this.setHeatMap("img/heatMapLevel24.png");
		this.setBackground("img/backgroundLevel24.png");
		
		this.badguys = [
	        //image src, width, height, offsetX, offsetY, frames, duration, badGuyType, startPositionX, startPositionY, health, experience) {			  
			new Sprite('img/goblin.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 705, 120, 1, 10),
			new Sprite('img/orc.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 620, 80, 1, 10),
			new Sprite('img/dragon.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 435, 120, 1, 10),
			new Sprite('img/halfling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 340, 140, 1, 10),
			new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 135, 180, 1, 10),
	        new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 125, 180, 1, 10),
			new Sprite('img/dwarf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 160, 220, 1, 10),
			new Sprite('img/catfolk.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 475, 100, 1, 10),
			new Sprite('img/dhampir.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 180, 200, 1, 10),
			new Sprite('img/drow.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 595, 300, 1, 10),
			new Sprite('img/fetchling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 200, 200, 1, 10),
			new Sprite(Constants.spritesheet[Constants.badguyPawn], 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 655, 100, 1, 10),
	        new Sprite(Constants.spritesheet[Constants.badguyBoss], 32, 32, 0, 128, 4, 0, BadguyType.Boss, 800, 330, 1, 20)              
		];	
	}
	else if (Constants.boardLevel == 25) {
		this.setHeatMap("img/heatMapLevel25.png");
		this.setBackground("img/backgroundLevel25.png");
		
		this.badguys = [
	        //image src, width, height, offsetX, offsetY, frames, duration, badGuyType, startPositionX, startPositionY, health, experience) {			  
			new Sprite('img/goblin.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 705, 120, 1, 10),
			new Sprite('img/orc.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 620, 80, 1, 10),
			new Sprite('img/dragon.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 435, 120, 1, 10),
			new Sprite('img/halfling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 340, 140, 1, 10),
			new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 135, 180, 1, 10),
	        new Sprite('img/elf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 125, 180, 1, 10),
			new Sprite('img/dwarf.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 160, 220, 1, 10),
			new Sprite('img/catfolk.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 475, 100, 1, 10),
			new Sprite('img/dhampir.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 180, 200, 1, 10),
			new Sprite('img/drow.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 595, 300, 1, 10),
			new Sprite('img/fetchling.png', 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 200, 200, 1, 10),
			new Sprite(Constants.spritesheet[Constants.badguyPawn], 32, 32, 0, 128, 4, 0, BadguyType.Pawn, 655, 100, 1, 10),
	        new Sprite(Constants.spritesheet[Constants.badguyBoss], 32, 32, 0, 128, 4, 0, BadguyType.Boss, 800, 330, 1, 20)              
		];	
	}	
	else {
		alert("YOU BEAT ALL THE LEVELS.  YOU BEAT THE GAME!!! GOOD JOB.");
	}
}

Game.prototype.caculateBadGuyPosition = function(badguy) {
    // line of sight? or maybe distance
	//var distance = this.pointDistance(badguy.Position.x, badguy.Position.y, this.hero.Position.x, this.hero.Position.y);
    //if (distance <= 50) {
	var bX = badguy.Position.x;
	var bY = badguy.Position.y;
	var hX = this.hero.Position.x;
	var hY = this.hero.Position.y;
	var futurePositionBX = bX;
	var futurePositionBY = bY;
	
	var changeFound = false;
	if (hX > bX && hY > bY) {
		if (this.isValidPath(badguy, 1, 1)) {
			futurePositionBX = bX+1;
			futurePositionBY = bY+1;
    			changeFound = true;			
		}
		else if (this.isValidPath(badguy, 0, 1)) {
			futurePositionBX = bX;
			futurePositionBY = bY+1;
    			changeFound = true;			
		}	
		else if (this.isValidPath(badguy, 1, 0)) {
			futurePositionBX = bX+1;
			futurePositionBY = bY;
    			changeFound = true;			
		}	
		else if (this.isValidPath(badguy, -1, -1)) {
			futurePositionBX = bX-1;
			futurePositionBY = bY-1;
    			changeFound = true;			
		}	
	}
	if (!changeFound && hX < bX && hY < bY) {
		if (this.isValidPath(badguy, -1, -1)) {
			futurePositionBX = bX-1;
			futurePositionBY = bY-1;
    			changeFound = true;			
		}
		else if (this.isValidPath(badguy, 0, -1)) {
			futurePositionBX = bX;
			futurePositionBY = bY-1;
    			changeFound = true;			
		}	
		else if (this.isValidPath(badguy, -1, 0)) {
			futurePositionBX = bX-1;
			futurePositionBY = bY;
    			changeFound = true;			
		}	
		else if (this.isValidPath(badguy, 1, 0)) {
			futurePositionBX = bX+1;
			futurePositionBY = bY;
    			changeFound = true;			
		}	
	}
	if (!changeFound && hX == bX && hY > bY) {
		if (this.isValidPath(badguy, 0, 1)) {
			futurePositionBX = bX;
			futurePositionBY = bY+1;
    			changeFound = true;			
		}
		else if (this.isValidPath(badguy, 1, 0)) {
			futurePositionBX = bX+1;
			futurePositionBY = bY;
    			changeFound = true;			
		}	
		else if (this.isValidPath(badguy, -1, 0)) {
			futurePositionBX = bX-1;
			futurePositionBY = bY;
    			changeFound = true;			
		}	
		else if (this.isValidPath(badguy, 0, -1)) {
			futurePositionBX = bX;
			futurePositionBY = bY-1;
    			changeFound = true;			
		}	
	}
	if (!changeFound && hX == bX && hY < bY) {	
		if (this.isValidPath(badguy, 0, -1)) {
			futurePositionBX = bX;
			futurePositionBY = bY-1;
    			changeFound = true;			
		}
		else if (this.isValidPath(badguy, 1, 0)) {
			futurePositionBX = bX+1;
			futurePositionBY = bY;
    			changeFound = true;			
		}	
		else if (this.isValidPath(badguy, -1, 0)) {
			futurePositionBX = bX+1;
			futurePositionBY = bY;
    			changeFound = true;			
		}	
		else if (this.isValidPath(badguy, 0, 1)) {
			futurePositionBX = bX;
			futurePositionBY = bY+1;
    			changeFound = true;			
		}	
	}	
	if (!changeFound && hX > bX && hY < bY) {
	    if (this.isValidPath(badguy, 1, -1)) {
			futurePositionBX = bX+1;
			futurePositionBY = bY-1;
    			changeFound = true;			
		}	
		else if (this.isValidPath(badguy, 1, 0)) {
			futurePositionBX = bX+1;
			futurePositionBY = bY;
    			changeFound = true;			
		}	
		else if (this.isValidPath(badguy, 0, +1)) {
			futurePositionBX = bX;
			futurePositionBY = bY+1;
    			changeFound = true;			
		}	
		else if (this.isValidPath(badguy, -1, 0)) {
			futurePositionBX = bX-1;
			futurePositionBY = bY;
    			changeFound = true;			
		}	
	}
	if (!changeFound && hX < bX && hY > bY) {
		if (this.isValidPath(badguy, -1, +1)) {
			futurePositionBX = bX-1;
			futurePositionBY = bY+1;
    			changeFound = true;			
		}	
		else if (this.isValidPath(badguy, -1, 0)) {
			futurePositionBX = bX-1;
			futurePositionBY = bY;
    			changeFound = true;			
		}	
		else if (this.isValidPath(badguy, 0, 1)) {
			futurePositionBX = bX;
			futurePositionBY = bY+1;
    			changeFound = true;			
		}	
		else if (this.isValidPath(badguy, 0, -1)) {
			futurePositionBX = bX;
			futurePositionBY = bY-1;
    			changeFound = true;			
		}	
	}
	if (!changeFound && hX > bX && hY == bY) {
		if (this.isValidPath(badguy, 1, 0)) {
			futurePositionBX = bX+1;
			futurePositionBY = bY;
    			changeFound = true;			
		}	
		else if (this.isValidPath(badguy, 0, 1)) {
			futurePositionBX = bX;
			futurePositionBY = bY+1;
    			changeFound = true;			
		}	
		else if (this.isValidPath(badguy, 0, -1)) {
			futurePositionBX = bX;
			futurePositionBY = bY-1;
    			changeFound = true;			
		}	
		else if (this.isValidPath(badguy, -1, 0)) {
			futurePositionBX = bX-1;
			futurePositionBY = bY;
    			changeFound = true;			
		}	
	}
	if (!changeFound && hX < bX && hY == bY) {
		if (this.isValidPath(badguy, -1, 0)) {
			futurePositionBX = bX-1;
			futurePositionBY = bY;
    			changeFound = true;			
		}	
		else if (this.isValidPath(badguy, 1, 0)) {
			futurePositionBX = bX+1;
			futurePositionBY = bY;
    			changeFound = true;			
		}	
		else if (this.isValidPath(badguy, 0, 1)) {
			futurePositionBX = bX;
			futurePositionBY = bY+1;
    			changeFound = true;			
		}	
		else if (this.isValidPath(badguy, 0, -1)) {
			futurePositionBX = bX;
			futurePositionBY = bY-1;
    			changeFound = true;			
		}	
	}
	
	this.setBadguyPosition(badguy, futurePositionBX, futurePositionBY);
	return badguy;
}

Game.prototype.setBadguyPosition = function(badguy, x,y) {
	badguy.Position.x = x;
    badguy.Position.y = y;
	badguy.setPosition(x, y);		
}