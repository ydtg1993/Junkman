var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Selector } from "./index";
import { SELECTOR_MODE, SELECTOR_TOWARDS } from "./init";
import { createDOMFromTree } from "../../aid/dombuilder";
export class Switcher extends Selector {
    _buildOptions() {
        let tree = [];
        let line = 0;
        let select = this.select;
        for (let name in select) {
            if (!select.hasOwnProperty(name))
                continue;
            this.value_line_hash[select[name]] = line;
            line++;
            tree.push({
                attributes: { 'data-name': name, 'data-value': select[name] },
                className: 'jk-input jk-text-trim jk-option',
                textContent: name,
                events: {
                    click: (e, option) => {
                        if (this.selectData.indexOf(select[name]) !== -1) {
                            /*cancel*/
                            this._tagCal(select[name], SELECTOR_MODE.Delete);
                            (() => __awaiter(this, void 0, void 0, function* () {
                                option.removeAttribute("active");
                            }))();
                            return;
                        }
                        this._tagCal(select[name], SELECTOR_MODE.Insert);
                        (() => __awaiter(this, void 0, void 0, function* () {
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
                        }))();
                    }
                }
            });
        }
        return tree;
    }
    make() {
        let dir = '';
        if (this.towards === SELECTOR_TOWARDS.Vertical)
            dir = ' vertical';
        let domTree = {
            className: 'jk jk-selector-switcher' + dir,
            nodes: this._buildOptions()
        };
        createDOMFromTree(domTree, this.parentNode);
        (() => __awaiter(this, void 0, void 0, function* () {
            this.delayExec();
        }))();
        return this;
    }
}
