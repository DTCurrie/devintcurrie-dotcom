import { Component, component } from 'lib/component';

@component({
    selector: 'app-audio-player',
    template: `
        <div class="audio-player">
            <button  class="play-button">play</button>
            <div class="volume-control">
                <button class="volume-button down">-</button>
                <progress class="volume" value="0" min="0" max="1"></progress>
                <button class="volume-button up">+</button>
                <button class="mute-button">mute</button>
            </div>
            <audio class="audio">
                <source class="soundtrack" type="audio/mpeg">
                <pre>Your browser does not support the audio element.</pre>
            </audio>
        </div>`,
    stylesUrl: 'audio-player/audio-player.component.scss'
})
export class AudioPlayer extends Component implements Init {

    private audioElement: HTMLAudioElement;

    private soundtrackElement: HTMLSourceElement;

    private playButton: HTMLElement;

    private volumeElement: HTMLProgressElement;
    private volumeDownElement: HTMLElement;
    private volumeUpElement: HTMLElement;
    private muteButton: HTMLElement;

    public get soundtrack(): string { return this.soundtrackElement.src; }
    public set soundtrack(url: string) {
        this.soundtrackElement.src = url;
        this.audioElement.load();
    }

    public async onInit(): Promise<void> {
        const audioPlayer = this.querySelector('.audio-player');

        this.audioElement = audioPlayer.querySelector<HTMLAudioElement>('.audio');
        this.soundtrackElement = audioPlayer.querySelector('.soundtrack');

        this.volumeElement = audioPlayer.querySelector('.volume');
        this.volumeDownElement = audioPlayer.querySelector('.volume-button.down');
        this.volumeUpElement = audioPlayer.querySelector('.volume-button.up');

        this.volumeElement.addEventListener('click', (ev: MouseEvent) => {
            ev.preventDefault();
            const percent = ev.offsetX / this.volumeElement.offsetWidth;
            const value = Math.round(percent * 10) / 10;
            this.audioElement.volume = value * this.audioElement.volume;
            this.volumeElement.value = value;
        });

        this.volumeDownElement.addEventListener('click', (ev: MouseEvent) => {
            ev.preventDefault();
            this.volumeElement.value -= 0.1;
        });

        this.volumeUpElement.addEventListener('click', (ev: MouseEvent) => {
            ev.preventDefault();
            this.volumeElement.value += 0.1;
        });

        this.soundtrack = 'assets/8bit_Dungeon_Level.mp3';
    }
}
