import { Behaviour, ClipRenderer, HitTestScript, propertyEditor_Number, SerilizeField, Transform, GameObject } from "../gameengine";
import { MoveBehaviour } from "./MoveBehaviour";
import { createBitmap, createContainer } from "./utils";

export class Slider extends Behaviour {

    @SerilizeField(propertyEditor_Number)
    contentWidth: number = 0;
    @SerilizeField(propertyEditor_Number)
    contentHeight: number = 0;

    datas:any[];

    iconWidth:number;
    iconHeight:number;


    onSelect:(data:any)=>void;

    onCreateItemRenderer:(data:any)=>GameObject;


    onStart() {
        const container = createContainer();
        const clipRenderer = new ClipRenderer();
        clipRenderer.contentWidth = this.contentWidth;
        clipRenderer.contentHeight = this.contentHeight;
        this.displayObject.addScript(clipRenderer);

        this.displayObject.addChild(container);
        const iconX = (this.contentWidth - this.iconWidth) / 2;
        const iconY = (this.contentHeight - this.iconHeight) / 2;

        let index = 0;
        for (let icon of this.datas) {
            const iconGameObject = this.onCreateItemRenderer(icon); 
            const iconTransform = iconGameObject.getScript(Transform);
            iconTransform.x = iconX;
            iconTransform.y = iconY + this.contentHeight * index
            container.addChild(iconGameObject);
            const hitTest = iconGameObject.getScript(HitTestScript);
            hitTest.onClick = ()=>{
                if (this.onSelect){
                    this.onSelect(icon);
                }
                return true;
            }
            index++;
        }

        const hitTest = this.displayObject.getScript(HitTestScript);
        hitTest.onClick = () => {
            const move = new MoveBehaviour();
            move.targetY = -this.contentHeight
            container.addScript(move);
        }
    }



    onUpdate() { }



}