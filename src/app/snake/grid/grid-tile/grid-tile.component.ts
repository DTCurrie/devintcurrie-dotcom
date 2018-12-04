import { Component, component } from 'lib/component';

import { GridCoordinates } from 'app/snake/grid/grid-coordinates';

@component({
    selector: 'snake-grid-tile',
    template: '<div class="grid-tile"><div class="grid-tile-content"></div></div>',
    stylesUrl: 'snake/grid/grid-tile/grid-tile.component.scss'
})
export class GridTile extends Component implements Init {
    public character: string;
    public color: string;
    public coordinates: GridCoordinates;

    public onInit(): void {
        const character = this.getAttribute('data-character');
        const color = this.getAttribute('data-color');
        const x: number = +this.getAttribute('data-coordinates-x');
        const y: number = +this.getAttribute('data-coordinates-y');

        if (!character) { throw new Error('GridTile requires a data-character attribute.'); }

        if (!color || !color.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
            throw new Error('GridTile requires a valid (hex: #xxxxxx) data-color attribute.');
        }

        if (!x) { throw new Error('GridTile requires a valid data-coordinates-x attribute.'); }
        if (!y) { throw new Error('Method GridTile requires a valid data-coordinates-y attribute.'); }

        this.character = character;
        this.color = color;
        this.coordinates = new GridCoordinates(x, y);

        const content = this.querySelector('.grid-tile-content');
        content.textContent = this.character;
        content.setAttribute('style', `color: ${this.color}`);
    }
}
