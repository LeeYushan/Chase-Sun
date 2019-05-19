import { core } from "./gameengine";
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

    setScriptProperty(scriptUUID: string, property: { name: string, value: any }) {
        const script = this.scriptsUUIDMap[scriptUUID];
        script[property.name] = property.value;
    }

    nofityListener() {
        if (this.listener) {
            const result = this.getInfo();
            this.listener(result);
        }
    }

    changeScene(sceneUrl:string) {
        core.loadScene(sceneUrl);
    }


    private getInfo() {
        const scriptsUUIDMap = this.scriptsUUIDMap;
        let uuId = 0;
        function getGameObjectInfo(gameObject: GameObject) {
            const name = gameObject.id || "Unnamed";
            const children = gameObject.children.map(child => getGameObjectInfo(child));

            const scripts = gameObject._scripts.map(script => {
                uuId++;
                scriptsUUIDMap[uuId] = script;
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
                    name: script.name, properties, uuId
                }
            })
            return { name, children, scripts }
        }
        return getGameObjectInfo(core.stage);

    }
}

export const editorAPI = new EditorAPI();