import { createComponent } from 'lib/component';

import './loader.scss';

export class Loader {
    constructor(parent: HTMLElement) {
        createComponent(['loader'], `<code class="loader-text">loading</code>`, parent);
    }
}

