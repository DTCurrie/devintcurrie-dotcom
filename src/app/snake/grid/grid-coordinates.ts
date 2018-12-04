export class GridCoordinates {
    constructor(public x = 0, public y = 0) { }
    public equals = (other: GridCoordinates): boolean => (this.x === other.x && this.y === other.y);
    public add = (other: GridCoordinates): GridCoordinates => new GridCoordinates(this.x + other.x, this.y + other.y);
}
