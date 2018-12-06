declare interface State {
    onEnter(from?: State): void | Promise<void>;
    onExit(to?: State): void | Promise<void>;
}

declare interface StateData {
    module: string;
    key: string;
    data?: any;
}
