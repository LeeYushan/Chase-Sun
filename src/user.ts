import { Item } from "./item";

export class User {

    name: string = "";

    gold: number = 100;

    bag: Item[] = [];
}


export const user = new User();