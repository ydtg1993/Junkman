import {Selector} from "./index";
import {SELECTOR_MODE, SELECTOR_TOWARDS, SelectorInterface} from "./init";
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
                className: 'jk-input jk-text-trim jk-option',
                textContent: name,
                events: {
                    click: (e: Event, option: HTMLElement) => {
                        if (this.selectData.indexOf(select[name]) !== -1) {
                            /*cancel*/
                            this._tagCal(select[name], SELECTOR_MODE.Delete);
                            (async () => {
                                option.removeAttribute("active");
                            })();
                            return;
                        }
                        this._tagCal(select[name], SELECTOR_MODE.Insert);
                        (async () => {
                            if (this.limitNumber > 0 && this.selectData.length > this.limitNumber) {
                                this.triggerEvent.enable = false;
                                let index = this.value_line_hash[this.selectData[0].toString()] + 1;
                                let popOpt = this.parentNode.querySelector(`div.jk-selector-switcher>div:nth-child(${index})`);
                                if (popOpt instanceof HTMLElement) {
                                    popOpt.click();
                                }
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

    make():this {
        let dir = '';
        if (this.towards === SELECTOR_TOWARDS.Vertical) dir = ' vertical';
        let domTree = {
            className: 'jk jk-selector-switcher' + dir,
            nodes: this._buildOptions()
        };

        createDOMFromTree(domTree,this.parentNode);
        (async ()=> {
            if(this.selectedData.length>0){
                this.selected(this.selectedData);
            }
        })();
        return this;
    }
}