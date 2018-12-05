declare interface ComponentConfig {
    selector: string;
    template?: string;
    templateUrl?: string;
    styles?: string;
    stylesUrl?: string;
}

declare interface Component extends HTMLElement {
    connectedCallback?(): void;
    disconnectedCallback?(): void;
}

declare function Component(config: ComponentConfig): (constructor: { new(...args: Array<any>): Component }) => void;

declare interface ComponentConstructor<T> { new(...args: Array<any>): T; }

declare interface Init extends Component {
    onInit(): void;
}

declare interface AfterInit extends Component {
    onAfterInit(): void;
}

declare interface Destroy extends Component {
    onDestroy(): void;
}