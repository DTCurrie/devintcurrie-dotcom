import { Component, component } from 'lib/component';

@component({
    selector: 'site-content',
    templateUrl: 'content/content.component.html',
    stylesUrl: 'content/content.component.scss'
})
export class Content extends Component { }
