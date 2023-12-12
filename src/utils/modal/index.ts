export class Modal {
    protected xhr: { url: string, method?: string, data?: {}, callback?: () => void } | undefined;
    protected content: string | undefined;
    protected domTree: HTMLElement | undefined;
    protected title: string = '';
    protected parentNode: Node | undefined;
    protected fullscreen: boolean = false;
    protected gauze: boolean = false;


    constructor(content: any) {
        if (typeof content === 'object') {
            this.xhr = content;
            this.xhr = Object.assign({
                method: 'GET',
                url: '',
                data: {},
                callback: () => {
                },
            }, content);
        } else if (typeof content === 'string') {
            this.content = content;
        } else if (content instanceof HTMLElement) {
            this.domTree = content;
        } else {
            console.error('type of content error!');
        }
    }

    public setTitle(title: string) {
        this.title = title;
        return this;
    }

    public setSize(width?: any, height?: any) {

        return this;
    }

    public setPosition(top?: 'string', left?: 'string') {
        return this;
    }

    public setFullscreen() {
        this.fullscreen = true;
        return this;
    }

    public setGauze() {
        this.gauze = true;
        return this;
    }

    public setParentNode(parentNode: Node) {
        return this;
    }

    make(){

    }
}