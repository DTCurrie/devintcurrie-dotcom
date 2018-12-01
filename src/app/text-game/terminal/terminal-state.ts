import { Terminal } from './terminal.component';
import { State } from 'lib/state';

export class TerminalState implements State {
    constructor(protected terminal: Terminal) { }

    public onEnter(from?: State): void | Promise<void> {
        throw new Error('Method not implemented.');
    }

    public onExit(to?: State): void | Promise<void> {
        throw new Error('Method not implemented.');
    }
}
