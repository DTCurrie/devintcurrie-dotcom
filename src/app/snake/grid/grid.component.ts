import { Component, component, Destroy, Init } from 'lib/component';

import { InputService, MoveDirection } from 'app/snake/input.service';
import { EventEmitter } from 'lib/emitters';

import { GridTile } from 'app/snake/grid/grid-tile/grid-tile.component';
import { GridTileTypes } from 'app/snake/grid/grid-tile/grid-tile-types.enum';
import { GridCoordinates } from 'app/snake/grid/grid-coordinates';

@component({
    selector: 'app-snake-grid',
    template: `
        <div class="grid">
            <div class="score-container">score: <span class="score"></span></div>
            <div class="grid-tiles"></div>
            <div class="instructions"></div>
        </div>`,
    stylesUrl: 'snake/grid/grid.component.scss'
})
export class Grid extends Component implements Init, Destroy {
    private input: InputService = new InputService();

    private loop: number;

    private width = 10;
    private height = 10;

    private tileSize = 18;
    private tiles: Array<GridTile> = [];

    private playerCoordinates: GridCoordinates;
    private playerSegmentCoordinates: Array<GridCoordinates> = [];

    private nextCoordinates: MoveDirection;
    private moveCoordinates: MoveDirection;

    private score: number;
    private scoreElement: any;
    private onScore: EventEmitter = new EventEmitter();

    private instructions: HTMLElement;

    private randomTile(): GridTile {
        let tile = this.getTileByCoordinates({ x: Math.floor(Math.random() * this.width), y: Math.floor(Math.random() * this.height) });
        if (tile.dataset.character !== '') { tile = this.randomTile(); }
        return tile;
    }

    private startGame(): void {
        this.tiles.forEach((tile: GridTile) => tile.dataset.character = '');

        this.input.onMove.once((coordinates: MoveDirection) => {
            this.nextCoordinates = coordinates;
            this.moveCoordinates = this.nextCoordinates;
            this.startGameLoop();
            this.input.onMove.on((newCoordinates: MoveDirection) => this.nextCoordinates = newCoordinates);
        });

        this.score = 0;
        this.scoreElement.textContent = `${this.score}`;

        this.playerCoordinates = { x: Math.floor(this.width / 2), y: Math.floor(this.width / 2) };
        this.playerSegmentCoordinates = [];
        this.getTileByCoordinates(this.playerCoordinates).dataset.character = GridTileTypes.Player;

        this.generateFood();
    }

    private startGameLoop(): void {
        this.loop = window.setInterval(() => {
            this.moveCoordinates = this.checkMovement();

            const coordinates = new GridCoordinates(
                this.playerCoordinates.x + this.moveCoordinates.x,
                this.playerCoordinates.y + this.moveCoordinates.y);
            const collision = this.calculateCollision(coordinates);

            if (collision === '') {
                this.movePlayer(coordinates);
                return;
            }

            if (collision === GridTileTypes.Food) {
                this.movePlayer(coordinates);
                this.playerSegmentCoordinates.push(coordinates);
                this.generateFood();
                this.onScore.emit();
                return;
            }

            if (collision === 'wall' || collision === GridTileTypes.Segment) {
                this.gameOver();
                return;
            }

            setTimeout(() => this.startGameLoop(), 0);
        }, 333);
    }

    private checkMovement(): MoveDirection {
        if (this.moveCoordinates.x > 0 && this.nextCoordinates.x < 0) { return this.moveCoordinates; }
        if (this.moveCoordinates.x < 0 && this.nextCoordinates.x > 0) { return this.moveCoordinates; }
        if (this.moveCoordinates.y > 0 && this.nextCoordinates.y < 0) { return this.moveCoordinates; }
        if (this.moveCoordinates.y < 0 && this.nextCoordinates.y > 0) { return this.moveCoordinates; }
        return this.nextCoordinates;
    }

    private calculateCollision(coordinates: GridCoordinates): string {
        if (coordinates.x < 0 || coordinates.x > this.width - 1) { return 'wall'; }
        if (coordinates.y < 0 || coordinates.y > this.height - 1) { return 'wall'; }
        return this.getTileByCoordinates(coordinates).dataset.character;
    }

    private movePlayer(coordinates: GridCoordinates): void {
        const oldCoordinates = this.playerCoordinates;
        this.playerCoordinates = coordinates;

        const oldTile = this.getTileByCoordinates(oldCoordinates);
        oldTile.dataset.character = '';

        const newTile = this.getTileByCoordinates(this.playerCoordinates);
        newTile.dataset.character = GridTileTypes.Player;

        if (!this.playerSegmentCoordinates.length) { return; }

        const oldSegmentTile = this.getTileByCoordinates(this.playerSegmentCoordinates.pop());
        oldSegmentTile.dataset.character = '';

        oldTile.dataset.character = GridTileTypes.Segment;
        this.playerSegmentCoordinates.unshift(oldCoordinates);
    }

    private gameOver(): void {
        clearInterval(this.loop);
        this.getTileByCoordinates(this.playerCoordinates).dataset.character = GridTileTypes.Dead;
        this.input.onMove.clear();
        this.input.onSpace.once(() => this.startGame());
        this.instructions.textContent = 'Game Over! Press Space to start again!';
    }

    private getTileByCoordinates(coordinates: GridCoordinates): GridTile {
        return this.tiles.find((tile: GridTile) =>
            tile.dataset.coordinatesX === `${coordinates.x}` && tile.dataset.coordinatesY === `${coordinates.y}`);
    }

    private generateFood(): void { this.randomTile().dataset.character = GridTileTypes.Food; }

    public onInit(): void {
        this.score = 0;
        this.scoreElement = this.querySelector('.score');
        this.scoreElement.textContent = `${this.score}`;

        this.instructions = this.querySelector('.instructions');
        this.instructions.textContent = 'Press Space to start!';

        const gridTiles = this.querySelector<HTMLElement>('.grid-tiles');

        gridTiles.style.width = `${(this.width * this.tileSize) + 2}px`;
        gridTiles.style.height = `${(this.height * this.tileSize) + 2}px`;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tile: GridTile = document.createElement('app-snake-grid-tile') as GridTile;
                tile.dataset.coordinatesX = `${x}`;
                tile.dataset.coordinatesY = `${y}`;
                gridTiles.appendChild<GridTile>(tile);
                this.tiles.push(tile);
            }
        }

        this.onScore.on(() => {
            this.score++;
            this.scoreElement.textContent = `${this.score}`;
        });

        this.input.onSpace.once(() => this.startGame());
    }

    public onDestroy(): void { if (this.loop) { clearInterval(this.loop); } }
}
