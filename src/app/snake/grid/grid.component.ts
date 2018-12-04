import { GridTile } from 'app/snake/grid/grid-tile/grid-tile.component';
import { Component, component } from 'lib/component';

@component({
    selector: 'snake-grid',
    template: '<div class="grid"><div class="grid-tiles"></div></div>',
    stylesUrl: 'snake/grid/grid.component.scss'
})
export class Grid extends Component {
    public tiles: Array<GridTile> = [];
}
