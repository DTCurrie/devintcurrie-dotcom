import { createComponent } from 'lib/component';

import './loader.scss';

export class Loader implements Destroy {
    private parent: HTMLElement;
    private element: HTMLElement;

    constructor(parent: HTMLElement) {
        this.parent = parent;
        this.element = createComponent(['loader'], `<code class="loader-text">loading</code>`, this.parent);
    }

    public destroy(): void { this.parent.removeChild(this.element); }
}

