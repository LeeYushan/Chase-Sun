import { Hierarchy } from "./Hierarchy";
import { Inspector } from "./Inspector";
import GoldenLayout from 'golden-layout';
import { AssetsLibrary } from "./AssetsLibrary";
let editorAPI

export function getCurrentSceneFilePath(){
    return 'assets/game.scene.json';
}


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


/**
 * 这里是用来让 getEditorAPI 可以进行类型检查，代码提示
 * 不要去研究这个语法是什么意思，就当没看见
 * 王泽
 */
type Type_EditorAPI = InstanceType<typeof import('../src/editmode')['EditorAPI']>

export function getEditorAPI():Type_EditorAPI {
    return editorAPI;
}

export type Property = { name: string, createPropertyEditor: Function };

export type NodeInfo = {
    uuId:string,
    name: string,
    children: NodeInfo[],
    scripts: { uuId: string, name: string, properties: Property[] }[]
};


export class EditorCore {

    hierarchy = new Hierarchy();

    inspector = new Inspector();

    assets = new AssetsLibrary();

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
        this.assets.initView();
    }
}

export const editorCore = new EditorCore();

const rows = {
    type: 'row',
    height:300,
    content: [
        {
            type: 'component',
            componentName: 'hierarchy',
            width:100
        },
        {
            type: 'component',
            componentName: 'scene',
            width: 300
        },
        {
            type: 'component',
            componentName: 'inspector',
            width:100
        }
    ]
}

const config = {
    content: [
        {
            type:"column",
            content:[
                rows,
                {
                    type: 'component',
                    componentName: 'assetslibrary',
                    height:100
                }
            ]
        }
       
]
};
const myLayout = new GoldenLayout(config);
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
myLayout.registerComponent('assetslibrary', function (container, componentState) {
    container.getElement().html(`
    <div id="assetslibrary"></div>
    ` );
});


setTimeout(()=>{
    getEditorAPIAsync(() => {
        // const currentSceneFilePath = getCurrentSceneFilePath();
        // editorAPI.changeScene(currentSceneFilePath);
        editorCore.create();
    })
},100)
