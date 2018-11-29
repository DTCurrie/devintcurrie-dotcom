declare interface ComponentConfig {
    selector: string;
    template?: string;
    templateUrl?: string;
    styles?: string;
    stylesUrl?: string;
}

declare function Component(config: ComponentConfig): (constructor: { new(...args: any[]): any }) => void;

declare interface Init {
    onInit(): void;
}

declare interface Destroy {
    onDestroy(): void;
}