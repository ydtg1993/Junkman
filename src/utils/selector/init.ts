export enum SELECTOR_MODE {
    Insert,
    Delete
}

export enum SELECTOR_MOD {
    Default,
    Menu,
    Switch
}

export enum SELECTOR_DIRECTION {
    Down,
    Up,
    Mid
}

export interface SelectorInterface {
    selected: (selected: string[]) => this;
    limit: (num: number) => this;
    searchOff: () => this;
    useHiddenInput: (name: string) => this;
    make:()=>void;
}