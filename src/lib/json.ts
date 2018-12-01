export function stringify(obj: any): string {
    const cache: Set<any> = new Set();

    return JSON.stringify(obj, (_key: string, value: any) => {
        if (typeof value === 'object' && value !== null) {
            if (cache.has(value)) { return; }
            cache.add(value);
        }

        return value;
    });
}
