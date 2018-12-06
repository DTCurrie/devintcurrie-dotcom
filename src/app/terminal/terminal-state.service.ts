import { stringify } from 'lib/json';

export class TerminalStateService {
    private static readonly storageKey = 'devintcurrie:terminal-state';

    public static saveState(data: StateData): void { localStorage.setItem(TerminalStateService.storageKey, stringify(data)); }
    public static loadState(): StateData { return JSON.parse(localStorage.getItem(TerminalStateService.storageKey)); }
    public static clearState(): void { localStorage.removeItem(TerminalStateService.storageKey); }
}
