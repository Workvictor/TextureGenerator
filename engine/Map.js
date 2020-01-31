function Map(cols, rows, blockSize, smoothMax, density) {
	this.x = 0;
	this.y = 0;
	this.blockSize = blockSize;
	this.width = cols;
	this.height = rows;
	if (this.blockSize > 1) {
		this.width = cols / this.blockSize;
		this.height = rows / this.blockSize;
	}

	this.density = density;
	this.state = {EMPTY: 0, SOLID: 1};
	this.grid = [];
	this.filled = false;
	this.initIndex = 0;
	this.indexStep = 10;
	this.smoothIndex = 0;
	this.smoothMax = smoothMax;
	this.ready = false;
	this.color = {
		SOLID: '#000',
		EMPTY: '#fff'
	};
}

function Node(id, x, y, state, blockSize) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.state = state;
	this.size = blockSize;
	this.regionId = null;
	this.regionColor = null;
	this.regionEdge = false;
	this.activeElement = false;
}

Map.prototype.update = function (display) {
	if (this.initIndex < this.width && !this.filled) {
		this.initRandomColumn(display);
		if (!this.filled)
			this.initIndex += this.indexStep;
	}

	if (this.filled && this.smoothMax != 0 && !this.ready) {
		if (this.initIndex < this.width - 1) {
			this.smoothStepIndex(display);
		}
		this.initIndex += this.indexStep;
	}
	if ((this.smoothIndex == this.smoothMax || this.smoothMax == 0) && this.filled) this.ready = true;
	//if (!this.filled)
	//	this.initAllRandom(display);

};

Map.prototype.drawNode = function (elem, display) {
	var color;
	switch (elem.state) {
		case this.state.SOLID:
			color = this.color.SOLID;
			break;
		case this.state.EMPTY:
			color = this.color.EMPTY;
			break;
	}
	display.ctx.fillStyle = color;
	display.ctx.fillRect(elem.x * elem.size - this.x, elem.y * elem.size - this.y, elem.size, elem.size);
};

Map.prototype.addColor = function (key, value) {
	this.color[key] = value;
};

Map.prototype.initRandomColumn = function (display) {
	var state = null;
	for (var x = this.initIndex; x < this.initIndex + this.indexStep; x++) {
		this.grid.push([]);
		for (var y = 0; y < this.height; y++) {
			if (x == 0 || x == this.width - 1 ||
				y == 0 || y == this.height - 1) {
				state = this.state.SOLID;
			} else {
				state = this.randomElement();
			}
			// add element to the grid
			var id = y * this.width + x;
			this.grid[x][y] = new Node(id, x, y, state, this.blockSize);
			this.drawNode(this.grid[x][y], display);
		}
		if (x == this.width - 1) {
			this.initIndex = 1;
			this.filled = true;
		}
	}
};
Map.prototype.initAllRandom = function (display) {
	var state = null;
	for (var x = 0; x < this.width; x++) {
		this.grid.push([]);
		for (var y = 0; y < this.height; y++) {
			if (x == 0 || x == this.width - 1 ||
				y == 0 || y == this.height - 1) {
				state = this.state.SOLID;
			} else {
				state = this.randomElement();
			}
			// add element to the grid
			var id = y * this.width + x;
			this.grid[x][y] = new Node(id, x, y, state, this.blockSize);
			this.drawNode(this.grid[x][y], display);
		}
	}
	this.filled = true;
};

Map.prototype.randomElement = function () {
	if (Math.random() < this.density) {
		return this.state.SOLID;
	}
	else {
		return this.state.EMPTY;
	}
};
Map.prototype.smoothStepIndex = function (display) {
	if (this.smoothIndex < this.smoothMax) {
		for (var x = this.initIndex; x < this.initIndex + this.indexStep; x++) {
			for (var y = 1; y < this.height - 1; y++) {
				var elem = this.grid[x][y];
				var nCount = this.getNeighborsCount(x, y);
				if (nCount >= 5) {
					elem.state = this.state.SOLID;
				}
				if (nCount <= 3) {
					elem.state = this.state.EMPTY;
				}
				this.drawNode(this.grid[x][y], display);
			}
			if (x == this.width - 2) {
				this.initIndex = 1;
				this.smoothIndex++;
			}
		}
	}

};
Map.prototype.smooth = function (display) {
	for (var x = 1; x < this.width - 1; x++) {
		for (var y = 1; y < this.height - 1; y++) {
			var elem = this.grid[x][y];
			var nCount = this.getNeighborsCount(x, y);
			if (nCount >= 5) {
				elem.state = this.state.SOLID;
			}
			if (nCount <= 3) {
				elem.state = this.state.EMPTY;
			}
			this.drawNode(this.grid[x][y], display);
		}
	}
};
Map.prototype.getNeighborsCount = function (x, y) {
	var count = 0;
	for (var neighborX = x - 1; neighborX <= x + 1; neighborX++) {
		for (var neighborY = y - 1; neighborY <= y + 1; neighborY++) {
			if (neighborX >= 0 && neighborX < this.width && neighborY >= 0 && neighborY < this.height) {
				if (this.grid[neighborX][neighborY].state == this.state.SOLID) {
					if (!(neighborX == x && neighborY == y)) {
						count++;
						if (count > 4) {
							return count;
						}
					}
				}
			}
		}
	}
	return count;
};