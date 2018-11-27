export function createComponent(classList: string[], content: string, parent: HTMLElement = document.body): HTMLElement {
    const component = document.createElement('div');
    component.classList.add(...classList);
    component.innerHTML = content;
    parent.appendChild(component);
    return component;
}