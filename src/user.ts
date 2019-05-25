import { Item } from "./item";

export class User {

    name: string = "";

    gold: number = 100;

    bag: Item[] = [];

    score:number = 0;
}


export const user = new User();