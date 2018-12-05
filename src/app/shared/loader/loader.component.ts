import { wait } from 'lib/async';
import { Component, component } from 'lib/component';

@component({
    selector: 'app-loader',
    template: '<div class="loader"><code class="loader-text loading">loading</code></div>',
    stylesUrl: 'shared/loader/loader.component.scss'
})
export class Loader extends Component { }
