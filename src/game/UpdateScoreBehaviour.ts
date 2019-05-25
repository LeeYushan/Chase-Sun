import { Behaviour, TextRenderer } from "../gameengine";
import { user } from "../user";

export class UpdateScoreBehaviour extends Behaviour {

    protected onStart() {

    }

    protected onUpdate(advancedTime: number) {
        const text = this.displayObject.getScript(TextRenderer);
        text.text = user.score.toString();
    }


}