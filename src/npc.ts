import { Behaviour, getGameObjectById, SerilizeField, propertyEditor_None } from "./gameengine";
import { WalkableBehaviour } from ".";


export class NpcBehaviour extends Behaviour {
    @SerilizeField(propertyEditor_None)
    private patrol: { x: number, y: number }[] = [];
    onStart() {
        const walkable = this.displayObject.getScript(WalkableBehaviour);
        walkable.goto(this.patrol.map(node => {
            return {
                x: node.x * 64,
                y: node.y * 64
            }
        }));
        walkable.onFinished = () => {
            this.patrol = this.patrol.reverse();
            console.log(this.patrol)
            walkable.goto(this.patrol.map(node => {
                return {
                    x: node.x * 64,
                    y: node.y * 64
                }
            }));
        }
        // const npcBehaviour = getGameObjectById("npcLayer").getScript(NPCLayerBehaviour);
        // npcBehaviour.addNPC(this);
    }
    onUpdate() {

    }
}

export class NPCLayerBehaviour extends Behaviour {


    private npcs: NpcBehaviour[] = [];
    addNPC(npc: NpcBehaviour) {
        this.npcs.push(npc);
    }

    getNPCBYTileXY(tileX: number, tileY: number) {

    }

    onStart() {
    }
    onUpdate() {
    }
}