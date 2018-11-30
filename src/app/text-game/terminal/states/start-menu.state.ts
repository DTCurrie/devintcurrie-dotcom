import { wait } from 'lib/async';
import { componentFactory } from 'lib/component';
import { Disposable } from 'lib/event-emitter';
import { State } from 'lib/state';

import { StartMenuArt } from 'app/text-game/art/start-menu/start-menu-art.component';
import { TerminalState } from 'app/text-game/terminal/terminal.state';

export class TerminalStartMenuState extends TerminalState implements State {
    private inputHandler: Disposable = this.terminal.onInput.on(async (input: string) => {
        this.terminal.handleInput(input);

        if (input.match(/^new$/i)) {
            this.terminal.addLine('Starting new game!', false, [ 'prompt' ]);
            // await this.terminal.stateMachine.transition(new TerminalStartMenuState(this.terminal));
            return;
        }

        if (input.match(/^load$/i)) {
            this.terminal.addLine('Loading saved game!', false, [ 'prompt' ]);
            return;
        }

        if (input.match(/^skip$/i)) {
            this.terminal.addLine('Skip game!', false, [ 'prompt' ]);
            return;
        }

        this.terminal.addLine('Command not recognized.', false, [ 'prompt' ]);
    });

    public onEnter = async (): Promise<void> => (async () => {
        this.terminal.windowElement.classList.add('show-input-helpers');
        this.terminal.historyElement.classList.add('show-title');

        this.terminal.addSpace();

        await this.terminal.addLine((await componentFactory<StartMenuArt>('tg-start-menu-art')).outerHTML, false, [ 'art' ]);
        await this.terminal.addLine(
            `Welcome to Spooky Mansion Mystery, a text-based adventure game where you will explore a haunted mansion, find clues, solve
            puzzles, and finally escape! Don't worry, if you want to skip this and go right to my website, hit the "skip to website"
            link in the bottom-right corner of the screen, or enter "skip".`,
            false, [ 'prompt' ]);

        this.terminal.helpersElement.innerHTML = `
            <ul class="helpers-list">
                <li class="helpers-list-item new">new</li>
                <li class="helpers-list-item load">load</li>
                <li class="helpers-list-item skip">skip</li>
            </ul>`;

        this.terminal.helpersElement.querySelectorAll('.helpers-list-item').forEach((element: HTMLLIElement): void => {
            element.addEventListener('click', (_ev: MouseEvent) => {
                if (element.classList.contains('new')) { this.terminal.inputElement.value = 'new'; }
                if (element.classList.contains('load')) { this.terminal.inputElement.value = 'load'; }
                if (element.classList.contains('skip')) { this.terminal.inputElement.value = 'skip'; }
                this.terminal.inputElement.focus();
            });
        });
    })();

    public onExit(to: State): void {
        this.inputHandler.dispose();
    }
}
