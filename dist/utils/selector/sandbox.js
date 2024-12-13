import { Selector } from "./index";
export class Sandbox extends Selector {
    make() {
        let domTree = {
            className: 'jk jk-selector-sandbox',
            nodes: [
                {
                    className: 'jk-selector-sandbox-head',
                    nodes: [
                        {
                            tag: 'input',
                            className: 'jk-input',
                            attributes: { placeholder: 'Search' },
                            events: {}
                        },
                        { className: 'jk-selector-sandbox-select jk-scroll' }
                    ]
                },
                {
                    className: 'jk-selector-sandbox-body',
                    nodes: []
                }
            ]
        };
        return this;
    }
}
