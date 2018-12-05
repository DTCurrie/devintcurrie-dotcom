import { EventEmitter, TypedEventEmitter } from 'lib/emitters';

export type MoveValue = -1 | 0 | 1;

export interface MoveDirection {
    x: MoveValue;
    y: MoveValue;
}

export class InputService {

    public onMove: TypedEventEmitter<MoveDirection> = new TypedEventEmitter<MoveDirection>();
    public onSpace: EventEmitter = new EventEmitter();

    constructor() { document.addEventListener('keydown', (ev: KeyboardEvent) => this.keyboardInput(ev)); }

    private keyboardInput(ev: KeyboardEvent): void {
        if (ev.keyCode === 38) {
            this.onMove.emit({ x: 0, y: -1 }); // up
        } else if (ev.keyCode === 40) {
            this.onMove.emit({ x: 0, y: 1 }); // down
        } else if (ev.keyCode === 37) {
            this.onMove.emit({ x: -1, y: 0 }); // left
        } else if (ev.keyCode === 39) {
            this.onMove.emit({ x: 1, y: 0 }); // right
        } else if (ev.keyCode === 32) {
            this.onSpace.emit(); // space
        }
    }
}
