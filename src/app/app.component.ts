import { Component, component } from 'lib/component';

import { TerminalStateService } from 'app/shared/terminal/terminal-state.service';
import { Terminal } from 'app/shared/terminal/terminal.component';

import { TextGameStartMenuState } from 'app/text-game/terminal-states';

import { TerminalIntroState } from 'app/intro.state';

@component({
    selector: 'app-root',
    template: `
    <main class="app">
        <app-terminal></app-terminal>
    </main>`,
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
