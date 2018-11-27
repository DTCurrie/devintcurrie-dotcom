import { createComponent } from 'lib/component';

import SimpleBar from 'simplebar';
import 'simplebar/dist/simplebar.css';

import './terminal.scss';

export class Terminal implements Init {
    private historyElement: HTMLElement;
    private historyContent: any;
    private inputForm: HTMLFormElement;
    private inputElement: HTMLInputElement;

    constructor(parent: HTMLElement) {
        const element = createComponent(['terminal'], require('./terminal.html'), parent);
        this.historyElement = element.querySelector<HTMLElement>('.history');
        this.inputForm = element.querySelector<HTMLFormElement>('.input');
        this.inputElement = this.inputForm.querySelector<HTMLInputElement>('input');
        this.init();
    }

    private addLine(text: string, input: boolean = true) {
        if (input) { text = `> ${text}`; }
        const line = document.createElement('p');
        line.classList.add('line');
        line.innerHTML = text;
        this.historyContent.getContentElement().appendChild(line);

    }

    public init(): void {
        this.historyContent = new SimpleBar(this.historyElement);
        this.inputForm.addEventListener("submit", (ev: Event) => {
            ev.preventDefault();
            const text = this.inputElement.value;
            if (!text || text === '') { return; }
            this.addLine(text);
            this.historyContent.getScrollElement().scrollTop = this.historyContent.getScrollElement().scrollHeight;
            this.inputElement.value = '';
        });

        this.inputElement.focus();
    }
}
