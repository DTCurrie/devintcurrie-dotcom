export interface GridCoordinates {
    x: number;
    y: number;
}

export class GridCoordinates implements GridCoordinates {
    constructor(public x: number, public y: number) { }
}
