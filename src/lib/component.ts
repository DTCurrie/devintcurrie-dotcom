export function validateComponent(config: ComponentConfig): void {
    if (config.selector.indexOf('-') <= 0) { throw new Error('Component selectors must include at least two dash ("-") words.'); }
    if (!config.template && !config.templateUrl) { throw new Error('Components require a template'); }
}

export class Component extends HTMLElement implements Component { }

export function component<T>(config: ComponentConfig): (constructor: ComponentConstructor<T>) => void {
    return async (constructor: ComponentConstructor<T>) => {
        validateComponent(config);

        if (config.styles || config.stylesUrl) {
            const stylesElement: HTMLStyleElement = document.createElement('style');

            if (config.stylesUrl) {
                const styles: string = await import(`../app/${config.stylesUrl}`);
                stylesElement.innerHTML = styles;
            }

            if (config.styles) { stylesElement.innerHTML += config.styles; }

            document.head.appendChild(stylesElement);
        }

        const template: HTMLTemplateElement = document.createElement('template');
        if (config.templateUrl) {
            template.innerHTML = await import(`../app/${config.templateUrl}`);
        } else if (config.template) {
            template.innerHTML = config.template;
        } else {
            throw new Error('Components require a template');
        }

        const clone = document.importNode(template.content, true);

        const connectedCallback = constructor.prototype.connectedCallback || (() => { return; });
        const disconnectedCallback = constructor.prototype.disconnectedCallback || (() => { return; });

        // we need to use this outside of class body (since we are inside a constructor function), so disbale tslint
        // tslint:disable:no-invalid-this
        constructor.prototype.connectedCallback = function(): void {
            this.innerHTML = '';
            this.appendChild(clone);
            connectedCallback.call(this);
            (async () => {
                if ((this as Init).onInit) { await (this as Init).onInit(); }
                if ((this as AfterInit).onAfterInit) { await (this as AfterInit).onAfterInit(); }
            })();
        };

        constructor.prototype.disconnectedCallback = function(): void {
            if ((this as Destroy).onDestroy) { (this as Destroy).onDestroy(); }
            disconnectedCallback.call(this);
        };
        // tslint:enable:no-invalid-this

        window.customElements.define(config.selector, constructor);
    };
}

export async function componentFactory<T extends Component>(selector: string): Promise<T> {
    const ctor = window.customElements.get(selector);
    return await new ctor() as T;
}
