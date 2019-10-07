const EVERY_HOUR = 36000000; // 1000 * 60 * 60
let interval_id;

function refreshOnUpdate() {
    return swRegistrationObject => {
        swRegistrationObject.onupdatefound = () => {
            const updatingWorker         = swRegistrationObject.installing;
            updatingWorker.onstatechange = () => {
                if (updatingWorker.state === 'installed' &&
                    navigator.serviceWorker.controller
                ) {
                    // eslint-disable-next-line no-console
                    console.log('New version is found, refreshing the page...');
                    clearInterval(interval_id);
                }
            };
        };
    };
}

export default function register() { // Register the service worker
    if (/* process.env.NODE_ENV === 'production' && */ 'serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            let path_name = window.location.pathname;
            path_name     = /index\.html/g.test(path_name) ? window.location.pathname.replace('index.html', '') : '';
            const sw_url  = `${path_name}service-worker.js`;
            navigator.serviceWorker
                .register(sw_url)
                .then(registration => {
                    interval_id = setInterval(() => {
                        registration
                            .update()
                            .then(refreshOnUpdate);
                    }, EVERY_HOUR);

                    registration.onupdatefound = () => {
                        const installingWorker         = registration.installing;
                        installingWorker.onstatechange = () => {
                            if (installingWorker.state === 'installed') {
                                if (navigator.serviceWorker.controller) {
                                    // User's first visit:
                                    // At this point, the old content will have been purged and
                                    // the fresh content will have been added to the cache.
                                    // It's the perfect time to display a "New content is
                                    // available; please refresh." message in your web app.
                                    console.log('New content is available; please refresh.'); // eslint-disable-line no-console
                                } else {
                                    // At this point, everything has been precached.
                                    // It's the perfect time to display a
                                    // "Content is cached for offline use." message.
                                    console.log('Content is cached for offline use.'); // eslint-disable-line no-console
                                }
                            }
                        };
                    };
                })
                .catch(error => {
                    console.error('Error during service worker registration:', error); // eslint-disable-line no-console
                });
        });
    }
}

export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.unregister();
        });
    }
}
