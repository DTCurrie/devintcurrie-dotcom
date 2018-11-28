import { createComponent } from 'lib/component';
import { TypedEvent } from 'lib/typed-event';

import SimpleBar from 'simplebar';
import 'simplebar/dist/simplebar.css';

import './terminal.scss';

export class Terminal implements Init {
    private historyElement: HTMLElement;
    private historyContent: any;

    private inputForm: HTMLFormElement;
    private inputElement: HTMLInputElement;

    private onInput: TypedEvent<string> = new TypedEvent<string>();

    constructor(parent: HTMLElement) {
        const element = createComponent(['terminal'], require('./terminal.html'), parent);
        this.historyElement = element.querySelector<HTMLElement>('.history');
        this.inputForm = element.querySelector<HTMLFormElement>('.input');
        this.inputElement = this.inputForm.querySelector<HTMLInputElement>('input');
        this.updateDivider();
        this.init();
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

    private clear(): void {
        this.historyContent.getContentElement().innerHTML = '';
        this.historyElement.classList.remove('filled');
    }

    private updateDivider(): void {
        const divider = this.historyElement.querySelector('.divider');
        const character = divider.getAttribute('data-character');
        const count = Math.floor(this.historyElement.clientWidth / 10);

        let content = '';

        for (let i = 0; i < count; i++) { content += character; }
        divider.innerHTML = content;
    }

    public init(): void {
        this.historyContent = new SimpleBar(this.historyElement.querySelector('.inner'));
        this.inputElement.disabled = true;

        this.inputForm.addEventListener("submit", (ev: Event) => {
            ev.preventDefault();
            this.onInput.emit(this.inputElement.value);
        });

        window.addEventListener("resize", (ev: UIEvent) => this.updateDivider());

        this.addLine('Welcome!', false);

        const initText = this.addLine('Initializing Website', false, ['loading']);

        setTimeout(() => {
            this.removeLine(initText);

            this.addLine('Website not available! System scan shows the website was moved to locked directory "~/home/site/super-secret-folder".', false);
            this.addLine('Attempt to unlock? (y/n)', false, ['prompt']);

            this.inputElement.disabled = false;
            this.inputElement.focus();
        }, 3000);

        const listener = this.onInput.on((input: string) => {
            this.handleInput(input);
            if (input.match(/^(y|ye|ye[as]|yeah)|(unlock)$/i)) {
                const unlockText = this.addLine('Unlocking directory "~/home/site/super-secret-folder"', false, ['loading']);

                setTimeout(() => {
                    this.removeLine(unlockText);

                    this.addLine('Unlocked directory "~/home/site/super-secret-folder".', false);
                    this.addLine('Executing "super-secret-adventure.exe"', false, ['loading']);

                    setTimeout(() => {
                        this.clear();
                        this.historyElement.classList.add('show-title');
                    }, 3000);
                }, 3000);
                listener.dispose();
                return;
            }

            this.addLine('Command not recognized. Attempt to unlock?', false, ['prompt']);
        });
    }
}
