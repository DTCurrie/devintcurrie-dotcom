export class StateMachine {
    private transitioning: boolean;

    constructor(private currentState?: State) { }

    public async transition(to: State): Promise<void> {
        if (this.transitioning) { return; }
        this.transitioning = true;

        if (this.currentState) { await this.currentState.onExit(to); }

        const from: State = this.currentState;
        this.currentState = to;

        await this.currentState.onEnter(from);
        this.transitioning = false;
    }
}
