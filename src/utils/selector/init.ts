export enum SELECTOR_MODE {
    Delete,
    Insert
}

export enum SELECTOR_MENU_DIRECTION {
    Down,
    Up,
    Mid,
    Right,
    RightUp,
    RightMid,
    Left,
    LeftUp,
    LeftMid
}

export interface SelectorInterface {
    selected: (selected: string[]) => this;
    limit: (num: number) => this;
    searchOff: () => this;
    useHiddenInput: (name: string) => this;
    make: () => void;
}