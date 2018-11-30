import { componentFactory } from 'lib/component';
import { State } from 'lib/state';

import { StartMenuArt } from 'app/text-game/art/start-menu/start-menu-art.component';
import { TerminalState } from 'app/text-game/terminal/terminal.state';

export class TerminalStartMenuState extends TerminalState implements State {
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
            <ul>
                <li>new</li>
                <li>load</li>
                <li>skip</li>
            </ul>
        `;
    })();

    public onExit(to: State): void {
        throw new Error('Method not implemented.');
    }
}
