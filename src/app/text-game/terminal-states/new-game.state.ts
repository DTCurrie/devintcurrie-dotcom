import { TerminalState } from 'app/shared/terminal/terminal-state';
import { TerminalStateService } from 'app/shared/terminal/terminal-state.service';

export class TextGameNewGameState extends TerminalState implements State {
    private inputHandler: Disposable = this.terminal.onInput.on(async (input: string) => {
        this.terminal.handleInput(input);
    });

    public async onEnter(): Promise<void> {
        TerminalStateService.saveState({ module: 'text-game', key: 'new-game' });

        if (!this.terminal.terminalWindow.classList.contains('show-input-helpers')) {
            this.terminal.terminalWindow.classList.add('show-input-helpers');
        }

        if (!this.terminal.historyElement.classList.contains('show-title')) {
            this.terminal.historyElement.classList.add('show-title');
        }

        this.terminal.addLine(`
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae tellus elementum purus aliquam cursus. Donec nunc
            nisl, cursus id mauris eu, dictum vulputate magna. Nulla dictum velit sed ornare hendrerit. Donec aliquet cursus consectetur.
            Nam dictum ultrices mi, nec ornare lacus consectetur non. Vestibulum imperdiet orci ut egestas suscipit. Nullam venenatis,
            purus eget vestibulum porttitor, justo sem accumsan ante, in vulputate quam leo a lorem. Proin euismod eget massa laoreet
            tristique. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Phasellus nunc neque,
            porttitor a magna id, luctus dignissim velit. Curabitur consequat erat nulla, ac rhoncus nulla bibendum nec. Aenean ut libero
            tincidunt, iaculis tortor eu, lobortis ipsum. Nam tellus massa, gravida sit amet convallis ut, ullamcorper vestibulum felis.
            Maecenas eu luctus urna, et tempus mi. Donec sodales congue imperdiet.`,
            false, [ 'prompt' ]);

        this.terminal.addLine(`
            Nunc eget mauris ac odio sodales gravida in at tortor. Donec ornare ex sem, et euismod nisl ullamcorper sed. Integer imperdiet
            magna id aliquet blandit. Ut at augue in est varius mattis. In hac habitasse platea dictumst. Nulla pulvinar, risus non aliquet
            tempor, nulla enim aliquam urna, vel lobortis erat eros ut ipsum. Nunc tempor felis nulla, quis lobortis purus eleifend sed.
            Cras auctor est vitae enim pretium mattis. Curabitur justo justo, faucibus eget tincidunt id, tempor ut felis. Sed cursus
            iaculis elit, id venenatis erat pretium a. Phasellus id odio sem. Praesent vehicula purus leo, in placerat diam rhoncus ut.
            Nunc eu metus nec purus facilisis lacinia sit amet vitae orci.`,
            false, [ 'prompt' ]);

        this.terminal.inputElement.focus();
    }

    public onExit(): void {
        this.terminal.clear();
        this.inputHandler.dispose();
    }
}
