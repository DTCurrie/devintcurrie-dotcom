import { wait } from 'lib/async';
import { Component, component } from 'lib/component';
import { EventEmitter } from 'lib/event-emitter';
import { StateMachine } from 'lib/state';

import SimpleBar from 'simplebar';
import 'simplebar/dist/simplebar.css';

import { TerminalIntroState } from 'app/text-game/terminal/terminal.states';

@component({
    selector: 'text-game-terminal',
    templateUrl: 'text-game/terminal/terminal.component.html',
    stylesUrl: 'text-game/terminal/terminal.component.scss'
})
export class Terminal extends Component implements Init {
    private historyContent: any;

    private inputForm: HTMLFormElement;

    public historyElement: HTMLElement;

    public inputElement: HTMLInputElement;
    public onInput: EventEmitter<string> = new EventEmitter<string>();

    public stateMachine: StateMachine = new StateMachine();

    private updateDivider(): void {
        const divider = this.historyElement.querySelector('.divider');
        const character = divider.getAttribute('data-character');
        const count = Math.floor(this.historyElement.clientWidth / 10);

        let content = '';

        for (let i = 0; i < count; i++) { content += character; }
        divider.innerHTML = content;
    }

    public addLine(text: string, input = true, classList?: Array<string>): HTMLElement {
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

    public handleInput(text: string): void {
        if (!text || text === '') { return; }
        this.addLine(text);
        this.historyContent.getScrollElement().scrollTop = this.historyContent.getScrollElement().scrollHeight;
        this.inputElement.value = '';
    }

    public removeLine(line: HTMLElement): void { this.historyContent.getContentElement().removeChild(line); }

    public clear = async (): Promise<never> => {
        return new Promise<never>(async (resolve: () => void) => {
            this.historyContent.getContentElement().innerHTML = '';
            this.historyElement.classList.remove('filled');
            this.historyElement.classList.add('reset');
            await wait(100);
            this.historyElement.classList.remove('reset');
            resolve();
        });
    };

    public onInit(): void {
        this.historyElement = this.querySelector<HTMLElement>('.history');
        this.inputForm = this.querySelector<HTMLFormElement>('.input');
        this.inputElement = this.querySelector<HTMLInputElement>('input');

        this.updateDivider();

        this.historyContent = new SimpleBar(this.historyElement.querySelector('.inner'));
        this.inputElement.disabled = true;

        this.inputForm.addEventListener('submit', (ev: Event) => {
            ev.preventDefault();
            this.onInput.emit(this.inputElement.value);
        });

        window.addEventListener('resize', (ev: UIEvent) => this.updateDivider());

        wait(3000).then(() => this.stateMachine.transition(new TerminalIntroState(this)));
    }
}
