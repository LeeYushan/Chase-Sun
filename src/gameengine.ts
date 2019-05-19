import { Data_DisplayObject as Data_GameObject } from "./data";
import { editorAPI } from "./editmode";
import { invertMatrix, Matrix, matrixAppendMatrix, Point, pointAppendMatrix } from "./math";
import { getPlatform } from "./platform";

// https://www.w3cschool.cn/html5/q2ybmfle.html

// 如何实现可复用？ -> 使用组合，而不是继承

const cost: MethodDecorator = (target, key, desc: any) => {
    const method = desc.value;
    console.log('装饰器!!!!!')
    desc.value = function () {
        const startTime = Date.now();
        const result = method.apply(this, arguments);
        const endTime = Date.now();
        const cost = endTime - startTime;
        console.log('执行开销', cost);
        return result;
    }
}

function createEditorObject(key, value) {
    const obj = {};
    obj[key] = value;
    return obj;
}

export const propertyEditor_Number: PropertyEditorFactory = (host, script, key) => {

    const value = script[key];
    const obj = createEditorObject(key, value)
    const controller = host.scriptRoot.add(obj, key).step(1)
    controller.onChange(function (value) {
        host.save(key, value);
    });

    controller.onFinishChange(function (value) {
        host.save(key, value);
    });
};

export const propertyEditor_String: PropertyEditorFactory = (host, script, key) => {
    const value = script[key];
    const obj = createEditorObject(key, value)
    const controller = host.scriptRoot.add(obj, key);
    controller.onChange(function (value) {
        host.save(key, value);
    });

    controller.onFinishChange(function (value) {
        host.save(key, value);
    });
}

export const propertyEditor_None: PropertyEditorFactory = (host, script, key) => {
    host.scriptRoot.addFolder(key)
}


interface PropertyEditorHost {

    /**
     * 通知编辑器保存该属性
     */
    save: (name: string, value: any) => void

    /**
     * 编辑器的脚本UI扩展口
     */
    scriptRoot: any;

}

type PropertyEditorFactory = (
    host: PropertyEditorHost,
    script: Behaviour,
    key: string) => void


export const SerilizeField = (propertyEditorFactory: PropertyEditorFactory) => (target, key) => {


    const clz = target as any;
    if (!clz.serilizeableKeys) {
        clz.serilizeableKeys = [];
    }


    clz.serilizeableKeys.push({
        key, propertyEditorFactory
    });
}

export abstract class Behaviour {

    constructor() {
        this.name = this.constructor.name;
    }

    name: string;

    displayObject: GameObject;

    abstract onStart();

    onEditorUpdate() {
    }

    abstract onUpdate();

}

export abstract class RenderableBehaviour extends Behaviour {

    onRender(context: CanvasRenderingContext2D) {

    }

    getRenderArea(): { x: number, y: number, width: number, height: number } {
        return null;
    }

}


export class GameObject {


    id: string;

    alpha: number = 1;

    private globalAlpha: number = 1;

    parent: GameObject;

    private isStage: boolean = false;

    children: GameObject[] = [];

    renderNode: RenderableBehaviour;



    constructor(isStage: boolean = false) {
        this.isStage = isStage;
        const hitTestScript = new HitTestScript();
        this.addScript(hitTestScript);
    }

    addChild(displayObject: GameObject) {
        this.children.push(displayObject);
        displayObject.parent = this;
        editorAPI.nofityListener();
    }

    removeChild(displayObject: GameObject) {
        const index = this.children.indexOf(displayObject);
        this.children.splice(index, 1);
        editorAPI.nofityListener();
    }


    _scripts: Behaviour[] = [];

    addScript(script: Behaviour) {
        script.displayObject = this;
        this._scripts.push(script);
        script.onStart();
    }

    /**
     * T 是一个泛型
     */
    getScript<T extends Behaviour>(clz: { new(): T }): T {
        for (let script of this._scripts) {
            if (script.constructor === clz) {
                return script as T;
            }
        }
        return null;
    }


    onUpdate() {
        for (let script of this._scripts) {
            script.onUpdate();
        }
        for (let child of this.children) {
            child.onUpdate();
        }
    }

    onEditorUpdate() {
        for (let script of this._scripts) {
            script.onEditorUpdate();
        }
        for (let child of this.children) {
            child.onEditorUpdate();
        }
    }

    draw(context: CanvasRenderingContext2D) {
        const globalMatrix = this.getScript(Transform).globalMatrix
        if (!this.isStage) {
            this.globalAlpha = this.alpha * this.parent.globalAlpha;
        }
        context.globalAlpha = this.globalAlpha;
        context.setTransform(
            globalMatrix.a,
            globalMatrix.b,
            globalMatrix.c,
            globalMatrix.d,
            globalMatrix.tx,
            globalMatrix.ty
        )
        if (this.renderNode) {
            this.renderNode.onRender(context);
        }
        for (let child of this.children) {
            child.draw(context);
        }
    }
}



export class SpriteRenderer extends RenderableBehaviour {

    @SerilizeField(propertyEditor_String)
    imageName: string;

    onStart() {
        this.displayObject.renderNode = this;
    }

    onUpdate() {
    }

    onRender(context: CanvasRenderingContext2D) {
        if (this.imageName) {
            const image = getImage(this.imageName);
            context.drawImage(image, 0, 0);
        }
    }

    getRenderArea() {
        if (this.imageName) {
            const image = getImage(this.imageName);
            return { x: 0, y: 0, width: image.width, height: image.height }
        }
        return null;
    }

}


export class TextRenderer extends RenderableBehaviour {


    @SerilizeField(propertyEditor_String)
    text: string = "";

    @SerilizeField(propertyEditor_Number)
    fontSize: number = 24;

    onStart() {
        this.displayObject.renderNode = this;
    }

    onUpdate() {

    }

    onRender(context: CanvasRenderingContext2D) {
        const lines = this.text.split("\n");
        context.font = this.fontSize + 'px Arial'
        context.fillStyle = '#FF0000';
        let lineCount = 0;
        for (let line of lines) {
            lineCount++;
            context.fillText(line, 0, this.fontSize * lineCount);
        }
    }

    getRenderArea() {
        return { x: 0, y: 0, width: 100, height: 20 };
    }
}

const images: { [url: string]: HTMLImageElement } = {};

export function getImage(url: string) {
    return images[url];
}

export class GameEngineCore {

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    stage = new GameObject(true);

    constructor() {
        this.canvas = getPlatform().getMainCanvas();
        this.context = this.canvas.getContext("2d");
        this.stage.addScript(new Transform())
    }

    loadImage(url: string) {
        const img = document.createElement("img");
        img.src = url;
        images[url] = img;
    }

    private currentScene: GameObject;

    loadScene(sceneUrl: string) {

        getPlatform().loadText(sceneUrl,(text)=>{
            const json = JSON.parse(text);
            this.createScene(json);
        })

      
    }

    createScene(data: Data_GameObject) {
        if (this.currentScene) {
            this.stage.removeChild(this.currentScene);
        }
        const rootDisplayObject = createGameObject(data)
        this.stage.addChild(rootDisplayObject);
        this.currentScene = rootDisplayObject;
    }

    createPrefab(data: Data_GameObject) {
        const gameObject = createGameObject(data);
        return gameObject;
    }

    start() {
        this.executeFrame();

        getPlatform().listenTouchEvent((clickX:number,clickY:number)=>{
            const hitTestScript = this.stage.getScript(HitTestScript);
            const hitTestDisplayObject = hitTestScript.hitTest(clickX, clickY)
            let displayObject = hitTestDisplayObject;
            while (displayObject) {
                const hitTestScript = displayObject.getScript(HitTestScript);
                if (hitTestScript && hitTestScript.onClick) {
                    hitTestScript.onClick(hitTestScript.clickLocalX, hitTestScript.clickLocalY);
                }
                displayObject = displayObject.parent;
            }
        })
    }

    executeFrame() {
        requestAnimationFrame(this.executeFrame.bind(this));
        this.update();
    }



    /**
     * 游戏引擎心跳控制
     * - 清除屏幕
     * - 执行用户逻辑
     * - 执行渲染
     */
    update() {
        this.clearScreen();
        this.executeUserLogic();
        this.drawRenderList();
    }

    private clearScreen() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    private drawRenderList() {
        this.context.save();
        this.stage.draw(this.context);
        this.context.restore();
    }

    private executeUserLogic() {
        if (isEditorMode()) {
            this.stage.onEditorUpdate();
        }
        else {
            this.stage.onUpdate();
        }
    }
}



const ids: { [id: string]: GameObject } = {};

export function getGameObjectById(id: string) {
    return ids[id];
}


export function createDataFromGameObject(gameObject: GameObject): Data_GameObject {
    const json: Data_GameObject = {};
    if (gameObject.id) {
        json.id = gameObject.id;
    }
    if (gameObject.children) {
        json.children = [];
        for (let child of gameObject.children) {
            const dataChild = createDataFromGameObject(child);
            json.children.push(dataChild);
        }
    }
    if (gameObject._scripts) {
        json.scripts = [];
        for (let script of gameObject._scripts) {
            const scriptName = script.constructor.name;
            if (scriptName === 'HitTestScript') {
                continue;
            }
            const serilizedData = {
                scriptName: script.constructor.name
            };
            const serilizeableKeys = script['__proto__'].serilizeableKeys;
            if (serilizeableKeys) {
                for (let item of serilizeableKeys) {
                    serilizedData[item.key] = script[item.key];
                }
            }
            json.scripts.push(serilizedData);

        }
    }
    return json;
}

export function createGameObject(data: Data_GameObject): GameObject {

    const gameObject = new GameObject();
    if (data.id) {
        ids[data.id] = gameObject;
        gameObject.id = data.id;
    }
    if (data.children) {
        for (let childData of data.children) {
            const child = createGameObject(childData);
            if (child) {
                gameObject.addChild(child);
            }
        }
    }
    if (data.scripts) {
        for (let scriptData of data.scripts) {
            const script = createScript(scriptData);
            const serilizeableKeys = script['__proto__'].serilizeableKeys
            if (serilizeableKeys) {
                for (let item of serilizeableKeys) {
                    script[item.key] = scriptData[item.key];
                }
            }
            gameObject.addScript(script);
        }
    }
    return gameObject;
}


let scriptMap = {

}

/**
 * 里式替换法则
 */
export function registerScript(scriptClass: typeof Behaviour) {
    scriptMap[scriptClass.name] = scriptClass
}


function createScript(data: any): Behaviour {
    const scriptName = data.scriptName;
    const clz = scriptMap[scriptName];
    const script = new clz();
    return script;
}

console.log('before Transform')
export class Transform extends Behaviour {

    @SerilizeField(propertyEditor_Number)
    x: number = 0;

    @SerilizeField(propertyEditor_Number)
    y: number = 0;

    scaleX: number = 1;
    scaleY: number = 1;

    @SerilizeField(propertyEditor_Number)
    rotation: number = 0;

    localMatrix: Matrix = new Matrix();
    globalMatrix: Matrix = new Matrix();

    onStart() {
    }

    onEditorUpdate() {
        this.onUpdate();
    }

    onUpdate() {
        this.localMatrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
        const parent = this.displayObject.parent;
        if (parent) {
            const parentTransform = this.displayObject.parent.getScript(Transform);
            this.globalMatrix = matrixAppendMatrix(this.localMatrix, parentTransform.globalMatrix);
        }
    }
}

console.log('after Transform')

export class HitTestScript extends Behaviour {

    onClick: (localX: number, localY: number) => void;

    private clickLocalX: number;
    private clickLocalY: number;

    hitTestArea = { x: 0, y: 0, width: 100, height: 100 };


    hitTest(clickLocalX: number, clickLocalY: number) {
        this.clickLocalX = clickLocalX;
        this.clickLocalY = clickLocalY;
        const displayObject = this.displayObject;
        const length = displayObject.children.length - 1;
        for (let i = length; i >= 0; i--) {
            const child = displayObject.children[i];
            const localMatrix = child.getScript(Transform).localMatrix;
            const invertLocalMatrix = invertMatrix(localMatrix);
            const clickLocalPoint = new Point(clickLocalX, clickLocalY);
            //相对于子对象的相对坐标 = 相对于当前对象的相对坐标 * 子对象的相对矩阵的逆矩阵
            const childLocalPoint = pointAppendMatrix(clickLocalPoint, invertLocalMatrix);
            const childHitTestScript = child.getScript(HitTestScript);
            const result = childHitTestScript.hitTest(childLocalPoint.x, childLocalPoint.y);
            if (result) {
                return result;
            }
        }

        const renderNode = this.displayObject.renderNode;
        if (renderNode) {
            const renderArea = renderNode.getRenderArea();
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
    }

    onStart() {
    }

    onUpdate() {
    }

}

registerScript(Transform);
registerScript(HitTestScript);
registerScript(SpriteRenderer);
registerScript(TextRenderer);


export function isEditorMode() {
   return getPlatform().isEditorMode();
}

window['editorAPI'] = editorAPI;
export const core = new GameEngineCore();

