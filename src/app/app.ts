import { createComponent } from 'lib/component';

import { Loader } from './loader/loader';

import './app.scss';

export class App {
    constructor() {
        const app = createComponent(['app'], '');
        const loader = new Loader(app);
        // import('./loader/loader').then((module: { Loader: typeof Loader }) => {
        //     new module.Loader(app);
        // });
    }
}
