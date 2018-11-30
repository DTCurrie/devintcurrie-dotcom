import { wait } from 'lib/async';
import { Component, component } from 'lib/component';

@component({
    selector: 'tg-loader',
    template: '<div class="loader"><code class="loader-text loading">loading</code></div>',
    stylesUrl: 'text-game/loader/loader.component.scss'
})
export class Loader extends Component implements Init {
    public onInit(): void { wait(2000).then(() => this.parentElement.removeChild(this)); }
}
