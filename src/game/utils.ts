import { GameObject, Transform, SpriteRenderer } from "../gameengine";

export function createBitmap(url:string){
    const gameObject = new GameObject();
    const transform = new Transform();
    gameObject.addScript(transform);
    const spriteRenderer = new SpriteRenderer();
    gameObject.addScript(spriteRenderer);
    spriteRenderer.imageName = url;
    return gameObject;
}

export function createContainer(){
    const gameObject = new GameObject();
    const transform = new Transform();
    gameObject.addScript(transform);
    return gameObject;
}