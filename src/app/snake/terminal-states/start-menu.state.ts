import { TerminalState } from 'app/shared/terminal/terminal-state';
import { TerminalStateService } from 'app/shared/terminal/terminal-state.service';

import { SnakeNewGameState } from 'app/snake/terminal-states/new-game.state';

export class SnakeStartMenuState extends TerminalState implements State {
    private inputHandler: Disposable = this.terminal.onInput.on(async (input: string) => {
        this.terminal.handleInput(input, [], true);

        if (input.match(/^new$/i)) {
            await this.terminal.stateMachine.transition(new SnakeNewGameState(this.terminal));
            return;
        }

        if (input.match(/^skip$/i)) {
            window.location.href = `${window.location.href}/site.html`;
            return;
        }

        this.terminal.addLine('Command not recognized.', false, [ 'prompt' ], true);
    });

    public async onEnter(): Promise<void> {
        TerminalStateService.saveState({ module: 'snake', key: 'start-menu' });

        if (!this.terminal.historyElement.classList.contains('lock')) { this.terminal.historyElement.classList.add('lock'); }
        if (!this.terminal.historyElement.classList.contains('show-title')) { this.terminal.historyElement.classList.add('show-title'); }
        if (this.terminal.inputForm.classList.contains('hide')) { this.terminal.inputForm.classList.remove('hide'); }
        if (!this.terminal.terminalWindow.classList.contains('show-input-helpers')) {
            this.terminal.terminalWindow.classList.add('show-input-helpers');
        }

        this.terminal.terminalWindow.querySelector('.header-text').textContent = 'Snake';

        this.terminal.inputElement.disabled = true;

        this.terminal.addSpace();
        await this.terminal.addLine('<app-snake-start-menu-art></app-snake-start-menu-art>', false);
        await this.terminal.addLine(
            `Welcome to the classic Snake game! You play as the "@" snake, and your goal is to eat the "&" mice!  Don't worry, if you want
            to skip this and go right to my website, use the <span class="button">skip to website</span> button in the bottom-right corner
            of the screen, or enter <span class="helper">skip</span>.`,
            false, [ 'prompt' ]);

        this.terminal.addSpace();

        this.terminal.setHelpers([
            { command: 'new' },
            { command: 'skip' }
        ]);

        this.terminal.inputElement.disabled = false;
        this.terminal.inputElement.focus();
    }

    public onExit(to: State): void {
        this.terminal.clear();
        this.terminal.helpersElement.innerHTML = '';
        this.terminal.historyElement.classList.remove('lock');
    }
}
