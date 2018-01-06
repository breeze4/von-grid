(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("three"));
	else if(typeof define === 'function' && define.amd)
		define(["three"], factory);
	else if(typeof exports === 'object')
		exports["vonGrid"] = factory(require("three"));
	else
		root["vonGrid"] = factory(root["three"]);
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const tools = {
	clamp: function (val, min, max) {
		return Math.max(min, Math.min(max, val));
	},

	sign: function (val) {
		return val && val / Math.abs(val);
	},

	/**
	 * If one value is passed, it will return something from -val to val.
	 * Else it returns a value between the range specified by min, max.
	 */
	random: function (min, max) {
		if (arguments.length === 1) {
			return (Math.random() * min) - (min * 0.5);
		}
		return Math.random() * (max - min) + min;
	},

	// from min to (and including) max
	randomInt: function (min, max) {
		if (arguments.length === 1) {
			return (Math.random() * min) - (min * 0.5) | 0;
		}
		return (Math.random() * (max - min + 1) + min) | 0;
	},

	normalize: function (v, min, max) {
		return (v - min) / (max - min);
	},

	getShortRotation: function (angle) {
		angle %= this.TAU;
		if (angle > this.PI) {
			angle -= this.TAU;
		}
		else if (angle < -this.PI) {
			angle += this.TAU;
		}
		return angle;
	},

	generateID: function () {
		return Math.random().toString(36).slice(2) + Date.now();
	},

	isPlainObject: function (obj) {
		if (typeof (obj) !== 'object' || obj.nodeType || obj === obj.window) {
			return false;
		}
		// The try/catch suppresses exceptions thrown when attempting to access the 'constructor' property of certain host objects, ie. |window.location|
		// https://bugzilla.mozilla.org/show_bug.cgi?id=814622
		try {
			if (obj.constructor && !Object.prototype.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
				return false;
			}
		}
		catch (err) {
			return false;
		}
		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	},

	// https://github.com/KyleAMathews/deepmerge/blob/master/index.js
	merge: function (target, src) {
		var self = this, array = Array.isArray(src);
		var dst = array && [] || {};
		if (array) {
			target = target || [];
			dst = dst.concat(target);
			src.forEach(function (e, i) {
				if (typeof dst[i] === 'undefined') {
					dst[i] = e;
				}
				else if (self.isPlainObject(e)) {
					dst[i] = self.merge(target[i], e);
				}
				else {
					if (target.indexOf(e) === -1) {
						dst.push(e);
					}
				}
			});
			return dst;
		}
		if (target && self.isPlainObject(target)) {
			Object.keys(target).forEach(function (key) {
				dst[key] = target[key];
			});
		}
		Object.keys(src).forEach(function (key) {
			if (!src[key] || !self.isPlainObject(src[key])) {
				dst[key] = src[key];
			}
			else {
				if (!target[key]) {
					dst[key] = src[key];
				}
				else {
					dst[key] = self.merge(target[key], src[key]);
				}
			}
		});
		return dst;
	},

	now: function () {
		return window.nwf ? window.nwf.system.Performance.elapsedTime : window.performance.now();
	},

	empty: function (node) {
		while (node.lastChild) {
			node.removeChild(node.lastChild);
		}
	},

	/*
		@source: http://jsperf.com/radix-sort
	 */
	radixSort: function (arr, idxBegin, idxEnd, bit) {
		idxBegin = idxBegin || 0;
		idxEnd = idxEnd || arr.length;
		bit = bit || 31;
		if (idxBegin >= (idxEnd - 1) || bit < 0) {
			return;
		}
		var idx = idxBegin;
		var idxOnes = idxEnd;
		var mask = 0x1 << bit;
		while (idx < idxOnes) {
			if (arr[idx] & mask) {
				--idxOnes;
				var tmp = arr[idx];
				arr[idx] = arr[idxOnes];
				arr[idxOnes] = tmp;
			}
			else {
				++idx;
			}
		}
		this.radixSort(arr, idxBegin, idxOnes, bit - 1);
		this.radixSort(arr, idxOnes, idxEnd, bit - 1);
	},

	randomizeRGB: function (base, range) {
		var rgb = base.split(',');
		var color = 'rgb(';
		var i, c;
		range = this.randomInt(range);
		for (i = 0; i < 3; i++) {
			c = parseInt(rgb[i]) + range;
			if (c < 0) c = 0;
			else if (c > 255) c = 255;
			color += c + ',';
		}
		color = color.substring(0, color.length - 1);
		color += ')';
		return color;
	},

	getJSON: function (config) {
		var xhr = new XMLHttpRequest();
		var cache = typeof config.cache === 'undefined' ? false : config.cache;
		var uri = cache ? config.url : config.url + '?t=' + Math.floor(Math.random() * 10000) + Date.now();
		xhr.onreadystatechange = function () {
			if (this.status === 200) {
				var json = null;
				try {
					json = JSON.parse(this.responseText);
				}
				catch (err) {
					// console.warn('[Tools.getJSON] Error: '+config.url+' is not a json resource');
					return;
				}
				config.callback.call(config.scope || null, json);
				return;
			}
			else if (this.status !== 0) {
				console.warn('[Tools.getJSON] Error: ' + this.status + ' (' + this.statusText + ') :: ' + config.url);
			}
		}
		xhr.open('GET', uri, true);
		xhr.setRequestHeader('Accept', 'application/json');
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send('');
	}
};

/* harmony default export */ __webpack_exports__["a"] = (tools);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const VERSION = '0.1.1';
/* unused harmony export VERSION */


const PI = Math.PI;
/* harmony export (immutable) */ __webpack_exports__["c"] = PI;

const TAU = Math.PI * 2;
/* harmony export (immutable) */ __webpack_exports__["f"] = TAU;

const DEG_TO_RAD = 0.0174532925;
/* harmony export (immutable) */ __webpack_exports__["a"] = DEG_TO_RAD;

const RAD_TO_DEG = 57.2957795;
/* unused harmony export RAD_TO_DEG */

const SQRT3 = Math.sqrt(3);
/* harmony export (immutable) */ __webpack_exports__["e"] = SQRT3;
 // used often in hex conversions

// useful enums for type checking. change to whatever fits your game. these are just examples
const TILE = 'tile';
/* harmony export (immutable) */ __webpack_exports__["g"] = TILE;
 // visual representation of a grid cell
const ENT = 'entity';
/* unused harmony export ENT */
 // dynamic things
const STR = 'structure';
/* unused harmony export STR */
 // static things

const HEX = 'hex';
/* harmony export (immutable) */ __webpack_exports__["b"] = HEX;

const SQR = 'square';
/* harmony export (immutable) */ __webpack_exports__["d"] = SQR;

const ABS = 'abstract';
/* unused harmony export ABS */



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_LinkedList__ = __webpack_require__(4);


/*
	Simple structure for holding grid coordinates and extra data about them.

	@author Corey Birnbaum https://github.com/vonWolfehaus/
*/

const Cell = function(q, r, s, h) {
	this.q = q || 0; // x grid coordinate (using different letters so that it won't be confused with pixel/world coordinates)
	this.r = r || 0; // y grid coordinate
	this.s = s || 0; // z grid coordinate
	this.h = h || 1; // 3D height of the cell, used by visual representation and pathfinder, cannot be less than 1
	this.tile = null; // optional link to the visual representation's class instance
	this.userData = {}; // populate with any extra data needed in your game
	this.walkable = true; // if true, pathfinder will use as a through node
	// rest of these are used by the pathfinder and overwritten at runtime, so don't touch
	this._calcCost = 0;
	this._priority = 0;
	this._visited = false;
	this._parent = null;
	this.uniqueID = __WEBPACK_IMPORTED_MODULE_0__lib_LinkedList__["a" /* default */].generateID();
};

Cell.prototype = {
	set: function(q, r, s) {
		this.q = q;
		this.r = r;
		this.s = s;
		return this;
	},

	copy: function(cell) {
		this.q = cell.q;
		this.r = cell.r;
		this.s = cell.s;
		this.h = cell.h;
		this.tile = cell.tile || null;
		this.userData = cell.userData || {};
		this.walkable = cell.walkable;
		return this;
	},

	add: function(cell) {
		this.q += cell.q;
		this.r += cell.r;
		this.s += cell.s;
		return this;
	},

	equals: function(cell) {
		return this.q === cell.q && this.r === cell.r && this.s === cell.s;
	}
};

Cell.prototype.constructor = Cell;

/* harmony default export */ __webpack_exports__["a"] = (Cell);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/*
	A high-speed doubly-linked list of objects. Note that for speed reasons (using a dictionary lookup of
	cached nodes) there can only be a single instance of an object in the list at the same time. Adding the same
	object a second time will result in a silent return from the add method.

	In order to keep a track of node links, an object must be able to identify itself with a uniqueID function.

	To add an item use:
	<pre><code>
		list.add(newItem);
	</code></pre>
	<p>
	You can iterate using the first and next members, such as:
	<pre><code>
		var node = list.first;
		while (node)
		{
			node.object().DOSOMETHING();
			node = node.next();
		}
	</code></pre>
 */

var LinkedListNode = function () {
	this.obj = null;
	this.next = null;
	this.prev = null;
	this.free = true;
};

var LinkedList = function () {
	this.first = null;
	this.last = null;
	this.length = 0;
	this.objToNodeMap = {}; // a quick lookup list to map linked list nodes to objects
	this.uniqueID = Date.now() + '' + Math.floor(Math.random() * 1000);

	this.sortArray = [];
};

// static function for utility
LinkedList.generateID = function () {
	return Math.random().toString(36).slice(2) + Date.now();
};

LinkedList.prototype = {
	/*
		Get the LinkedListNode for this object.
		@param obj The object to get the node for
	 */
	getNode: function (obj) {
		// objects added to a list must implement a uniqueID which returns a unique object identifier string
		return this.objToNodeMap[obj.uniqueID];
	},

	/*
		Adds a new node to the list -- typically only used internally unless you're doing something funky
		Use add() to add an object to the list, not this.
	 */
	addNode: function (obj) {
		var node = new LinkedListNode();
		if (!obj.uniqueID) {
			try {
				obj.uniqueID = LinkedList.generateID();
				// console.log('New ID: '+obj.uniqueID);
			}
			catch (err) {
				console.error('[LinkedList.addNode] obj passed is immutable: cannot attach necessary identifier');
				return null;
			}
		}

		node.obj = obj;
		node.free = false;
		this.objToNodeMap[obj.uniqueID] = node;
		return node;
	},

	swapObjects: function (node, newObj) {
		this.objToNodeMap[node.obj.uniqueID] = null;
		this.objToNodeMap[newObj.uniqueID] = node;
		node.obj = newObj;
	},

	/*
		Add an item to the list
		@param obj The object to add
	 */
	add: function (obj) {
		var node = this.objToNodeMap[obj.uniqueID];

		if (!node) {
			node = this.addNode(obj);
		}
		else {
			if (node.free === false) return;

			// reusing a node, so we clean it up
			// this caching of node/object pairs is the reason an object can only exist
			// once in a list -- which also makes things faster (not always creating new node
			// object every time objects are moving on and off the list
			node.obj = obj;
			node.free = false;
			node.next = null;
			node.prev = null;
		}

		// append this obj to the end of the list
		if (!this.first) { // is this the first?
			this.first = node;
			this.last = node;
			node.next = null; // clear just in case
			node.prev = null;
		}
		else {
			if (!this.last) {
				throw new Error("[LinkedList.add] No last in the list -- that shouldn't happen here");
			}

			// add this entry to the end of the list
			this.last.next = node; // current end of list points to the new end
			node.prev = this.last;
			this.last = node;            // new object to add becomes last in the list
			node.next = null;      // just in case this was previously set
		}
		this.length++;

		if (this.showDebug) this.dump('after add');
	},

	has: function (obj) {
		return !!this.objToNodeMap[obj.uniqueID];
	},

	/*
		Moves this item upwards in the list
		@param obj
	 */
	moveUp: function (obj) {
		this.dump('before move up');
		var c = this.getNode(obj);
		if (!c) throw "Oops, trying to move an object that isn't in the list";
		if (!c.prev) return; // already first, ignore

		// This operation makes C swap places with B:
		// A <-> B <-> C <-> D
		// A <-> C <-> B <-> D

		var b = c.prev;
		var a = b.prev;

		// fix last
		if (c == this.last) this.last = b;

		var oldCNext = c.next;

		if (a) a.next = c;
		c.next = b;
		c.prev = b.prev;

		b.next = oldCNext;
		b.prev = c;

		// check to see if we are now first
		if (this.first == b) this.first = c;
	},

	/*
		Moves this item downwards in the list
		@param obj
	 */
	moveDown: function (obj) {
		var b = this.getNode(obj);
		if (!b) throw "Oops, trying to move an object that isn't in the list";
		if (!b.next) return; // already last, ignore

		// This operation makes B swap places with C:
		// A <-> B <-> C <-> D
		// A <-> C <-> B <-> D

		var c = b.next;
		this.moveUp(c.obj);

		// check to see if we are now last
		if (this.last == c) this.last = b;
	},

	/*
		Take everything off the list and put it in an array, sort it, then put it back.
	 */
	sort: function (compare) {
		var sortArray = this.sortArray;
		var i, l, node = this.first;
		sortArray.length = 0;

		while (node) {
			sortArray.push(node.obj);
			node = node.next;
		}

		this.clear();

		sortArray.sort(compare);
		// console.log(sortArray);
		l = sortArray.length;
		for (i = 0; i < l; i++) {
			this.add(sortArray[i]);
		}
	},

	/*
		Removes an item from the list
		@param obj The object to remove
		@returns boolean true if the item was removed, false if the item was not on the list
	 */
	remove: function (obj) {
		var node = this.getNode(obj);
		if (!node || node.free) {
			return false; // ignore this error (trying to remove something not there)
		}

		// pull this object out and tie up the ends
		if (node.prev) node.prev.next = node.next;
		if (node.next) node.next.prev = node.prev;

		// fix first and last
		if (!node.prev) // if this was first on the list
			this.first = node.next; // make the next on the list first (can be null)
		if (!node.next) // if this was the last
			this.last = node.prev; // then this node's previous becomes last

		node.free = true;
		node.prev = null;
		node.next = null;

		this.length--;

		return true;
	},

	// remove the head and return it's object
	shift: function () {
		var node = this.first;
		if (this.length === 0) return null;
		// if (node == null || node.free == true) return null;

		// pull this object out and tie up the ends
		if (node.prev) {
			node.prev.next = node.next;
		}
		if (node.next) {
			node.next.prev = node.prev;
		}

		// make the next on the list first (can be null)
		this.first = node.next;
		if (!node.next) this.last = null; // make sure we clear this

		node.free = true;
		node.prev = null;
		node.next = null;

		this.length--;
		return node.obj;
	},

	// remove the tail and return it's object
	pop: function () {
		var node = this.last;
		if (this.length === 0) return null;

		// pull this object out and tie up the ends
		if (node.prev) {
			node.prev.next = node.next;
		}
		if (node.next) {
			node.next.prev = node.prev;
		}

		// this node's previous becomes last
		this.last = node.prev;
		if (!node.prev) this.first = null; // make sure we clear this

		node.free = true;
		node.prev = null;
		node.next = null;

		this.length--;
		return node.obj;
	},

	/**
	 * Add the passed list to this list, leaving it untouched.
	 */
	concat: function (list) {
		var node = list.first;
		while (node) {
			this.add(node.obj);
			node = node.next;
		}
	},

	/**
	 * Clears the list out
	 */
	clear: function () {
		var next = this.first;

		while (next) {
			next.free = true;
			next = next.next;
		}

		this.first = null;
		this.length = 0;
	},

	dispose: function () {
		var next = this.first;

		while (next) {
			next.obj = null;
			next = next.next;
		}
		this.first = null;

		this.objToNodeMap = null;
	},

	/*
		Outputs the contents of the current list for debugging.
	 */
	dump: function (msg) {
		console.log('====================' + msg + '=====================');
		var a = this.first;
		while (a) {
			console.log("{" + a.obj.toString() + "} previous=" + (a.prev ? a.prev.obj : "NULL"));
			a = a.next();
		}
		console.log("===================================");
		console.log("Last: {" + (this.last ? this.last.obj : 'NULL') + "} " +
			"First: {" + (this.first ? this.first.obj : 'NULL') + "}");
	}
};

LinkedList.prototype.constructor = LinkedList;

/* harmony default export */ __webpack_exports__["a"] = (LinkedList);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_three__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_three___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_three__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__constants__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_Tools__ = __webpack_require__(1);
/*
	Example tile class that constructs its geometry for rendering and holds some gameplay properties.

	@author Corey Birnbaum https://github.com/vonWolfehaus/
*/






const Tile = function (config) {
	config = config || {};
	var settings = {
		cell: null, // required Cell
		geometry: null, // required threejs geometry
		material: null // not required but it would improve performance significantly
	};
	settings = __WEBPACK_IMPORTED_MODULE_2__utils_Tools__["a" /* default */].merge(settings, config);

	if (!settings.cell || !settings.geometry) {
		throw new Error('Missing Tile configuration');
	}

	this.cell = settings.cell;
	if (this.cell.tile && this.cell.tile !== this) this.cell.tile.dispose(); // remove whatever was there
	this.cell.tile = this;

	this.uniqueID = __WEBPACK_IMPORTED_MODULE_2__utils_Tools__["a" /* default */].generateID();

	this.geometry = settings.geometry;
	this.material = settings.material;
	if (!this.material) {
		this.material = new __WEBPACK_IMPORTED_MODULE_0_three__["MeshPhongMaterial"]({
			color: __WEBPACK_IMPORTED_MODULE_2__utils_Tools__["a" /* default */].randomizeRGB('30, 30, 30', 13)
		});
	}

	this.objectType = __WEBPACK_IMPORTED_MODULE_1__constants__["g" /* TILE */];
	this.entity = null;
	this.userData = {};

	this.selected = false;
	this.highlight = '0x0084cc';

	this.mesh = new __WEBPACK_IMPORTED_MODULE_0_three__["Mesh"](this.geometry, this.material);
	this.mesh.userData.structure = this;

	// create references so we can control orientation through this (Tile), instead of drilling down
	this.position = this.mesh.position;
	this.rotation = this.mesh.rotation;

	// rotate it to face "up" (the threejs coordinate space is Y+)
	this.rotation.x = -90 * __WEBPACK_IMPORTED_MODULE_1__constants__["a" /* DEG_TO_RAD */];
	this.mesh.scale.set(settings.scale, settings.scale, 1);

	if (this.material.emissive) {
		this._emissive = this.material.emissive.getHex();
	}
	else {
		this._emissive = null;
	}
};

Tile.prototype = {
	select: function () {
		if (this.material.emissive) {
			this.material.emissive.setHex(this.highlight);
		}
		this.selected = true;
		return this;
	},

	deselect: function () {
		if (this._emissive !== null && this.material.emissive) {
			this.material.emissive.setHex(this._emissive);
		}
		this.selected = false;
		return this;
	},

	toggle: function () {
		if (this.selected) {
			this.deselect();
		}
		else {
			this.select();
		}
		return this;
	},

	dispose: function () {
		if (this.cell && this.cell.tile) this.cell.tile = null;
		this.cell = null;
		this.position = null;
		this.rotation = null;
		if (this.mesh.parent) this.mesh.parent.remove(this.mesh);
		this.mesh.userData.structure = null;
		this.mesh = null;
		this.material = null;
		this.userData = null;
		this.entity = null;
		this.geometry = null;
		this._emissive = null;
	}
};

Tile.prototype.constructor = Tile;

/* harmony default export */ __webpack_exports__["a"] = (Tile);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__grids_HexGrid__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__grids_SqrGrid__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_Scene__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Board__ = __webpack_require__(10);







var vg = { // eslint-disable-line
	HexGrid: __WEBPACK_IMPORTED_MODULE_0__grids_HexGrid__["a" /* default */], SqrGrid: __WEBPACK_IMPORTED_MODULE_1__grids_SqrGrid__["a" /* default */], Scene: __WEBPACK_IMPORTED_MODULE_2__utils_Scene__["a" /* default */], Board: __WEBPACK_IMPORTED_MODULE_3__Board__["a" /* default */]
};

/* harmony default export */ __webpack_exports__["default"] = (vg);

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_three__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_three___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_three__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__constants__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_Tools__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Cell__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Tile__ = __webpack_require__(5);
/*
	Graph of hexagons. Handles grid cell management (placement math for eg pathfinding, range, etc) and grid conversion math.
	[Cube/axial coordinate system](http://www.redblobgames.com/grids/hexagons/), "flat top" version only. Since this is 3D, just rotate your camera for pointy top maps.
	Interface:
	type
	size - number of cells (in radius); only used if the map is generated
	cellSize
	cells - a hash so we can have sparse maps
	numCells
	extrudeSettings
	autogenerated
	cellShape
	cellGeo
	cellShapeGeo

	@author Corey Birnbaum https://github.com/vonWolfehaus/
 */
// 'utils/Loader', 'graphs/Hex', 'utils/Tools'








const HexGrid = function (config) {
	config = config || {};
	/*  ______________________________________________
		GRID INTERFACE:
	*/
	this.type = __WEBPACK_IMPORTED_MODULE_1__constants__["b" /* HEX */];
	this.size = 5; // only used for generated maps
	this.cellSize = typeof config.cellSize === 'undefined' ? 10 : config.cellSize;
	this.cells = {};
	this.numCells = 0;

	this.extrudeSettings = null;
	this.autogenerated = false;

	// create base shape used for building geometry
	var i, verts = [];
	// create the skeleton of the hex
	for (i = 0; i < 6; i++) {
		verts.push(this._createVertex(i));
	}
	// copy the verts into a shape for the geometry to use
	this.cellShape = new __WEBPACK_IMPORTED_MODULE_0_three__["Shape"]();
	this.cellShape.moveTo(verts[0].x, verts[0].y);
	for (i = 1; i < 6; i++) {
		this.cellShape.lineTo(verts[i].x, verts[i].y);
	}
	this.cellShape.lineTo(verts[0].x, verts[0].y);
	this.cellShape.autoClose = true;

	this.cellGeo = new __WEBPACK_IMPORTED_MODULE_0_three__["Geometry"]();
	this.cellGeo.vertices = verts;
	this.cellGeo.verticesNeedUpdate = true;

	this.cellShapeGeo = new __WEBPACK_IMPORTED_MODULE_0_three__["ShapeGeometry"](this.cellShape);

	/*  ______________________________________________
		PRIVATE
	*/

	this._cellWidth = this.cellSize * 2;
	this._cellLength = (__WEBPACK_IMPORTED_MODULE_1__constants__["e" /* SQRT3 */] * 0.5) * this._cellWidth;
	this._hashDelimeter = '.';
	// pre-computed permutations
	this._directions = [new __WEBPACK_IMPORTED_MODULE_3__Cell__["a" /* default */](+1, -1, 0), new __WEBPACK_IMPORTED_MODULE_3__Cell__["a" /* default */](+1, 0, -1), new __WEBPACK_IMPORTED_MODULE_3__Cell__["a" /* default */](0, +1, -1),
	new __WEBPACK_IMPORTED_MODULE_3__Cell__["a" /* default */](-1, +1, 0), new __WEBPACK_IMPORTED_MODULE_3__Cell__["a" /* default */](-1, 0, +1), new __WEBPACK_IMPORTED_MODULE_3__Cell__["a" /* default */](0, -1, +1)];
	this._diagonals = [new __WEBPACK_IMPORTED_MODULE_3__Cell__["a" /* default */](+2, -1, -1), new __WEBPACK_IMPORTED_MODULE_3__Cell__["a" /* default */](+1, +1, -2), new __WEBPACK_IMPORTED_MODULE_3__Cell__["a" /* default */](-1, +2, -1),
	new __WEBPACK_IMPORTED_MODULE_3__Cell__["a" /* default */](-2, +1, +1), new __WEBPACK_IMPORTED_MODULE_3__Cell__["a" /* default */](-1, -1, +2), new __WEBPACK_IMPORTED_MODULE_3__Cell__["a" /* default */](+1, -2, +1)];
	// cached objects
	this._list = [];
	this._vec3 = new __WEBPACK_IMPORTED_MODULE_0_three__["Vector3"]();
	this._cel = new __WEBPACK_IMPORTED_MODULE_3__Cell__["a" /* default */]();
	this._conversionVec = new __WEBPACK_IMPORTED_MODULE_0_three__["Vector3"]();
	this._geoCache = [];
	this._matCache = [];
};

HexGrid.TWO_THIRDS = 2 / 3;

HexGrid.prototype = {
	/*  ________________________________________________________________________
		High-level functions that the Board interfaces with (all grids implement)
	 */

	// grid cell (Hex in cube coordinate space) to position in pixels/world
	cellToPixel: function (cell) {
		this._vec3.x = cell.q * this._cellWidth * 0.75;
		this._vec3.y = cell.h;
		this._vec3.z = -((cell.s - cell.r) * this._cellLength * 0.5);
		return this._vec3;
	},

	pixelToCell: function (pos) {
		// convert a position in world space ("pixels") to cell coordinates
		var q = pos.x * (HexGrid.TWO_THIRDS / this.cellSize);
		var r = ((-pos.x / 3) + (__WEBPACK_IMPORTED_MODULE_1__constants__["e" /* SQRT3 */] / 3) * pos.z) / this.cellSize;
		this._cel.set(q, r, -q - r);
		return this._cubeRound(this._cel);
	},

	getCellAt: function (pos) {
		// get the Cell (if any) at the passed world position
		var q = pos.x * (HexGrid.TWO_THIRDS / this.cellSize);
		var r = ((-pos.x / 3) + (__WEBPACK_IMPORTED_MODULE_1__constants__["e" /* SQRT3 */] / 3) * pos.z) / this.cellSize;
		this._cel.set(q, r, -q - r);
		this._cubeRound(this._cel);
		return this.cells[this.cellToHash(this._cel)];
	},

	getNeighbors: function (cell, diagonal, filter) {
		// always returns an array
		var i, n, l = this._directions.length;
		this._list.length = 0;
		for (i = 0; i < l; i++) {
			this._cel.copy(cell);
			this._cel.add(this._directions[i]);
			n = this.cells[this.cellToHash(this._cel)];
			if (!n || (filter && !filter(cell, n))) {
				continue;
			}
			this._list.push(n);
		}
		if (diagonal) {
			for (i = 0; i < l; i++) {
				this._cel.copy(cell);
				this._cel.add(this._diagonals[i]);
				n = this.cells[this.cellToHash(this._cel)];
				if (!n || (filter && !filter(cell, n))) {
					continue;
				}
				this._list.push(n);
			}
		}
		return this._list;
	},

	getRandomCell: function () {
		var c, i = 0, x = __WEBPACK_IMPORTED_MODULE_2__utils_Tools__["a" /* default */].randomInt(0, this.numCells);
		for (c in this.cells) {
			if (i === x) {
				return this.cells[c];
			}
			i++;
		}
		return this.cells[c];
	},

	cellToHash: function (cell) {
		return cell.q + this._hashDelimeter + cell.r + this._hashDelimeter + cell.s;
	},

	distance: function (cellA, cellB) {
		var d = Math.max(Math.abs(cellA.q - cellB.q), Math.abs(cellA.r - cellB.r), Math.abs(cellA.s - cellB.s));
		d += cellB.h - cellA.h; // include vertical height
		return d;
	},

	clearPath: function () {
		var i, c;
		for (i in this.cells) {
			c = this.cells[i];
			c._calcCost = 0;
			c._priority = 0;
			c._parent = null;
			c._visited = false;
		}
	},

	traverse: function (cb) {
		var i;
		for (i in this.cells) {
			cb(this.cells[i]);
		}
	},

	generateTile: function (cell, scale, material) {
		var height = Math.abs(cell.h);
		if (height < 1) height = 1;

		var geo = this._geoCache[height];
		if (!geo) {
			this.extrudeSettings.amount = height;
			geo = new __WEBPACK_IMPORTED_MODULE_0_three__["ExtrudeGeometry"](this.cellShape, this.extrudeSettings);
			this._geoCache[height] = geo;
		}

		/*mat = this._matCache[c.matConfig.mat_cache_id];
		if (!mat) { // MaterialLoader? we currently only support basic stuff though. maybe later
			mat.map = Loader.loadTexture(c.matConfig.imgURL);
			delete c.matConfig.imgURL;
			mat = new THREE[c.matConfig.type](c.matConfig);
			this._matCache[c.matConfig.mat_cache_id] = mat;
		}*/

		var tile = new __WEBPACK_IMPORTED_MODULE_4__Tile__["a" /* default */]({
			size: this.cellSize,
			scale: scale,
			cell: cell,
			geometry: geo,
			material: material
		});

		cell.tile = tile;

		return tile;
	},

	generateTiles: function (config) {
		config = config || {};
		var tiles = [];
		var settings = {
			tileScale: 0.95,
			cellSize: this.cellSize,
			material: null,
			extrudeSettings: {
				amount: 1,
				bevelEnabled: true,
				bevelSegments: 1,
				steps: 1,
				bevelSize: 0.5,
				bevelThickness: 0.5
			}
		}
		settings = __WEBPACK_IMPORTED_MODULE_2__utils_Tools__["a" /* default */].merge(settings, config);

		/*if (!settings.material) {
			settings.material = new MeshPhongMaterial({
				color: Tools.randomizeRGB('30, 30, 30', 10)
			});
		}*/

		// overwrite with any new dimensions
		this.cellSize = settings.cellSize;
		this._cellWidth = this.cellSize * 2;
		this._cellLength = (__WEBPACK_IMPORTED_MODULE_1__constants__["e" /* SQRT3 */] * 0.5) * this._cellWidth;

		this.autogenerated = true;
		this.extrudeSettings = settings.extrudeSettings;

		var i, t, c;
		for (i in this.cells) {
			c = this.cells[i];
			t = this.generateTile(c, settings.tileScale, settings.material);
			t.position.copy(this.cellToPixel(c));
			t.position.y = 0;
			tiles.push(t);
		}
		return tiles;
	},

	generateTilePoly: function (material) {
		if (!material) {
			material = new __WEBPACK_IMPORTED_MODULE_0_three__["MeshBasicMaterial"]({ color: 0x24b4ff });
		}
		var mesh = new __WEBPACK_IMPORTED_MODULE_0_three__["Mesh"](this.cellShapeGeo, material);
		this._vec3.set(1, 0, 0);
		mesh.rotateOnAxis(this._vec3, __WEBPACK_IMPORTED_MODULE_1__constants__["c" /* PI */] / 2);
		return mesh;
	},

	// create a flat, hexagon-shaped grid
	generate: function (config) {
		config = config || {};
		this.size = typeof config.size === 'undefined' ? this.size : config.size;
		var x, y, z, c;
		for (x = -this.size; x < this.size + 1; x++) {
			for (y = -this.size; y < this.size + 1; y++) {
				z = -x - y;
				if (Math.abs(x) <= this.size && Math.abs(y) <= this.size && Math.abs(z) <= this.size) {
					c = new __WEBPACK_IMPORTED_MODULE_3__Cell__["a" /* default */](x, y, z);
					this.add(c);
				}
			}
		}
	},

	generateOverlay: function (size, overlayObj, overlayMat) {
		var x, y, z;
		var geo = this.cellShape.createPointsGeometry();
		for (x = -size; x < size + 1; x++) {
			for (y = -size; y < size + 1; y++) {
				z = -x - y;
				if (Math.abs(x) <= size && Math.abs(y) <= size && Math.abs(z) <= size) {
					this._cel.set(x, y, z); // define the cell
					var line = new __WEBPACK_IMPORTED_MODULE_0_three__["Line"](geo, overlayMat);
					line.position.copy(this.cellToPixel(this._cel));
					line.rotation.x = 90 * __WEBPACK_IMPORTED_MODULE_1__constants__["a" /* DEG_TO_RAD */];
					overlayObj.add(line);
				}
			}
		}
	},

	add: function (cell) {
		var h = this.cellToHash(cell);
		if (this.cells[h]) {
			// console.warn('A cell already exists there');
			return;
		}
		this.cells[h] = cell;
		this.numCells++;

		return cell;
	},

	remove: function (cell) {
		var h = this.cellToHash(cell);
		if (this.cells[h]) {
			delete this.cells[h];
			this.numCells--;
		}
	},

	dispose: function () {
		this.cells = null;
		this.numCells = 0;
		this.cellShape = null;
		this.cellGeo.dispose();
		this.cellGeo = null;
		this.cellShapeGeo.dispose();
		this.cellShapeGeo = null;
		this._list = null;
		this._vec3 = null;
		this._conversionVec = null;
		this._geoCache = null;
		this._matCache = null;
	},

	/*
		Load a grid from a parsed json object.
		json = {
			extrudeSettings,
			size,
			cellSize,
			autogenerated,
			cells: [],
			materials: [
				{
					cache_id: 0,
					type: 'MeshLambertMaterial',
					color, ambient, emissive, reflectivity, refractionRatio, wrapAround,
					imgURL: url
				},
				{
					cacheId: 1, ...
				}
				...
			]
		}
	*/
	load: function (url, cb, scope) {
		var self = this;
		__WEBPACK_IMPORTED_MODULE_2__utils_Tools__["a" /* default */].getJSON({
			url: url,
			callback: function (json) {
				self.fromJSON(json);
				cb.call(scope || null, json);
			},
			cache: false,
			scope: self
		});
	},

	fromJSON: function (json) {
		var i, c;
		var cells = json.cells;

		this.cells = {};
		this.numCells = 0;

		this.size = json.size;
		this.cellSize = json.cellSize;
		this._cellWidth = this.cellSize * 2;
		this._cellLength = (__WEBPACK_IMPORTED_MODULE_1__constants__["e" /* SQRT3 */] * 0.5) * this._cellWidth;

		this.extrudeSettings = json.extrudeSettings;
		this.autogenerated = json.autogenerated;

		for (i = 0; i < cells.length; i++) {
			c = new __WEBPACK_IMPORTED_MODULE_3__Cell__["a" /* default */]();
			c.copy(cells[i]);
			this.add(c);
		}
	},

	toJSON: function () {
		var json = {
			size: this.size,
			cellSize: this.cellSize,
			extrudeSettings: this.extrudeSettings,
			autogenerated: this.autogenerated
		};
		var cells = [];
		var c, k;

		for (k in this.cells) {
			c = this.cells[k];
			cells.push({
				q: c.q,
				r: c.r,
				s: c.s,
				h: c.h,
				walkable: c.walkable,
				userData: c.userData
			});
		}
		json.cells = cells;

		return json;
	},

	/*  ________________________________________________________________________
		Hexagon-specific conversion math
		Mostly commented out because they're inlined whenever possible to increase performance.
		They're still here for reference.
	 */

	_createVertex: function (i) {
		var angle = (__WEBPACK_IMPORTED_MODULE_1__constants__["f" /* TAU */] / 6) * i;
		return new __WEBPACK_IMPORTED_MODULE_0_three__["Vector3"]((this.cellSize * Math.cos(angle)), (this.cellSize * Math.sin(angle)), 0);
	},

	/*_pixelToAxial: function(pos) {
		var q, r; // = x, y
		q = pos.x * ((2/3) / this.cellSize);
		r = ((-pos.x / 3) + (SQRT3/3) * pos.y) / this.cellSize;
		this._cel.set(q, r, -q-r);
		return this._cubeRound(this._cel);
	},*/

	/*_axialToCube: function(h) {
		return {
			q: h.q,
			r: h.r,
			s: -h.q - h.r
		};
	},*/

	/*_cubeToAxial: function(cell) {
		return cell; // yep
	},*/

	/*_axialToPixel: function(cell) {
		var x, y; // = q, r
		x = cell.q * this._cellWidth * 0.75;
		y = (cell.s - cell.r) * this._cellLength * 0.5;
		return {x: x, y: -y};
	},*/

	/*_hexToPixel: function(h) {
		var x, y; // = q, r
		x = this.cellSize * 1.5 * h.x;
		y = this.cellSize * SQRT3 * (h.y + (h.x * 0.5));
		return {x: x, y: y};
	},*/

	/*_axialRound: function(h) {
		return this._cubeRound(this.axialToCube(h));
	},*/

	_cubeRound: function (h) {
		var rx = Math.round(h.q);
		var ry = Math.round(h.r);
		var rz = Math.round(h.s);

		var xDiff = Math.abs(rx - h.q);
		var yDiff = Math.abs(ry - h.r);
		var zDiff = Math.abs(rz - h.s);

		if (xDiff > yDiff && xDiff > zDiff) {
			rx = -ry - rz;
		}
		else if (yDiff > zDiff) {
			ry = -rx - rz;
		}
		else {
			rz = -rx - ry;
		}

		return this._cel.set(rx, ry, rz);
	},

	/*_cubeDistance: function(a, b) {
		return Math.max(Math.abs(a.q - b.q), Math.abs(a.r - b.r), Math.abs(a.s - b.s));
	}*/
};

HexGrid.prototype.constructor = HexGrid;

/* harmony default export */ __webpack_exports__["a"] = (HexGrid);

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_three__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_three___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_three__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__constants__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_Tools__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Cell__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Tile__ = __webpack_require__(5);
/*
	Graph of squares. Handles grid cell management (placement math for eg pathfinding, range, etc) and grid conversion math.
	Interface:
	type
	size - number of cells (in radius); only used if the map is generated
	cellSize
	cells - a hash so we can have sparse maps
	numCells
	extrudeSettings
	autogenerated
	cellShape
	cellGeo
	cellShapeGeo

	@author Corey Birnbaum https://github.com/vonWolfehaus/
 */









const SqrGrid = function (config) {
	config = config || {};
	/*  ______________________________________________
		GRID INTERFACE:
	*/
	this.type = __WEBPACK_IMPORTED_MODULE_1__constants__["d" /* SQR */];
	this.size = 5; // only used for generated maps
	this.cellSize = typeof config.cellSize === 'undefined' ? 10 : config.cellSize;
	this.cells = {};
	this.numCells = 0;

	this.extrudeSettings = null;
	this.autogenerated = false;

	// create base shape used for building geometry
	var verts = [];
	verts.push(new __WEBPACK_IMPORTED_MODULE_0_three__["Vector3"]());
	verts.push(new __WEBPACK_IMPORTED_MODULE_0_three__["Vector3"](-this.cellSize, this.cellSize));
	verts.push(new __WEBPACK_IMPORTED_MODULE_0_three__["Vector3"](this.cellSize, this.cellSize));
	verts.push(new __WEBPACK_IMPORTED_MODULE_0_three__["Vector3"](this.cellSize, -this.cellSize));
	// copy the verts into a shape for the geometry to use
	this.cellShape = new __WEBPACK_IMPORTED_MODULE_0_three__["Shape"]();
	this.cellShape.moveTo(-this.cellSize, -this.cellSize);
	this.cellShape.lineTo(-this.cellSize, this.cellSize);
	this.cellShape.lineTo(this.cellSize, this.cellSize);
	this.cellShape.lineTo(this.cellSize, -this.cellSize);
	this.cellShape.lineTo(-this.cellSize, -this.cellSize);

	this.cellGeo = new __WEBPACK_IMPORTED_MODULE_0_three__["Geometry"]();
	this.cellGeo.vertices = verts;
	this.cellGeo.verticesNeedUpdate = true;

	this.cellShapeGeo = new __WEBPACK_IMPORTED_MODULE_0_three__["ShapeGeometry"](this.cellShape);

	/*  ______________________________________________
		PRIVATE
	*/

	this._fullCellSize = this.cellSize * 2;
	this._hashDelimeter = '.';
	// pre-computed permutations
	this._directions = [new __WEBPACK_IMPORTED_MODULE_3__Cell__["a" /* default */](+1, 0, 0), new __WEBPACK_IMPORTED_MODULE_3__Cell__["a" /* default */](0, -1, 0),
	new __WEBPACK_IMPORTED_MODULE_3__Cell__["a" /* default */](-1, 0, 0), new __WEBPACK_IMPORTED_MODULE_3__Cell__["a" /* default */](0, +1, 0)];
	this._diagonals = [new __WEBPACK_IMPORTED_MODULE_3__Cell__["a" /* default */](-1, -1, 0), new __WEBPACK_IMPORTED_MODULE_3__Cell__["a" /* default */](-1, +1, 0),
	new __WEBPACK_IMPORTED_MODULE_3__Cell__["a" /* default */](+1, +1, 0), new __WEBPACK_IMPORTED_MODULE_3__Cell__["a" /* default */](+1, -1, 0)];
	// cached objects
	this._list = [];
	this._vec3 = new __WEBPACK_IMPORTED_MODULE_0_three__["Vector3"]();
	this._cel = new __WEBPACK_IMPORTED_MODULE_3__Cell__["a" /* default */]();
	this._conversionVec = new __WEBPACK_IMPORTED_MODULE_0_three__["Vector3"]();
	this._geoCache = [];
	this._matCache = [];
};

SqrGrid.prototype = {
	/*
		________________________________________________________________________
		High-level functions that the Board interfaces with (all grids implement)
	 */

	cellToPixel: function (cell) {
		this._vec3.x = cell.q * this._fullCellSize;
		this._vec3.y = cell.h;
		this._vec3.z = cell.r * this._fullCellSize;
		return this._vec3;
	},

	pixelToCell: function (pos) {
		var q = Math.round(pos.x / this._fullCellSize);
		var r = Math.round(pos.z / this._fullCellSize);
		return this._cel.set(q, r, 0);
	},

	getCellAt: function (pos) {
		var q = Math.round(pos.x / this._fullCellSize);
		var r = Math.round(pos.z / this._fullCellSize);
		this._cel.set(q, r);
		return this.cells[this.cellToHash(this._cel)];
	},

	getNeighbors: function (cell, diagonal, filter) {
		// always returns an array
		var i, n, l = this._directions.length;
		this._list.length = 0;
		for (i = 0; i < l; i++) {
			this._cel.copy(cell);
			this._cel.add(this._directions[i]);
			n = this.cells[this.cellToHash(this._cel)];
			if (!n || (filter && !filter(cell, n))) {
				continue;
			}
			this._list.push(n);
		}
		if (diagonal) {
			for (i = 0; i < l; i++) {
				this._cel.copy(cell);
				this._cel.add(this._diagonals[i]);
				n = this.cells[this.cellToHash(this._cel)];
				if (!n || (filter && !filter(cell, n))) {
					continue;
				}
				this._list.push(n);
			}
		}
		return this._list;
	},

	getRandomCell: function () {
		var c, i = 0, x = __WEBPACK_IMPORTED_MODULE_2__utils_Tools__["a" /* default */].randomInt(0, this.numCells);
		for (c in this.cells) {
			if (i === x) {
				return this.cells[c];
			}
			i++;
		}
		return this.cells[c];
	},

	cellToHash: function (cell) {
		return cell.q + this._hashDelimeter + cell.r; // s is not used in a square grid
	},

	distance: function (cellA, cellB) {
		var d = Math.max(Math.abs(cellA.q - cellB.q), Math.abs(cellA.r - cellB.r));
		d += cellB.h - cellA.h; // include vertical size
		return d;
	},

	clearPath: function () {
		var i, c;
		for (i in this.cells) {
			c = this.cells[i];
			c._calcCost = 0;
			c._priority = 0;
			c._parent = null;
			c._visited = false;
		}
	},

	traverse: function (cb) {
		var i;
		for (i in this.cells) {
			cb(this.cells[i]);
		}
	},

	generateTile: function (cell, scale, material) {
		var height = Math.abs(cell.h);
		if (height < 1) height = 1;

		var geo = this._geoCache[height];
		if (!geo) {
			this.extrudeSettings.amount = height;
			geo = new __WEBPACK_IMPORTED_MODULE_0_three__["ExtrudeGeometry"](this.cellShape, this.extrudeSettings);
			this._geoCache[height] = geo;
		}

		/*mat = this._matCache[c.matConfig.mat_cache_id];
		if (!mat) { // MaterialLoader? we currently only support basic stuff though. maybe later
			mat.map = Loader.loadTexture(c.matConfig.imgURL);
			delete c.matConfig.imgURL;
			mat = new THREE[c.matConfig.type](c.matConfig);
			this._matCache[c.matConfig.mat_cache_id] = mat;
		}*/

		var t = new __WEBPACK_IMPORTED_MODULE_4__Tile__["a" /* default */]({
			size: this.cellSize,
			scale: scale,
			cell: cell,
			geometry: geo,
			material: material
		});

		cell.tile = t;

		return t;
	},

	generateTiles: function (config) {
		config = config || {};
		var tiles = [];
		var settings = {
			tileScale: 0.95,
			cellSize: this.cellSize,
			material: null,
			extrudeSettings: {
				amount: 1,
				bevelEnabled: true,
				bevelSegments: 1,
				steps: 1,
				bevelSize: 0.5,
				bevelThickness: 0.5
			}
		}
		settings = __WEBPACK_IMPORTED_MODULE_2__utils_Tools__["a" /* default */].merge(settings, config);

		/*if (!settings.material) {
			settings.material = new MeshPhongMaterial({
				color: Tools.randomizeRGB('30, 30, 30', 10)
			});
		}*/

		// overwrite with any new dimensions
		this.cellSize = settings.cellSize;
		this._fullCellSize = this.cellSize * 2;

		this.autogenerated = true;
		this.extrudeSettings = settings.extrudeSettings;

		var i, t, c;
		for (i in this.cells) {
			c = this.cells[i];
			t = this.generateTile(c, settings.tileScale, settings.material);
			t.position.copy(this.cellToPixel(c));
			t.position.y = 0;
			tiles.push(t);
		}
		return tiles;
	},

	generateTilePoly: function (material) {
		if (!material) {
			material = new __WEBPACK_IMPORTED_MODULE_0_three__["MeshBasicMaterial"]({ color: 0x24b4ff });
		}
		var mesh = new __WEBPACK_IMPORTED_MODULE_0_three__["Mesh"](this.cellShapeGeo, material);
		this._vec3.set(1, 0, 0);
		mesh.rotateOnAxis(this._vec3, __WEBPACK_IMPORTED_MODULE_1__constants__["c" /* PI */] / 2);
		return mesh;
	},

	// create a flat, square-shaped grid
	generate: function (config) {
		config = config || {};
		this.size = typeof config.size === 'undefined' ? this.size : config.size;
		var x, y, c;
		var half = Math.ceil(this.size / 2);
		for (x = -half; x < half; x++) {
			for (y = -half; y < half; y++) {
				c = new __WEBPACK_IMPORTED_MODULE_3__Cell__["a" /* default */](x, y + 1);
				this.add(c);
			}
		}
	},

	generateOverlay: function (size, overlayObj, overlayMat) {
		var x, y;
		var half = Math.ceil(size / 2);
		for (x = -half; x < half; x++) {
			for (y = -half; y < half; y++) {
				this._cel.set(x, y); // define the cell
				var line = new __WEBPACK_IMPORTED_MODULE_0_three__["Line"](this.cellGeo, overlayMat);
				line.position.copy(this.cellToPixel(this._cel));
				line.rotation.x = 90 * __WEBPACK_IMPORTED_MODULE_1__constants__["a" /* DEG_TO_RAD */];
				overlayObj.add(line);
			}
		}
	},

	add: function (cell) {
		var h = this.cellToHash(cell);
		if (this.cells[h]) {
			// console.warn('A cell already exists there');
			return;
		}
		this.cells[h] = cell;
		this.numCells++;

		return cell;
	},

	remove: function (cell) {
		var h = this.cellToHash(cell);
		if (this.cells[h]) {
			delete this.cells[h];
			this.numCells--;
		}
	},

	dispose: function () {
		this.cells = null;
		this.numCells = 0;
		this.cellShape = null;
		this.cellGeo.dispose();
		this.cellGeo = null;
		this.cellShapeGeo.dispose();
		this.cellShapeGeo = null;
		this._list = null;
		this._vec3 = null;
		this._conversionVec = null;
		this._geoCache = null;
		this._matCache = null;
	},

	/*
		Load a grid from a parsed json object.
		json = {
			extrudeSettings,
			size,
			cellSize,
			autogenerated,
			cells: [],
			materials: [
				{
					cache_id: 0,
					type: 'MeshLambertMaterial',
					color, ambient, emissive, reflectivity, refractionRatio, wrapAround,
					imgURL: url
				},
				{
					cacheId: 1, ...
				}
				...
			]
		}
	*/
	load: function (url, callback, scope) {
		__WEBPACK_IMPORTED_MODULE_2__utils_Tools__["a" /* default */].getJSON({
			url: url,
			callback: function (json) {
				this.fromJSON(json);
				callback.call(scope || null, json);
			},
			cache: false,
			scope: this
		});
	},

	fromJSON: function (json) {
		var i, c;
		var cells = json.cells;

		this.cells = {};
		this.numCells = 0;

		this.size = json.size;
		this.cellSize = json.cellSize;
		this._fullCellSize = this.cellSize * 2;
		this.extrudeSettings = json.extrudeSettings;
		this.autogenerated = json.autogenerated;

		for (i = 0; i < cells.length; i++) {
			c = new __WEBPACK_IMPORTED_MODULE_3__Cell__["a" /* default */]();
			c.copy(cells[i]);
			this.add(c);
		}
	},

	toJSON: function () {
		var json = {
			size: this.size,
			cellSize: this.cellSize,
			extrudeSettings: this.extrudeSettings,
			autogenerated: this.autogenerated
		};
		var cells = [];
		var c, k;

		for (k in this.cells) {
			c = this.cells[k];
			cells.push({
				q: c.q,
				r: c.r,
				s: c.s,
				h: c.h,
				walkable: c.walkable,
				userData: c.userData
			});
		}
		json.cells = cells;

		return json;
	}
};

SqrGrid.prototype.constructor = SqrGrid;

/* harmony default export */ __webpack_exports__["a"] = (SqrGrid);

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_three__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_three___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_three__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Tools__ = __webpack_require__(1);
/*
	Sets up and manages a THREEjs container, camera, and light, making it easy to get going.
	Also provides camera control.

	Assumes full screen.
 */
// 'utils/Tools'



// import OrbitControlsSetup from 'three-orbit-controls';
// const OrbitControls = OrbitControlsSetup(THREE);



const VgScene = function (sceneConfig, controlConfig) {
	var sceneSettings = {
		element: document.body,
		alpha: true,
		antialias: true,
		clearColor: '#fff',
		sortObjects: false,
		fog: null,
		light: new __WEBPACK_IMPORTED_MODULE_0_three__["DirectionalLight"](0xffffff),
		lightPosition: null,
		cameraType: 'PerspectiveCamera',
		cameraPosition: null, // {x, y, z}
		orthoZoom: 4
	};

	var controlSettings = {
		minDistance: 100,
		maxDistance: 1000,
		zoomSpeed: 2,
		noZoom: false,
		enableZoom: true,
		enableRotate: true,
		enablePan: true
	};

	sceneSettings = __WEBPACK_IMPORTED_MODULE_1__Tools__["a" /* default */].merge(sceneSettings, sceneConfig);
	if (typeof controlConfig !== 'boolean') {
		controlSettings = __WEBPACK_IMPORTED_MODULE_1__Tools__["a" /* default */].merge(controlSettings, controlConfig);
	}

	this.renderer = new __WEBPACK_IMPORTED_MODULE_0_three__["WebGLRenderer"]({
		alpha: sceneSettings.alpha,
		antialias: sceneSettings.antialias
	});
	this.renderer.setClearColor(sceneSettings.clearColor, 0);
	this.renderer.sortObjects = sceneSettings.sortObjects;

	this.width = window.innerWidth;
	this.height = window.innerHeight;

	this.orthoZoom = sceneSettings.orthoZoom;

	this.container = new __WEBPACK_IMPORTED_MODULE_0_three__["Scene"]();
	this.container.fog = sceneSettings.fog;

	this.container.add(new __WEBPACK_IMPORTED_MODULE_0_three__["AmbientLight"](0xdddddd));

	if (!sceneSettings.lightPosition) {
		sceneSettings.light.position.set(-1, 1, -1).normalize();
	}
	this.container.add(sceneSettings.light);

	if (sceneSettings.cameraType === 'OrthographicCamera') {
		var width = window.innerWidth / this.orthoZoom;
		var height = window.innerHeight / this.orthoZoom;
		this.camera = new __WEBPACK_IMPORTED_MODULE_0_three__["OrthographicCamera"](width / -2, width / 2, height / 2, height / -2, 1, 5000);
	}
	else {
		this.camera = new __WEBPACK_IMPORTED_MODULE_0_three__["PerspectiveCamera"](50, this.width / this.height, 1, 5000);
	}

	this.contolled = !!controlConfig;
	if (this.contolled) {
		this.controls = new __WEBPACK_IMPORTED_MODULE_0_three__["OrbitControls"](this.camera, this.renderer.domElement);
		this.controls.minDistance = controlSettings.minDistance;
		this.controls.maxDistance = controlSettings.maxDistance;
		this.controls.zoomSpeed = controlSettings.zoomSpeed;
		this.controls.enableZoom = controlSettings.enableZoom;
		this.controls.enableRotate = controlSettings.enableRotate;
		this.controls.enablePan = controlSettings.enablePan;
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

/* harmony default export */ __webpack_exports__["a"] = (VgScene);

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_three__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_three___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_three__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pathing_AStarFinder__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_Loader__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_Tools__ = __webpack_require__(1);
/*
	Interface to the grid. Holds data about the visual representation of the cells (tiles).

	@author Corey Birnbaum https://github.com/vonWolfehaus/
 */






const Board = function(grid, finderConfig) {
	if (!grid) throw new Error('You must pass in a grid system for the board to use.');

	this.tiles = [];
	this.tileGroup = null; // only for tiles

	this.group = new __WEBPACK_IMPORTED_MODULE_0_three__["Object3D"](); // can hold all entities, also holds tileGroup, never trashed

	this.grid = null;
	this.overlay = null;
	this.finder = new __WEBPACK_IMPORTED_MODULE_1__pathing_AStarFinder__["a" /* default */](finderConfig);
	// need to keep a resource cache around, so this Loader does that, use it instead of THREE's ImageUtils
	__WEBPACK_IMPORTED_MODULE_2__utils_Loader__["a" /* default */].init();

	this.setGrid(grid);
};

Board.prototype = {
	setEntityOnTile: function(entity, tile) {
		// snap an entity's position to a tile; merely copies position
		var pos = this.grid.cellToPixel(tile.cell);
		entity.position.copy(pos);
		// adjust for any offset after the entity was set directly onto the tile
		entity.position.y += entity.heightOffset || 0;
		// remove entity from old tile
		if (entity.tile) {
			entity.tile.entity = null;
		}
		// set new situation
		entity.tile = tile;
		tile.entity = entity;
	},

	addTile: function(tile) {
		var i = this.tiles.indexOf(tile);
		if (i === -1) this.tiles.push(tile);
		else return;

		this.snapTileToGrid(tile);
		tile.position.y = 0;

		this.tileGroup.add(tile.mesh);
		this.grid.add(tile.cell);

		tile.cell.tile = tile;
	},

	removeTile: function(tile) {
		if (!tile) return; // was already removed somewhere
		var i = this.tiles.indexOf(tile);
		this.grid.remove(tile.cell);

		if (i !== -1) this.tiles.splice(i, 1);
		// this.tileGroup.remove(tile.mesh);

		tile.dispose();
	},

	removeAllTiles: function() {
		if (!this.tileGroup) return;
		var tiles = this.tileGroup.children;
		for (var i = 0; i < tiles.length; i++) {
			this.tileGroup.remove(tiles[i]);
		}
	},

	getTileAtCell: function(cell) {
		var h = this.grid.cellToHash(cell);
		return cell.tile || (typeof this.grid.cells[h] !== 'undefined' ? this.grid.cells[h].tile : null);
	},

	snapToGrid: function(pos) {
		var cell = this.grid.pixelToCell(pos);
		pos.copy(this.grid.cellToPixel(cell));
	},

	snapTileToGrid: function(tile) {
		if (tile.cell) {
			tile.position.copy(this.grid.cellToPixel(tile.cell));
		}
		else {
			var cell = this.grid.pixelToCell(tile.position);
			tile.position.copy(this.grid.cellToPixel(cell));
		}
		return tile;
	},

	getRandomTile: function() {
		var i = __WEBPACK_IMPORTED_MODULE_3__utils_Tools__["a" /* default */].randomInt(0, this.tiles.length-1);
		return this.tiles[i];
	},

	findPath: function(startTile, endTile, heuristic) {
		return this.finder.findPath(startTile.cell, endTile.cell, heuristic, this.grid);
	},

	setGrid: function(newGrid) {
		this.group.remove(this.tileGroup);
		if (this.grid && newGrid !== this.grid) {
			this.removeAllTiles();
			this.tiles.forEach(function(t) {
				this.grid.remove(t.cell);
				t.dispose();
			});
			this.grid.dispose();
		}
		this.grid = newGrid;
		this.tiles = [];
		this.tileGroup = new __WEBPACK_IMPORTED_MODULE_0_three__["Object3D"]();
		this.group.add(this.tileGroup);
	},

	generateOverlay: function(size) {
		var mat = new __WEBPACK_IMPORTED_MODULE_0_three__["LineBasicMaterial"]({
			color: 0x000000,
			opacity: 0.3
		});

		if (this.overlay) {
			this.group.remove(this.overlay);
		}

		this.overlay = new __WEBPACK_IMPORTED_MODULE_0_three__["Object3D"]();

		this.grid.generateOverlay(size, this.overlay, mat);

		this.group.add(this.overlay);
	},

	generateTilemap: function(config) {
		this.reset();

		var tiles = this.grid.generateTiles(config);
		this.tiles = tiles;

		this.tileGroup = new __WEBPACK_IMPORTED_MODULE_0_three__["Object3D"]();
		for (var i = 0; i < tiles.length; i++) {
			this.tileGroup.add(tiles[i].mesh);
		}

		this.group.add(this.tileGroup);
	},

	reset: function() {
		// removes all tiles from the scene, but leaves the grid intact
		this.removeAllTiles();
		if (this.tileGroup) this.group.remove(this.tileGroup);
	}
};

Board.prototype.constructor = Board;

/* harmony default export */ __webpack_exports__["a"] = (Board);

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_Tools__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_LinkedList__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__PathUtil__ = __webpack_require__(12);
/*
	A* path-finder based upon http://www.redblobgames.com/pathfinding/a-star/introduction.html
	@author Corey Birnbaum https://github.com/vonWolfehaus/
 */
// 'utils/Tools', 'lib/LinkedList'







const AStarFinder = function (finderConfig) {
	finderConfig = finderConfig || {};

	var settings = {
		allowDiagonal: false,
		heuristicFilter: null
	};
	settings = __WEBPACK_IMPORTED_MODULE_0__utils_Tools__["a" /* default */].merge(settings, finderConfig);

	this.allowDiagonal = settings.allowDiagonal;
	this.heuristicFilter = settings.heuristicFilter;

	this.list = new __WEBPACK_IMPORTED_MODULE_1__lib_LinkedList__["a" /* default */]();
};

AStarFinder.prototype = {
	/*
		Find and return the path.
		@return Array<Cell> The path, including both start and end positions. Null if it failed.
	 */
	findPath: function (startNode, endNode, heuristic, grid) {
		var current, costSoFar, neighbors, n, i, l;
		heuristic = heuristic || this.heuristicFilter;
		// clear old values from previous finding
		grid.clearPath();
		this.list.clear();

		// push the start current into the open list
		this.list.add(startNode);

		// while the open list is not empty
		while (this.list.length > 0) {
			// sort so lowest cost is first
			this.list.sort(this.compare);

			// pop the position of current which has the minimum `_calcCost` value.
			current = this.list.shift();
			current._visited = true;

			// if reached the end position, construct the path and return it
			if (current === endNode) {
				return __WEBPACK_IMPORTED_MODULE_2__PathUtil__["a" /* default */].backtrace(endNode);
			}

			// cycle through each neighbor of the current current
			neighbors = grid.getNeighbors(current, this.allowDiagonal, heuristic);
			for (i = 0, l = neighbors.length; i < l; i++) {
				n = neighbors[i];

				if (!n.walkable) {
					continue;
				}

				costSoFar = current._calcCost + grid.distance(current, n);

				// check if the neighbor has not been inspected yet, or can be reached with smaller cost from the current node
				if (!n._visited || costSoFar < n._calcCost) {
					n._visited = true;
					n._parent = current;
					n._calcCost = costSoFar;
					// console.log(n);
					// _priority is the most important property, since it makes the algorithm "greedy" and seek the goal.
					// otherwise it behaves like a brushfire/breadth-first
					n._priority = costSoFar + grid.distance(endNode, n);

					// check neighbor if it's the end current as well--often cuts steps by a significant amount
					if (n === endNode) {
						return __WEBPACK_IMPORTED_MODULE_2__PathUtil__["a" /* default */].backtrace(endNode);
					}
					// console.log(n);
					this.list.add(n);
				}
				// console.log(this.list);
			} // end for each neighbor
		} // end while not open list empty
		// failed to find the path
		return null;
	},

	compare: function (nodeA, nodeB) {
		return nodeA._priority - nodeB._priority;
	}
};

AStarFinder.prototype.constructor = AStarFinder;

/* harmony default export */ __webpack_exports__["a"] = (AStarFinder);

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/*
	@source https://github.com/qiao/PathFinding.js/
*/
const PathUtil = {
	/**
	 * Backtrace according to the parent records and return the path.
	 * (including both start and end nodes)
	 * @param {Node} node End node
	 * @return {Array.<Array.<number>>} the path
	 */
	backtrace: function (node) {
		var path = [node];
		while (node._parent) {
			node = node._parent;
			path.push(node);
		}
		return path.reverse();
	},

	/**
	 * Backtrace from start and end node, and return the path.
	 * (including both start and end nodes)
	 * @param {Node}
	 * @param {Node}
	 */
	biBacktrace: function (nodeA, nodeB) {
		var pathA = this.backtrace(nodeA),
			pathB = this.backtrace(nodeB);
		return pathA.concat(pathB.reverse());
	},

	/**
	 * Compute the length of the path.
	 * @param {Array.<Array.<number>>} path The path
	 * @return {number} The length of the path
	 */
	pathLength: function (path) {
		var i, sum = 0, a, b, dx, dy;
		for (i = 1; i < path.length; ++i) {
			a = path[i - 1];
			b = path[i];
			dx = a[0] - b[0];
			dy = a[1] - b[1];
			sum += Math.sqrt(dx * dx + dy * dy);
		}
		return sum;
	},


	/**
	 * Given the start and end coordinates, return all the coordinates lying
	 * on the line formed by these coordinates, based on Bresenham's algorithm.
	 * http://en.wikipedia.org/wiki/Bresenham's_line_algorithm#Simplification
	 * @param {number} x0 Start x coordinate
	 * @param {number} y0 Start y coordinate
	 * @param {number} x1 End x coordinate
	 * @param {number} y1 End y coordinate
	 * @return {Array.<Array.<number>>} The coordinates on the line
	 */
	interpolate: function (x0, y0, x1, y1) {
		var abs = Math.abs,
			line = [],
			sx, sy, dx, dy, err, e2;

		dx = abs(x1 - x0);
		dy = abs(y1 - y0);

		sx = (x0 < x1) ? 1 : -1;
		sy = (y0 < y1) ? 1 : -1;

		err = dx - dy;

		while (x0 !== x1 || y0 !== y1) {
			line.push([x0, y0]);

			e2 = 2 * err;
			if (e2 > -dy) {
				err = err - dy;
				x0 = x0 + sx;
			}
			if (e2 < dx) {
				err = err + dx;
				y0 = y0 + sy;
			}
		}

		return line;
	},


	/**
	 * Given a compressed path, return a new path that has all the segments
	 * in it interpolated.
	 * @param {Array.<Array.<number>>} path The path
	 * @return {Array.<Array.<number>>} expanded path
	 */
	expandPath: function (path) {
		var expanded = [],
			len = path.length,
			coord0, coord1,
			interpolated,
			interpolatedLen,
			i, j;

		if (len < 2) {
			return expanded;
		}

		for (i = 0; i < len - 1; ++i) {
			coord0 = path[i];
			coord1 = path[i + 1];

			interpolated = this.interpolate(coord0[0], coord0[1], coord1[0], coord1[1]);
			interpolatedLen = interpolated.length;
			for (j = 0; j < interpolatedLen - 1; ++j) {
				expanded.push(interpolated[j]);
			}
		}
		expanded.push(path[len - 1]);

		return expanded;
	},


	/**
	 * Smoothen the give path.
	 * The original path will not be modified; a new path will be returned.
	 * @param {PF.Grid} grid
	 * @param {Array.<Array.<number>>} path The path
	 */
	smoothenPath: function (grid, path) {
		var len = path.length,
			x0 = path[0][0],        // path start x
			y0 = path[0][1],        // path start y
			x1 = path[len - 1][0],  // path end x
			y1 = path[len - 1][1],  // path end y
			sx, sy,                 // current start coordinate
			ex, ey,                 // current end coordinate
			newPath,
			lastValidCoord,
			i, j, coord, line, testCoord, blocked;

		sx = x0;
		sy = y0;
		newPath = [[sx, sy]];

		for (i = 2; i < len; ++i) {
			coord = path[i];
			ex = coord[0];
			ey = coord[1];
			line = this.interpolate(sx, sy, ex, ey);

			blocked = false;
			for (j = 1; j < line.length; ++j) {
				testCoord = line[j];

				if (!grid.isWalkableAt(testCoord[0], testCoord[1])) {
					blocked = true;
					break;
				}
			}
			if (blocked) {
				lastValidCoord = path[i - 1];
				newPath.push(lastValidCoord);
				sx = lastValidCoord[0];
				sy = lastValidCoord[1];
			}
		}
		newPath.push([x1, y1]);

		return newPath;
	},


	/**
	 * Compress a path, remove redundant nodes without altering the shape
	 * The original path is not modified
	 * @param {Array.<Array.<number>>} path The path
	 * @return {Array.<Array.<number>>} The compressed path
	 */
	compressPath: function (path) {

		// nothing to compress
		if (path.length < 3) {
			return path;
		}

		var compressed = [],
			sx = path[0][0], // start x
			sy = path[0][1], // start y
			px = path[1][0], // second point x
			py = path[1][1], // second point y
			dx = px - sx, // direction between the two points
			dy = py - sy, // direction between the two points
			lx, ly,
			ldx, ldy,
			sq, i;

		// normalize the direction
		sq = Math.sqrt(dx * dx + dy * dy);
		dx /= sq;
		dy /= sq;

		// start the new path
		compressed.push([sx, sy]);

		for (i = 2; i < path.length; i++) {

			// store the last point
			lx = px;
			ly = py;

			// store the last direction
			ldx = dx;
			ldy = dy;

			// next point
			px = path[i][0];
			py = path[i][1];

			// next direction
			dx = px - lx;
			dy = py - ly;

			// normalize
			sq = Math.sqrt(dx * dx + dy * dy);
			dx /= sq;
			dy /= sq;

			// if the direction has changed, store the point
			if (dx !== ldx || dy !== ldy) {
				compressed.push([lx, ly]);
			}
		}

		// store the last point
		compressed.push([px, py]);

		return compressed;
	}
};

/* harmony default export */ __webpack_exports__["a"] = (PathUtil);

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_three__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_three___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_three__);



const Loader = {
	manager: null,
	imageLoader: null,
	crossOrigin: false,

	init: function(crossOrigin) {
		this.crossOrigin = crossOrigin || false;

		this.manager = new __WEBPACK_IMPORTED_MODULE_0_three__["LoadingManager"](function() {
			// called when all images are loaded, so call your state manager or something
		}, function() {
			// noop
		}, function() {
			console.warn('Error loading images');
		});

		this.imageLoader = new __WEBPACK_IMPORTED_MODULE_0_three__["ImageLoader"](this.manager);
		this.imageLoader.crossOrigin = crossOrigin;
	},

	loadTexture: function(url, mapping, onLoad, onError) {
		var texture = new __WEBPACK_IMPORTED_MODULE_0_three__["Texture"](null, mapping);
		this.imageLoader.load(url, function(image) { // on load
				texture.image = image;
				texture.needsUpdate = true;
				if (onLoad) onLoad(texture);
			},
			null, // on progress
			function (evt) { // on error
				if (onError) onError(evt);
			});
		texture.sourceFile = url;

		return texture;
	}
};

/* harmony default export */ __webpack_exports__["a"] = (Loader);

/***/ })
/******/ ]);
});