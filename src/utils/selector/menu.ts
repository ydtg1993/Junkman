import {Selector} from "./index";
import {SELECTOR_DIRECTION, SELECTOR_MODE, SelectorInterface} from "./init";
import {Icon} from "../../aid/icon";
import {createDOMFromTree} from "../../aid/dombuilder";

export class Menu extends Selector implements SelectorInterface {
    constructor(dom: HTMLElement, select: { [key: string]: string }) {
        super(dom, select);
    }

    private _selectedInputShow(selectedDom: HTMLElement) {
        let names:string[] = [];
        // @ts-ignore
        this.selectData.forEach((d)=>{
            let name = Object.keys(this.select).find(key => this.select[key] === d) as string;
            names.push(name);
        });
        if (this.limitNumber === 1) {
            selectedDom.innerHTML = `<span class="jk-text-trim">${names[0]}</span>`;
            return;
        }
        let html = '';
        for (let name of names) {
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
                    click: (e: Event, option: HTMLElement) => {
                        let selectedDom = this.DOM.querySelector('.jk-selector-selected-area');
                        if (!(selectedDom instanceof HTMLElement)) return;
                        if (this.selectData.indexOf(select[name]) !== -1) {
                            /*cancel*/
                            this._tagCal(select[name], SELECTOR_MODE.Delete);
                            (async ()=>{
                                option.removeAttribute("active");
                                let svg = option.querySelector("svg");
                                if (svg) {
                                    option.removeChild(svg);
                                }
                                this._selectedInputShow(selectedDom);
                                if (this.selectData.length === 0) selectedDom.textContent = this.placeholder;
                            })();
                            return;
                        }
                        this._tagCal(select[name], SELECTOR_MODE.Insert);
                        (async ()=>{
                            if (this.limitNumber > 0 && this.selectData.length > this.limitNumber) {
                                this.triggerEvent.enable = false;
                                let index = this.value_line_hash[this.selectData[0].toString()] + 1;
                                let popOpt = this.DOM.querySelector(`.jk-selector-menu-options>div:nth-child(${index})`);
                                if (popOpt instanceof HTMLElement) popOpt.click();
                                this.triggerEvent.enable = true;
                            }
                            option.setAttribute('active', '1');
                            option.insertAdjacentHTML('beforeend', Icon.check);
                            this._selectedInputShow(selectedDom);
                        })();
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

    private _directionShow() {
        let listDom = this.DOM.querySelector('.jk-selector-menu-list');
        if (!(listDom instanceof HTMLElement)) return;
        listDom.style.display = 'flex';
        const directionMap = {
            [SELECTOR_DIRECTION.Up]: {
                top: `-${listDom.clientHeight + 2.5}px`,
            },
            [SELECTOR_DIRECTION.Mid]: {
                top: `-${listDom.clientHeight / 2}px`
            },
            [SELECTOR_DIRECTION.Right]: {
                top: '0',
                left: `${this.DOM.offsetWidth}px`
            },
            [SELECTOR_DIRECTION.RightMid]: {
                top: `-${listDom.clientHeight / 2}px`,
                left: `${this.DOM.offsetWidth}px`
            },
            [SELECTOR_DIRECTION.RightUp]: {
                top: `-${listDom.clientHeight + 2.5 - this.DOM.offsetHeight}px`,
                left: `${this.DOM.offsetWidth}px`,
            },
            [SELECTOR_DIRECTION.Left]: {
                top: '0',
                left: `-${this.DOM.offsetWidth}px`
            },
            [SELECTOR_DIRECTION.LeftMid]: {
                top: `-${listDom.clientHeight / 2}px`,
                left: `-${this.DOM.offsetWidth}px`
            },
            [SELECTOR_DIRECTION.LeftUp]: {
                top: `-${listDom.clientHeight + 2.5 - this.DOM.offsetHeight}px`,
                left: `-${this.DOM.offsetWidth}px`
            }
        };
        let selectDom = this.DOM.querySelector('.jk-selector-menu-select');
        if (selectDom instanceof HTMLElement && [SELECTOR_DIRECTION.Left, SELECTOR_DIRECTION.LeftMid, SELECTOR_DIRECTION.LeftUp].includes(this.direction)) {
            selectDom.style.flexDirection = 'row-reverse';
        }
        // @ts-ignore
        const styles = directionMap[this.direction];
        if (styles) {
            Object.assign(listDom.style, styles);
        }
    }

    make() {
        let domTree = {
            className: 'jk jk-selector-menu',
            events: {
                click: () => this._directionShow(),
                mouseleave: () => {
                    if(this.show)return;
                    let listDom = this.DOM.querySelector('.jk-selector-menu-list');
                    if (!(listDom instanceof HTMLElement)) return;
                    listDom.style.display = 'none';
                    if (!this.searchOff) {
                        // @ts-ignore
                        this.DOM.querySelector(`.jk-selector-search>input`).value = '';
                    }
                }
            },
            nodes: [
                {
                    className: 'jk-input jk-selector-menu-select',
                    nodes:
                        (() => {
                            let cursor = '';
                            if ([SELECTOR_DIRECTION.Left,
                                SELECTOR_DIRECTION.LeftMid,
                                SELECTOR_DIRECTION.LeftUp].includes(this.direction)) {
                                cursor = 'style="transform: rotate(90deg);"';
                            }else if([SELECTOR_DIRECTION.Right,
                                SELECTOR_DIRECTION.RightMid,
                                SELECTOR_DIRECTION.RightUp].includes(this.direction)){
                                cursor = 'style="transform: rotate(270deg);"';
                            }
                            return `<div class="jk-selector-selected-area jk-text-trim${this.limitNumber != 1 ? ' multi' : ''}">${this.placeholder}</div><div ${cursor}>▼</div>`;
                        })(),
                    styles: (() => {
                        if ([SELECTOR_DIRECTION.Left,
                            SELECTOR_DIRECTION.LeftMid,
                            SELECTOR_DIRECTION.LeftUp].includes(this.direction)) {
                            return {'flex-direction': 'row-reverse'};
                        }
                        return {};
                    })()
                },
                {
                    className: 'jk-selector-menu-list',
                    nodes: (() => {
                        if (!this.searchOff) {
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

        let listDom = this.DOM.querySelector('.jk-selector-menu-list');
        if(!(listDom instanceof HTMLElement))return;
        if ([SELECTOR_DIRECTION.LeftMid,
            SELECTOR_DIRECTION.LeftUp,
            SELECTOR_DIRECTION.RightMid,
            SELECTOR_DIRECTION.RightUp].includes(this.direction)) {
            listDom.style.height = listDom.clientHeight + 'px';
        }

        (async ()=> {
            let options = listDom.querySelectorAll('.jk-selector-menu-options>div');
            options.forEach((D) => {
                if(!(D instanceof HTMLElement))return;
                let value = D.getAttribute('data-value') as string;
                if (this.selectedData.indexOf(value) !== -1) {
                    this.triggerEvent.enable = false;
                    D.click();
                    this.triggerEvent.enable = true;
                }
            });
            if(!this.show) listDom.style.display = 'none';
        })();
    }
}