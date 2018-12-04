import { stringify } from 'lib/json';

import { TerminalState } from 'app/shared/terminal/terminal-state';

interface TerminalStateData {
    module: string;
    key: string;
    data?: TerminalState;
}

export class TerminalStateService {
    private static readonly storageKey = 'spooky-mansion-mystery:terminal-state';

    public static saveState(data: TerminalStateData): void { localStorage.setItem(TerminalStateService.storageKey, stringify(data)); }
    public static loadState(): TerminalStateData { return JSON.parse(localStorage.getItem(TerminalStateService.storageKey)); }
    public static clearState(): void { localStorage.removeItem(TerminalStateService.storageKey); }
}
