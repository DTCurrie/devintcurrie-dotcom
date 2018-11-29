import { wait } from 'lib/async';
import { Component } from 'lib/component';
import { TypedEvent } from 'lib/typed-event';

import SimpleBar from 'simplebar';
import 'simplebar/dist/simplebar.css';

@Component({
    selector: 'text-game-terminal',
    templateUrl: 'text-game/terminal/terminal.component.html',
    stylesUrl: 'text-game/terminal/terminal.component.scss'
})
export class Terminal extends HTMLElement implements Init {

    private historyElement: HTMLElement;
    private historyContent: any;

    private inputForm: HTMLFormElement;
    private inputElement: HTMLInputElement;

    private onInput: TypedEvent<string> = new TypedEvent<string>();

    public onInit(): void {
        this.historyElement = this.querySelector<HTMLElement>('.history');
        this.inputForm = this.querySelector<HTMLFormElement>('.input');
        this.inputElement = this.querySelector<HTMLInputElement>('input');

        this.updateDivider();

        this.historyContent = new SimpleBar(this.historyElement.querySelector('.inner'));
        this.inputElement.disabled = true;

        this.inputForm.addEventListener("submit", (ev: Event) => {
            ev.preventDefault();
            this.onInput.emit(this.inputElement.value);
        });

        window.addEventListener("resize", (ev: UIEvent) => this.updateDivider());

        this.startIntro();
    }

    private addLine(text: string, input: boolean = true, classList?: string[]): HTMLElement {
        if (input) { text = `> ${text}`; }

        const line: HTMLElement = document.createElement('p');

        line.classList.add('line');
        if (classList) { line.classList.add(...classList); }

        line.innerHTML = text;
        this.historyContent.getContentElement().appendChild(line);

        if (this.historyContent.getScrollElement().scrollHeight >= this.historyElement.scrollHeight) {
            this.historyElement.classList.add('filled');
        }

        return line;
    }

    private handleInput(text: string): void {
        if (!text || text === '') { return; }
        this.addLine(text);
        this.historyContent.getScrollElement().scrollTop = this.historyContent.getScrollElement().scrollHeight;
        this.inputElement.value = '';
    }

    private removeLine(line: HTMLElement): void { this.historyContent.getContentElement().removeChild(line); }

    private clear = async (): Promise<never> => {
        return new Promise<never>(async (resolve: () => void) => {
            this.historyContent.getContentElement().innerHTML = '';
            this.historyElement.classList.remove('filled');
            this.historyElement.classList.add('reset');
            await wait(100);
            this.historyElement.classList.remove('reset')
            resolve();
        });
    }

    private updateDivider(): void {
        const divider = this.historyElement.querySelector('.divider');
        const character = divider.getAttribute('data-character');
        const count = Math.floor(this.historyElement.clientWidth / 10);

        let content = '';

        for (let i = 0; i < count; i++) { content += character; }
        divider.innerHTML = content;
    }

    private async startIntro(): Promise<never> {
        return new Promise<never>(async (resolve: () => void) => {
            this.addLine('Welcome!', false);

            const initText = this.addLine('Initializing Website', false, ['loading']);
            await wait(3000).then(() => this.removeLine(initText));

            this.addLine('Website not available! System scan shows the website was moved to locked directory "~/home/site/super-secret-folder".', false);
            this.addLine('Attempt to unlock? (y/n)', false, ['prompt']);

            this.inputElement.disabled = false;
            this.inputElement.focus();

            const listener = this.onInput.on(async (input: string) => {
                this.handleInput(input);

                if (!input.match(/^(y|ye|ye[as]|yeah)|(unlock)$/i)) {
                    this.addLine('Command not recognized. Attempt to unlock?', false, ['prompt']);
                    return;
                }

                const unlockText = this.addLine('Unlocking directory "~/home/site/super-secret-folder"', false, ['loading']);
                await wait(3000).then(() => this.removeLine(unlockText));

                this.addLine('Unlocked directory "~/home/site/super-secret-folder".', false);
                this.addLine('Executing "super-secret-adventure.exe"', false, ['loading']);

                await wait(3000);

                this.clear();
                this.historyElement.classList.add('show-title');

                listener.dispose();
                resolve();
            });
        });
    }
}
