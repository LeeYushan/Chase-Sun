import { Behaviour, GameObject } from "../gameengine";
import { user } from "../user";
import { createContainer } from "./utils";
import { getPlatform } from "../platform";
import { Collider } from "./Collider";

type State = "up" | "down";

export class GamePlayBehaviour extends Behaviour {

    private duringTime = 0;


    private state:State = "up";


    private currentTouchId:number = -1;

    private gameObjects:GameObject[] = [];

    protected onStart() {


        const gameObject = createContainer();
        const collider = new Collider();
        gameObject.addScript(collider);
        this.gameObjects.push(gameObject);
        this.displayObject.addChild(gameObject);

        getPlatform().listenTouch((event)=>{
            if (event.type === 'touchstart'){
                if (this.currentTouchId == -1){
                    this.changeState("down");
                    this.currentTouchId = event.touchId;
                }
              
            }
            else if (event.type === 'touchend'){
                if (this.currentTouchId === event.touchId){
                    this.changeState("up");
                    this.currentTouchId = -1;
                }
            }
            
        })

    
      
    } 

    private onStateChanged(to:State){
        console.log('按键切换为',to)
        const gameObjects = this.gameObjects;
        const first = gameObjects[0].getScript(Collider);
        if (to === 'down'){
           
            if (first.state === 'waiting'){
                console.log('什么也没发生');
            }
            else if (first.state === 'touchable'){
                first.changeState('touching-cannot-release')
            }
        }
        else if (to ==='up'){
            if (first.state === "touching-cannot-release"){
                first.changeState('touched-fail')
            }
            else if (first.state === 'touching-can-release'){
                first.changeState('touched-success');
            }
        }
    }
    
    private changeState(state:State ){
        if (this.state != state){
            this.state = state;
            this.onStateChanged(state);
        }
    }

     protected onUpdate(advancedTime: number) {
       
        this.duringTime += advancedTime;
        user.score  = this.duringTime
    }



}