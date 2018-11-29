export async function wait(delay: number): Promise<never> {
    return new Promise<never>(async (resolve: () => void) => await setTimeout(resolve, delay));
}