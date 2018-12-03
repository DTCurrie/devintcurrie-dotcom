import { wait } from 'lib/async';
import { componentFactory } from 'lib/component';
import { Disposable } from 'lib/event-emitter';
import { State } from 'lib/state';

import { StartMenuArt } from 'app/text-game/art/start-menu/start-menu-art.component';

import { TerminalState } from 'app/text-game/terminal/terminal-state';
import { TerminalStateService } from 'app/text-game/terminal/terminal-state.service';
import { TerminalNewGameState } from 'app/text-game/terminal/states/new-game.state';

export class TerminalStartMenuState extends TerminalState implements State {
    private animationTicker: number;

    private animationFrames: Array<string> = [];

    private inputHandler: Disposable = this.terminal.onInput.on(async (input: string) => {
        this.terminal.handleInput(input, [], true);

        if (input.match(/^new$/i)) {
            this.terminal.addLine('Starting new game!', false, [ 'prompt' ]);
            await this.terminal.stateMachine.transition(new TerminalNewGameState(this.terminal));
            return;
        }

        if (input.match(/^skip$/i)) {
            this.terminal.addLine('Skip game!', false, [ 'prompt' ]);
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

    public onEnter = async (): Promise<void> => (async () => {
        TerminalStateService.saveState({ key: 'start-menu' });

        this.terminal.terminalWindow.classList.add('show-input-helpers');
        this.terminal.historyElement.classList.add('show-title');

        await import('app/text-game/art/start-menu/start-menu-art.component');

        await this.terminal.addLine((await componentFactory<StartMenuArt>('tg-start-menu-art')).outerHTML, false);
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

        this.terminal.helpersElement.querySelectorAll('.helpers-list .helper').forEach((element: HTMLLIElement): void => {
            element.addEventListener('click', (_ev: MouseEvent) => {
                if (element.classList.contains('new')) { this.terminal.inputElement.value = 'new'; }
                if (element.classList.contains('skip')) { this.terminal.inputElement.value = 'skip'; }
                this.terminal.inputElement.focus();
            });
        });

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
    })();

    public onExit(to: State): void {
        this.inputHandler.dispose();
        clearInterval(this.animationTicker);
        this.terminal.clear();
        this.terminal.helpersElement.innerHTML = '';
    }
}
