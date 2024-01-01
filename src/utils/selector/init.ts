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
    make: () => void;
}