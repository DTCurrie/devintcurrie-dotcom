window.addEventListener('load', async () => {
    try {
        if (window.location.href.match(/\/site.html$/)) {
            await import(/* webpackChunkName: "site", webpackMode: "lazy" */ 'site/site.module');
            return;

        }

        await import(/* webpackChunkName: "app", webpackMode: "lazy" */ 'app/app.module');

    } catch (error) {
        console.error('Error loading root component.', error);
    }
});
