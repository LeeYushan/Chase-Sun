import { core, getScriptsName, createScript } from "./gameengine";
import { GameObject, Behaviour, Transform, getGameObjectById, createDataFromGameObject } from "./gameengine";

export class EditorAPI {

    private scriptsUUIDMap = {};

    private listener: (data: any) => void;

    addListener(listener: (data: any) => void) {
        this.listener = listener;
        this.nofityListener();
    }

    save() {

        const jsonData = createDataFromGameObject(core.stage.children[0]);
        const content = JSON.stringify(jsonData, null, '\t');
        return content;

    }

    addGameObject(){
        const container = core.stage.children[0];
        const gameObject = new GameObject();
        const transform = new Transform();
        gameObject.addScript(transform);
        container.addChild(gameObject);
    }

    addScript(gameObjectUUID:string,scriptName:string){
        const container = core.stage.children[0];
        const script = createScript({scriptName:scriptName})
        container.addScript(script);
    }

    getScriptsList(){
        return getScriptsName();
    }

    setScriptProperty(scriptUUID: string, property: { name: string, value: any }) {
        const script = this.scriptsUUIDMap[scriptUUID];
        script[property.name] = property.value;
    }

    nofityListener() {
        if (this.listener) {
            const result = this.getInfo();
            console.log(result)
            this.listener(result);
        }
    }

    currentSceneFilePath:string;

    changeScene(sceneUrl:string) {
        this.currentSceneFilePath = sceneUrl;
        core.loadScene(sceneUrl);
    }


    private getInfo() {
        const scriptsUUIDMap = this.scriptsUUIDMap;
        let gameObjectUUID = 0;
        let scriptUUID = 0;
        function getGameObjectInfo(gameObject: GameObject) {
            gameObjectUUID++;
            const name = gameObject.id ? gameObject.id +"."+ gameObjectUUID : "Unnamed." + gameObjectUUID;
            const children = gameObject.children.map(child => getGameObjectInfo(child));
          
            const scripts = gameObject._scripts.map(script => {
                scriptUUID++;
                scriptsUUIDMap[scriptUUID] = script;
                const properties = []
                const serilizeableKeys = script['__proto__'].serilizeableKeys;
                if (serilizeableKeys) {
                    for (let item of serilizeableKeys) {
                        const property = {
                            name: item.key,
                            createPropertyEditor: (host) => {
                                return item.propertyEditorFactory(host, script, item.key);
                            }
                        };
                        properties.push(property)

                    }
                }


                return {
                    name: script.name, properties, uuId: scriptUUID
                }
            })
            return { name, children, scripts,uuId:gameObjectUUID }
        }
        return getGameObjectInfo(core.stage);

    }
}

export const editorAPI = new EditorAPI();