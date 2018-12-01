import SimpleBar from 'simplebar';

import { wait } from 'lib/async';
import { Component, component } from 'lib/component';
import { EventEmitter } from 'lib/event-emitter';
import { StateMachine } from 'lib/state';

import { TerminalStateService } from 'app/text-game/terminal/terminal-state.service';
import { TerminalIntroState, TerminalNewGameState, TerminalStartMenuState } from 'app/text-game/terminal/states';

@component({
    selector: 'tg-terminal',
    templateUrl: 'text-game/terminal/terminal.component.html',
    stylesUrl: 'text-game/terminal/terminal.component.scss'
})
export class Terminal extends Component implements Init {
    private simplebar: any;

    private inputForm: HTMLFormElement;

    public terminalWindow: HTMLElement;
    public historyElement: HTMLElement;
    public helpersElement: HTMLElement;
    public inputElement: HTMLInputElement;

    public onInput: EventEmitter<string> = new EventEmitter<string>();

    public stateMachine: StateMachine = new StateMachine();

    public get historyContent(): Element { return this.simplebar.getContentElement(); }
    public get historyScroll(): Element { return this.simplebar.getScrollElement(); }

    private updateDivider(): void {
        const divider = this.historyElement.querySelector('.divider');
        const character = divider.getAttribute('data-character');
        const count = Math.floor(this.historyElement.clientWidth / 10);

        let content = '';

        for (let i = 0; i < count; i++) { content += character; }
        divider.innerHTML = content;
    }

    public async addLine(text: string, input = true, classList?: Array<string>, deleteLast?: boolean): Promise<HTMLElement> {
        if (input) { text = `> ${text}`; }
        if (deleteLast) { this.historyContent.removeChild(this.historyContent.lastChild); }

        const line: HTMLElement = document.createElement('p');

        line.classList.add('line');
        if (classList) { line.classList.add(...classList); }

        line.innerHTML = text;
        this.historyContent.appendChild(line);

        if (this.historyScroll.scrollHeight >= this.historyElement.scrollHeight) { this.historyElement.classList.add('filled'); }
        this.historyScroll.scrollTop = this.historyScroll.scrollHeight;

        return line;
    }

    public async addSpace(): Promise<void> { this.addLine('&nbsp;', false); }

    public handleInput(text: string, classList?: Array<string>, deleteLast?: boolean): void {
        if (!text || text === '') { return; }
        if (deleteLast) { this.historyContent.removeChild(this.historyContent.lastChild); }
        this.addLine(text, true, classList);
        this.inputElement.value = '';
    }

    public removeLine(line: HTMLElement): void { this.historyContent.removeChild(line); }

    public async clear(): Promise<void> {
        this.inputForm.classList.add('hide');
        this.historyContent.innerHTML = '';

        this.historyElement.classList.remove('filled');
        this.historyElement.classList.add('reset');

        await wait(100);

        this.historyElement.classList.remove('reset');
        this.inputForm.classList.remove('hide');
    }

    public async onInit(): Promise<void> {
        this.terminalWindow = this.querySelector<HTMLElement>('.terminal-window');
        this.historyElement = this.terminalWindow.querySelector<HTMLElement>('.history');
        this.inputForm = this.terminalWindow.querySelector<HTMLFormElement>('.input');
        this.helpersElement = this.inputForm.querySelector<HTMLFormElement>('.helpers');
        this.inputElement = this.inputForm.querySelector<HTMLInputElement>('input');

        this.updateDivider();

        this.simplebar = new SimpleBar(this.historyElement.querySelector('.inner'));
        this.inputElement.disabled = true;

        this.inputForm.addEventListener('submit', (ev: Event) => {
            ev.preventDefault();
            this.onInput.emit(this.inputElement.value);
        });

        window.addEventListener('resize', (_ev: UIEvent) => this.updateDivider());

        await wait(2000);

        const state = TerminalStateService.loadState();
        if (state) {
            if (state.key === 'start-menu') {
                this.stateMachine.transition(new TerminalStartMenuState(this));
                return;
            }

            if (state.key === 'new-game') {
                // this.stateMachine.transition(new TerminalNewGameState(this));
                this.stateMachine.transition(new TerminalStartMenuState(this));
                return;
            }
        }

        this.stateMachine.transition(new TerminalIntroState(this));
    }
}
