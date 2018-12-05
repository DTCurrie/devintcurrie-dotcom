import { State } from 'lib/state';

import { TerminalState } from 'app/shared/terminal/terminal-state';
import { TerminalStateService } from 'app/shared/terminal/terminal-state.service';

export class SnakeNewGameState extends TerminalState implements State {
    public async onEnter(): Promise<void> {
        TerminalStateService.saveState({ module: 'snake', key: 'new-game' });

        if (!this.terminal.historyElement.classList.contains('lock')) {
            this.terminal.historyElement.classList.add('lock');
        }

        if (!this.terminal.historyElement.classList.contains('show-title')) {
            this.terminal.historyElement.classList.add('show-title');
        }

        this.terminal.terminalWindow.querySelector('.header-text').textContent = 'Snake';

        this.terminal.inputForm.classList.add('hide');
        this.terminal.inputElement.disabled = true;

        this.terminal.addSpace();
        this.terminal.historyContent.append(document.createElement('snake-grid'));
        this.terminal.addSpace();
        this.terminal.addLine('Press Space to start!', false, [ 'prompt' ]);
    }

    public onExit(to: State): void {
        this.terminal.clear();
        this.terminal.helpersElement.innerHTML = '';
    }
}
