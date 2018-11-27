import { createComponent } from 'lib/component';

import './terminal.scss';

export class Terminal implements Init {
    private historyElement: HTMLElement;
    private inputForm: HTMLFormElement;
    private inputElement: HTMLInputElement;

    constructor(parent: HTMLElement) {
        const element = createComponent(['terminal'], require('./terminal.html'), parent);
        this.historyElement = element.querySelector<HTMLElement>('.history');
        this.inputForm = element.querySelector<HTMLFormElement>('.input');
        this.inputElement = this.inputForm.querySelector<HTMLInputElement>('input');
        this.init();
    }

    public init(): void {
        this.inputForm.addEventListener("submit", (ev: Event) => {
            ev.preventDefault();
            const line = document.createElement('p');
            line.classList.add('line');
            line.innerHTML = this.inputElement.value;
            this.historyElement.appendChild(line);
            this.inputElement.value = '';
        });

        this.inputElement.focus();
    }
}
