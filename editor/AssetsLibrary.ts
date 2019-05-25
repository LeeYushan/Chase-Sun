import * as fs from 'fs';
import * as path from 'path';
import { getEditorAPI, getCurrentSceneFilePath } from '.';

export class AssetsLibrary {

    initView() {
        const files = getFiles("assets");
        const container = document.getElementById("assetslibrary");
        for (let file of files){
            const fileIcon = document.createElement("div");
            fileIcon.innerText = file;
            container.appendChild(fileIcon);
            fileIcon.onclick = ()=>{
                if (file.indexOf(".scene.json") >= 0){
                    console.log('这是一个场景')
                    const editorAPI = getEditorAPI();
                    editorAPI.changeScene(file);
                }
                console.log (file)
            }
        }
    }
}

function getFiles(dirname: string,result?:string[]) {
    if (!result){
        result = [];
    }
    const files = fs.readdirSync(dirname);
   
    for (let file of files) {
        const filePath = path.join(dirname, file).split("\\").join("/");
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            getFiles(filePath,result)
        }
        else if (stat.isFile()){
            result.push(filePath)
        }
    }
    return result;
}