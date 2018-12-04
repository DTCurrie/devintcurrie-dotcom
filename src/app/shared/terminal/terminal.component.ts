import SimpleBar from 'simplebar';

import { wait } from 'lib/async';
import { Component, component } from 'lib/component';
import { EventEmitter } from 'lib/event-emitter';
import { StateMachine } from 'lib/state';

import { TerminalIntroState } from 'app/shared/terminal/intro.state';
import { TerminalStateService } from 'app/shared/terminal/terminal-state.service';

import { TerminalStartMenuState } from 'app/text-game/terminal-states';

export interface TerminalHelper {
    command: string;
    options?: Array<string>;
    alias?: string;
}

@component({
    selector: 'app-terminal',
    templateUrl: 'shared/terminal/terminal.component.html',
    stylesUrl: 'shared/terminal/terminal.component.scss'
})
export class Terminal extends Component implements Init {
    private simplebar: any;

    public terminalWindow: HTMLElement;
    public historyElement: HTMLElement;
    public helpersElement: HTMLElement;
    public inputForm: HTMLFormElement;
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

        const line: HTMLElement = document.createElement('div');

        line.classList.add('line');
        if (classList) { line.classList.add(...classList); }

        line.innerHTML = text;
        this.historyContent.appendChild(line);

        if (this.historyElement.scrollHeight >= this.terminalWindow.scrollHeight) { this.historyElement.classList.add('filled'); }
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

    public async setHelpers(helpers: Array<TerminalHelper>): Promise<void> {
        this.helpersElement.innerHTML = '';

        await Promise.all(helpers.map(async (helper: TerminalHelper) => {
            const helperElement = document.createElement('li');

            helperElement.classList.add('helper');
            helperElement.setAttribute('data-command', helper.command);
            helperElement.innerHTML = helper.command;

            if (helper.options) { helper.options.forEach((option: string) => helperElement.innerHTML += ` [${option}]`); }
            if (helper.alias) { helperElement.innerHTML += ` (${helper.alias})`; }

            helperElement.addEventListener('click', (ev: MouseEvent) => {
                ev.preventDefault();
                this.inputElement.value = helper.command;
                this.inputElement.focus();
            });

            this.helpersElement.appendChild(helperElement);

        }));
    }

    public async onInit(): Promise<void> {
        this.terminalWindow = this.querySelector<HTMLElement>('.terminal-window');

        this.historyElement = this.terminalWindow.querySelector<HTMLElement>('.history');
        this.inputForm = this.terminalWindow.querySelector<HTMLFormElement>('.input');

        this.helpersElement = this.inputForm.querySelector<HTMLFormElement>('.helpers .helpers-list');
        this.inputElement = this.inputForm.querySelector<HTMLInputElement>('input');

        this.simplebar = new SimpleBar(this.historyElement.querySelector('.inner'));

        this.inputElement.disabled = true;

        this.updateDivider();

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
