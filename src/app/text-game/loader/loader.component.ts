import { wait } from 'lib/async';
import { Component, component } from 'lib/component';

@component({
    selector: 'text-game-loader',
    template: '<div class="loader"><code class="loader-text">loading</code>',
    stylesUrl: 'text-game/loader/loader.component.scss'
})
export class Loader extends Component implements Init {

    public onInit(): void {
        this.querySelector('.loader').classList.add('loading');
        wait(3000).then(() => this.parentElement.removeChild(this));
    }
}
