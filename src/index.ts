import {loader} from './aid/loader';
import {contextmenu} from './aid/contextmenu';
import {request} from './aid/request';

import {Tip} from './utils/tip/index';
import {Menu} from './utils/selector/menu';

const selector = {
    Menu: Menu
};

export {
    request, loader, contextmenu,
    Tip,
    selector
};