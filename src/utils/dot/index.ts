export enum DotMode {
    Insert,
    Delete
}

export enum DotMod {
    Default,
    Menu,
    Switch
}

export enum DotDirection {
    Down,
    Up,
    Mid
}

export class Dot{
    private dom!: HTMLElement;
    private limit!:number;
    private selectedData!: string[];
    private selectData!: string[];
    private insertData!: string[];
    private deleteData!: string[];
    private modSettings: { mode: DotMod; placeholder?: string; height?: string; direction?: DotDirection }={
        mode:DotMod.Default,
        placeholder: '未选择',
        height: '150px',
        direction: DotDirection.Down
    };
    private useSearchMod: boolean = true;
    private triggerEvent!: { func: Function | null; enable: boolean };
    private selectInputDOM!: HTMLElement;
    private insertInputDOM!: HTMLElement;
    private deleteInputDOM!: HTMLElement;
    private SELECTED_DOM!: HTMLElement;
    private CONTENT_DOM!: HTMLElement;
    private SELECT_COVER_DOM!: HTMLElement;
    private id_line_hash!: { [id: string]: number };

    constructor(dom:HTMLElement,data:any) {

    }

    selected(selected: string[]) {

        return this;
    }

    limitNum(num: number) {
        this.limit = num;
        return this;
    }

    modMenu(placeholder: string, height: string,direction: DotDirection) {
        this.modSettings.mode = DotMod.Menu;
        this.modSettings.placeholder = placeholder;
        this.modSettings.height = height;
        this.modSettings.direction = direction;
        return this;
    }

    modSwitch(){

    }
}