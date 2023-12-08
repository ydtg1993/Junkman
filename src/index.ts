import {loader} from './aid/loader';
import {contextmenu} from './aid/contextmenu';
import {request} from './aid/request';

import {Tip} from './utils/tip/index';
import {Menu} from './utils/selector/menu';
import {SELECTOR_MENU_DIRECTION} from './utils/selector/init'
import {Sandbox} from "./utils/selector/sandbox";

const selector = {
    /**
     * @class Menu
     * @param dom   type:HTMLDocument   des:bind parent node
     * @param select    type:{key:value,...}    des:select options data
     *
     * @function limit(int)  des:preset selected options limit number
     * @function settings(params)   des:preset menu select placeholder,options max height, options popup direction
     *      @params {
     *          placeholder:string,
     *          height:string,
     *          direction:junkman.SELECTOR_MENU_DIRECTION
     *     }
     * @function make   des:build document
     */
    Menu: Menu,

    Sandbox:Sandbox,
};

export {
    request, loader, contextmenu,
    Tip,
    selector, SELECTOR_MENU_DIRECTION
};