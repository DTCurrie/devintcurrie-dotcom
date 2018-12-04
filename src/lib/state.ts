export interface State {
    onEnter(from?: State): void | Promise<void>;
    onExit(to?: State): void | Promise<void>;
}

export class StateMachine {
    constructor(private currentState?: State) { }

    public transition = async (to: State): Promise<void> => {
        if (this.currentState) { await this.currentState.onExit(to); }

        const from: State = this.currentState;
        this.currentState = to;

        await this.currentState.onEnter(from);
    };
}
