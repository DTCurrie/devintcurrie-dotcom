export type Emitter<T> = (event: T) => void;

export interface Disposable {
    dispose(): void;
}

export class EventEmitter<T> {
    private emitters: Array<Emitter<T>> = [];
    private emissions: Array<Emitter<T>> = [];

    on = (emitter: Emitter<T>): Disposable => {
        this.emitters.push(emitter);
        return { dispose: () => this.off(emitter) };
    };

    once = (emitter: Emitter<T>): number => this.emissions.push(emitter);

    off = (emitter: Emitter<T>) => {
        const index = this.emitters.indexOf(emitter);
        if (index > -1) { this.emitters.splice(index, 1); }
    };

    emit = (event: T) => {
        this.emitters.concat(this.emissions).forEach((emitter: Emitter<T>) => emitter(event));
        this.emissions = [];
    };

    pipe = (emitter: EventEmitter<T>): Disposable => this.on((event: T) => emitter.emit(event));
}
