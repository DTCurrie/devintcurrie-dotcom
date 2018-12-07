import { Component, component } from 'lib/component';

@component({
    selector: 'site-sidebar',
    templateUrl: 'sidebar/sidebar.component.html',
    stylesUrl: 'sidebar/sidebar.component.scss'
})
export class Sidebar extends Component implements Init {
    public onInit(): void {
        const sidebar = this.querySelector('.sidebar');
        const expand = this.querySelector('.expand');
        const sections = sidebar.querySelectorAll('.sidebar-section');

        expand.addEventListener('click', (_ev: MouseEvent) => {
            sidebar.classList.toggle('expanded');
            expand.classList.toggle('open');
            expand.classList.toggle('close');
        });

        sections.forEach((section: Element) => {
            section.addEventListener('click', (_ev: MouseEvent) => {
                sidebar.querySelector(('.sidebar-section.active')).classList.remove('active');
                if (!section.classList.contains('active')) { section.classList.add('active'); }
            });
        });
    }
}
