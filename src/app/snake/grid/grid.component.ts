import { Component, component } from 'lib/component';

import { InputService, MoveDirection } from 'app/snake/input.service';
import { EventEmitter } from 'lib/emitters';

enum EntityTypes {
    Player = '@',
    Segment = '@',
    Food = '&'
}

export interface MoveCoordinates {
    x: number;
    y: number;
}

@component({
    selector: 'snake-grid',
    template: `
        <div class="grid">
            <div class="score-container">score: <span class="score"></span></div>
            <div class="grid-tiles"></div>
            <div class="instructions"></div>
        </div>`,
    stylesUrl: 'snake/grid/grid.component.scss'
})
export class Grid extends Component implements Init {
    private input: InputService = new InputService();

    private loop: number;

    private width = 10;
    private height = 10;

    private tileSize = 18;
    private tiles: Array<HTMLElement> = [];

    private playerCoordinates: MoveCoordinates;
    private playerSegmentCoordinates: Array<MoveCoordinates> = [];

    private nextCoordinates: MoveDirection;
    private moveCoordinates: MoveDirection;

    private score: number;
    private scoreElement: any;
    private onScore: EventEmitter = new EventEmitter();

    private player = EntityTypes.Player;

    private randomTile(): HTMLElement {
        let tile = this.getTileByCoordinates({ x: Math.floor(Math.random() * this.width), y: Math.floor(Math.random() * this.height) });
        if (tile.querySelector('.content').textContent !== '') { tile = this.randomTile(); }
        return tile;
    }

    private startGame(): void {
        this.tiles.forEach((tile: HTMLElement) => tile.querySelector('.content').textContent = '');

        this.input.onMove.once((coordinates: MoveDirection) => {
            this.nextCoordinates = coordinates;
            this.moveCoordinates = this.nextCoordinates;
            this.startGameLoop();
            this.input.onMove.on((newCoordinates: MoveDirection) => this.nextCoordinates = newCoordinates);
        });

        this.score = 0;

        this.playerCoordinates = { x: Math.floor(this.width / 2), y: Math.floor(this.width / 2) };
        this.getTileByCoordinates(this.playerCoordinates).querySelector('.content').textContent = this.player;

        this.generateFood();

    }

    private startGameLoop(): void {
        this.loop = window.setInterval(() => {
            this.moveCoordinates = this.checkMovement();
            const coordinates: MoveCoordinates = {
                x: this.playerCoordinates.x + this.moveCoordinates.x,
                y: this.playerCoordinates.y + this.moveCoordinates.y
            };

            const collision = this.calculateCollision(coordinates);

            if (!collision) { this.movePlayer(coordinates); }

            if (collision === EntityTypes.Food) {
                this.movePlayer(coordinates);
                this.playerSegmentCoordinates.unshift(coordinates);
                this.generateFood();
                this.onScore.emit();
            }

            if (collision === 'wall' || collision === EntityTypes.Segment) {
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

    private calculateCollision(coordinates: MoveCoordinates): string | false {
        if (coordinates.x < 0 || coordinates.x > this.width - 1) { return 'wall'; }
        if (coordinates.y < 0 || coordinates.y > this.height - 1) { return 'wall'; }
        const other = this.getTileByCoordinates(coordinates).querySelector('.content');
        if (other.textContent === '') { return false; }
        return other.querySelector('.content').textContent;
    }

    private movePlayer(coordinates: MoveCoordinates): void {
        const oldCoordinates = this.playerCoordinates;
        this.getTileByCoordinates(oldCoordinates).querySelector('.content').textContent = '';
        this.playerCoordinates = coordinates;
        this.getTileByCoordinates(this.playerCoordinates).querySelector('.content').textContent = this.player;

        this.getTileByCoordinates(this.playerSegmentCoordinates.pop()).querySelector('.content').textContent = '';
        this.getTileByCoordinates(oldCoordinates).querySelector('.content').textContent = EntityTypes.Segment;
        this.playerSegmentCoordinates.unshift(oldCoordinates);
    }

    private gameOver(): void {
        clearInterval(this.loop);
        this.getTileByCoordinates(this.playerCoordinates).querySelector('.content').textContent = 'X';

        this.input.onMove.clear();
        this.input.onSpace.once(() => this.startGame());
    }

    private getTileByCoordinates(coordinates: MoveCoordinates): HTMLElement {
        return this.tiles.find((tile: HTMLElement) =>
            tile.dataset.coordinatesX === `${coordinates.x}` && tile.dataset.coordinatesY === `${coordinates.y}`);
    }

    private generateFood(): void {
        const tile = this.randomTile();
        tile.querySelector('.content').textContent = '&';
    }

    public onInit(): void {
        this.scoreElement = this.querySelector('.score');
        this.score = 0;
        this.scoreElement.textContent = `${this.score}`;

        const gridTiles = this.querySelector<HTMLElement>('.grid-tiles');

        gridTiles.style.width = `${(this.width * this.tileSize) + 2}px`;
        gridTiles.style.height = `${(this.height * this.tileSize) + 2}px`;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tile = document.createElement('div');
                tile.classList.add('grid-tile');
                tile.dataset.coordinatesX = `${x}`;
                tile.dataset.coordinatesY = `${y}`;

                const content = document.createElement('div');
                content.classList.add('content');
                tile.appendChild(content);

                gridTiles.appendChild<HTMLElement>(tile);
                this.tiles.push(tile);
            }
        }

        this.onScore.on(() => {
            this.score++;
            this.scoreElement.textContent = `${this.score}`;
        });

        this.input.onSpace.once(() => this.startGame());
    }
}
