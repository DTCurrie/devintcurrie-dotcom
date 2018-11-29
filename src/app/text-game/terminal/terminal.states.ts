import { State } from 'lib/state';

export class TerminalIntroState implements State {
    onEnter(from: State): Promise<void> {
        throw new Error('Method not implemented.');
    }

    onExit(to: State): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
