import { Component, component, Init } from 'lib/component';

import { TerminalStateService } from 'app/terminal/terminal-state.service';
import { Terminal } from 'app/terminal/terminal.component';

@component({
    selector: 'app-root',
    template: `
    <div class="app">
        <app-terminal></app-terminal>
    </div>`,
    stylesUrl: 'app.component.scss'
})
export class App extends Component implements Init {
    public async onInit(): Promise<void> {
        const terminal: Terminal = this.querySelector<Terminal>('app-terminal');
        const state = TerminalStateService.loadState();

        if (state) {
            terminal.setAttribute('data-state-module', state.module);
            terminal.setAttribute('data-state-key', state.key);
            return;
        }

        terminal.setAttribute('data-state-module', 'app');
        terminal.setAttribute('data-state-key', 'intro');
    }

}
