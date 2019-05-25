import * as dat from 'dat.gui';
import { remote } from 'electron';
import { editorCore, getEditorAPI, NodeInfo } from ".";
import * as fs from 'fs';
const { Menu , MenuItem } = remote;

let root;

export class Hierarchy {

    initView() {

        const gui = new dat.GUI({ autoPlace: false });
        const customContainer = document.getElementById('hierarchy');
        customContainer.appendChild(gui.domElement);


        customContainer.addEventListener('contextmenu', (e) => { 
            e.preventDefault();

            const menu = new Menu();
            menu.append(new MenuItem({label:'创建 GameObject' ,click:()=>{
                console.log (1111)
                editorAPI.addGameObject();
                const saveData = editorAPI.save();
                fs.writeFileSync(editorAPI.currentSceneFilePath, saveData, 'utf-8');
            }}));
            menu.popup({ window:remote.getCurrentWindow()});
            // if(isEleEditable(e.target)){
            //     menu.popup(remote.getCurrentWindow());
            // }else{
            //     //判断有文本选中
            //     let selectText = window.getSelection().toString();
            //     if(!!selectText){
            //         menu2.popup(remote.getCurrentWindow());
            //     }
            // }
            
        }, false) 

    
        editorCore.addListenerOnSelectNode((node) => {


        })

        const editorAPI = getEditorAPI();
        editorAPI.addListener((info: NodeInfo) => {

           
            if (root){
                gui.removeFolder(root);
            }
            root = gui.addFolder('root')
    
            function createGuiTree(parent, data: NodeInfo) {
                const folder = parent.addFolder(data.name);
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