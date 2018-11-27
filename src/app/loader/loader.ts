import { createComponent } from 'lib/component';

import './loader.scss';

export class Loader implements Destroy {
    private parentElement: HTMLElement;
    private element: HTMLElement;

    constructor(parent: HTMLElement) {
        this.parentElement = parent;
        this.element = createComponent(['loader'], `<code class="loader-text">loading</code>`, this.parentElement);
    }

    public destroy(): void { this.parentElement.removeChild(this.element); }
}

