window.addEventListener('load', async () => {
    const main = document.querySelector('main[role="main"].main');

    try {
        if (window.location.href.match(/\/site.html$/)) {
            await import(/* webpackChunkName: "site", webpackMode: "lazy" */ 'site/site.module');
            main.append(document.createElement('site-root'));

        } else {
            await import(/* webpackChunkName: "app", webpackMode: "lazy" */ 'app/app.module');
            main.append(document.createElement('app-root'));
        }

        main.removeChild(document.querySelector('.loader'));
    } catch (error) {
        console.error('Error loading root component.', error);
    }
});
