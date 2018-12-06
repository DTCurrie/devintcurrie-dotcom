import { wait } from 'lib/async';

import { TerminalState } from 'app/terminal/terminal-state';
import { TerminalStateService } from 'app/terminal/terminal-state.service';

import { TextGameNewGameState } from 'app/text-game/terminal-states/new-game.state';

export class TextGameStartMenuState extends TerminalState implements State {
    private animationTicker: number;

    private animationFrames: Array<string> = [];

    private inputHandler: Disposable = this.terminal.onInput.on(async (input: string) => {
        this.terminal.handleInput(input, [], true);

        if (input.match(/^new$/i)) {
            this.terminal.addLine('Starting new game!', false, [ 'prompt' ]);
            await this.terminal.stateMachine.transition(new TextGameNewGameState(this.terminal));
            return;
        }

        if (input.match(/^skip$/i)) {
            window.location.href = `${window.location.href}/site.html`;
            return;
        }

        this.terminal.addLine('Command not recognized.', false, [ 'prompt' ], true);
    });

    private async animation(): Promise<number> {
        const art = this.terminal.historyContent.querySelector('.art pre');

        await Promise.all(this.animationFrames.map(async (frame: string) => {
            art.innerHTML = await frame;
            await wait(500);
        }));

        return window.setTimeout(async () => this.animation());
    }

    public async onEnter(): Promise<void> {
        TerminalStateService.saveState({ module: 'text-game', key: 'start-menu' });

        if (!this.terminal.terminalWindow.classList.contains('show-input-helpers')) {
            this.terminal.terminalWindow.classList.add('show-input-helpers');
        }

        if (!this.terminal.historyElement.classList.contains('show-title')) {
            this.terminal.historyElement.classList.add('show-title');
        }

        this.terminal.terminalWindow.querySelector('.header-text').textContent = 'Spooky Mansion Mystery';

        await this.terminal.addLine('<tg-start-menu-art></tg-start-menu-art>', false);
        await this.terminal.addLine(
            `Welcome to Spooky Mansion Mystery, a text-based adventure game where you will explore a haunted mansion, find clues, solve
            puzzles, and finally escape! Don't worry, if you want to skip this and go right to my website, use the
            <span class="button">skip to website</span> button in the bottom-right corner of the screen, or enter
            <span class="helper">skip</span>.`,
            false, [ 'prompt' ]);

        this.terminal.addSpace();

        this.terminal.setHelpers([
            { command: 'new' },
            { command: 'skip' }
        ]);

        const art = this.terminal.historyContent.querySelector('.art pre');
        let artText = art.textContent;

        const replaceAll = async (original: string, replacement: string) => artText = artText.split(original).join(replacement);

        this.animationFrames.push(artText);
        await this.animationFrames.push(await replaceAll('/', "'"));
        await this.animationFrames.push(await replaceAll('+', '_').then(async () => replaceAll('M', 'N')));
        await this.animationFrames.push(await replaceAll('`', ' '));
        await this.animationFrames.push(await replaceAll('_', '+').then(async () => replaceAll('N', 'M')));
        await this.animationFrames.push(await replaceAll("'", '/'));

        this.animationTicker = await this.animation();

        this.terminal.inputElement.disabled = false;
        this.terminal.inputElement.focus();
    }

    public onExit(to: State): void {
        this.inputHandler.dispose();
        clearInterval(this.animationTicker);
        this.terminal.clear();
        this.terminal.helpersElement.innerHTML = '';
    }
}
