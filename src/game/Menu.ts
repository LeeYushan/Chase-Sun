import { Behaviour, core } from "../gameengine";
import { Slider } from "./Slider";
import { createBitmap } from "./utils";

export class Menu extends Behaviour {
    onStart() {

        const slider = this.displayObject.getScript(Slider);
        slider.onCreateItemRenderer = (data)=>{
            return createBitmap(data.imageName);
        }
        slider.datas = [
            {imageName:'assets/item1.png'},
            {imageName:'assets/item1.png'},
            {imageName:'assets/item1.png'}
        ]
        slider.onSelect = (data)=>{
            core.loadScene("assets/main.scene.json")
        }
        slider.iconWidth = slider.iconHeight = 64;
    } 
    
    onUpdate(advancedTime: number) {

    }



}