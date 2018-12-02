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

        if (input.match(/^yesh$/i)) { this.terminal.addLine('Nice Connery impression ...', false, [ 'sass' ]); }
        this.terminal.addLine('System scan shows the website was moved to locked directory "~/home/site/super-secret-folder".');

        const unlockText = await this.terminal.addLine('Unlocking directory "~/home/site/super-secret-folder"', false, [ 'loading' ]);
        await wait(2000).then(() => this.terminal.removeLine(unlockText));

        this.terminal.addLine('Unlocked directory "~/home/site/super-secret-folder".', false);
        this.terminal.addLine('Executing "super-secret-adventure.exe"', false, [ 'loading' ]);

        await wait(2000);
        await this.terminal.stateMachine.transition(new TerminalStartMenuState(this.terminal));
    });

    public onEnter = async (): Promise<void> => (async () => {
        this.terminal.addLine('Welcome to devintcurrie.com!', false);

        const initText = await this.terminal.addLine('Initializing Website', false, [ 'loading' ]);
        await wait(2000).then(() => this.terminal.removeLine(initText));

        this.terminal.addLine('Error initializing website!', false);
        this.terminal.addLine(
            `(don't worry this is all pretend, everything is working fine. you can skip all this by clicking the
            <span class="button">skip to website</span> button in the bottom-right corner of the screen)`,
            false, [ 'sass' ]);

        const rebootText = await this.terminal.addLine('Rebooting web server', false, [ 'loading' ]);
        await wait(2000).then(() => this.terminal.removeLine(rebootText));
        this.terminal.addLine('Web server rebooted.', false);

        const startText = await this.terminal.addLine('Starting site_booter.exe', false, [ 'loading' ]);
        await wait(2000).then(() => this.terminal.removeLine(startText));
        this.terminal.addSpace();

        this.terminal.addLine('--**[[ Site Booter ]]**--', false, [ 'helper' ]);

        const colorText = await this.terminal.addLine('Loading colors', false, [ 'loading' ]);
        await wait(2000);
        this.terminal.removeLine(colorText);
        this.terminal.terminalWindow.classList.remove('no-color');
        this.terminal.addLine('Colors loaded.', false);

        const scanText = await this.terminal.addLine('Scanning system', false, [ 'loading' ]);
        await wait(2000).then(() => this.terminal.removeLine(scanText));
        this.terminal.addLine('System scan shows the website was moved to locked directory "~/home/site/super-secret-folder".', false);

        const unlockText = await this.terminal.addLine('Unlocking directory "~/home/site/super-secret-folder"', false, [ 'loading' ]);
        await wait(2000).then(() => this.terminal.removeLine(unlockText));
        this.terminal.addLine('Unlocked and navigated to directory "~/home/site/super-secret-folder".', false);

        this.terminal.addLine('Contents of "~/home/site/super-secret-folder":', false, [ 'helper' ]);
        this.terminal.addLine('<ul><li>site.exe</li><li>spooky_mansion_mystery.exe</li></ul>', false, [ 'helper' ]);

        const inputText = await this.terminal.addLine('Initializing input', false, [ 'loading' ]);
        await wait(2000);
        this.terminal.removeLine(inputText);
        this.terminal.inputForm.classList.remove('hide');
        this.terminal.addLine('Input initialized.', false);

        this.terminal.addLine('Load audio (music will play, you will have play/pause and volume control)?', false, [ 'prompt' ]);

        this.terminal.inputElement.disabled = false;
        this.terminal.inputElement.focus();
    })();

    public onExit(): void {
        this.terminal.clear();
        this.inputHandler.dispose();
    }
}
