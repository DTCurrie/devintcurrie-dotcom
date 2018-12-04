import { Component, component } from 'lib/component';

import { GridCoordinates } from 'app/snake/grid/grid.component';

@component({
    selector: 'snake-grid-tile',
    template: '<div class="grid-tile"><div class="grid-tile-content"></div></div>',
    stylesUrl: 'snake/grid-tile/grid-tile.component.scss'
})
export class GridTile extends Component implements Init {
    public character: string;
    public color: string;

    public onInit(): void {
        const character = this.getAttribute('data-character');
        const color = this.getAttribute('data-color');

        if (!character) { throw new Error('GridTile requires a data-character attribute.'); }

        if (!color || !color.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
            throw new Error('GridTile requires a valid (hex: #xxxxxx) data-color attribute.');
        }

        this.character = character;
        this.color = color;

        const content = this.querySelector('.grid-tile-content');
        content.textContent = this.character;
        content.setAttribute('style', `color: ${this.color}`);
    }
}
