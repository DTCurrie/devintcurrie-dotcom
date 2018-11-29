
export function validateComponent(config: ComponentConfig): void {
    if (config.selector.indexOf('-') <= 0) { throw new Error('Component selectors must include at least two dash ("-") words.'); }
    if (!config.template && !config.templateUrl) { throw new Error('Components require a template'); }
}

export function Component(config: ComponentConfig): (constructor: { new(...args: any[]): any }) => void {
    console.log(config);
    return async (constructor: { new(...args: any[]): any }) => {
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

        const connectedCallback = constructor.prototype.connectedCallback || (() => { });
        const disconnectedCallback = constructor.prototype.disconnectedCallback || (() => { });

        constructor.prototype.connectedCallback = function () {
            this.appendChild(clone);
            connectedCallback.call(this);
            if (this.onInit) { this.onInit(); }
        };

        constructor.prototype.disconnectedCallback = function () {
            if (this.onDestroy) { this.onDestroy(); }
            disconnectedCallback.call(this);
        };

        window.customElements.define(config.selector, constructor);
    };
};