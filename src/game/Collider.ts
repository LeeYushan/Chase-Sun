import { Behaviour } from "../gameengine";


const FALL_TIME = 4000;

const MISTAKE_TIME = 1000;


type State ="idle" | "waiting" | "touchable" | "touching-cannot-release" | "touching-can-release" | "touched-success" | "touched-fail" | "missing";

export class Collider extends Behaviour {

    appearTime: number = 0;


    speedRate: number = 1;

    sizeTime: number = 4000;

    state: State = "waiting";
    private duringTime = 0;

    changeState(state: State) {
        if (this.state != state) {
            this.state = state;
            this.onChangeState(state);
        }
    }

    private onChangeState(to: State) {
        console.log('碰撞体切换为', to)
    }

    protected onStart() {

    }

    protected onUpdate(advancedTime: number) {
        this.duringTime += advancedTime;
        if (this.state === 'waiting') {
            if (this.duringTime >= this.appearTime + FALL_TIME) {
                this.changeState("touchable")
            }
        }
        else if (this.state === 'touchable') {
            if (this.duringTime >= this.appearTime + FALL_TIME + MISTAKE_TIME) {
                this.changeState("missing");
            }
        }
        else if (this.state === 'touching-cannot-release') {
            if (this.duringTime >= this.appearTime + FALL_TIME + this.sizeTime) {
                this.changeState('touching-can-release')
            }
        }
    }

    isMatch(time: number) {
        if (time >= this.appearTime + FALL_TIME &&
            time <= this.appearTime + FALL_TIME + MISTAKE_TIME
        ) {
            console.log('match!!!!')
            return true;
        }
        {
            return false;
        }

    }



}