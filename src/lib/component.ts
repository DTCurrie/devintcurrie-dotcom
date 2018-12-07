export interface ComponentConfig {
    selector: string;
    template?: string;
    templateUrl?: string;
    styles?: string;
    stylesUrl?: string;
}

export interface Component extends HTMLElement {
    connectedCallback?(): void;
    disconnectedCallback?(): void;
}

export interface ComponentConstructor<T> { new(...args: Array<any>): T; }

export interface Init extends Component {
    onInit(): void;
}

export interface AfterInit extends Component {
    onAfterInit(): void;
}

export interface Destroy extends Component {
    onDestroy(): void;
}

export function validateComponent(config: ComponentConfig): void {
    if (config.selector.indexOf('-') <= 0) { throw new Error('Component selectors must include at least two dash ("-") words.'); }
    if (!config.template && !config.templateUrl) { throw new Error('Components require a template'); }
}

export class Component extends (class extends HTMLElement { }) implements Component {
    constructor() {
        super();
    }
}

export function component<T extends HTMLElement>(config: ComponentConfig): (constructor: ComponentConstructor<T>) => void {
    return async (constructor: ComponentConstructor<T>) => {
        validateComponent(config);

        const moduleName = config.selector.split('-')[ 0 ];

        const connectedCallback = constructor.prototype.connectedCallback || (() => { return; });
        const disconnectedCallback = constructor.prototype.disconnectedCallback || (() => { return; });

        if (config.styles || config.stylesUrl) {
            const styles: HTMLStyleElement = document.createElement('style');

            if (config.stylesUrl) { styles.innerHTML += await import(`../${moduleName}/${config.stylesUrl}`); }
            if (config.styles) { styles.innerHTML += config.styles; }

            document.head.appendChild(styles);
        }

        // we need to use this outside of class body (since we are inside a constructor function), so disbale tslint
        // tslint:disable:no-invalid-this
        constructor.prototype.connectedCallback = async function(): Promise<void> {
            const template: HTMLTemplateElement = document.createElement('template');

            if (config.templateUrl) {
                template.innerHTML += await import(`../${moduleName}/${config.templateUrl}`);
            } else if (config.template) {
                template.innerHTML += config.template;
            } else {
                throw new Error('Components require a template');
            }

            const clone = document.importNode(template.content, true);

            this.innerHTML = '';
            this.appendChild(clone);

            await connectedCallback.call(this);
            if ((this as Init).onInit) { await (this as Init).onInit(); }
            if ((this as AfterInit).onAfterInit) { await (this as AfterInit).onAfterInit(); }
        };

        constructor.prototype.disconnectedCallback = function(): void {
            if ((this as Destroy).onDestroy) { (this as Destroy).onDestroy(); }
            disconnectedCallback.call(this);
        };
        // tslint:enable:no-invalid-this

        window.customElements.define(config.selector, constructor);
        return constructor;
    };
}
