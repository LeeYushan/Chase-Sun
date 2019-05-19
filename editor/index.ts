import { Hierarchy } from "./Hierarchy";
import { Inspector } from "./Inspector";
import GoldenLayout from 'golden-layout';
let editorAPI

function getEditorAPIAsync(callback) {
    const gameIFrame = document.getElementById("game") as HTMLIFrameElement;
    editorAPI = (gameIFrame.contentWindow as any).editorAPI;
    if (!editorAPI || !editorCore) {
        setTimeout(() => {
            getEditorAPIAsync(callback)
        }, 100);
    }
    else {
        callback(editorAPI)
    }
}

export function getEditorAPI() {
    return editorAPI;
}

export type Property = { name: string, createPropertyEditor: Function };

export type NodeInfo = {
    name: string,
    children: NodeInfo[],
    scripts: { uuId: string, name: string, properties: Property[] }[]
};


export class EditorCore {

    hierarchy = new Hierarchy();

    inspector = new Inspector();

    private listenerOnSelectNode = [];

    addListenerOnSelectNode(listener: Function) {
        this.listenerOnSelectNode.push(listener);
    }

    notifySelectNode(node: NodeInfo) {
        for (let listener of this.listenerOnSelectNode) {
            listener(node);
        }
    }

    create() {
        this.hierarchy.initView();
        this.inspector.initView();
    }
}

export const editorCore = new EditorCore();


var config = {
    content: [{
        type: 'row',
        content: [
            {
                type: 'component',
                componentName: 'hierarchy',
                componentState: { text: 'Component 1' },
                width:100
            },
            {
                type: 'component',
                componentName: 'scene',
                componentState: { text: 'Component 2' },
                width: 300
            },
            {
                type: 'component',
                componentName: 'inspector',
                componentState: { text: 'Component 3' },
                width:100
            }
        ]
    }
]
};
var myLayout = new GoldenLayout(config);
myLayout.init();
myLayout.registerComponent('hierarchy', function (container, componentState) {
    container.getElement().html(`
        <div id="hierarchy"></div>  
    ` );
});
myLayout.registerComponent('inspector', function (container, componentState) {
    container.getElement().html(`
    <div id="inspector"></div>
    ` );
});

myLayout.registerComponent('scene', function (container, componentState) {
    container.getElement().html(`
    <iframe frameborder="0" id="game" src="http://localhost:8080/?editorMode=1" width="640" height="640"></iframe>
    ` );
});


setTimeout(()=>{
    getEditorAPIAsync(() => {
        editorAPI.changeScene('game.scene.json');
        editorCore.create();
    })
},100)
