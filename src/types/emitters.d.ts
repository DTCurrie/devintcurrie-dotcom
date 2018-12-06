declare type Emitter = () => void;
declare type TypedEmitter<T> = (event: T) => void;

declare interface Disposable {
    dispose(): void;
}
