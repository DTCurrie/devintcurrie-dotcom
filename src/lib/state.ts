export interface State {
    onEnter(from?: State): void | Promise<void>;
    onExit(to?: State): void | Promise<void>;
}

export class StateMachine {
    private currentState: State;

    public async transition(to: State): Promise<void> {
        return (async () => {
            if (this.currentState) { await this.currentState.onExit(to); }

            const from: State = this.currentState;
            this.currentState = to;

            await this.currentState.onEnter(from);
        })();
    }
}
