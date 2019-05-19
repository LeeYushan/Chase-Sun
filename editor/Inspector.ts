import * as dat from 'dat.gui';
import * as fs from 'fs';
import { editorCore, getEditorAPI, NodeInfo } from ".";

const gui = new dat.GUI({ autoPlace: false });
let root;
export class Inspector {

    initView() {
        const customContainer = document.getElementById('inspector');
        customContainer.appendChild(gui.domElement);
        editorCore.addListenerOnSelectNode((node: NodeInfo) => {
            this.updateInspector(node)
        })
    }

    private updateInspector(nodeInfo: NodeInfo) {
        if (root) {
            gui.removeFolder(root)
        }
        root = gui.addFolder(`GameObject:${nodeInfo.name}`);
        root.open();
        for (let script of nodeInfo.scripts) {
            const scriptRoot = root.addFolder(`脚本名称:${script.name}`);
            scriptRoot.open();
            for (let property of script.properties) {
                const host = new PropertyEditComponentHost(script.uuId);
                host.scriptRoot = scriptRoot;
                property.createPropertyEditor(host);
            }
        }
    }
}

class PropertyEditComponentHost {

    private scriptUUID: string;
    constructor(scriptUUID: string) {
        this.scriptUUID = scriptUUID;
    }

    scriptRoot: any;

    save(name: string, value: any) {
        const newProperty = { name, value };
        const editorAPI = getEditorAPI();
        editorAPI.setScriptProperty(this.scriptUUID, newProperty);
        const saveData = editorAPI.save();
        fs.writeFileSync('game.scene.json', saveData, 'utf-8');
    }
}