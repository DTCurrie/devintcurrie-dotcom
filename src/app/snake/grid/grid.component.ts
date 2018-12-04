import { Component, component } from 'lib/component';

@component({
    selector: 'snake-grid',
    template: '<div class="grid"><div class="grid-tiles"></div></div>',
    stylesUrl: 'snake/grid/grid.component.scss'
})
export class Grid extends Component implements Init {
    private width = 10;
    private height = 10;

    private tileSize = 18;

    public tiles: Array<HTMLElement> = [];

    public getTileByCoordinates(x: number, y: number): HTMLElement {
        return this.tiles.find((tile: HTMLElement) => tile.dataset.coordinatesX === `${x}` && tile.dataset.coordinatesY === `${y}`);
    }

    public onInit(): void {
        const grid = this.querySelector<HTMLElement>('.grid');
        const gridTile = grid.querySelector('.grid-tiles');

        grid.style.width = `${this.width * this.tileSize}px`;
        grid.style.height = `${this.height * this.tileSize}px`;

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const tile = document.createElement('div');
                tile.classList.add('grid-tile');
                tile.dataset.coordinatesX = `${x}`;
                tile.dataset.coordinatesY = `${y}`;

                const content = document.createElement('div');
                content.classList.add('content');
                tile.appendChild(content);

                gridTile.appendChild<HTMLElement>(tile);
                this.tiles.push(tile);
            }
        }

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                setTimeout(() => {
                    this.getTileByCoordinates(x, y).querySelector('.content').textContent = 'X';
                }, (x + y) * 100);
            }
        }

    }
}
