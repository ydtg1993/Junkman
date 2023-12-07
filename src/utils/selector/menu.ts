import {Selector} from "./index";
import {SELECTOR_MENU_DIRECTION, SELECTOR_MODE, SelectorInterface} from "./init";
import {Icon} from "../../aid/icon";
import {createDOMFromTree} from "../../aid/dombuilder";

export class Menu extends Selector implements SelectorInterface {
    private placeholder: string = '-select-';
    private maxHeight: string = '150px';
    private direction: SELECTOR_MENU_DIRECTION = SELECTOR_MENU_DIRECTION.Down;

    constructor(dom: HTMLElement, select: { [key: string]: string }) {
        super(dom, select);
    }

    settings({placeholder, height, direction}:
                 { placeholder?: string, height?: string, direction?: SELECTOR_MENU_DIRECTION }): this {
        if (placeholder) this.placeholder = placeholder;
        if (height) this.maxHeight = height;
        if (direction) this.direction = direction;
        return this;
    }

    private _menuSelect(selectedDom:HTMLElement,select: { [key: string]: string }) {
        if (this.limitNumber === 1) {
            let d: string = this.selectData[0];
            selectedDom.innerHTML = `<span class="jk-text-trim">${select[d]}</span>`;
            return;
        }
        let html = '';
        for (let id of this.selectData) {
            html += `<span class="jk-text-trim" title="${select[id]}">${select[id]}</span>`;
        }
        selectedDom.innerHTML = html;
    };

    private _buildOptions(): {}[] {
        let tree = [];
        let line = 0;
        let select = this.select;
        for (let id in select) {
            if (!select.hasOwnProperty(id)) continue;
            this.id_line_hash[id] = line;
            line++;
            tree.push({
                attributes: {'data-id': id},
                nodes: `<div class="jk-text-trim" data-v="${id}">${select[id]}</div>`,
                events: {
                    click: (e: Event,dom:HTMLElement) => {
                        let option = dom;
                        let selectedDom = this.DOM.querySelector('.jk-selector-selected-area');
                        if(!(selectedDom instanceof HTMLElement))return;
                        if (this.selectData.indexOf(id) !== -1) {
                            /*cancel*/
                            this._tagCal(id, SELECTOR_MODE.Delete);
                            option.removeAttribute("active");
                            let svg = option.querySelector("svg");
                            if (svg) {
                                option.removeChild(svg);
                            }
                            this._menuSelect(selectedDom,select);
                            if (this.selectData.length === 0) selectedDom.textContent = this.placeholder;
                            return;
                        }
                        if (this.limitNumber > 0 && this.selectData.length >= this.limitNumber) {
                            this.triggerEvent.enable = false;
                            let index = this.id_line_hash[this.selectData[0]] + 1;
                            let popOpt = this.DOM.querySelector(`.jk-selector-menu-options>div:nth-child(${index})`);
                            if(popOpt instanceof HTMLElement)popOpt.click();
                            this.triggerEvent.enable = true;
                        }
                        option.setAttribute('active', '1');
                        this._tagCal(id, SELECTOR_MODE.Insert);
                        option.insertAdjacentHTML('beforeend', Icon.check);
                        this._menuSelect(selectedDom,select);
                    }
                }
            });
        }
        return tree;
    }

    make() {
        let domTree = {
            className: 'jk jk-selector-menu',
            events: {
                click: () => {
                    let listDom = this.DOM.querySelector('.jk-selector-menu-list');
                    if (!(listDom instanceof HTMLElement)) return;
                    listDom.style.display = 'flex';
                    if (this.direction === SELECTOR_MENU_DIRECTION.Up) {
                        listDom.style.top = `-${listDom.clientHeight + 2.5}px`;
                        listDom.style.flexDirection = 'column-reverse';
                    } else if (this.direction === SELECTOR_MENU_DIRECTION.Mid) {
                        listDom.style.top = `-${listDom.clientHeight / 2}px`;
                    }
                },
                mouseleave: () => {
                    let listDom = this.DOM.querySelector('.jk-selector-menu-list');
                    if (!(listDom instanceof HTMLElement)) return;
                    listDom.style.display = 'none';
                    if (this.useSearchMod) {
                        // @ts-ignore
                        this.DOM.querySelector(`.jk-selector-search>input`).value = '';
                    }
                }
            },
            nodes: [
                {
                    className: 'jk-input jk-selector-menu-select',
                    nodes: `<div class="jk-selector-selected-area jk-text-trim${this.limitNumber!=1?' multi':''}">${this.placeholder}</div><div>▼</div>`
                },
                {
                    className: 'jk-selector-menu-list',
                    nodes: [
                        {className: 'jk-selector-search', nodes: '<input class="jk-input" placeholder="Search">'},
                        {className: 'jk-selector-menu-options jk-scroll', nodes: this._buildOptions()}
                    ]
                }
            ]
        };

        createDOMFromTree(domTree, this.DOM);
    }
}