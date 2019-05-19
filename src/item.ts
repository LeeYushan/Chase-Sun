import { Behaviour, GameObject, Transform, SpriteRenderer, isEditorMode, SerilizeField, propertyEditor_None } from "./gameengine";
import { core } from "./gameengine";
import { itemPrefab } from "./data";
import { CommandBase } from "./command";
import { user } from "./user";
import { ItemConfigType, itemConfig } from "./config";

export class ItemLayerBehaviour extends Behaviour {


    private items: Item[] = [];
    @SerilizeField(propertyEditor_None)
    private itemData: any[];

    onStart() {

        if (!isEditorMode()) {
            for (let itemData of this.itemData) {
                const itemGameObject = core.createPrefab(itemPrefab);
                const transform = itemGameObject.getScript(Transform);
                const cId = itemData.cId;

                transform.x = itemData.x * 64;
                transform.y = itemData.y * 64;
                let gameItem: Item;
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
                    const spriteRenderer = itemGameObject.getScript(SpriteRenderer);
                    spriteRenderer.imageName = gameItem.config.iconName;
                    this.items.push(gameItem);
                    gameItem.itemGameObject = itemGameObject;
                }
                this.displayObject.addChild(itemGameObject);
            }
        }

    }

    onUpdate() {
    }

    getItemByTileXY(tileX: number, tileY: number): Item {
        const result = this.items.find(item => item.x === tileX && item.y === tileY);
        if (result) {
            return result;
        }
        else {
            return null;
        }
    }
}

export abstract class Item {

    uId: number;
    cId: number;
    x: number;
    y: number;
    itemGameObject: GameObject;
    config: ItemConfigType;

    constructor(cId: number) {
        this.config = itemConfig.find(config => config.id === cId);
    }

    /**
     * 使用一个道具，如果使用完需要消失，返回true,否则返回 false
     */
    use(): boolean {

        return false;
    }
}

export class HpItem extends Item {

    use() {
        console.log(`你使用了${this.config.name}`);
        return true;
    }
}


export class GoldItem extends Item {

    use() {
        user.gold += 100;
        return true;
    }
}


export class UseItemCommand extends CommandBase {

    private item: Item;
    constructor(item: Item) {
        super();
        this.item = item;
    }

    execute() {
        const needDisappear = this.item.use();
        if (needDisappear) {
            const gameObject = this.item.itemGameObject;
            gameObject.parent.removeChild(gameObject);
        }


        this.onFinished();
    }

    cancel() {

    }
}