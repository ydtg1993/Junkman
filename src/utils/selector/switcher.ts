import {Selector} from "./index";
import {SELECTOR_MODE, SELECTOR_SWITCHER_DIRECTION, SelectorInterface} from "./init";
import {createDOMFromTree} from "../../aid/dombuilder";

export class Switcher extends Selector implements SelectorInterface {
    private direction: SELECTOR_SWITCHER_DIRECTION = SELECTOR_SWITCHER_DIRECTION.Horizontal;

    private settings({direction}:{direction?:SELECTOR_SWITCHER_DIRECTION}) {
        if (direction !== undefined) this.direction = direction;
        return this;
    }

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
                className: 'jk-input jk-text-trim',
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
                                let popOpt = this.DOM.querySelector(`div:nth-child(${index})`);
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

    make() {
        let dir = '';
        if (this.direction === SELECTOR_SWITCHER_DIRECTION.Vertical) dir = ' vertical';
        let domTree = {
            className: 'jk jk-selector-switcher' + dir,
            nodes: this._buildOptions()
        };

        createDOMFromTree(domTree, this.DOM);
        (async () => {
            let options = this.DOM.querySelectorAll('div');
            options.forEach((D) => {
                if (!(D instanceof HTMLElement)) return;
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