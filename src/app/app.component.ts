import { Component, component } from 'lib/component';

@component({
    selector: 'app-root',
    template: `
    <main class="app">
        <tg-terminal></tg-terminal>
    </main>`,
    stylesUrl: 'app.component.scss'
})
export class App extends Component { }
