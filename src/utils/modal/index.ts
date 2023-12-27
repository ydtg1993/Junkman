import {createDOMFromTree} from "../../aid/dombuilder";
import {Icon} from "../../index";
import {generateUniqueString} from "../../aid/random";

export class Modal {
    protected xhr: { url: string, method?: string, data?: {}, callback?: () => void } | undefined;
    protected content: string | HTMLElement | undefined;
    protected DOM!: HTMLElement;
    protected title: string = '';
    protected windowStyles: { width?: any, height?: any, top?: string, right?: string, bottom?: string, left?: string } = {
        width: '80%',
        height: '80%',
        top: 'auto',
        right: 'auto',
        bottom: 'auto',
        left: 'auto',
    };
    protected parentNode: HTMLElement = document.body;
    protected fullscreen: boolean = false;
    protected gauze: boolean = false;
    protected unique: string = '';


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
        } else if (typeof content === 'string' || (content instanceof HTMLElement)) {
            this.content = content;
        } else {
            console.error('type of content error!');
        }
        this.unique = generateUniqueString(10);
    }

    public setTitle(title: string) {
        this.title = title;
        return this;
    }

    public setSize(size: { width?: any, height?: any }) {
        if (size.width) {
            this.windowStyles.width = size.width;
        }
        if (size.height) {
            this.windowStyles.height = size.height;
        }
        return this;
    }

    public setPos(position: { x?: string, y?: string }) {
        if (position.x) {
            if (position.x.charAt(0) === 'T') {
                this.windowStyles.top = position.x.substring(1);
            } else {
                this.windowStyles.bottom = position.x.substring(1);
            }
        }
        if (position.y) {
            if (position.y.charAt(0) === 'L') {
                this.windowStyles.left = position.y.substring(1);
            } else {
                this.windowStyles.right = position.y.substring(1);
            }
        }
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

    public setParentNode(parentNode: HTMLElement) {
        this.parentNode = parentNode;
        return this;
    }

    public close() {
        this.parentNode.removeChild(this.DOM);
    }

    public getUniqueCode() {
        return this.unique;
    }

    private buildHeader() {
        let header = {
            className: 'jk-modal-header', nodes: [
                {textContent: this.title}
            ]
        };
        if (this.fullscreen) {
            //@ts-ignore
            header.nodes.push({events: {click: () => alert(1),}, nodes: Icon.aspect});
        }

        header.nodes.push({
            // @ts-ignore
            events: {click: () => this.close()}, nodes: Icon.close
        });
        return header;
    }

    private buildFooter() {
        let foot = {className: 'jk-modal-footer', nodes: []};

        return foot;
    }

    make() {
        let domTree = {
            className: 'jk jk-modal', attributes: {unique: this.unique},
            nodes: [
                {
                    className: 'jk-modal-window',
                    styles: this.windowStyles,
                    nodes: [
                        this.buildHeader(),
                        {className: 'jk-modal-body', nodes: this.content},
                        //this.buildFooter(),
                    ]
                }
            ]
        };

        if (this.gauze) {
            // @ts-ignore
            domTree.nodes.push({className: 'gauze', events: {click: () => this.close()}});
        }

        this.DOM = createDOMFromTree(domTree, this.parentNode);
    }
}