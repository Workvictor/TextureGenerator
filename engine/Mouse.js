function Mouse() {
	this.pressed = false;
	this.x = null;
	this.y = null;
	this.savedPosition = {x: null, y: null};
	
}

Mouse.prototype.getCords = function (object, event) {
	var rect = object.getBoundingClientRect();
	var x = event.clientX - rect.left;
	var y = event.clientY - rect.top;
	return {
		x: x,
		y: y
	}
};

Mouse.prototype.move = function (object, event) {
	this.x = this.getCords(object, event).x;
	this.y = this.getCords(object, event).y;
};


Mouse.prototype.click = function (object) {
	
	if (object.clickable) {
		if ((this.x > object.x && this.x < object.x + object.width &&
			this.y > object.y && this.y < object.y + object.height)) {
			object.onclick();
		}
	}
	
	
};

Mouse.prototype.onwheel = function (scale, event) {
	event.preventDefault();
	if (event.deltaY < 0) {
		console.log('-', scale);
		scale=0.5;
	}
	if (event.deltaY > 0) {
		console.log('+', scale);
	}
};

Mouse.prototype.down = function (event) {
	if (event.which == 1) {
		event.preventDefault();
		this.pressed = true;
	}
};

Mouse.prototype.up = function (event) {
	if (event.which == 1) {
		event.preventDefault();
		this.pressed = false;
	}
};

Mouse.prototype.contextMenu = function (event) {
	if (event.which == 3) {
		event.preventDefault();
	}
};

Mouse.prototype.savePosition = function (x, y) {
	this.savedPosition = {x: x, y: y};
};
