import { astar } from "./astar";
import { CommandBase, CommandPool } from "./command";
import { uiPrefabData } from "./data";
import { Behaviour, GameEngineCore, GameObject, getGameObjectById, HitTestScript, registerScript, TextRenderer, Transform, isEditorMode, core } from "./gameengine";
import { ItemLayerBehaviour, UseItemCommand } from "./item";
import { NpcBehaviour } from "./npc";
import { TileMapRenderer } from "./tilemap";
import { user } from "./user";
import { Slider } from "./game/Slider";
import { Menu } from "./game/Menu";
import { UpdateScoreBehaviour } from "./game/UpdateScoreBehaviour";
import { GamePlayBehaviour } from "./game/GamePlayBehaviour";

export class WalkableBehaviour extends Behaviour {

    private path: { x: number, y: number }[] = [];

    private speedY: number = 0;
    private speedX: number = 0;

    private pathIndex = 0;

    onFinished: Function;

    onStart() {
    }

    setStartPosition(startX: number, startY: number) {
        const transform = this.displayObject.getScript(Transform);
        transform.x = startX;
        transform.y = startY;
    }

    goto(path: { x: number, y: number }[]) {
        this.path = path;
        this.pathIndex = 0;

    }

    onUpdate() {
        if (!this.path[this.pathIndex]) {
            return;
        }
        const transform = this.displayObject.getScript(Transform);

        const targetX = this.path[this.pathIndex].x;
        const targetY = this.path[this.pathIndex].y;
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


        const arrivedSingleTarget = transform.x === targetX && transform.y === targetY;
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
    }

}


class WalkCommand extends CommandBase {

    private walkable: WalkableBehaviour;
    private tileX: number;
    private tileY: number;
    constructor(walkable: WalkableBehaviour, tileX: number, tileY: number) {
        super();
        this.walkable = walkable;
        this.tileX = tileX;
        this.tileY = tileY;
    }

    execute() {

        const findpath = new astar.FindPath();
        const tilemap = getGameObjectById("tilemap");
        const grid = tilemap.getScript(TileMapRenderer).grid;
        findpath.setHeurisitic(findpath.euclidian);
        const transform = this.walkable.displayObject.getScript(Transform);
        const startX = Math.floor(transform.x / 64);
        const startY = Math.floor(transform.y / 64);

        const paths = findpath.findPath(grid, startX, startY, this.tileX, this.tileY);
        if (paths) {
            const path = paths.map(node => {
                return { x: node.x * 64, y: node.y * 64 }
            });
            path.shift();
            this.walkable.onFinished = () => {
                this.onFinished();
            }
            this.walkable.goto(path);
        }
        else {
            this.onFinished();
        }

    }

    cancel(): void {
        console.log('取消移动')
    }
}

class TalkCommand extends CommandBase {
    private ui: GameObject;
    execute(): void {
        const ui = core.createPrefab(uiPrefabData);
        const uiRoot = getGameObjectById("UIRoot");
        uiRoot.getScript(HitTestScript).onClick = () => {
            uiRoot.removeChild(ui);
            this.onFinished();
        }
        uiRoot.addChild(ui);
        this.ui = ui;
    }

    cancel() {
        const uiRoot = getGameObjectById("UIRoot");
        uiRoot.removeChild(this.ui);
    }

}

export class MainRoleBehaviour extends Behaviour {

    private commandPool = new CommandPool();


    private goto(tileX: number, tileY: number) {
        const walkable = this.displayObject.getScript(WalkableBehaviour)
        const walkCommand1 = new WalkCommand(walkable, tileX, tileY);
        this.commandPool.push(walkCommand1);



        const itemLayer = getGameObjectById('itemLayer');
        const itemLayerBehaviour = itemLayer.getScript(ItemLayerBehaviour);
        const item = itemLayerBehaviour.getItemByTileXY(tileX, tileY);
        if (item) {
            const useItemCommand = new UseItemCommand(item);
            this.commandPool.push(useItemCommand);
        }
        else {
            const talkCommand = new TalkCommand();
            this.commandPool.push(talkCommand);
        }

        // const walkCommand2 = new WalkCommand(walkable, 0, 0);

        // this.commandPool.push(talkCommand);

        // this.commandPool.push(walkCommand2);
        this.commandPool.seriesExecuteAllCommand();

    }

    onStart() {
        const tilemap = getGameObjectById("tilemap");
        const hitTest = tilemap.getScript(HitTestScript);
        hitTest.onClick = (localX, localY) => {
            const tileX = Math.floor(localX / 64);
            const tileY = Math.floor(localY / 64);
            this.goto(tileX, tileY);
        }

    }
    onUpdate() {

    }
}



export class TopUIBehaviour extends Behaviour {
    onStart() {

    }
    onUpdate() {
        const text = this.displayObject.getScript(TextRenderer);
        text.text = user.gold.toString();
    }
}

class Character extends Behaviour{
    private speed;
    protected onStart() 
    {
        
    }    
    
    protected onUpdate(advancedTime: number) {
        
    }

    public getCharacterSpeed():number{
        return this.speed;
    }

    public setCharacterSpeed(speed:number){
        this.speed=speed;
    }
}

class SceneFollow extends Behaviour{
    protected onStart() {
        throw new Error("Method not implemented.");
    }    
    
    protected onUpdate(advancedTime: number) {
        throw new Error("Method not implemented.");
    }
}

registerScript(TileMapRenderer);
registerScript(MainRoleBehaviour);
registerScript(WalkableBehaviour);
registerScript(NpcBehaviour);
registerScript(ItemLayerBehaviour);
registerScript(TopUIBehaviour);
registerScript(Slider);
registerScript(Menu);
registerScript(UpdateScoreBehaviour);
registerScript(GamePlayBehaviour);

core.loadImage("assets/icon.jpg");
core.loadImage("assets/font.png");
core.loadImage("assets/0.png");
core.loadImage("assets/1.png");
core.loadImage("assets/item1.png");
core.loadImage("assets/item2.png");
core.loadImage("assets/scene.png");
core.loadImage("assets/kuafu.png");
core.loadImage("assets/sun.png");


core.start();

if (!isEditorMode()) {
    core.loadScene('assets/menu.scene.json')
}

