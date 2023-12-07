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

    private _menuSelect(selectedDom: HTMLElement, name:string) {
        if (this.limitNumber === 1) {
            let d: string = this.selectData[0];
            selectedDom.innerHTML = `<span class="jk-text-trim">${name}</span>`;
            return;
        }
        let html = '';
        for (let id of this.selectData) {
            html += `<span class="jk-text-trim" title="${name}">${name}</span>`;
        }
        selectedDom.innerHTML = html;
    };

    private _buildOptions(): {}[] {
        let tree = [];
        let line = 0;
        let select = this.select;
        for (let name in select) {
            if (!select.hasOwnProperty(name)) continue;
            this.value_line_hash[select[name]] = line;
            line++;
            tree.push({
                attributes: {'data-name': name, 'data-value': select[name]},
                nodes: `<div class="jk-text-trim">${name}</div>`,
                events: {
                    click: (e: Event, dom: HTMLElement) => {
                        let option = dom;
                        let selectedDom = this.DOM.querySelector('.jk-selector-selected-area');
                        if (!(selectedDom instanceof HTMLElement)) return;
                        if (this.selectData.indexOf(select[name]) !== -1) {
                            /*cancel*/
                            this._tagCal(select[name], SELECTOR_MODE.Delete);
                            option.removeAttribute("active");
                            let svg = option.querySelector("svg");
                            if (svg) {
                                option.removeChild(svg);
                            }
                            this._menuSelect(selectedDom, name);
                            if (this.selectData.length === 0) selectedDom.textContent = this.placeholder;
                            return;
                        }
                        if (this.limitNumber > 0 && this.selectData.length >= this.limitNumber) {
                            this.triggerEvent.enable = false;
                            let index = this.value_line_hash[this.selectData[0].toString()] + 1;
                            let popOpt = this.DOM.querySelector(`.jk-selector-menu-options>div:nth-child(${index})`);
                            if (popOpt instanceof HTMLElement) popOpt.click();
                            this.triggerEvent.enable = true;
                        }
                        option.setAttribute('active', '1');
                        this._tagCal(select[name], SELECTOR_MODE.Insert);
                        option.insertAdjacentHTML('beforeend', Icon.check);
                        this._menuSelect(selectedDom, name);
                    }
                }
            });
        }
        return tree;
    }

    private _buildSearchInput(): {} {
        return {
            tag: 'input',
            className: 'jk-input',
            attributes: {placeholder: 'Search'},
            events: {
                input: (e: Event, dom: HTMLElement) => {
                    // @ts-ignore
                    let keywords = dom.value;
                    let options: NodeListOf<HTMLElement> = this.DOM.querySelectorAll('.jk-selector-menu-options>div');
                    if (!keywords) {
                        options.forEach((option) => {
                            option.style.display = 'flex';
                        });
                        return;
                    }
                    setTimeout(() => {
                        options.forEach((option) => {
                            let text: string = option.getAttribute('data-name') as string;
                            if (keywords.indexOf(text) !== -1 || text.indexOf(keywords) !== -1) {
                                option.style.display = 'flex';
                                return;
                            }
                            option.style.display = 'none';
                        });
                    }, 300);
                }
            }
        };
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
                /*                mouseleave: () => {
                                    let listDom = this.DOM.querySelector('.jk-selector-menu-list');
                                    if (!(listDom instanceof HTMLElement)) return;
                                    listDom.style.display = 'none';
                                    if (this.useSearchMod) {
                                        // @ts-ignore
                                        this.DOM.querySelector(`.jk-selector-search>input`).value = '';
                                    }
                                }*/
            },
            nodes: [
                {
                    className: 'jk-input jk-selector-menu-select',
                    nodes: `<div class="jk-selector-selected-area jk-text-trim${this.limitNumber != 1 ? ' multi' : ''}">${this.placeholder}</div><div>▼</div>`
                },
                {
                    className: 'jk-selector-menu-list',
                    nodes: (() => {
                        if (this.useSearchMod) {
                            return [
                                {className: 'jk-selector-search', nodes: [this._buildSearchInput()]},
                                {className: 'jk-selector-menu-options jk-scroll', nodes: this._buildOptions()}
                            ];
                        }
                        return [{className: 'jk-selector-menu-options jk-scroll', nodes: this._buildOptions()}];
                    })()
                }
            ]
        };

        createDOMFromTree(domTree, this.DOM);
    }
}