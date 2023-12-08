import {loader} from './aid/loader';
import {contextmenu} from './aid/contextmenu';
import {request} from './aid/request';
import {createDOMFromTree} from './aid/dombuilder'
import {imgDelay} from "./aid/imgdelay";
import {Icon} from "./aid/icon";

import {Tip} from './utils/tip/index';
import {Menu} from './utils/selector/menu';
import {SELECTOR_MENU_DIRECTION,SELECTOR_SWITCHER_DIRECTION,SELECTOR_MODE} from './utils/selector/init'
import {Sandbox} from "./utils/selector/sandbox";
import {Switcher} from "./utils/selector/switcher";

const selector = {
    /**
     * @class Menu
     * @param dom   type:HTMLDocument   description: bind parent node
     * @param select    type:{key:value,...}    description: select options data
     *
     * @function limit(num:int)     description: preset selected options limit number
     * @function selected(params)   params:[value,...]
     * @function settings(params)   description: preset menu select placeholder,options max height, options popup direction
     *      params: {
     *          placeholder:string,
     *          height:string,
     *          direction:junkman.SELECTOR_MENU_DIRECTION
     *     }
     * @function useHiddenInput(name:string)    description: use hidden input save data
     * @function trigger    description: preset callback function in the event on click option
     *      callback: (data)=>{
     *          data.value      description: current selected value
     *          data.operate    description: insert or delete
     *          data.select     description: selected options
     *          data.insert     description: selected options except beginning selected
     *          data.delete     description: deleted from the beginning selected
     *      }
     * @function make   description: :build document
     */
    Menu: Menu,

    Sandbox:Sandbox,

    Switcher:Switcher,
};

export {
    request, loader, contextmenu,createDOMFromTree,imgDelay,Icon,
    Tip,
    selector, SELECTOR_MENU_DIRECTION,SELECTOR_SWITCHER_DIRECTION,SELECTOR_MODE
};