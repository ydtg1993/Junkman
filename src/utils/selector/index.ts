import {SELECTOR_MODE} from "./init";

export class Selector {
    protected DOM!: HTMLElement;
    protected select: { [key: string]: string } = {};
    protected limitNumber!: number;
    protected selectedData: string[] = [];
    protected selectData: string[] = [];
    protected insertData: string[] = [];
    protected deleteData: string[] = [];
    protected useSearchMod: boolean = true;
    protected triggerEvent: { func: Function | null; enable: boolean } = {func: null, enable: false};
    protected SELECT_INPUT_DOM!: HTMLElement | null;
    protected INSERT_INPUT_DOM!: HTMLElement | null;
    protected DELETE_INPUT_DOM!: HTMLElement | null;
    protected SELECT_COVER_DOM!: HTMLElement;
    protected value_line_hash: { [id: string]: number } = {};

    constructor(dom: HTMLElement, select: { [key: string]: string }) {
        this.DOM = dom;
        this.select = select;
    }

    selected(selected: string[]): this {
        if (!Array.isArray(selected)) {
            console.error('selected params must be array[string] !');
            return this;
        }
        selected = selected.map(function (elem) {
            return elem.toString();
        });
        this.selectedData = selected.filter(d => Object.keys(this.select).map(key => this.select[key]).includes(d));
        return this;
    }

    limit(num: number): this {
        this.limitNumber = num;
        return this;
    }

    searchOff(): this {
        this.useSearchMod = false;
        return this;
    }

    trigger(f:()=>void):this {
        this.triggerEvent = {func: f, enable: true};
        return this;
    }

    useHiddenInput(name: string): this {
        this.DOM.insertAdjacentHTML('beforeend', `
<input name="${name}[select]" value="[]" type="hidden" />
<input name="${name}[insert]" value="[]" type="hidden" />
<input name="${name}[delete]" value="[]" type="hidden" />`);
        this.SELECT_INPUT_DOM = this.DOM.querySelector(`input[name='${name}[select]']`);
        this.INSERT_INPUT_DOM = this.DOM.querySelector(`input[name='${name}[insert]']`);
        this.DELETE_INPUT_DOM = this.DOM.querySelector(`input[name='${name}[delete]']`);
        return this;
    }

    protected _tagCal(value: string, operate: SELECTOR_MODE) {
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
        } else {
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
                value:value,
                operate:operate ,
                select:this.selectData,
                insert:this.insertData,
                delete:this.deleteData});
        }
    }
}