import { core, GameObject, TextRenderer, Transform, SpriteRenderer } from "./gameengine";

core.loadImage('assets/item1.png');
core.start();
core.loadScene('assets/test.scene.json')
// const text = new GameObject();
// const textRenderer = new TextRenderer();
// textRenderer.text = "helloworld"
// const textTransform = new Transform();
// textTransform.x = textTransform.y = textTransform.rotation = 0;
// text.addScript(textRenderer);
// text.addScript(textTransform);


// const image = new GameObject();
// const imageRenderer = new SpriteRenderer();
// imageRenderer.imageName = "assets/item1.png";
// const imageTransform = new Transform();
// imageTransform.x = imageTransform.y = imageTransform.rotation = 0;
// image.addScript(imageRenderer);
// image.addScript(imageTransform);

// core.stage.addChild(image)