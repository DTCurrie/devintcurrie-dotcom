import { GridTile } from 'app/snake/grid/grid-tile/grid-tile.component';
import { Component, component } from 'lib/component';

export class GridCoordinates {
    constructor(public x = 0, public y = 0) { }
    public equals = (other: GridCoordinates): boolean => (this.x === other.x && this.y === other.y);
    public add = (other: GridCoordinates): GridCoordinates => new GridCoordinates(this.x + other.x, this.y + other.y);
}

@component({
    selector: 'snake-grid',
    template: '<div class="grid"><div class="grid-tiles"></div></div>',
    stylesUrl: 'snake/grid/grid.component.scss'
})
export class Grid extends Component {
    public tiles: Array<GridTile> = [];
}
