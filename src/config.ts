export type ItemConfigType = {
    id: number,
    name: string;
    iconName: string;
}


export const itemConfig: ItemConfigType[] = [
    { id: 1, name: '小型治疗药水', iconName: "assets/item1.png" },
    { id: 2, name: "金币", iconName: "assets/item2.png" }
]