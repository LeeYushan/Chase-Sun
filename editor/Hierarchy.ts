import { editorCore, getEditorAPI, NodeInfo } from ".";
import * as dat from 'dat.gui';

let root;

export class Hierarchy {

    initView() {

        const gui = new dat.GUI({ autoPlace: false });
        const customContainer = document.getElementById('hierarchy');
        customContainer.appendChild(gui.domElement);

    
        editorCore.addListenerOnSelectNode((node) => {


        })

        const editorAPI = getEditorAPI();
        editorAPI.addListener((info: NodeInfo) => {

           
            if (root){
                gui.removeFolder(root);
            }
            root = gui.addFolder('root')
        

            let index = 0;
            function createGuiTree(parent, data: NodeInfo) {
                index++;
                const folder = parent.addFolder(data.name + "." + index);
                for (let child of data.children) {
                    createGuiTree(folder, child)
                }
                folder.domElement.onclick = (e: MouseEvent) => {
                    e.stopImmediatePropagation();
                    console.log(data.name);
                    editorCore.notifySelectNode(data)
                }
            }

            createGuiTree(root, info);
         
         
        })
    }
}