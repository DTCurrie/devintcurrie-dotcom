import { createComponent } from 'lib/component';

import { Loader } from './loader/loader';
import { Terminal } from './terminal/terminal';

import './app.scss';

export class App {
    constructor() {
        const app = createComponent(['app'], '');
        const loader = new Loader(app);

        import('./terminal/terminal').then((module: { Terminal: typeof Terminal }) =>
            setTimeout(() => {
                const terminal = new module.Terminal(app);
                loader.destroy();
            }, 900));
    }
}
