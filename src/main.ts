window.addEventListener('load', async () => {
    const main = document.querySelector('main[role="main"].main');

    try {
        // TODO: Include this check when full app goes live
        // if (window.location.href.match(/\/site.html$/)) {
        //     await import(/* webpackChunkName: "async", webpackMode: "lazy" */ 'site/site.module');
        //     main.append(document.createElement('site-root'));

        // } else {
        //     await import(/* webpackChunkName: "async", webpackMode: "lazy" */ 'app/app.module');
        //     main.append(document.createElement('app-root'));
        // }

        await import(/* webpackChunkName: "async", webpackMode: "lazy" */ 'site/site.module');
        main.append(document.createElement('site-root'));
        main.removeChild(document.querySelector('.loader'));
    } catch (error) {
        console.error('Error loading root component.', error);
    }
});
