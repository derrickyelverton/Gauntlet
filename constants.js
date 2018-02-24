var BadguyType = {
	Pawn: 0,
	Boss: 1
};

var Direction = {
	LEFT: 0,
	RIGHT: 1,
	UP: 3,
	DOWN: 4
};

var Keys = {
	getDown: [],
	UP: 38,
	DOWN: 40,
	LEFT: 37,
	RIGHT: 39,
	A: 65,
	B: 66,
	C: 67,
	D: 68,
	E: 69,
	F: 70,
	G: 71,
	H: 72,
	I: 73,
	J: 74,
	K: 75,
	L: 76,
	M: 77,
	N: 78,
	O: 79,
	P: 80,
	Q: 81,
	R: 82,
	S: 83,
	T: 84,
	U: 85,
	V: 86,
	W: 87,
	X: 88,
	Y: 89,
	Z: 90,
	SPACE: 32,
	ENTER: 13,
	SHIFT: 16,
	CONTROL:17
}

var Action = {
	getAction: [],
	STANDING: 1,
	SITTING: 2,
	WALKING: 3,
	SHOOTING_FIREBALL: 4,
	PUNCH: 5,
	KICK: 6
}

var Constants = {
	
	lastRunTime: 0,
	lastSecond: 0,
	runTime: 0,
	boardLevel: 1,
	
	canvasWidth: 800,
	canvasHeight: 600,
	
	spritePositionX: 16,
	spritePositionY: 32,

	spritesheet : ['img/knight.png', 'img/badguyPawn.png', 'img/badguyBoss.png'],
	currentHero : 0,
	badguyPawn : 1,
	badguyBoss : 2,
	
	mapCurrentRow: 0,
	mapCurrentColumn: 0,
	map: [
	    ['img/Background1.png','img/Background7.png','img/Background13.png','img/Background19.png','img/Background25.png','img/Background31.png','img/Background37.png','img/Background43.png'],
	    ['img/Background2.png','img/Background8.png','img/Background14.png','img/Background20.png','img/Background26.png','img/Background32.png','img/Background38.png','img/Background44.png'],
	    ['img/Background3.png','img/Background9.png','img/Background15.png','img/Background21.png','img/Background27.png','img/Background33.png','img/Background39.png','img/Background45.png'],
	    ['img/Background4.png','img/Background10.png','img/Background16.png','img/Background22.png','img/Background28.png','img/Background34.png','img/Background40.png','img/Background46.png'],
	    ['img/Background5.png','img/Background11.png','img/Background17.png','img/Background23.png','img/Background29.png','img/Background35.png','img/Background41.png','img/Background47.png'],
	    ['img/Background6.png','img/Background12.png','img/Background18.png','img/Background24.png','img/Background30.png','img/Background36.png','img/Background42.png','img/Background48.png'],
	],
	
	mapHeatMap: [
	    ['img/BackgroundHeatMap1.png','img/BackgroundHeatMap7.png','img/BackgroundHeatMap13.png','img/BackgroundHeatMap19.png','img/BackgroundHeatMap25.png','img/BackgroundHeatMap31.png','img/BackgroundHeatMap37.png','img/BackgroundHeatMap43.png'],
	    ['img/BackgroundHeatMap2.png','img/BackgroundHeatMap8.png','img/BackgroundHeatMap14.png','img/BackgroundHeatMap20.png','img/BackgroundHeatMap26.png','img/BackgroundHeatMap32.png','img/BackgroundHeatMap38.png','img/BackgroundHeatMap44.png'],
	    ['img/BackgroundHeatMap3.png','img/BackgroundHeatMap9.png','img/BackgroundHeatMap15.png','img/BackgroundHeatMap21.png','img/BackgroundHeatMap27.png','img/BackgroundHeatMap33.png','img/BackgroundHeatMap39.png','img/BackgroundHeatMap45.png'],
	    ['img/BackgroundHeatMap4.png','img/BackgroundHeatMap10.png','img/BackgroundHeatMap16.png','img/BackgroundHeatMap22.png','img/BackgroundHeatMap28.png','img/BackgroundHeatMap34.png','img/BackgroundHeatMap40.png','img/BackgroundHeatMap46.png'],
	    ['img/BackgroundHeatMap5.png','img/BackgroundHeatMap11.png','img/BackgroundHeatMap17.png','img/BackgroundHeatMap23.png','img/BackgroundHeatMap29.png','img/BackgroundHeatMap35.png','img/BackgroundHeatMap41.png','img/BackgroundHeatMap47.png'],
	    ['img/BackgroundHeatMap6.png','img/BackgroundHeatMap12.png','img/BackgroundHeatMap18.png','img/BackgroundHeatMap24.png','img/BackgroundHeatMap30.png','img/BackgroundHeatMap36.png','img/BackgroundHeatMap42.png','img/BackgroundHeatMap48.png'],
	]
	

}

function ConstantUtils() {
		
};

ConstantUtils.prototype.pointDistance = function(aX, aY, bX, bY) {
	return this.distance(aX, bX) + this.distance(aY, bY);
}

ConstantUtils.prototype.distance = function(aX, bX) {
	return (aX > bX) ? Math.abs(aX - bX) : Math.abs(bX - aX); 
}

ConstantUtils.prototype.getColorAtPoint = function(context, x, y) {
	return context.getImageData(x, y, 1, 1).data;
}

ConstantUtils.prototype.clearCanvas = function(canvas, canvasWidth, canvasHeight) {
	canvas.clearRect(0, 0, canvasWidth, canvasHeight);
}

ConstantUtils.prototype.inArray = function(element, arr) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] === element) {
			return true;
		}
	}    
	return false;
}

ConstantUtils.prototype.removeFromArray = function(element, arr) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == element)
			arr.splice(i, 1);
	}
	return arr;
}