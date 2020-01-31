initImporter();
importScript('Display.js');
importScript('Map.js');
importScript('Mouse.js');


function main() {
	var running = false;
	var display;
	var map;
	var texture_size;
	var pixel_size;
	var smoothMax;
	var mouse = new Mouse();
	
	var color_input_group = document.getElementById("color_input_group");
	var ui_panel = document.getElementsByClassName("ui-panel")[0];
	
	var ui_index;
	var ui_close = document.getElementsByClassName("ui-close");
	for (ui_index = 0; ui_index < ui_close.length; ui_index++) {
		ui_close[ui_index].addEventListener('click', onGroupClose);
	}
	function onGroupClose(event) {
		color_input_group.removeChild(event.target.parentNode);
	}
	
	var ui_submit = document.getElementsByClassName("ui-submit");
	for (ui_index = 0; ui_index < ui_submit.length; ui_index++) {
		ui_submit[ui_index].addEventListener('click', onColorSubmit);
	}
	function onColorSubmit() {
		var color_panel_to_remove = event.target.parentNode.getElementsByClassName("ui-color-picker")[0];
		color_panel_to_remove.remove();
	}
	
	var color_input = document.getElementById("color_input");
	var color_preview = document.getElementById("color_preview");
	var gradient = document.getElementById("gradient");
	gradient.width = getComputedStyle(gradient).width.slice(0, -2);
	gradient.height = getComputedStyle(gradient).height.slice(0, -2);
	gradient.ctx = gradient.getContext('2d');
	var grad = gradient.ctx.createLinearGradient(0, 0, gradient.width, 0);
	grad.addColorStop(0, '#f00');
	grad.addColorStop(0.16, '#ff0');
	grad.addColorStop(0.33, '#0f0');
	grad.addColorStop(0.5, '#0ff');
	grad.addColorStop(0.66, '#00f');
	grad.addColorStop(0.83, '#f0f');
	grad.addColorStop(1, '#f00');
	gradient.ctx.fillStyle = grad;
	gradient.ctx.fillRect(0, 0, gradient.width, gradient.height);
	var grad2 = gradient.ctx.createLinearGradient(0, 0, 0, gradient.height);
	grad2.addColorStop(0, '#fff');
	grad2.addColorStop(0.4, 'transparent');
	grad2.addColorStop(0.5, 'transparent');
	grad2.addColorStop(0.6, 'transparent');
	grad2.addColorStop(1, '#000');
	gradient.ctx.fillStyle = grad2;
	gradient.ctx.fillRect(0, 0, gradient.width, gradient.height);
	var add_color_btn = document.getElementById("add_color_btn");
	add_color_btn.addEventListener('click', onAddColor);
	function onAddColor() {
		buildColorPickerUi();
	}
	
	function buildColorPickerUi() {
		
	}
	
	document.addEventListener('mouseup', onGradientPickRelease);
	function onGradientPickRelease() {
		if (slider_picker.picked)
			slider_picker.picked = false;
	}
	
	color_input.addEventListener('input', onColorInput);
	function onColorInput() {
		var rgba = color_input.value;
		colorPreviewSetBgColor(rgba);
	}
	
	gradient.addEventListener('mousedown', onGradientPick);
	function onGradientPick(event) {
		mouse.move(gradient, event);
		slider_picker.picked = true;
		pickerMove(mouse.x, mouse.y);
		pickColor(slider_picker.x, slider_picker.y);
	}
	
	gradient.addEventListener('mousemove', onGradientMove);
	function onGradientMove(event) {
		mouse.move(gradient, event);
		if (slider_picker.picked) {
			pickerMove(mouse.x, mouse.y);
			pickColor(slider_picker.x, slider_picker.y);
		}
	}
	
	function pickerMove(x, y) {
		slider_picker.x = x;
		slider_picker.y = y;
		slider_picker.style.left = slider_picker.x + 'px';
		slider_picker.style.top = slider_picker.y + 'px';
	}
	
	function pickColor(x, y) {
		var pixel = gradient.ctx.getImageData(x, y, 1, 1);
		var data = pixel.data;
		var rgba = 'rgba(' + data[0] + ', ' + data[1] +
			', ' + data[2] + ', ' + (data[3] / 255) + ')';
		colorPreviewSetBgColor(rgba);
	}
	
	function colorPreviewSetBgColor(rgba) {
		color_preview.style.backgroundColor = rgba;
		color_input.value = rgba;
	}
	
	var smooth_value_input = document.getElementById('smooth_value_input');
	var generate_btn = document.getElementById('generate_btn');
	var texture_size_input = document.getElementById('texture_size_input');
	var pixel_size_input = document.getElementById('pixel_size_input');
	var texture_size_selector = document.getElementsByClassName('texture_size');
	var save_btn = document.getElementById('save_btn');
	save_btn.setAttribute('download', 'imageName.png');
	
	var slider_picker = document.getElementById("slider_picker");
	slider_picker.picked = false;
	slider_picker.addEventListener('mousedown', onPickUp);
	function onPickUp() {
		slider_picker.picked = true;
	}
	
	displayInit();
	
	generate_btn.addEventListener('click', generateBtnClick);
	save_btn.addEventListener('click', saveBtnClick);
	
	for (var i = 0; i < texture_size_selector.length; i++) {
		texture_size_selector[i].addEventListener('click', onSelect);
		texture_size_selector[i].innerHTML = texture_size_selector[i].getAttribute('data-value');
	}
	function onSelect(event) {
		texture_size_input.value = event.target.getAttribute('data-value');
		displayInit();
	}
	
	function displayInit() {
		texture_size = texture_size_input.value;
		display = new Display(texture_size, texture_size);
	}
	
	function saveBtnClick() {
		save_btn.setAttribute('href', display.img.toDataURL());
	}
	
	function generateBtnClick() {
		save_btn.classList.add('btn-hide');
		smoothMax = smooth_value_input.value;
		pixel_size = pixel_size_input.value;
		running = true;
		map = new Map(texture_size, texture_size, pixel_size, smoothMax, 0.485);
		display.clearScreen();
	}
	
	
	cycle();
	function cycle() {
		if (running) {
			map.update(display);
			if (map.ready) {
				running = false;
				save_btn.classList.remove('btn-hide');
			}
		}
		window.requestAnimationFrame(cycle);
	}
}

function initEngine() {
	if (!window.requestAnimationFrame) {
		alert('Ой! Похоже Вы используете очень старый браузер. Чтобы продолжить обновите браузер.');
	} else {
		main();
	}
}

function importScript(name, fromDir) {
	var srcPathDefault = 'engine/';
	if (!fromDir) {
		fromDir = srcPathDefault;
	}
	
	if (typeof name === 'string') {
		var head = document.getElementsByTagName("head")[0];
		var scriptNode = document.createElement("script");
		scriptNode.src = fromDir + name;
		head.insertBefore(scriptNode, head.firstChild);
		
		var importCounter = new Event("importCounter");
		document.dispatchEvent(importCounter);
		
		scriptNode.onload = function () {
			var imported = new Event("imported");
			document.dispatchEvent(imported);
		}
	}
}

function initImporter() {
	var progress = 0;
	var loaded = 0;
	var total = 0;
	document.addEventListener("importCounter", onImportStart);
	document.addEventListener("imported", onImportProgress);
	function onImportStart() {
		total++;
	}
	
	function onImportProgress() {
		loaded++;
		progress = Math.floor((loaded / total) * 100);
		//удалить обработчики событий
		if (progress == 100) {
			document.removeEventListener("importCounter", onImportStart);
			document.removeEventListener("imported", onImportProgress);
			initEngine();
		}
		
	}
}