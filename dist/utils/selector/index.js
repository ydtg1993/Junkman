var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SELECTOR_DIRECTION, SELECTOR_MODE, SELECTOR_TOWARDS } from "./init";
export class Selector {
    constructor(select, options) {
        this.parentNode = document.body;
        this.select = {};
        this.selectedData = [];
        this.selectData = [];
        this.insertData = [];
        this.deleteData = [];
        this.searchOff = false;
        this.triggerEvent = { func: null, enable: false };
        this.value_line_hash = {};
        this.towards = SELECTOR_TOWARDS.Horizontal;
        this.placeholder = '-select-';
        this.maxHeight = '150px';
        this.hiddenInput = null;
        this.direction = SELECTOR_DIRECTION.Down;
        this.show = false;
        this.wrap = false;
        this.select = select;
        if (typeof options.limit === "number") {
            this.limitNumber = options.limit;
        }
        if (typeof options.searchOff === "boolean") {
            this.searchOff = options.searchOff;
        }
        if (typeof options.trigger === "function") {
            this.triggerEvent = { func: options.trigger, enable: true };
        }
        if (typeof options.hiddenInput === "string") {
            this.hiddenInput = options.hiddenInput;
        }
        if (typeof options.placeholder === "string") {
            this.placeholder = options.placeholder;
        }
        if (typeof options.show === "boolean") {
            this.show = options.show;
        }
        if (typeof options.wrap === "boolean") {
            this.wrap = options.wrap;
        }
        if (typeof options.menuMaxHeight === "string") {
            this.maxHeight = options.menuMaxHeight;
        }
        // @ts-ignore
        if (options.hasOwnProperty('direction') && options.direction in SELECTOR_DIRECTION) {
            // @ts-ignore
            this.direction = options.direction;
        }
        // @ts-ignore
        if (options.hasOwnProperty('towards') && options.towards in SELECTOR_TOWARDS) {
            // @ts-ignore
            this.towards = options.towards;
        }
        if (options.parentNode instanceof HTMLElement) {
            this.parentNode = options.parentNode;
        }
    }
    selected(selected) {
        if (!Array.isArray(selected)) {
            console.error('selected params must be array[string] !');
            return this;
        }
        selected = selected.map(function (elem) {
            return elem.toString();
        });
        this.selectedData = selected.filter(d => Object.keys(this.select).map(key => this.select[key]).includes(d));
        (() => __awaiter(this, void 0, void 0, function* () {
            let options = this.parentNode.querySelectorAll('.jk-option');
            if (options.length > 0) {
                options.forEach((D) => {
                    if (!(D instanceof HTMLElement))
                        return;
                    let value = D.getAttribute('data-value');
                    if (this.selectedData.indexOf(value) !== -1) {
                        this.triggerEvent.enable = false;
                        D.click();
                        this.triggerEvent.enable = true;
                    }
                });
                let menu = this.parentNode.querySelector('.jk-selector-menu-list');
                if (!this.show && (menu instanceof HTMLElement)) {
                    menu.style.display = 'none';
                }
            }
        }))();
        return this;
    }
    _tagCal(value, operate) {
        let index = this.selectData.indexOf(value);
        if (operate === SELECTOR_MODE.Insert) {
            if (index === -1) {
                this.selectData.push(value);
                if (this.SELECT_INPUT_DOM instanceof HTMLElement) {
                    // @ts-ignore
                    this.SELECT_INPUT_DOM.value = JSON.stringify(this.selectData);
                }
            }
            if (this.selectedData.indexOf(value) === -1 && this.insertData.indexOf(value) === -1) {
                this.insertData.push(value);
                if (this.INSERT_INPUT_DOM instanceof HTMLElement) {
                    // @ts-ignore
                    this.INSERT_INPUT_DOM.value = JSON.stringify(this.insertData);
                }
            }
            index = this.deleteData.indexOf(value);
            if (index !== -1) {
                this.deleteData.splice(index, 1);
                if (this.DELETE_INPUT_DOM instanceof HTMLElement) {
                    // @ts-ignore
                    this.DELETE_INPUT_DOM.value = JSON.stringify(this.deleteData);
                }
            }
        }
        else {
            if (index !== -1) {
                this.selectData.splice(index, 1);
                if (this.SELECT_INPUT_DOM instanceof HTMLElement) {
                    // @ts-ignore
                    this.SELECT_INPUT_DOM.value = JSON.stringify(this.selectData);
                }
            }
            if (this.selectedData.indexOf(value) !== -1 && this.deleteData.indexOf(value) === -1) {
                this.deleteData.push(value);
                if (this.DELETE_INPUT_DOM instanceof HTMLElement) {
                    // @ts-ignore
                    this.DELETE_INPUT_DOM.value = JSON.stringify(this.deleteData);
                }
            }
            index = this.insertData.indexOf(value);
            if (index !== -1) {
                this.insertData.splice(index, 1);
                if (this.INSERT_INPUT_DOM instanceof HTMLElement) {
                    // @ts-ignore
                    this.INSERT_INPUT_DOM.value = JSON.stringify(this.insertData);
                }
            }
        }
        if (typeof this.triggerEvent.func == 'function' && this.triggerEvent.enable) {
            this.triggerEvent.func({
                value: value,
                operate: operate,
                select: this.selectData,
                insert: this.insertData,
                delete: this.deleteData
            });
        }
    }
    delayExec() {
        if (typeof this.hiddenInput === "string") {
            this.parentNode.insertAdjacentHTML('beforeend', `
<input name="${this.hiddenInput}[select]" value="[]" type="hidden" />
<input name="${this.hiddenInput}[insert]" value="[]" type="hidden" />
<input name="${this.hiddenInput}[delete]" value="[]" type="hidden" />`);
            this.SELECT_INPUT_DOM = this.parentNode.querySelector(`input[name='${this.hiddenInput}[select]']`);
            this.INSERT_INPUT_DOM = this.parentNode.querySelector(`input[name='${this.hiddenInput}[insert]']`);
            this.DELETE_INPUT_DOM = this.parentNode.querySelector(`input[name='${this.hiddenInput}[delete]']`);
        }
        if (this.selectedData.length > 0) {
            this.selected(this.selectedData);
        }
    }
    make() {
        return this;
    }
    ;
}
