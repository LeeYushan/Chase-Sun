var a = {

    id: "Scene",
    scripts: [
        { scriptName: "Transform", x: 0, y: 0, rotation: 0 }
    ],
    children: [
        {
            id: "tilemap",
            scripts: [
                { scriptName: "Transform", x: 0, y: 100, rotation: 0 },
                {
                    scriptName: "TileMapRenderer", tileData: [
                        [0, 1, 0, 0, 0, 0],
                        [0, 1, 0, 0, 0, 0],
                        [0, 0, 0, 0, 1, 0],
                        [0, 0, 0, 0, 1, 0],
                    ]
                }
            ],
            children: [
                {
                    id: "itemLayer",
                    scripts: [
                        { scriptName: "Transform", x: 0, y: 0, rotation: 0 },
                        {
                            scriptName: "ItemLayerBehaviour",
                            itemData: [
                                { x: 2, y: 0, cId: 1, uId: 1 },
                                { x: 4, y: 0, cId: 2, uId: 2 }
                            ]
                        }
                    ],
                    children: [

                    ]
                },
                {
                    scripts: [
                        { scriptName: "Transform", x: 0, y: 0, rotation: 0 },
                        {
                            scriptName: "SpriteRenderer", imageName: "assets/icon.jpg"
                        },
                        {
                            scriptName: "MainRoleBehaviour"
                        },
                        {
                            scriptName: "WalkableBehaviour"
                        }
                    ]
                },
                {
                    scripts: [
                        { scriptName: "Transform", x: 256, y: 64, rotation: 0 },
                        {
                            scriptName: "SpriteRenderer", imageName: "assets/icon.jpg"
                        },
                        {
                            scriptName: "WalkableBehaviour"
                        },
                        {
                            scriptName: "NpcBehaviour",
                            patrol: [{ x: 4, y: 1 }, { x: 5, y: 1 }]
                        }
                    ]
                },
            ]
        },


        {
            id: "UIRoot",
            scripts: [
                { scriptName: "Transform", x: 0, y: 0, rotation: 0 }
            ],
            children: [
                {
                    scripts: [
                        { scriptName: "Transform", x: 0, y: 0, rotation: 0 },
                        { scriptName: "TextRenderer", text: "helloworld" },
                        { scriptName: "TopUIBehaviour" }
                    ]
                }
            ]
        }
    ]
};

const content = JSON.stringify(a, null, '\t');
const fs = require('fs');
fs.writeFileSync('game.scene.json', content, 'utf-8');