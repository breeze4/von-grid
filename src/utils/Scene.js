/*
	Sets up and manages a THREEjs container, camera, and light, making it easy to get going.
	Also provides camera control.

	Assumes full screen.
 */
// 'utils/Tools'
import * as THREE from 'three';
import {
	DirectionalLight, WebGLRenderer, Scene, AmbientLight,
	OrthographicCamera, PerspectiveCamera
} from 'three';

import OrbitControlsSetup from 'three-orbit-controls';
const OrbitControls = OrbitControlsSetup(THREE);

import Tools from './Tools';

const VgScene = function (sceneConfig, controlConfig) {
	var sceneSettings = {
		element: document.body,
		alpha: true,
		antialias: true,
		clearColor: '#fff',
		sortObjects: false,
		fog: null,
		light: new DirectionalLight(0xffffff),
		lightPosition: null,
		cameraType: 'PerspectiveCamera',
		cameraPosition: null, // {x, y, z}
		orthoZoom: 4
	};

	var controlSettings = {
		minDistance: 100,
		maxDistance: 1000,
		zoomSpeed: 2,
		noZoom: false
	};

	sceneSettings = Tools.merge(sceneSettings, sceneConfig);
	if (typeof controlConfig !== 'boolean') {
		controlSettings = Tools.merge(controlSettings, controlConfig);
	}

	this.renderer = new WebGLRenderer({
		alpha: sceneSettings.alpha,
		antialias: sceneSettings.antialias
	});
	this.renderer.setClearColor(sceneSettings.clearColor, 0);
	this.renderer.sortObjects = sceneSettings.sortObjects;

	this.width = window.innerWidth;
	this.height = window.innerHeight;

	this.orthoZoom = sceneSettings.orthoZoom;

	this.container = new Scene();
	this.container.fog = sceneSettings.fog;

	this.container.add(new AmbientLight(0xdddddd));

	if (!sceneSettings.lightPosition) {
		sceneSettings.light.position.set(-1, 1, -1).normalize();
	}
	this.container.add(sceneSettings.light);

	if (sceneSettings.cameraType === 'OrthographicCamera') {
		var width = window.innerWidth / this.orthoZoom;
		var height = window.innerHeight / this.orthoZoom;
		this.camera = new OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 5000);
	}
	else {
		this.camera = new PerspectiveCamera(50, this.width / this.height, 1, 5000);
	}

	this.contolled = !!controlConfig;
	if (this.contolled) {
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.minDistance = controlSettings.minDistance;
		this.controls.maxDistance = controlSettings.maxDistance;
		this.controls.zoomSpeed = controlSettings.zoomSpeed;
		this.controls.noZoom = controlSettings.noZoom;
	}

	if (sceneSettings.cameraPosition) {
		this.camera.position.copy(sceneSettings.cameraPosition);
	}

	window.addEventListener('resize', function onWindowResize() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		if (this.camera.type === 'OrthographicCamera') {
			var width = this.width / this.orthoZoom;
			var height = this.height / this.orthoZoom;
			this.camera.left = width / -2;
			this.camera.right = width / 2;
			this.camera.top = height / 2;
			this.camera.bottom = height / -2;
		}
		else {
			this.camera.aspect = this.width / this.height;
		}
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(this.width, this.height);
	}.bind(this), false);

	this.attachTo(sceneSettings.element);
};

VgScene.prototype = {

	attachTo: function (element) {
		element.style.width = this.width + 'px';
		element.style.height = this.height + 'px';
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(this.width, this.height);
		element.appendChild(this.renderer.domElement);
	},

	add: function (mesh) {
		this.container.add(mesh);
	},

	remove: function (mesh) {
		this.container.remove(mesh);
	},

	render: function () {
		if (this.contolled) this.controls.update();
		this.renderer.render(this.container, this.camera);
	},

	updateOrthoZoom: function () {
		if (this.orthoZoom <= 0) {
			this.orthoZoom = 0;
			return;
		}
		var width = this.width / this.orthoZoom;
		var height = this.height / this.orthoZoom;
		this.camera.left = width / -2;
		this.camera.right = width / 2;
		this.camera.top = height / 2;
		this.camera.bottom = height / -2;
		this.camera.updateProjectionMatrix();
	},

	focusOn: function (obj) {
		this.camera.lookAt(obj.position);
	}
};

VgScene.prototype.constructor = VgScene;

export default VgScene;