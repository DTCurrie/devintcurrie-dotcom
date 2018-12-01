import { wait } from 'lib/async';
import { componentFactory } from 'lib/component';
import { Disposable } from 'lib/event-emitter';
import { State } from 'lib/state';

import { StartMenuArt } from 'app/text-game/art/start-menu/start-menu-art.component';

import { TerminalState } from 'app/text-game/terminal/terminal-state';
import { TerminalStateService } from 'app/text-game/terminal/terminal-state.service';
import { TerminalNewGameState } from 'app/text-game/terminal/states/new-game.state';

export class TerminalStartMenuState extends TerminalState implements State {
    private animationTicker: number = window.setTimeout(async () => this.mangle(), 500);

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

    private async mangle(): Promise<void> {
        const art = this.terminal.historyContent.querySelector('.art pre');
        const artText = art.textContent;
        const replaceAll = async (original: string, replacement: string) => artText.split(original).join(replacement);

        art.innerHTML = await replaceAll('/', "'");
        await wait(500);
        art.innerHTML = await replaceAll('+', '_');
        await wait(500);
        art.innerHTML = await replaceAll('"', '|');
        await wait(500);
        art.innerHTML = await replaceAll('`', ' ');
        await wait(500);
        art.innerHTML = await replaceAll('*', '.');

        art.innerHTML = artText;
        window.setTimeout(async () => this.mangle(), 500);
    }

    public onEnter = async (): Promise<void> => (async () => {
        TerminalStateService.saveState({ key: 'start-menu' });

        this.terminal.terminalWindow.classList.add('show-input-helpers');
        this.terminal.historyElement.classList.add('show-title');

        await this.terminal.addLine((await componentFactory<StartMenuArt>('tg-start-menu-art')).outerHTML, false);
        await this.terminal.addLine(
            `Welcome to Spooky Mansion Mystery, a text-based adventure game where you will explore a haunted mansion, find clues, solve
            puzzles, and finally escape! Don't worry, if you want to skip this and go right to my website, use the
            <span class="button">skip to website</span> button in the bottom-right corner of the screen, or enter
            <span class="helper">skip</span>.`,
            false, [ 'prompt' ]);

        this.terminal.addSpace();

        this.terminal.helpersElement.innerHTML = `
            <ul class="helpers-list">
                <li class="helper">new</li>
                <li class="helper">skip</li>
            </ul>`;

        this.terminal.helpersElement.querySelectorAll('.helpers-list-item').forEach((element: HTMLLIElement): void => {
            element.addEventListener('click', (_ev: MouseEvent) => {
                if (element.classList.contains('new')) { this.terminal.inputElement.value = 'new'; }
                if (element.classList.contains('load')) { this.terminal.inputElement.value = 'load'; }
                if (element.classList.contains('skip')) { this.terminal.inputElement.value = 'skip'; }
                this.terminal.inputElement.focus();
            });
        });

        await wait(100);
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
