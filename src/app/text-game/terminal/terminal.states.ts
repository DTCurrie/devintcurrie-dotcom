import { wait } from 'lib/async';
import { Disposable } from 'lib/event-emitter';
import { State } from 'lib/state';

import { Terminal } from './terminal.component';

export class TerminalState {
    constructor(protected terminal: Terminal) { }
}

export class TerminalIntroState extends TerminalState implements State {
    private inputHandler: Disposable = this.terminal.onInput.on(async (input: string) => {
        this.terminal.handleInput(input);

        if (!input.match(/^ye?[as]?h?$/i)) {
            this.terminal.addLine('Command not recognized. Attempt to unlock?', false, [ 'prompt' ]);
            return;
        }

        const unlockText = this.terminal.addLine('Unlocking directory "~/home/site/super-secret-folder"', false, [ 'loading' ]);
        await wait(3000).then(() => this.terminal.removeLine(unlockText));

        this.terminal.addLine('Unlocked directory "~/home/site/super-secret-folder".', false);
        this.terminal.addLine('Executing "super-secret-adventure.exe"', false, [ 'loading' ]);

        await wait(3000);

        this.terminal.clear();
        this.terminal.historyElement.classList.add('show-title');
        await this.terminal.stateMachine.transition(new TerminalGameState(this.terminal));
    });

    public onEnter = async (): Promise<void> => (async () => {
        this.terminal.addLine('Welcome!', false);

        const initText = this.terminal.addLine('Initializing Website', false, [ 'loading' ]);
        await wait(3000).then(() => this.terminal.removeLine(initText));

        this.terminal.addLine(
            'Website not available! System scan shows the website was moved to locked directory "~/home/site/super-secret-folder".',
            false);

        this.terminal.addLine('Attempt to unlock? (y/n)', false, [ 'prompt' ]);

        this.terminal.inputElement.disabled = false;
        this.terminal.inputElement.focus();
    })();

    public onExit = async (): Promise<void> => this.inputHandler.dispose();
}

export class TerminalGameState extends TerminalState implements State {
    public onEnter(from: State): Promise<void> {
        throw new Error('Method not implemented.');
    }
    public onExit(to: State): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
