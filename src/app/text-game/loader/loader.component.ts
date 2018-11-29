import { wait } from 'lib/async';
import { Component } from 'lib/component';

@Component({
    selector: 'text-game-loader',
    template: '<div class="loader"><code class="loader-text">loading</code>',
    stylesUrl: 'text-game/loader/loader.component.scss'
})
export class Loader extends HTMLElement implements Init, Destroy {

    onInit(): void {
        this.classList.add('loading');
        wait(3000).then(() => this.onDestroy());
    }

    onDestroy(): void { this.parentElement.removeChild(this); }
}
