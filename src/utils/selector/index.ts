import {SELECTOR_DIRECTION, SELECTOR_MODE, SELECTOR_TOWARDS, SelectorInterface} from "./init";

export class Selector implements SelectorInterface{
    protected DOM!: HTMLElement;
    protected select: { [key: string]: string } = {};
    protected limitNumber!: number;
    protected selectedData: string[] = [];
    protected selectData: string[] = [];
    protected insertData: string[] = [];
    protected deleteData: string[] = [];
    protected searchOff: boolean = false;
    protected triggerEvent: { func: Function | null; enable: boolean } = {func: null, enable: false};
    protected SELECT_INPUT_DOM!: HTMLElement | null;
    protected INSERT_INPUT_DOM!: HTMLElement | null;
    protected DELETE_INPUT_DOM!: HTMLElement | null;
    protected value_line_hash: { [id: string]: number } = {};

    protected towards : SELECTOR_TOWARDS = SELECTOR_TOWARDS.Horizontal;

    protected placeholder: string = '-select-';
    protected maxHeight: string = '150px';
    protected direction: SELECTOR_DIRECTION = SELECTOR_DIRECTION.Down;
    protected show:boolean = false;

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

    setOptions(options:{
        limit?:number,
        searchOff?:boolean,
        trigger?:()=>void,
        hiddenInput?:string,
        direction?:SELECTOR_DIRECTION,
        towards?:SELECTOR_TOWARDS,
        placeholder?:string,
        show?:boolean,
        menuMaxHeight?:string,
    }): this {
        if(typeof options.limit === "number"){
            this.limitNumber = options.limit;
        }
        if(typeof options.searchOff === "boolean"){
            this.searchOff = options.searchOff;
        }
        if(typeof options.trigger === "function"){
            this.triggerEvent = {func: options.trigger, enable: true};
        }
        if(typeof options.hiddenInput === "string"){
            this.DOM.insertAdjacentHTML('beforeend', `
<input name="${options.hiddenInput}[select]" value="[]" type="hidden" />
<input name="${options.hiddenInput}[insert]" value="[]" type="hidden" />
<input name="${options.hiddenInput}[delete]" value="[]" type="hidden" />`);
            this.SELECT_INPUT_DOM = this.DOM.querySelector(`input[name='${options.hiddenInput}[select]']`);
            this.INSERT_INPUT_DOM = this.DOM.querySelector(`input[name='${options.hiddenInput}[insert]']`);
            this.DELETE_INPUT_DOM = this.DOM.querySelector(`input[name='${options.hiddenInput}[delete]']`);
        }
        if(typeof options.placeholder === "string"){
            this.placeholder = options.placeholder;
        }
        if(typeof options.show === "boolean"){
            this.show = options.show;
        }
        if(typeof options.menuMaxHeight === "string"){
            this.maxHeight = options.menuMaxHeight;
        }
        // @ts-ignore
        if(options.hasOwnProperty('direction') && options.direction in SELECTOR_DIRECTION){
            // @ts-ignore
            this.direction = options.direction;
        }
        // @ts-ignore
        if(options.hasOwnProperty('towards') && options.towards in SELECTOR_TOWARDS){
            // @ts-ignore
            this.towards = options.towards;
        }
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

    make(){

    };
}