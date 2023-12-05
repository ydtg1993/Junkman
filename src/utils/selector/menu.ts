import {Selector} from "./index";
import {SelectorInterface} from "./init";

export class Menu extends Selector implements SelectorInterface{
    constructor(dom: HTMLElement, data: any) {
        super(dom, data);
    }

    make(){

    }
}