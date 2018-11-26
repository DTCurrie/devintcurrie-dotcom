export class Component {
    constructor() {
        const element = document.createElement('div');
        element.innerHTML = `Hello webpack!`;
        document.body.appendChild(element);
    }
}

const test = new Component();

//   if (module.hot) {
//     module.hot.accept('./print.js', function() {
//       console.log('Accepting the updated printMe module!');
//       document.body.removeChild(element);
//       element = component(); // Re-render the "component" to update the click handler
//       document.body.appendChild(element);
//     })
//   }