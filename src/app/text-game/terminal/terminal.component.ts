import { wait } from 'lib/async';
import { Component, component } from 'lib/component';
import { EventEmitter } from 'lib/event-emitter';
import { StateMachine } from 'lib/state';

import SimpleBar from 'simplebar';
import 'simplebar/dist/simplebar.css';

import { TerminalIntroState } from 'app/text-game/terminal/states/intro.state';

@component({
    selector: 'tg-terminal',
    templateUrl: 'text-game/terminal/terminal.component.html',
    stylesUrl: 'text-game/terminal/terminal.component.scss'
})
export class Terminal extends Component implements Init {
    private historyContent: any;

    private inputForm: HTMLFormElement;

    public windowElement: HTMLElement;
    public historyElement: HTMLElement;
    public helpersElement: HTMLElement;
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

    public async addLine(text: string, input = true, classList?: Array<string>): Promise<HTMLElement> {
        if (input) { text = `> ${text}`; }

        const line: HTMLElement = document.createElement('p');

        line.classList.add('line');
        if (classList) { line.classList.add(...classList); }

        line.innerHTML = text;
        this.historyContent.getContentElement().appendChild(line);

        if (this.historyContent.getScrollElement().scrollHeight >= this.historyElement.scrollHeight) {
            this.historyElement.classList.add('filled');
        }

        this.historyContent.getScrollElement().scrollTop = this.historyContent.getScrollElement().scrollHeight;

        return line;
    }

    public async addSpace(): Promise<void> { this.addLine('&nbsp;', false); }

    public handleInput(text: string, deleteLast?: boolean): void {
        if (!text || text === '') { return; }
        this.addLine(text);
        this.inputElement.value = '';
    }

    public removeLine(line: HTMLElement): void { this.historyContent.getContentElement().removeChild(line); }

    public async clear(): Promise<void> {
        this.inputForm.classList.add('hide');
        this.historyContent.getContentElement().innerHTML = '';
        this.historyElement.classList.remove('filled');
        this.historyElement.classList.add('reset');
        await wait(100);
        this.historyElement.classList.remove('reset');
        this.inputForm.classList.remove('hide');
    }

    public onInit(): void {
        this.windowElement = this.querySelector<HTMLElement>('.terminal-window');
        this.historyElement = this.windowElement.querySelector<HTMLElement>('.history');
        this.inputForm = this.windowElement.querySelector<HTMLFormElement>('.input');
        this.helpersElement = this.inputForm.querySelector<HTMLFormElement>('.helpers');
        this.inputElement = this.inputForm.querySelector<HTMLInputElement>('input');

        this.updateDivider();

        this.historyContent = new SimpleBar(this.historyElement.querySelector('.inner'));
        this.inputElement.disabled = true;

        this.inputForm.addEventListener('submit', (ev: Event) => {
            ev.preventDefault();
            this.onInput.emit(this.inputElement.value);
        });

        window.addEventListener('resize', (ev: UIEvent) => this.updateDivider());

        wait(2000).then(() => this.stateMachine.transition(new TerminalIntroState(this)));
    }
}
