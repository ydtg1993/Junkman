import {Selector} from "./index";
import {SELECTOR_MENU_DIRECTION, SelectorInterface} from "./init";

export class Switcher extends Selector implements SelectorInterface {

    make(){
        let domTree = {
            className: 'jk jk-selector-sandbox',
            nodes: [
                {
                    className:'jk-selector-sandbox-head',
                    nodes:[
                        {className: 'jk-input jk-selector-menu-select'}
                    ]
                },
                {
                    className:'jk-selector-sandbox-body',
                    nodes:[

                    ]
                }
            ]
        };
    }
}