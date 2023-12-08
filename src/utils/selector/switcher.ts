import {Selector} from "./index";
import {SELECTOR_MENU_DIRECTION, SELECTOR_MODE, SelectorInterface} from "./init";
import {Icon} from "../../aid/icon";
import {createDOMFromTree} from "../../aid/dombuilder";

export class Switcher extends Selector implements SelectorInterface {
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
                className:'jk-switcher-option jk-text-trim',
                textContent:name,
                events: {
                    click: (e: Event, option: HTMLElement) => {
                        if (this.selectData.indexOf(select[name]) !== -1) {
                            /*cancel*/
                            this._tagCal(select[name], SELECTOR_MODE.Delete);
                            (async ()=>{
                                option.removeAttribute("active");
                                let svg = option.querySelector("svg");
                                if (svg) {
                                    option.removeChild(svg);
                                }
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
                        })();
                    }
                }
            });
        }
        return tree;
    }

    make(){
        let domTree = {
            className: 'jk jk-selector-switcher',
            nodes: this._buildOptions()
        };

        createDOMFromTree(domTree, this.DOM);
        (async ()=> {
            let options = this.DOM.querySelectorAll('.jk-switcher-option');
            options.forEach((D) => {
                if(!(D instanceof HTMLElement))return;
                let value = D.getAttribute('data-value') as string;
                if (this.selectedData.indexOf(value) !== -1) {
                    this.triggerEvent.enable = false;
                    D.click();
                    this.triggerEvent.enable = true;
                }
            });
        })();
    }
}