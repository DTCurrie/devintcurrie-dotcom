import { wait } from 'lib/async';

import { TerminalState } from 'app/shared/terminal/terminal-state';
import { TerminalStateService } from 'app/shared/terminal/terminal-state.service';

export class TerminalIntroState extends TerminalState implements State {
    private inputHandler: Disposable = this.terminal.onInput.on(async (input: string) => {
        this.terminal.handleInput(input);

        if (input.match(/^help|-h$/i)) {
            await this.terminal.addLine('Site Booter:', false, [ 'system' ]);
            this.terminal.addLine(`
                <ul>
                    <li>* run [exe] - Runs the supplied module. ex: run site.exe</li>
                    <li>* skip (-s) - Skip straight to my portfolio site.</li>
                    <li>* help (-h) - Show this menu.</li>
                </ul>`,
                false, [ 'system' ]);
            return;
        }

        if (input.match(/^skip|-s$/i)) {
            this.terminal.addLine('Skip to site!', false, [ 'system' ]);
            return;
        }

        if (input.match(/^run( \w+(\.exe)?)?$/i)) {
            const parts = input.split(' ');

            if (parts.length < 2) {
                await this.terminal.addLine('Run requires an option. ex: run site.exe', false, [ 'prompt' ]);
                return;
            }

            const command = parts[ 1 ];

            if (command === 'site.exe') {
                await this.terminal.addLine('run site.exe', false, [ 'prompt' ]);
                return;
            }

            if (command === 'mystery.exe') {
                this.terminal.dataset.stateModule = 'text-game';
                this.terminal.dataset.stateKey = 'start-menu';
                return;
            }

            if (command === 'snake.exe') {
                this.terminal.dataset.stateModule = 'snake';
                this.terminal.dataset.stateKey = 'start-menu';
                return;
            }

            await this.terminal.addLine(`Cannot find module ${command}`, false, [ 'prompt' ]);
            return;
        }

        await this.terminal.addLine('Command not recognized. Try entering "help" for more information.', false, [ 'prompt' ]);
    });

    public onEnter = async (): Promise<void> => (async () => {
        TerminalStateService.saveState({ module: 'app', key: 'intro' });

        this.terminal.addLine('Welcome to devintcurrie.com!', false);

        this.terminal.addLine('--**[[ Site Booter ]]**--', false, [ 'title' ]);
        this.terminal.addLine(
            `(don't worry this is all pretend. you can skip all this by clicking the <span class="button">skip to website</span>
                button in the bottom-right corner of the screen)`,
            false, [ 'sass' ]);

        if (this.terminal.terminalWindow.classList.contains('show-input-helpers')) {
            this.terminal.terminalWindow.classList.remove('show-input-helpers');
        }

        if (this.terminal.historyElement.classList.contains('show-title')) {
            this.terminal.historyElement.classList.remove('show-title');
        }

        if (!this.terminal.initialized) {
            this.terminal.terminalWindow.classList.add('no-color');
            this.terminal.inputForm.classList.add('hide');

            const colorText = await this.terminal.addLine('Loading colors', false, [ 'loading' ]);
            await wait(2000);
            this.terminal.removeLine(colorText);
            this.terminal.terminalWindow.classList.remove('no-color');
            this.terminal.addLine('Colors loaded.', false);

            const scanText = await this.terminal.addLine('Scanning system', false, [ 'loading' ]);
            await wait(2000).then(() => this.terminal.removeLine(scanText));
            this.terminal.addLine('System scan shows the website was moved to "~/home/site/super-secret-folder".', false);
            this.terminal.addLine('Navigated to "~/home/site/super-secret-folder".', false);

            const inputText = await this.terminal.addLine('Initializing input', false, [ 'loading' ]);
            await wait(2000);
            this.terminal.removeLine(inputText);
            this.terminal.inputForm.classList.remove('hide');
            this.terminal.terminalWindow.classList.add('show-input-helpers');
            this.terminal.addLine('Input initialized.', false);

            this.terminal.initialized = true;
            localStorage.setItem('devintcurrie:terminal-intitialized', `${1}`);
        }

        this.terminal.addLine('Contents of "~/home/site/super-secret-folder":', false, [ 'system' ]);
        this.terminal.addLine(`
            <ul>
                <li class="run-link">site.exe</li>
                <li class="run-link">mystery.exe</li>
                <li class="run-link">snake.exe</li>
            </ul>`,
            false, [ 'system' ]);

        this.terminal.historyContent.querySelectorAll<HTMLLIElement>('.run-link').forEach((link: HTMLLIElement) => {
            link.addEventListener('click', (ev: MouseEvent) => {
                ev.preventDefault();
                this.terminal.inputElement.value = `run ${link.textContent}`;
                this.terminal.inputElement.focus();
            });
        });

        this.terminal.setHelpers([
            { command: 'run', options: [ 'exe' ] },
            { command: 'skip', alias: '-s' },
            { command: 'help', alias: '-h' }
        ]);

        this.terminal.inputElement.disabled = false;
        this.terminal.inputElement.focus();
    })();

    public onExit(): void {
        this.terminal.clear();
        this.inputHandler.dispose();
    }
}
