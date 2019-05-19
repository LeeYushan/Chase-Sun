
export type Data_DisplayObject = {
    scripts?: any[]
    id?: string,
    children?: Data_DisplayObject[]
}

export const uiPrefabData: Data_DisplayObject = {
    scripts: [
        { scriptName: "Transform", x: 0, y: 0, rotation: 0 },
        { scriptName: "SpriteRenderer", imageName: "assets/font.png" }
    ],
}

export const itemPrefab: Data_DisplayObject = {
    scripts: [
        { scriptName: "Transform", x: 0, y: 0, rotation: 0 },
        {
            scriptName: "SpriteRenderer"
        },
    ]
}