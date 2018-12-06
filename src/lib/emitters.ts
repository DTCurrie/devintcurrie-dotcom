export class TypedEventEmitter<T> {
    private emitters: Array<TypedEmitter<T>> = [];
    private emissions: Array<TypedEmitter<T>> = [];

    public clear(): void {
        this.emitters = [];
        this.emissions = [];
    }

    public on = (emitter: TypedEmitter<T>): Disposable => {
        this.emitters.push(emitter);
        return { dispose: () => this.off(emitter) };
    };

    public once = (emitter: TypedEmitter<T>): number => this.emissions.push(emitter);

    public off = (emitter: TypedEmitter<T>) => {
        const index = this.emitters.indexOf(emitter);
        if (index > -1) { this.emitters.splice(index, 1); }
    };

    public emit = (event: T) => {
        this.emitters.concat(this.emissions).forEach((emitter: TypedEmitter<T>) => emitter(event));
        this.emissions = [];
    };

    public pipe = (emitter: TypedEventEmitter<T>): Disposable => this.on((event: T) => emitter.emit(event));
}

export class EventEmitter {
    private emitters: Array<Emitter> = [];
    private emissions: Array<Emitter> = [];

    public clear(): void {
        this.emitters = [];
        this.emissions = [];
    }

    public on = (emitter: Emitter): Disposable => {
        this.emitters.push(emitter);
        return { dispose: () => this.off(emitter) };
    };

    public once = (emitter: Emitter): number => this.emissions.push(emitter);

    public off = (emitter: Emitter) => {
        const index = this.emitters.indexOf(emitter);
        if (index > -1) { this.emitters.splice(index, 1); }
    };

    public emit = () => {
        this.emitters.concat(this.emissions).forEach((emitter: Emitter) => emitter());
        this.emissions = [];
    };

    public pipe = (emitter: EventEmitter): Disposable => this.on(() => emitter.emit());
}
