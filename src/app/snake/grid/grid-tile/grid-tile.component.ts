import { Component, component } from 'lib/component';
import { GridTileTypes } from 'app/snake/grid/grid-tile/grid-tile-types.enum';

@component({
    selector: 'snake-grid-tile',
    template: '<div class="grid-tile"><div class="grid-tile-content"></div></div>',
    stylesUrl: 'snake/grid/grid-tile/grid-tile.component.scss'
})
export class GridTile extends Component implements Init {

    private onAttributeChanged: MutationObserver = new MutationObserver((mutations: Array<MutationRecord>, _observer: MutationObserver) =>
        mutations.forEach(async (mutation: MutationRecord) => {
            if (mutation.type !== 'attributes') { return; }
            if (mutation.attributeName !== 'data-character') { return; }
            if (this.content.textContent === this.dataset.character) { return; }

            this.content.textContent = this.dataset.character;

            if (this.dataset.character === GridTileTypes.Player) {
                this.replaceContentClass([ 'segment', 'food', 'dead' ], 'player');
                return;
            }

            if (this.dataset.character === GridTileTypes.Segment) {
                this.replaceContentClass([ 'player', 'food', 'dead' ], 'segment');
                return;
            }

            if (this.dataset.character === GridTileTypes.Food) {
                this.replaceContentClass([ 'player', 'segment', 'dead' ], 'food');
                return;
            }

            if (this.dataset.character === GridTileTypes.Dead) {
                this.replaceContentClass([ 'player', 'segment', 'food' ], 'dead');
                return;
            }

            if (this.dataset.character === '') { this.replaceContentClass([ 'player', 'segment', 'food', 'dead' ]); }
        }));

    public content: HTMLElement;

    private replaceContentClass = (originals: Array<string>, replacement?: string) => {
        originals.forEach((original: string) => {
            if (this.content.classList.contains(original)) { this.content.classList.remove(original); }
        });

        if (replacement && !this.content.classList.contains(replacement)) { this.content.classList.add(replacement); }
    };

    public onInit(): void {
        this.content = this.querySelector('.grid-tile-content');
        this.onAttributeChanged.observe(this, { attributes: true });
    }
}
