import {SELECTOR_MODE} from "./init";

export class Selector {
    protected DOM!: HTMLElement;
    protected readonly select: Record<string, any>[];
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
    protected SELECTED_DOM!: HTMLElement;
    protected CONTENT_DOM!: HTMLElement;
    protected SELECT_COVER_DOM!: HTMLElement;
    protected id_line_hash!: { [id: string]: number };

    constructor(dom: HTMLElement, select: Record<string, any>[]) {
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
        selected = selected.filter(d => {
            // @ts-ignore
            if (this.select[d]) return false;
            return true;
        });
        this.selectedData = selected;
        return this;
    }

    limit(num: number): this {
        this.limitNumber = num;
        return this;
    }

    searchOff(): this {
        this.useSearchMod = true;
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

    protected _tagSelect(element: HTMLElement) {
        if (this.limitNumber > 0 && this.selectData.length >= this.limitNumber && this.SELECTED_DOM.firstChild instanceof HTMLElement) {
            this.triggerEvent.enable = false;
            this.SELECTED_DOM.firstChild.click();
            this.triggerEvent.enable = true;
        }
        let clone = element.cloneNode(true);
        // @ts-ignore
        clone.addEventListener('click', () => this._tagCancel(clone), false);
        this.SELECTED_DOM.appendChild(clone);
        element.remove();
        let id = element.getAttribute('data-id');
        if (id) this._tagCal(id, SELECTOR_MODE.Insert);
        this.SELECTED_DOM.scrollTop = this.SELECTED_DOM.scrollHeight;
    }

    protected _tagCancel(element: HTMLElement) {
        let clone = element.cloneNode(true);
        clone.addEventListener('click', () => this._tagSelect(clone), false);
        this.CONTENT_DOM.appendChild(clone);
        element.remove();
        let id = element.getAttribute('data-id');
        if (id) this._tagCal(id, SELECTOR_MODE.Delete);
    };

    protected _tagCal(id :string, operate :SELECTOR_MODE) {
        let index = this.selectData.indexOf(id);
        if (operate === SELECTOR_MODE.Insert) {
            if (index === -1) {
                this.selectData.push(id);
                if (this.SELECT_INPUT_DOM instanceof HTMLElement) {
                    // @ts-ignore
                    this.SELECT_INPUT_DOM.value = JSON.stringify(this.selectData);
                }
            }
            if (this.selectedData.indexOf(id) === -1 && this.insertData.indexOf(id) === -1) {
                this.insertData.push(id);
                if (this.INSERT_INPUT_DOM instanceof HTMLElement) {
                    // @ts-ignore
                    this.INSERT_INPUT_DOM.value = JSON.stringify(this.insertData);
                }
            }
            index = this.deleteData.indexOf(id);
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
            if (this.selectedData.indexOf(id) !== -1 && this.deleteData.indexOf(id) === -1) {
                this.deleteData.push(id);
                if (this.DELETE_INPUT_DOM instanceof HTMLElement) {
                    // @ts-ignore
                    this.DELETE_INPUT_DOM.value = JSON.stringify(this.deleteData);
                }
            }
            index = this.insertData.indexOf(id);
            if (index !== -1) {
                this.insertData.splice(index, 1);
                if (this.INSERT_INPUT_DOM instanceof HTMLElement) {
                    // @ts-ignore
                    this.INSERT_INPUT_DOM.value = JSON.stringify(this.insertData);
                }
            }
        }
        if (typeof this.triggerEvent.func == 'function' && this.triggerEvent.enable === true)
            this.triggerEvent.func(this.selectData, this.insertData, this.deleteData);
    }

}