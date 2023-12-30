export enum SELECTOR_MODE {
    Delete,
    Insert
}

export enum SELECTOR_TOWARDS {
    Vertical,
    Horizontal
}

export enum SELECTOR_DIRECTION {
    Down,
    Up,
    Mid,
    Right,
    RightUp,
    RightMid,
    Left,
    LeftUp,
    LeftMid,
}

export interface SelectorInterface {
    selected: (selected: string[]) => this;
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
    }): this;
    make: () => void;
}