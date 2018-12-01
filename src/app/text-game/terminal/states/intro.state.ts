import { wait } from 'lib/async';
import { Disposable } from 'lib/event-emitter';
import { State } from 'lib/state';

import { TerminalStartMenuState } from 'app/text-game/terminal/states/start-menu.state';

import { TerminalState } from 'app/text-game/terminal/terminal-state';
import { TerminalStateService } from 'app/text-game/terminal/terminal-state.service';

export class TerminalIntroState extends TerminalState implements State {
    private inputHandler: Disposable = this.terminal.onInput.on(async (input: string) => {
        this.terminal.handleInput(input);

        if (!input.match(/^(ye?[as]?h?)|unlock$/i)) {
            this.terminal.addLine('Command not recognized. Attempt to unlock?', false, [ 'prompt' ]);
            return;
        }

        if (input.match(/^yesh$/i)) { this.terminal.addLine('Nice Connery ...', false, [ 'sass' ]); }

        const unlockText = await this.terminal.addLine('Unlocking directory "~/home/site/super-secret-folder"', false, [ 'loading' ]);
        await wait(2000).then(() => this.terminal.removeLine(unlockText));

        this.terminal.addLine('Unlocked directory "~/home/site/super-secret-folder".', false);
        this.terminal.addLine('Executing "super-secret-adventure.exe"', false, [ 'loading' ]);

        await wait(2000);
        await this.terminal.stateMachine.transition(new TerminalStartMenuState(this.terminal));
    });

    public onEnter = async (): Promise<void> => (async () => {
        TerminalStateService.saveState({ key: 'intro' });

        this.terminal.addLine('Welcome!', false);

        const initText = await this.terminal.addLine('Initializing Website', false, [ 'loading' ]);
        await wait(2000).then(() => this.terminal.removeLine(initText));

        this.terminal.addLine(
            'Website not available! System scan shows the website was moved to locked directory "~/home/site/super-secret-folder".',
            false);

        this.terminal.addLine('Attempt to unlock?', false, [ 'prompt' ]);

        this.terminal.inputElement.disabled = false;
        this.terminal.inputElement.focus();
    })();

    public onExit(): void {
        this.terminal.clear();
        this.inputHandler.dispose();
    }
}
