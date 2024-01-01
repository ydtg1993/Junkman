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
    protected timeout: number = -1;
    protected headerHidden: boolean = false;
    protected enlarge:boolean = false;
    protected window_position_auto = [true, true];

    constructor(options: {
        title?:string,
        aspect?: { width?: string, height?: string },
        position: { x?: string, y?: string },
        fullscreen?:boolean,
        close?:boolean,
        gauze?:boolean,
        headerHidden?:boolean,
        timeout?:number,
        zIndex?:number,
        parentNode?: HTMLElement
    }) {
        this.unique = generateUniqueString(10);
        if(options.title){
            this.title = options.title;
        }
        if(options.gauze){
            this.gauze = options.gauze;
        }
        if(options.fullscreen){
            this.fullscreen = options.fullscreen;
        }
        if(options.timeout){
            this.timeout = options.timeout;
        }
        if(options.zIndex && options.zIndex > 0){
            //@ts-ignore
            this.windowStyles.zIndex = options.zIndex;
        }
        if(options.headerHidden){
            this.headerHidden = options.headerHidden;
        }
        if(options.aspect) {
            if (options.aspect.width) {
                this.windowStyles.width = options.aspect.width;
            }
            if (options.aspect.height) {
                this.windowStyles.height = options.aspect.height;
            }
        }
        if(options.position) {
            if (options.position.x) {
                if (options.position.x.charAt(0) === 'L') {
                    this.windowStyles.left = options.position.x.substring(1);
                } else if (options.position.x.charAt(0) === 'R') {
                    this.windowStyles.right = options.position.x.substring(1);
                }
                this.window_position_auto[0] = false;
            }
            if (options.position.y) {
                if (options.position.y.charAt(0) === 'T') {
                    this.windowStyles.top = options.position.y.substring(1);
                } else if (options.position.y.charAt(0) === 'B') {
                    this.windowStyles.bottom = options.position.y.substring(1);
                }
                this.window_position_auto[1] = false;
            }
        }
        if(options.parentNode instanceof HTMLElement) {
            this.parentNode = options.parentNode;
        }
    }

    public setContent(content: any) {
        if (typeof content === 'object' && content.hasOwnProperty('url')) {
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
        return this;
    }

    public close() {
        this.parentNode.removeChild(this.DOM);
    }

    public getWindowNode() {
        return this.DOM;
    }

    private buildHeader() {
        let header = {
            className: 'jk-modal-header', nodes: [
                {textContent: this.title}
            ]
        };
        //@ts-ignore
        header.nodes.push({events: {click: () => {
            if(!this.enlarge){
                this.buildFullscreen();
                this.enlarge = true;
            }else {
                this.resize();
                this.enlarge = false;
            }
        }}, nodes: Icon.aspect});
        header.nodes.push({
            // @ts-ignore
            events: {click: () => this.close()}, nodes: Icon.close,styles: {margin:'0 5px 0 10px'},
        });
        return header;
    }

    private buildPosition() {
        let w = this.DOM.querySelector('.jk-modal-window');
        if(!(w instanceof HTMLElement))return;
        if (this.window_position_auto[0]) {
            let left = (window.innerWidth - w.clientWidth) / 2;
            this.windowStyles.left = left + 'px';
            w.style.left = this.windowStyles.left;
        }

        if (this.window_position_auto[1]) {
            let top = (window.innerHeight - w.clientHeight) / 2;
            this.windowStyles.top = top + 'px';
            w.style.top = this.windowStyles.top;
        }
    }

    private buildFullscreen(){
        let w = this.DOM.querySelector('.jk-modal-window');
        if(!(w instanceof HTMLElement))return;
        w.style.width = '100%';
        w.style.height = '100%';
        w.style.top = '0';
        w.style.bottom = '0';
        w.style.left = '0';
        w.style.right = '0';
    }

    private resize(){
        let w = this.DOM.querySelector('.jk-modal-window');
        if(!(w instanceof HTMLElement))return;
        w.style.width = this.windowStyles.width;
        w.style.height = this.windowStyles.height;
        // @ts-ignore
        w.style.top = this.windowStyles.top;
        // @ts-ignore
        w.style.bottom = this.windowStyles.bottom;
        // @ts-ignore
        w.style.left = this.windowStyles.left;
        // @ts-ignore
        w.style.right = this.windowStyles.right;
    }

    make() {
        let domTree = {
            className: 'jk jk-modal', attributes: {unique: this.unique},
            nodes: [
                {
                    className: 'jk-modal-window',
                    styles: this.windowStyles,
                    nodes: [
                        {className: 'jk-modal-body', nodes: this.content},
                    ]
                }
            ]
        };

        if(!this.headerHidden){
            // @ts-ignore
            domTree.nodes[0].nodes.unshift(this.buildHeader());
        }

        if (this.gauze) {
            let gauze = {className: 'gauze', events: {click: () => this.close()}};
            // @ts-ignore
            if(this.windowStyles.zIndex > 0){
                // @ts-ignore
                gauze.styles = {zIndex:this.windowStyles.zIndex-1};
            }
            // @ts-ignore
            domTree.nodes.push(gauze);
        }

        this.DOM = createDOMFromTree(domTree,this.parentNode);
        this.buildPosition();
        this.fullscreen && this.buildFullscreen();
        this.timeout>0 && setTimeout(()=>this.close(),this.timeout*1000);
    }
}