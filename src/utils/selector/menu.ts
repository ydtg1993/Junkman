import {Selector} from "./index";
import {SELECTOR_DIRECTION, SELECTOR_MODE, SelectorInterface} from "./init";
import {Icon} from "../../aid/icon";

export class Menu extends Selector implements SelectorInterface{
    private placeholder:string = '未选择';
    private maxHeight:string = '150px';
    private direction:SELECTOR_DIRECTION = SELECTOR_DIRECTION.Down;

    constructor(dom: HTMLElement, select: Map<string, any>) {
        super(dom, select);
    }

    private _menuSelect (select: Map<string, any>) {
        if (this.limitNumber === 1) {
            let d:string = this.selectData[0];
            this.SELECTED_DOM.innerHTML = `<p class="jk-text-trim">${select.get(d)}</p>`;
            return;
        }
        let html = '';
        for (let id of this.selectData) {
            html += `<span class="jk-text-trim" title="${select.get(id)}">${select.get(id)}</span>`;
        }
        this.SELECTED_DOM.innerHTML = html;
    };

    make(){
        let select = this.select;
        let menu = document.createElement('div');
        menu.className = 'jk-selector-menu';
        let menu_select = document.createElement('div');
        menu_select.className = 'jk-input jk-selector-menu-select';
        menu_select.insertAdjacentHTML('afterbegin', `<div class="dlp dlp-text">${this.placeholder}</div><div>▼</div>`);
        let menu_list = document.createElement('div');
        menu_list.className = 'jk-selector-menu-list';
        let list = document.createElement('div');
        list.className = 'jk-scroll';
        list.style.maxHeight = this.maxHeight;
        let check = Icon.check;
        let line = 0;
        for (let id in select) {
            if (!select.hasOwnProperty(id)) continue;
            this.id_line_hash[id] = line;
            line++;
            let option = document.createElement('div');
            option.className = 'option';
            option.setAttribute('data-id', id);
            option.insertAdjacentHTML('afterbegin', `
<div class="jk-text-trim" data-v="${id}">${select.get(id)}</div><div></div>`);
            option.addEventListener('click', () => {
                if (this.selectData.indexOf(id) !== -1) {
                    /*cancel*/
                    this._tagCal(id, SELECTOR_MODE.Delete);
                    option.classList.remove('jk-selector-menu-option-active');
                    if (option.lastChild instanceof HTMLElement) option.lastChild.innerHTML = '';
                    this._menuSelect(select);
                    if (this.selectData.length === 0) this.SELECTED_DOM.textContent = this.placeholder;
                    return;
                }
                if (this.limitNumber > 0 && this.selectData.length >= this.limitNumber) {
                    this.triggerEvent.enable = false;
                    // @ts-ignore
                    list.childNodes[this.id_line_hash[this.selectData[0].toString()]].click();
                    this.triggerEvent.enable = true;
                }
                option.classList.add('jk-selector-menu-option-active');
                this._tagCal(id, SELECTOR_MODE.Insert);
                (option.lastChild instanceof HTMLElement) && option.lastChild.insertAdjacentHTML('afterbegin', check);
                this._menuSelect(select);
            }, false);
            list.append(option);
        }

        menu.append(menu_select);
        if (this.useSearchMod) {
            let search_box = document.createElement('div');
            search_box.className = 'jk-selector-search';
            let input = document.createElement('input');
            input.setAttribute('placeholder', '搜索');
            search_box.append(input);
            menu_list.append(search_box);
        }
        menu_list.append(list);
        menu.append(menu_list);
        menu.addEventListener('click', () => {
            menu_list.style.display = 'flex';
            if (this.direction === SELECTOR_DIRECTION.Up) {
                menu_list.style.top = `-${menu_list.clientHeight + 2.5}px`;
                menu_list.style.flexDirection = 'column-reverse';
            } else if (this.direction === SELECTOR_DIRECTION.Mid) {
                menu_list.style.top = `-${menu_list.clientHeight / 2}px`;
            }
        });
        menu.addEventListener('mouseleave', () => {
            menu_list.style.display = 'none';
            if (this.useSearchMod) {
                // @ts-ignore
                this.DOM.querySelector(`.jk-selector-search>input`).value = '';
            }
            for (let node of this.CONTENT_DOM.childNodes) {
                if(node instanceof HTMLElement)node.style.display = 'flex';
            }
        });

        this.DOM.append(menu);
        // @ts-ignore
        this.SELECTED_DOM = this.DOM.querySelector(`.dlp-dot-menu-select`).firstElementChild;
        // @ts-ignore
        this.CONTENT_DOM = this.DOM.querySelector(`.list`);
    }
}