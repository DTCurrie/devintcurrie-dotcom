export interface State {
    onEnter(from: State): Promise<void>;
    onExit(to: State): Promise<void>;
}

export class StateMachine {
    currentState: State;

    async transition(to: State): Promise<void> {
        return (async () => {
            await this.currentState.onExit(to);

            const from: State = this.currentState;
            this.currentState = to;

            await this.currentState.onEnter(from);
        })();
    }
}
