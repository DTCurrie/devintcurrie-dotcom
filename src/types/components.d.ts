declare interface Component {
    destroy?: () => void;
}

declare interface ComponentConstructor {

    new(parent: HTMLElement): Component;
}

declare class App {
    constructor();
}