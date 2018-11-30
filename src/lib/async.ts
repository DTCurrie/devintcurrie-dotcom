export async function wait(delay: number): Promise<never> {
    return new Promise<never>((resolve: () => void) => setTimeout(resolve, delay));
}
