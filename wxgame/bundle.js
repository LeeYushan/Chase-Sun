/******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/astar.ts":
/*!**********************!*\
  !*** ./src/astar.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var astar;
(function (astar) {
    var Node = /** @class */ (function () {
        function Node(x, y) {
            this.walkable = true;
            this.costMultiplier = 1.0;
            this.inPath = false;
            this.x = x;
            this.y = y;
        }
        Node.prototype.toString = function () {
            if (this.inPath) {
                return "国";
            }
            else if (!this.walkable) {
                return "田";
            }
            else {
                return "口";
            }
        };
        return Node;
    }());
    astar.Node = Node;
    var Grid = /** @class */ (function () {
        function Grid(numCols, numRows) {
            this._numCols = numCols;
            this._numRows = numRows;
            this._nodes = [];
            for (var i = 0; i < this._numCols; i++) {
                this._nodes[i] = [];
                for (var j = 0; j < this._numRows; j++) {
                    this._nodes[i][j] = new Node(i, j);
                }
            }
        }
        Grid.prototype.clear = function () {
            for (var i = 0; i < this._numCols; i++) {
                for (var j = 0; j < this._numRows; j++) {
                    var node = this._nodes[i][j];
                    node.f = node.g = node.h = 0;
                    node.inPath = false;
                    node.parent = null;
                }
            }
        };
        Grid.prototype.getNode = function (x, y) {
            return this._nodes[x][y];
        };
        Grid.prototype.setWalkable = function (x, y, value) {
            this._nodes[x][y].walkable = value;
        };
        Object.defineProperty(Grid.prototype, "numCols", {
            get: function () {
                return this._numCols;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Grid.prototype, "numRows", {
            get: function () {
                return this._numRows;
            },
            enumerable: true,
            configurable: true
        });
        Grid.prototype.getNeighbors = function (node) {
            var result = [];
            var startX = Math.max(0, node.x - 1);
            var endX = Math.min(this.numCols - 1, node.x + 1);
            var startY = Math.max(0, node.y - 1);
            var endY = Math.min(this.numRows - 1, node.y + 1);
            for (var i = startX; i <= endX; i++) {
                for (var j = startY; j <= endY; j++) {
                    result.push(this.getNode(i, j));
                }
            }
            return result;
        };
        Grid.prototype.toString = function () {
            var result = "";
            for (var y = 0; y < this._numRows; y++) {
                for (var x = 0; x < this._numCols; x++) {
                    result += this._nodes[x][y].toString();
                }
                result += "\n";
            }
            return result;
        };
        return Grid;
    }());
    astar.Grid = Grid;
    var STRAIGHT_COST = 1;
    var DIAG_COST = Math.SQRT2;
    var FindPath = /** @class */ (function () {
        function FindPath() {
        }
        FindPath.prototype.manhattan = function (node, endNode) {
            var cost = Math.abs(node.x - endNode.x) * STRAIGHT_COST
                + Math.abs(node.y + endNode.y) * STRAIGHT_COST;
            return cost;
        };
        FindPath.prototype.euclidian = function (node, endNode) {
            var dx = node.x - endNode.x;
            var dy = node.y - endNode.y;
            return Math.sqrt(dx * dx + dy * dy) * STRAIGHT_COST;
        };
        FindPath.prototype.diagonal = function (node, endNode) {
            var dx = Math.abs(node.x - endNode.x);
            var dy = Math.abs(node.y - endNode.y);
            var diag = Math.min(dx, dy);
            var straight = dx + dy;
            return DIAG_COST * diag + STRAIGHT_COST * (straight - 2 * diag);
        };
        FindPath.prototype.setHeurisitic = function (heuristic) {
            this._heuristic = heuristic;
        };
        FindPath.prototype.findPath = function (grid, startX, startY, endX, endY) {
            grid.clear();
            var startNode = grid.getNode(startX, startY);
            var endNode = grid.getNode(endX, endY);
            startNode.g = 0;
            startNode.h = this._heuristic(startNode, endNode);
            startNode.f = startNode.g + startNode.h;
            var openList = [];
            var closedList = [];
            var currentNode = startNode;
            while (currentNode != endNode) {
                var neighbors = grid.getNeighbors(currentNode);
                for (var i = 0; i < neighbors.length; i++) {
                    var testNode = neighbors[i];
                    if (testNode == currentNode ||
                        !testNode.walkable) {
                        continue;
                    }
                    var cost = STRAIGHT_COST;
                    if (!((currentNode.x == testNode.x) || (currentNode.y == testNode.y))) {
                        cost = DIAG_COST;
                    }
                    var g = currentNode.g + cost * testNode.costMultiplier;
                    var h = this._heuristic(testNode, endNode);
                    var f = g + h;
                    if (openList.indexOf(testNode) >= 0 || closedList.indexOf(testNode) >= 0) {
                        if (testNode.f > f) {
                            testNode.f = f;
                            testNode.g = g;
                            testNode.h = h;
                            testNode.parent = currentNode;
                        }
                        else {
                            //什么也不做
                        }
                    }
                    else {
                        testNode.f = f;
                        testNode.g = g;
                        testNode.h = h;
                        testNode.parent = currentNode;
                        openList.push(testNode);
                    }
                }
                closedList.push(currentNode);
                if (openList.length == 0) {
                    console.log("no path found");
                    return null;
                }
                openList.sort(function (a, b) { return a.f - b.f; });
                currentNode = openList.shift();
            }
            var path = [];
            var nodeInPath = endNode;
            path.push(nodeInPath);
            nodeInPath.inPath = true;
            while (nodeInPath != startNode) {
                nodeInPath = nodeInPath.parent;
                path.unshift(nodeInPath);
                nodeInPath.inPath = true;
            }
            return path;
        };
        return FindPath;
    }());
    astar.FindPath = FindPath;
})(astar = exports.astar || (exports.astar = {}));


/***/ }),

/***/ "./src/command.ts":
/*!************************!*\
  !*** ./src/command.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CommandPool = /** @class */ (function () {
    function CommandPool() {
        this._commandList = [];
        this.currentCommand = null;
    }
    CommandPool.prototype.push = function (command) {
        if (this.currentCommand) {
            this._commandList = [];
            this.currentCommand.cancel();
            this.currentCommand = null;
        }
        this._commandList.push(command);
    };
    CommandPool.prototype.seriesExecuteAllCommand = function () {
        this.pickAndExecuteFirstCommand();
    };
    CommandPool.prototype.pickAndExecuteFirstCommand = function () {
        var _this = this;
        if (this.currentCommand) {
            return;
        }
        if (this._commandList.length == 0) {
            return;
        }
        var command = this._commandList.shift();
        this.currentCommand = command;
        command.onFinished = function () {
            _this.currentCommand = null;
            _this.pickAndExecuteFirstCommand();
        };
        command.execute();
    };
    return CommandPool;
}());
exports.CommandPool = CommandPool;
var CommandBase = /** @class */ (function () {
    function CommandBase() {
    }
    return CommandBase;
}());
exports.CommandBase = CommandBase;


/***/ }),

/***/ "./src/config.ts":
/*!***********************!*\
  !*** ./src/config.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.itemConfig = [
    { id: 1, name: '小型治疗药水', iconName: "assets/item1.png" },
    { id: 2, name: "金币", iconName: "assets/item2.png" }
];


/***/ }),

/***/ "./src/data.ts":
/*!*********************!*\
  !*** ./src/data.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.uiPrefabData = {
    scripts: [
        { scriptName: "Transform", x: 0, y: 0, rotation: 0 },
        { scriptName: "SpriteRenderer", imageName: "assets/font.png" }
    ],
};
exports.itemPrefab = {
    scripts: [
        { scriptName: "Transform", x: 0, y: 0, rotation: 0 },
        {
            scriptName: "SpriteRenderer"
        },
    ]
};


/***/ }),

/***/ "./src/editmode.ts":
/*!*************************!*\
  !*** ./src/editmode.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var gameengine_1 = __webpack_require__(/*! ./gameengine */ "./src/gameengine.ts");
var gameengine_2 = __webpack_require__(/*! ./gameengine */ "./src/gameengine.ts");
var EditorAPI = /** @class */ (function () {
    function EditorAPI() {
        this.scriptsUUIDMap = {};
    }
    EditorAPI.prototype.addListener = function (listener) {
        this.listener = listener;
        this.nofityListener();
    };
    EditorAPI.prototype.save = function () {
        var jsonData = gameengine_2.createDataFromGameObject(gameengine_1.core.stage.children[0]);
        var content = JSON.stringify(jsonData, null, '\t');
        return content;
    };
    EditorAPI.prototype.setScriptProperty = function (scriptUUID, property) {
        var script = this.scriptsUUIDMap[scriptUUID];
        script[property.name] = property.value;
    };
    EditorAPI.prototype.nofityListener = function () {
        if (this.listener) {
            var result = this.getInfo();
            this.listener(result);
        }
    };
    EditorAPI.prototype.changeScene = function (sceneUrl) {
        gameengine_1.core.loadScene(sceneUrl);
    };
    EditorAPI.prototype.getInfo = function () {
        var scriptsUUIDMap = this.scriptsUUIDMap;
        var uuId = 0;
        function getGameObjectInfo(gameObject) {
            var name = gameObject.id || "Unnamed";
            var children = gameObject.children.map(function (child) { return getGameObjectInfo(child); });
            var scripts = gameObject._scripts.map(function (script) {
                uuId++;
                scriptsUUIDMap[uuId] = script;
                var properties = [];
                var serilizeableKeys = script['__proto__'].serilizeableKeys;
                if (serilizeableKeys) {
                    var _loop_1 = function (item) {
                        var property = {
                            name: item.key,
                            createPropertyEditor: function (host) {
                                return item.propertyEditorFactory(host, script, item.key);
                            }
                        };
                        properties.push(property);
                    };
                    for (var _i = 0, serilizeableKeys_1 = serilizeableKeys; _i < serilizeableKeys_1.length; _i++) {
                        var item = serilizeableKeys_1[_i];
                        _loop_1(item);
                    }
                }
                return {
                    name: script.name, properties: properties, uuId: uuId
                };
            });
            return { name: name, children: children, scripts: scripts };
        }
        return getGameObjectInfo(gameengine_1.core.stage);
    };
    return EditorAPI;
}());
exports.EditorAPI = EditorAPI;
exports.editorAPI = new EditorAPI();


/***/ }),

/***/ "./src/gameengine.ts":
/*!***************************!*\
  !*** ./src/gameengine.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var editmode_1 = __webpack_require__(/*! ./editmode */ "./src/editmode.ts");
var math_1 = __webpack_require__(/*! ./math */ "./src/math.ts");
var platform_1 = __webpack_require__(/*! ./platform */ "./src/platform.ts");
// https://www.w3cschool.cn/html5/q2ybmfle.html
// 如何实现可复用？ -> 使用组合，而不是继承
var cost = function (target, key, desc) {
    var method = desc.value;
    console.log('装饰器!!!!!');
    desc.value = function () {
        var startTime = Date.now();
        var result = method.apply(this, arguments);
        var endTime = Date.now();
        var cost = endTime - startTime;
        console.log('执行开销', cost);
        return result;
    };
};
function createEditorObject(key, value) {
    var obj = {};
    obj[key] = value;
    return obj;
}
exports.propertyEditor_Number = function (host, script, key) {
    var value = script[key];
    var obj = createEditorObject(key, value);
    var controller = host.scriptRoot.add(obj, key).step(1);
    controller.onChange(function (value) {
        host.save(key, value);
    });
    controller.onFinishChange(function (value) {
        host.save(key, value);
    });
};
exports.propertyEditor_String = function (host, script, key) {
    var value = script[key];
    var obj = createEditorObject(key, value);
    var controller = host.scriptRoot.add(obj, key);
    controller.onChange(function (value) {
        host.save(key, value);
    });
    controller.onFinishChange(function (value) {
        host.save(key, value);
    });
};
exports.propertyEditor_None = function (host, script, key) {
    host.scriptRoot.addFolder(key);
};
exports.SerilizeField = function (propertyEditorFactory) { return function (target, key) {
    var clz = target;
    if (!clz.serilizeableKeys) {
        clz.serilizeableKeys = [];
    }
    clz.serilizeableKeys.push({
        key: key, propertyEditorFactory: propertyEditorFactory
    });
}; };
var Behaviour = /** @class */ (function () {
    function Behaviour() {
        this.name = this.constructor.name;
    }
    Behaviour.prototype.onEditorUpdate = function () {
    };
    return Behaviour;
}());
exports.Behaviour = Behaviour;
var RenderableBehaviour = /** @class */ (function (_super) {
    __extends(RenderableBehaviour, _super);
    function RenderableBehaviour() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RenderableBehaviour.prototype.onRender = function (context) {
    };
    RenderableBehaviour.prototype.getRenderArea = function () {
        return null;
    };
    return RenderableBehaviour;
}(Behaviour));
exports.RenderableBehaviour = RenderableBehaviour;
var GameObject = /** @class */ (function () {
    function GameObject(isStage) {
        if (isStage === void 0) { isStage = false; }
        this.alpha = 1;
        this.globalAlpha = 1;
        this.isStage = false;
        this.children = [];
        this._scripts = [];
        this.isStage = isStage;
        var hitTestScript = new HitTestScript();
        this.addScript(hitTestScript);
    }
    GameObject.prototype.addChild = function (displayObject) {
        this.children.push(displayObject);
        displayObject.parent = this;
        editmode_1.editorAPI.nofityListener();
    };
    GameObject.prototype.removeChild = function (displayObject) {
        var index = this.children.indexOf(displayObject);
        this.children.splice(index, 1);
        editmode_1.editorAPI.nofityListener();
    };
    GameObject.prototype.addScript = function (script) {
        script.displayObject = this;
        this._scripts.push(script);
        script.onStart();
    };
    /**
     * T 是一个泛型
     */
    GameObject.prototype.getScript = function (clz) {
        for (var _i = 0, _a = this._scripts; _i < _a.length; _i++) {
            var script = _a[_i];
            if (script.constructor === clz) {
                return script;
            }
        }
        return null;
    };
    GameObject.prototype.onUpdate = function () {
        for (var _i = 0, _a = this._scripts; _i < _a.length; _i++) {
            var script = _a[_i];
            script.onUpdate();
        }
        for (var _b = 0, _c = this.children; _b < _c.length; _b++) {
            var child = _c[_b];
            child.onUpdate();
        }
    };
    GameObject.prototype.onEditorUpdate = function () {
        for (var _i = 0, _a = this._scripts; _i < _a.length; _i++) {
            var script = _a[_i];
            script.onEditorUpdate();
        }
        for (var _b = 0, _c = this.children; _b < _c.length; _b++) {
            var child = _c[_b];
            child.onEditorUpdate();
        }
    };
    GameObject.prototype.draw = function (context) {
        var globalMatrix = this.getScript(Transform).globalMatrix;
        if (!this.isStage) {
            this.globalAlpha = this.alpha * this.parent.globalAlpha;
        }
        context.globalAlpha = this.globalAlpha;
        context.setTransform(globalMatrix.a, globalMatrix.b, globalMatrix.c, globalMatrix.d, globalMatrix.tx, globalMatrix.ty);
        if (this.renderNode) {
            this.renderNode.onRender(context);
        }
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.draw(context);
        }
    };
    return GameObject;
}());
exports.GameObject = GameObject;
var SpriteRenderer = /** @class */ (function (_super) {
    __extends(SpriteRenderer, _super);
    function SpriteRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SpriteRenderer.prototype.onStart = function () {
        this.displayObject.renderNode = this;
    };
    SpriteRenderer.prototype.onUpdate = function () {
    };
    SpriteRenderer.prototype.onRender = function (context) {
        if (this.imageName) {
            var image = getImage(this.imageName);
            context.drawImage(image, 0, 0);
        }
    };
    SpriteRenderer.prototype.getRenderArea = function () {
        if (this.imageName) {
            var image = getImage(this.imageName);
            return { x: 0, y: 0, width: image.width, height: image.height };
        }
        return null;
    };
    __decorate([
        exports.SerilizeField(exports.propertyEditor_String)
    ], SpriteRenderer.prototype, "imageName", void 0);
    return SpriteRenderer;
}(RenderableBehaviour));
exports.SpriteRenderer = SpriteRenderer;
var TextRenderer = /** @class */ (function (_super) {
    __extends(TextRenderer, _super);
    function TextRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.text = "";
        _this.fontSize = 24;
        return _this;
    }
    TextRenderer.prototype.onStart = function () {
        this.displayObject.renderNode = this;
    };
    TextRenderer.prototype.onUpdate = function () {
    };
    TextRenderer.prototype.onRender = function (context) {
        var lines = this.text.split("\n");
        context.font = this.fontSize + 'px Arial';
        context.fillStyle = '#FF0000';
        var lineCount = 0;
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            lineCount++;
            context.fillText(line, 0, this.fontSize * lineCount);
        }
    };
    TextRenderer.prototype.getRenderArea = function () {
        return { x: 0, y: 0, width: 100, height: 20 };
    };
    __decorate([
        exports.SerilizeField(exports.propertyEditor_String)
    ], TextRenderer.prototype, "text", void 0);
    __decorate([
        exports.SerilizeField(exports.propertyEditor_Number)
    ], TextRenderer.prototype, "fontSize", void 0);
    return TextRenderer;
}(RenderableBehaviour));
exports.TextRenderer = TextRenderer;
var images = {};
function getImage(url) {
    return images[url];
}
exports.getImage = getImage;
var GameEngineCore = /** @class */ (function () {
    function GameEngineCore() {
        this.stage = new GameObject(true);
        this.canvas = platform_1.getPlatform().getMainCanvas();
        this.context = this.canvas.getContext("2d");
        this.stage.addScript(new Transform());
    }
    GameEngineCore.prototype.loadImage = function (url) {
        var img = document.createElement("img");
        img.src = url;
        images[url] = img;
    };
    GameEngineCore.prototype.loadScene = function (sceneUrl) {
        var _this = this;
        platform_1.getPlatform().loadText(sceneUrl, function (text) {
            var json = JSON.parse(text);
            _this.createScene(json);
        });
    };
    GameEngineCore.prototype.createScene = function (data) {
        if (this.currentScene) {
            this.stage.removeChild(this.currentScene);
        }
        var rootDisplayObject = createGameObject(data);
        this.stage.addChild(rootDisplayObject);
        this.currentScene = rootDisplayObject;
    };
    GameEngineCore.prototype.createPrefab = function (data) {
        var gameObject = createGameObject(data);
        return gameObject;
    };
    GameEngineCore.prototype.start = function () {
        var _this = this;
        this.executeFrame();
        platform_1.getPlatform().listenTouchEvent(function (clickX, clickY) {
            var hitTestScript = _this.stage.getScript(HitTestScript);
            var hitTestDisplayObject = hitTestScript.hitTest(clickX, clickY);
            var displayObject = hitTestDisplayObject;
            while (displayObject) {
                var hitTestScript_1 = displayObject.getScript(HitTestScript);
                if (hitTestScript_1 && hitTestScript_1.onClick) {
                    hitTestScript_1.onClick(hitTestScript_1.clickLocalX, hitTestScript_1.clickLocalY);
                }
                displayObject = displayObject.parent;
            }
        });
    };
    GameEngineCore.prototype.executeFrame = function () {
        requestAnimationFrame(this.executeFrame.bind(this));
        this.update();
    };
    /**
     * 游戏引擎心跳控制
     * - 清除屏幕
     * - 执行用户逻辑
     * - 执行渲染
     */
    GameEngineCore.prototype.update = function () {
        this.clearScreen();
        this.executeUserLogic();
        this.drawRenderList();
    };
    GameEngineCore.prototype.clearScreen = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    GameEngineCore.prototype.drawRenderList = function () {
        this.context.save();
        this.stage.draw(this.context);
        this.context.restore();
    };
    GameEngineCore.prototype.executeUserLogic = function () {
        if (isEditorMode()) {
            this.stage.onEditorUpdate();
        }
        else {
            this.stage.onUpdate();
        }
    };
    return GameEngineCore;
}());
exports.GameEngineCore = GameEngineCore;
var ids = {};
function getGameObjectById(id) {
    return ids[id];
}
exports.getGameObjectById = getGameObjectById;
function createDataFromGameObject(gameObject) {
    var json = {};
    if (gameObject.id) {
        json.id = gameObject.id;
    }
    if (gameObject.children) {
        json.children = [];
        for (var _i = 0, _a = gameObject.children; _i < _a.length; _i++) {
            var child = _a[_i];
            var dataChild = createDataFromGameObject(child);
            json.children.push(dataChild);
        }
    }
    if (gameObject._scripts) {
        json.scripts = [];
        for (var _b = 0, _c = gameObject._scripts; _b < _c.length; _b++) {
            var script = _c[_b];
            var scriptName = script.constructor.name;
            if (scriptName === 'HitTestScript') {
                continue;
            }
            var serilizedData = {
                scriptName: script.constructor.name
            };
            var serilizeableKeys = script['__proto__'].serilizeableKeys;
            if (serilizeableKeys) {
                for (var _d = 0, serilizeableKeys_1 = serilizeableKeys; _d < serilizeableKeys_1.length; _d++) {
                    var item = serilizeableKeys_1[_d];
                    serilizedData[item.key] = script[item.key];
                }
            }
            json.scripts.push(serilizedData);
        }
    }
    return json;
}
exports.createDataFromGameObject = createDataFromGameObject;
function createGameObject(data) {
    var gameObject = new GameObject();
    if (data.id) {
        ids[data.id] = gameObject;
        gameObject.id = data.id;
    }
    if (data.children) {
        for (var _i = 0, _a = data.children; _i < _a.length; _i++) {
            var childData = _a[_i];
            var child = createGameObject(childData);
            if (child) {
                gameObject.addChild(child);
            }
        }
    }
    if (data.scripts) {
        for (var _b = 0, _c = data.scripts; _b < _c.length; _b++) {
            var scriptData = _c[_b];
            var script = createScript(scriptData);
            var serilizeableKeys = script['__proto__'].serilizeableKeys;
            if (serilizeableKeys) {
                for (var _d = 0, serilizeableKeys_2 = serilizeableKeys; _d < serilizeableKeys_2.length; _d++) {
                    var item = serilizeableKeys_2[_d];
                    script[item.key] = scriptData[item.key];
                }
            }
            gameObject.addScript(script);
        }
    }
    return gameObject;
}
exports.createGameObject = createGameObject;
var scriptMap = {};
/**
 * 里式替换法则
 */
function registerScript(scriptClass) {
    scriptMap[scriptClass.name] = scriptClass;
}
exports.registerScript = registerScript;
function createScript(data) {
    var scriptName = data.scriptName;
    var clz = scriptMap[scriptName];
    var script = new clz();
    return script;
}
console.log('before Transform');
var Transform = /** @class */ (function (_super) {
    __extends(Transform, _super);
    function Transform() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.x = 0;
        _this.y = 0;
        _this.scaleX = 1;
        _this.scaleY = 1;
        _this.rotation = 0;
        _this.localMatrix = new math_1.Matrix();
        _this.globalMatrix = new math_1.Matrix();
        return _this;
    }
    Transform.prototype.onStart = function () {
    };
    Transform.prototype.onEditorUpdate = function () {
        this.onUpdate();
    };
    Transform.prototype.onUpdate = function () {
        this.localMatrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
        var parent = this.displayObject.parent;
        if (parent) {
            var parentTransform = this.displayObject.parent.getScript(Transform);
            this.globalMatrix = math_1.matrixAppendMatrix(this.localMatrix, parentTransform.globalMatrix);
        }
    };
    __decorate([
        exports.SerilizeField(exports.propertyEditor_Number)
    ], Transform.prototype, "x", void 0);
    __decorate([
        exports.SerilizeField(exports.propertyEditor_Number)
    ], Transform.prototype, "y", void 0);
    __decorate([
        exports.SerilizeField(exports.propertyEditor_Number)
    ], Transform.prototype, "rotation", void 0);
    return Transform;
}(Behaviour));
exports.Transform = Transform;
console.log('after Transform');
var HitTestScript = /** @class */ (function (_super) {
    __extends(HitTestScript, _super);
    function HitTestScript() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.hitTestArea = { x: 0, y: 0, width: 100, height: 100 };
        return _this;
    }
    HitTestScript.prototype.hitTest = function (clickLocalX, clickLocalY) {
        this.clickLocalX = clickLocalX;
        this.clickLocalY = clickLocalY;
        var displayObject = this.displayObject;
        var length = displayObject.children.length - 1;
        for (var i = length; i >= 0; i--) {
            var child = displayObject.children[i];
            var localMatrix = child.getScript(Transform).localMatrix;
            var invertLocalMatrix = math_1.invertMatrix(localMatrix);
            var clickLocalPoint = new math_1.Point(clickLocalX, clickLocalY);
            //相对于子对象的相对坐标 = 相对于当前对象的相对坐标 * 子对象的相对矩阵的逆矩阵
            var childLocalPoint = math_1.pointAppendMatrix(clickLocalPoint, invertLocalMatrix);
            var childHitTestScript = child.getScript(HitTestScript);
            var result = childHitTestScript.hitTest(childLocalPoint.x, childLocalPoint.y);
            if (result) {
                return result;
            }
        }
        var renderNode = this.displayObject.renderNode;
        if (renderNode) {
            var renderArea = renderNode.getRenderArea();
            if (renderArea) {
                if (clickLocalX >= 0 && clickLocalX <= renderArea.width &&
                    clickLocalY >= 0 && clickLocalY <= renderArea.height) {
                    return displayObject;
                }
                else {
                    return null;
                }
            }
            return null;
        }
        else {
            return null;
        }
    };
    HitTestScript.prototype.onStart = function () {
    };
    HitTestScript.prototype.onUpdate = function () {
    };
    return HitTestScript;
}(Behaviour));
exports.HitTestScript = HitTestScript;
registerScript(Transform);
registerScript(HitTestScript);
registerScript(SpriteRenderer);
registerScript(TextRenderer);
function isEditorMode() {
    return platform_1.getPlatform().isEditorMode();
}
exports.isEditorMode = isEditorMode;
window['editorAPI'] = editmode_1.editorAPI;
exports.core = new GameEngineCore();


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var astar_1 = __webpack_require__(/*! ./astar */ "./src/astar.ts");
var command_1 = __webpack_require__(/*! ./command */ "./src/command.ts");
var data_1 = __webpack_require__(/*! ./data */ "./src/data.ts");
var gameengine_1 = __webpack_require__(/*! ./gameengine */ "./src/gameengine.ts");
var item_1 = __webpack_require__(/*! ./item */ "./src/item.ts");
var npc_1 = __webpack_require__(/*! ./npc */ "./src/npc.ts");
var tilemap_1 = __webpack_require__(/*! ./tilemap */ "./src/tilemap.ts");
var user_1 = __webpack_require__(/*! ./user */ "./src/user.ts");
var WalkableBehaviour = /** @class */ (function (_super) {
    __extends(WalkableBehaviour, _super);
    function WalkableBehaviour() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.path = [];
        _this.speedY = 0;
        _this.speedX = 0;
        _this.pathIndex = 0;
        return _this;
    }
    WalkableBehaviour.prototype.onStart = function () {
    };
    WalkableBehaviour.prototype.setStartPosition = function (startX, startY) {
        var transform = this.displayObject.getScript(gameengine_1.Transform);
        transform.x = startX;
        transform.y = startY;
    };
    WalkableBehaviour.prototype.goto = function (path) {
        this.path = path;
        this.pathIndex = 0;
    };
    WalkableBehaviour.prototype.onUpdate = function () {
        if (!this.path[this.pathIndex]) {
            return;
        }
        var transform = this.displayObject.getScript(gameengine_1.Transform);
        var targetX = this.path[this.pathIndex].x;
        var targetY = this.path[this.pathIndex].y;
        if (transform.y === targetY) {
            this.speedY = 0;
        }
        else if (transform.y < targetY) {
            this.speedY = 1;
        }
        else {
            this.speedY = -1;
        }
        if (transform.x === targetX) {
            this.speedX = 0;
        }
        else if (transform.x < targetX) {
            this.speedX = 1;
        }
        else {
            this.speedX = -1;
        }
        var arrivedSingleTarget = transform.x === targetX && transform.y === targetY;
        if (arrivedSingleTarget) {
            this.pathIndex++;
            if (this.pathIndex >= this.path.length) {
                if (this.onFinished) {
                    this.onFinished();
                }
            }
        }
        transform.x += this.speedX;
        transform.y += this.speedY;
    };
    return WalkableBehaviour;
}(gameengine_1.Behaviour));
exports.WalkableBehaviour = WalkableBehaviour;
var WalkCommand = /** @class */ (function (_super) {
    __extends(WalkCommand, _super);
    function WalkCommand(walkable, tileX, tileY) {
        var _this = _super.call(this) || this;
        _this.walkable = walkable;
        _this.tileX = tileX;
        _this.tileY = tileY;
        return _this;
    }
    WalkCommand.prototype.execute = function () {
        var _this = this;
        var findpath = new astar_1.astar.FindPath();
        var tilemap = gameengine_1.getGameObjectById("tilemap");
        var grid = tilemap.getScript(tilemap_1.TileMapRenderer).grid;
        findpath.setHeurisitic(findpath.euclidian);
        var transform = this.walkable.displayObject.getScript(gameengine_1.Transform);
        var startX = Math.floor(transform.x / 64);
        var startY = Math.floor(transform.y / 64);
        var paths = findpath.findPath(grid, startX, startY, this.tileX, this.tileY);
        if (paths) {
            var path = paths.map(function (node) {
                return { x: node.x * 64, y: node.y * 64 };
            });
            path.shift();
            this.walkable.onFinished = function () {
                _this.onFinished();
            };
            this.walkable.goto(path);
        }
        else {
            this.onFinished();
        }
    };
    WalkCommand.prototype.cancel = function () {
        console.log('取消移动');
    };
    return WalkCommand;
}(command_1.CommandBase));
var TalkCommand = /** @class */ (function (_super) {
    __extends(TalkCommand, _super);
    function TalkCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TalkCommand.prototype.execute = function () {
        var _this = this;
        var ui = gameengine_1.core.createPrefab(data_1.uiPrefabData);
        var uiRoot = gameengine_1.getGameObjectById("UIRoot");
        uiRoot.getScript(gameengine_1.HitTestScript).onClick = function () {
            uiRoot.removeChild(ui);
            _this.onFinished();
        };
        uiRoot.addChild(ui);
        this.ui = ui;
    };
    TalkCommand.prototype.cancel = function () {
        var uiRoot = gameengine_1.getGameObjectById("UIRoot");
        uiRoot.removeChild(this.ui);
    };
    return TalkCommand;
}(command_1.CommandBase));
var MainRoleBehaviour = /** @class */ (function (_super) {
    __extends(MainRoleBehaviour, _super);
    function MainRoleBehaviour() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.commandPool = new command_1.CommandPool();
        return _this;
    }
    MainRoleBehaviour.prototype.goto = function (tileX, tileY) {
        var walkable = this.displayObject.getScript(WalkableBehaviour);
        var walkCommand1 = new WalkCommand(walkable, tileX, tileY);
        this.commandPool.push(walkCommand1);
        var itemLayer = gameengine_1.getGameObjectById('itemLayer');
        var itemLayerBehaviour = itemLayer.getScript(item_1.ItemLayerBehaviour);
        var item = itemLayerBehaviour.getItemByTileXY(tileX, tileY);
        if (item) {
            var useItemCommand = new item_1.UseItemCommand(item);
            this.commandPool.push(useItemCommand);
        }
        else {
            var talkCommand = new TalkCommand();
            this.commandPool.push(talkCommand);
        }
        // const walkCommand2 = new WalkCommand(walkable, 0, 0);
        // this.commandPool.push(talkCommand);
        // this.commandPool.push(walkCommand2);
        this.commandPool.seriesExecuteAllCommand();
    };
    MainRoleBehaviour.prototype.onStart = function () {
        var _this = this;
        var tilemap = gameengine_1.getGameObjectById("tilemap");
        var hitTest = tilemap.getScript(gameengine_1.HitTestScript);
        hitTest.onClick = function (localX, localY) {
            var tileX = Math.floor(localX / 64);
            var tileY = Math.floor(localY / 64);
            _this.goto(tileX, tileY);
        };
    };
    MainRoleBehaviour.prototype.onUpdate = function () {
    };
    return MainRoleBehaviour;
}(gameengine_1.Behaviour));
exports.MainRoleBehaviour = MainRoleBehaviour;
var TopUIBehaviour = /** @class */ (function (_super) {
    __extends(TopUIBehaviour, _super);
    function TopUIBehaviour() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TopUIBehaviour.prototype.onStart = function () {
    };
    TopUIBehaviour.prototype.onUpdate = function () {
        var text = this.displayObject.getScript(gameengine_1.TextRenderer);
        text.text = user_1.user.gold.toString();
    };
    return TopUIBehaviour;
}(gameengine_1.Behaviour));
exports.TopUIBehaviour = TopUIBehaviour;
gameengine_1.registerScript(tilemap_1.TileMapRenderer);
gameengine_1.registerScript(MainRoleBehaviour);
gameengine_1.registerScript(WalkableBehaviour);
gameengine_1.registerScript(npc_1.NpcBehaviour);
gameengine_1.registerScript(item_1.ItemLayerBehaviour);
gameengine_1.registerScript(TopUIBehaviour);
gameengine_1.core.loadImage("assets/icon.jpg");
gameengine_1.core.loadImage("assets/font.png");
gameengine_1.core.loadImage("assets/0.png");
gameengine_1.core.loadImage("assets/1.png");
gameengine_1.core.loadImage("assets/item1.png");
gameengine_1.core.loadImage("assets/item2.png");
gameengine_1.core.loadImage("assets/enermy.jpg");
gameengine_1.core.loadImage("assets/conversation.png");
gameengine_1.core.start();
if (!gameengine_1.isEditorMode()) {
    gameengine_1.core.loadScene('assets/game.scene.json');
}


/***/ }),

/***/ "./src/item.ts":
/*!*********************!*\
  !*** ./src/item.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var gameengine_1 = __webpack_require__(/*! ./gameengine */ "./src/gameengine.ts");
var gameengine_2 = __webpack_require__(/*! ./gameengine */ "./src/gameengine.ts");
var data_1 = __webpack_require__(/*! ./data */ "./src/data.ts");
var command_1 = __webpack_require__(/*! ./command */ "./src/command.ts");
var user_1 = __webpack_require__(/*! ./user */ "./src/user.ts");
var config_1 = __webpack_require__(/*! ./config */ "./src/config.ts");
var ItemLayerBehaviour = /** @class */ (function (_super) {
    __extends(ItemLayerBehaviour, _super);
    function ItemLayerBehaviour() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.items = [];
        return _this;
    }
    ItemLayerBehaviour.prototype.onStart = function () {
        if (!gameengine_1.isEditorMode()) {
            for (var _i = 0, _a = this.itemData; _i < _a.length; _i++) {
                var itemData = _a[_i];
                var itemGameObject = gameengine_2.core.createPrefab(data_1.itemPrefab);
                var transform = itemGameObject.getScript(gameengine_1.Transform);
                var cId = itemData.cId;
                transform.x = itemData.x * 64;
                transform.y = itemData.y * 64;
                var gameItem = void 0;
                if (cId == 1) {
                    gameItem = new HpItem(cId);
                }
                else if (cId == 2) {
                    gameItem = new GoldItem(cId);
                }
                if (gameItem) {
                    gameItem.x = itemData.x;
                    gameItem.y = itemData.y;
                    gameItem.cId = itemData.cId;
                    gameItem.uId = itemData.uId;
                    var spriteRenderer = itemGameObject.getScript(gameengine_1.SpriteRenderer);
                    spriteRenderer.imageName = gameItem.config.iconName;
                    this.items.push(gameItem);
                    gameItem.itemGameObject = itemGameObject;
                }
                this.displayObject.addChild(itemGameObject);
            }
        }
    };
    ItemLayerBehaviour.prototype.onUpdate = function () {
    };
    ItemLayerBehaviour.prototype.getItemByTileXY = function (tileX, tileY) {
        var result = this.items.find(function (item) { return item.x === tileX && item.y === tileY; });
        if (result) {
            return result;
        }
        else {
            return null;
        }
    };
    __decorate([
        gameengine_1.SerilizeField(gameengine_1.propertyEditor_None)
    ], ItemLayerBehaviour.prototype, "itemData", void 0);
    return ItemLayerBehaviour;
}(gameengine_1.Behaviour));
exports.ItemLayerBehaviour = ItemLayerBehaviour;
var Item = /** @class */ (function () {
    function Item(cId) {
        this.config = config_1.itemConfig.find(function (config) { return config.id === cId; });
    }
    /**
     * 使用一个道具，如果使用完需要消失，返回true,否则返回 false
     */
    Item.prototype.use = function () {
        return false;
    };
    return Item;
}());
exports.Item = Item;
var HpItem = /** @class */ (function (_super) {
    __extends(HpItem, _super);
    function HpItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HpItem.prototype.use = function () {
        console.log("\u4F60\u4F7F\u7528\u4E86" + this.config.name);
        return true;
    };
    return HpItem;
}(Item));
exports.HpItem = HpItem;
var GoldItem = /** @class */ (function (_super) {
    __extends(GoldItem, _super);
    function GoldItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GoldItem.prototype.use = function () {
        user_1.user.gold += 100;
        return true;
    };
    return GoldItem;
}(Item));
exports.GoldItem = GoldItem;
var UseItemCommand = /** @class */ (function (_super) {
    __extends(UseItemCommand, _super);
    function UseItemCommand(item) {
        var _this = _super.call(this) || this;
        _this.item = item;
        return _this;
    }
    UseItemCommand.prototype.execute = function () {
        var needDisappear = this.item.use();
        if (needDisappear) {
            var gameObject = this.item.itemGameObject;
            gameObject.parent.removeChild(gameObject);
        }
        this.onFinished();
    };
    UseItemCommand.prototype.cancel = function () {
    };
    return UseItemCommand;
}(command_1.CommandBase));
exports.UseItemCommand = UseItemCommand;


/***/ }),

/***/ "./src/math.ts":
/*!*********************!*\
  !*** ./src/math.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * 数学相关类，由于本引擎是一个 2D 游戏引擎，所以内置的 Point 只有 x,y 两个属性，并且矩阵是个 3*3 矩阵
 * 扩展阅读：矩阵运算的几何意义是什么？
 * https://www.zhihu.com/question/21351965/answer/204058188
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 表示一个点，也等价于一个二维向量
 */
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
exports.Point = Point;
/**
 *
 * @param point 矩阵与向量相乘
 */
function pointAppendMatrix(point, m) {
    var x = m.a * point.x + m.c * point.y + m.tx;
    var y = m.b * point.x + m.d * point.y + m.ty;
    return new Point(x, y);
}
exports.pointAppendMatrix = pointAppendMatrix;
/**
 * 使用伴随矩阵法求逆矩阵
 * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
 */
function invertMatrix(m) {
    var a = m.a;
    var b = m.b;
    var c = m.c;
    var d = m.d;
    var tx = m.tx;
    var ty = m.ty;
    var determinant = a * d - b * c;
    var result = new Matrix(1, 0, 0, 1, 0, 0);
    if (determinant == 0) {
        throw new Error("no invert");
    }
    determinant = 1 / determinant;
    var k = result.a = d * determinant;
    b = result.b = -b * determinant;
    c = result.c = -c * determinant;
    d = result.d = a * determinant;
    result.tx = -(k * tx + c * ty);
    result.ty = -(b * tx + d * ty);
    return result;
}
exports.invertMatrix = invertMatrix;
/**
 *
 * 矩阵与矩阵相乘
 */
function matrixAppendMatrix(m1, m2) {
    var result = new Matrix();
    result.a = m1.a * m2.a + m1.b * m2.c;
    result.b = m1.a * m2.b + m1.b * m2.d;
    result.c = m2.a * m1.c + m2.c * m1.d;
    result.d = m2.b * m1.c + m1.d * m2.d;
    result.tx = m2.a * m1.tx + m2.c * m1.ty + m2.tx;
    result.ty = m2.b * m1.tx + m2.d * m1.ty + m2.ty;
    return result;
}
exports.matrixAppendMatrix = matrixAppendMatrix;
var PI = Math.PI;
var HalfPI = PI / 2;
var PacPI = PI + HalfPI;
var TwoPI = PI * 2;
var DEG_TO_RAD = Math.PI / 180;
var Matrix = /** @class */ (function () {
    function Matrix(a, b, c, d, tx, ty) {
        if (a === void 0) { a = 1; }
        if (b === void 0) { b = 0; }
        if (c === void 0) { c = 0; }
        if (d === void 0) { d = 1; }
        if (tx === void 0) { tx = 0; }
        if (ty === void 0) { ty = 0; }
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
    }
    /**
     * 返回将 Matrix 对象表示的几何转换应用于指定点所产生的结果。
     */
    Matrix.prototype.toString = function () {
        return "(a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
    };
    /**
     * 根据显示对象的属性确定当前矩阵
     */
    Matrix.prototype.updateFromDisplayObject = function (x, y, scaleX, scaleY, rotation) {
        this.tx = x;
        this.ty = y;
        var skewX, skewY;
        skewX = skewY = rotation / 180 * Math.PI;
        ;
        if ((skewX == 0 || skewX == TwoPI) && (skewY == 0 || skewY == TwoPI)) {
            this.a = scaleX;
            this.b = this.c = 0;
            this.d = scaleY;
            return;
        }
        var u = Math.cos(skewX);
        var v = Math.sin(skewX);
        if (skewX == skewY) {
            this.a = u * scaleX;
            this.b = v * scaleX;
        }
        else {
            this.a = Math.cos(skewY) * scaleX;
            this.b = Math.sin(skewY) * scaleX;
        }
        this.c = -v * scaleY;
        this.d = u * scaleY;
    };
    return Matrix;
}());
exports.Matrix = Matrix;


/***/ }),

/***/ "./src/npc.ts":
/*!********************!*\
  !*** ./src/npc.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var gameengine_1 = __webpack_require__(/*! ./gameengine */ "./src/gameengine.ts");
var _1 = __webpack_require__(/*! . */ "./src/index.ts");
var NpcBehaviour = /** @class */ (function (_super) {
    __extends(NpcBehaviour, _super);
    function NpcBehaviour() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.patrol = [];
        return _this;
    }
    NpcBehaviour.prototype.onStart = function () {
        var _this = this;
        var walkable = this.displayObject.getScript(_1.WalkableBehaviour);
        walkable.goto(this.patrol.map(function (node) {
            return {
                x: node.x * 64,
                y: node.y * 64
            };
        }));
        walkable.onFinished = function () {
            _this.patrol = _this.patrol.reverse();
            console.log(_this.patrol);
            walkable.goto(_this.patrol.map(function (node) {
                return {
                    x: node.x * 64,
                    y: node.y * 64
                };
            }));
        };
        // const npcBehaviour = getGameObjectById("npcLayer").getScript(NPCLayerBehaviour);
        // npcBehaviour.addNPC(this);
    };
    NpcBehaviour.prototype.onUpdate = function () {
    };
    __decorate([
        gameengine_1.SerilizeField(gameengine_1.propertyEditor_None)
    ], NpcBehaviour.prototype, "patrol", void 0);
    return NpcBehaviour;
}(gameengine_1.Behaviour));
exports.NpcBehaviour = NpcBehaviour;
var NPCLayerBehaviour = /** @class */ (function (_super) {
    __extends(NPCLayerBehaviour, _super);
    function NPCLayerBehaviour() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.npcs = [];
        return _this;
    }
    NPCLayerBehaviour.prototype.addNPC = function (npc) {
        this.npcs.push(npc);
    };
    NPCLayerBehaviour.prototype.getNPCBYTileXY = function (tileX, tileY) {
    };
    NPCLayerBehaviour.prototype.onStart = function () {
    };
    NPCLayerBehaviour.prototype.onUpdate = function () {
    };
    return NPCLayerBehaviour;
}(gameengine_1.Behaviour));
exports.NPCLayerBehaviour = NPCLayerBehaviour;


/***/ }),

/***/ "./src/platform.ts":
/*!*************************!*\
  !*** ./src/platform.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var platform;
function getPlatform() {
    if (platform) {
        return platform;
    }
    if (window['canvas']) {
        platform = new WxgamePlatform();
    }
    else {
        platform = new BrowserPlatform();
    }
    return platform;
}
exports.getPlatform = getPlatform;
var Platform = /** @class */ (function () {
    function Platform() {
    }
    return Platform;
}());
var BrowserPlatform = /** @class */ (function (_super) {
    __extends(BrowserPlatform, _super);
    function BrowserPlatform() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BrowserPlatform.prototype.listenTouchEvent = function (callback) {
        var canvas = this.getMainCanvas();
        canvas.onclick = function (e) {
            console.log('helloworld');
            var rect = canvas.getBoundingClientRect();
            var clickX = Math.round(e.clientX - rect.left);
            var clickY = Math.round(e.clientY - rect.top);
            callback(clickX, clickY);
        };
    };
    BrowserPlatform.prototype.isEditorMode = function () {
        return location.search.indexOf("editorMode=1") >= 0;
    };
    BrowserPlatform.prototype.getMainCanvas = function () {
        return document.getElementById("gameCanvas");
    };
    BrowserPlatform.prototype.loadText = function (url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            callback(xhr.responseText);
        };
        xhr.open("get", url);
        xhr.send();
    };
    return BrowserPlatform;
}(Platform));
var WxgamePlatform = /** @class */ (function (_super) {
    __extends(WxgamePlatform, _super);
    function WxgamePlatform() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.scale = 1;
        return _this;
    }
    WxgamePlatform.prototype.listenTouchEvent = function (callback) {
        var _this = this;
        wx.onTouchStart(function (result) {
            var touch = result.touches[0];
            var clientX = touch.clientX / _this.scale;
            var clientY = touch.clientY / _this.scale;
            console.log(clientX, clientY, _this.scale);
            callback(clientX, clientY);
        });
    };
    WxgamePlatform.prototype.isEditorMode = function () {
        return false;
    };
    WxgamePlatform.prototype.getMainCanvas = function () {
        var canvas = window['canvas'];
        var width = canvas.width;
        var height = canvas.height;
        var scale = width / height;
        canvas.width = 600;
        canvas.height = Math.floor(600 / scale);
        this.scale = scale;
        return canvas;
    };
    WxgamePlatform.prototype.loadText = function (url, callback) {
        var fs = wx.getFileSystemManager();
        var content = fs.readFileSync(url, 'utf-8');
        callback(content);
    };
    return WxgamePlatform;
}(Platform));


/***/ }),

/***/ "./src/tilemap.ts":
/*!************************!*\
  !*** ./src/tilemap.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var astar_1 = __webpack_require__(/*! ./astar */ "./src/astar.ts");
var gameengine_1 = __webpack_require__(/*! ./gameengine */ "./src/gameengine.ts");
var TileMapRenderer = /** @class */ (function (_super) {
    __extends(TileMapRenderer, _super);
    function TileMapRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tileData = [];
        return _this;
    }
    TileMapRenderer.prototype.onStart = function () {
        this.displayObject.renderNode = this;
        this.grid = new astar_1.astar.Grid(6, 4);
        for (var rowIndex = 0; rowIndex < this.tileData.length; rowIndex++) {
            var row = this.tileData[rowIndex];
            for (var colIndex = 0; colIndex < row.length; colIndex++) {
                var walkable = row[colIndex] == 1 ? false : true;
                this.grid.setWalkable(colIndex, rowIndex, walkable);
            }
        }
    };
    TileMapRenderer.prototype.onUpdate = function () {
    };
    TileMapRenderer.prototype.onRender = function (context) {
        for (var rowIndex = 0; rowIndex < this.tileData.length; rowIndex++) {
            var row = this.tileData[rowIndex];
            for (var colIndex = 0; colIndex < row.length; colIndex++) {
                var data = row[colIndex];
                var imageUrl = "assets/" + data + ".png";
                var image = gameengine_1.getImage(imageUrl);
                context.drawImage(image, colIndex * 64, rowIndex * 64);
            }
        }
    };
    TileMapRenderer.prototype.getRenderArea = function () {
        return {
            x: 0,
            y: 0,
            width: this.grid.numCols * 64,
            height: this.grid.numRows * 64
        };
    };
    __decorate([
        gameengine_1.SerilizeField(gameengine_1.propertyEditor_None)
    ], TileMapRenderer.prototype, "tileData", void 0);
    return TileMapRenderer;
}(gameengine_1.RenderableBehaviour));
exports.TileMapRenderer = TileMapRenderer;


/***/ }),

/***/ "./src/user.ts":
/*!*********************!*\
  !*** ./src/user.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var User = /** @class */ (function () {
    function User() {
        this.name = "";
        this.gold = 100;
        this.bag = [];
    }
    return User;
}());
exports.User = User;
exports.user = new User();


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map