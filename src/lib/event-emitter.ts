export type Emitter<T> = (event: T) => void;

export interface Disposable {
    dispose(): void;
}

export class EventEmitter<T> {
    private emitters: Array<Emitter<T>> = [];
    private emissions: Array<Emitter<T>> = [];

    public on = (emitter: Emitter<T>): Disposable => {
        this.emitters.push(emitter);
        return { dispose: () => this.off(emitter) };
    };

    public once = (emitter: Emitter<T>): number => this.emissions.push(emitter);

    public off = (emitter: Emitter<T>) => {
        const index = this.emitters.indexOf(emitter);
        if (index > -1) { this.emitters.splice(index, 1); }
    };

    public emit = (event: T) => {
        this.emitters.concat(this.emissions).forEach((emitter: Emitter<T>) => emitter(event));
        this.emissions = [];
    };

    public pipe = (emitter: EventEmitter<T>): Disposable => this.on((event: T) => emitter.emit(event));
}
