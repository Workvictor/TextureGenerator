function Display(width, height) {
	var parent = document.getElementById("canvas-container");
	var oldDisplay = document.getElementById("display");
	if(oldDisplay != undefined){
		parent.removeChild(oldDisplay);
	}
	this.img = document.createElement("canvas");
	this.img.id = 'display';
	this.img.width = width;
	this.img.height = height;
	parent.appendChild(this.img);

	this.ctx = this.img.getContext('2d');
	this.ctx.globalAlpha = 1;
	this.ctx.textBaseline = "top";
	this.ctx.textAlign = "start";
	this.ctx.font = "14px Arial";
}

Display.prototype.fadeScreen = function () {
	this.ctx.fillStyle = 'hsla(120, 50%, 2%, 0.15)';
	this.ctx.fillRect(0, 0, this.img.width, this.img.height);
};

Display.prototype.clearScreen = function () {
	this.ctx.clearRect(0, 0, this.img.width, this.img.height);
};

Display.prototype.setSize = function (width, height) {
	this.width = width;
	this.height = height;
};
