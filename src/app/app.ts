import { Component } from 'lib/component';

@Component({
    selector: 'app-root',
    template: `
    <main class="app">
        <text-game-terminal></text-game-terminal>
    </main>`,
    stylesUrl: 'app.component.scss'
})
export class App extends HTMLElement {
    connectedCallback() {
        console.log('connected callback');
        import('./text-game/text-game');
    }

    disconnectedCallback() {
        console.log('disconnected callback');
    }
}
