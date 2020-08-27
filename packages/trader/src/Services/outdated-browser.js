import React from 'react';
import { action } from 'mobx';
import { Localize } from '@deriv/translations';

let common_store;

const OutdatedBrowser = (() => {
    const init = store => {
        common_store = store.common;

        const src = '//browser-update.org/update.min.js';
        if (document.querySelector(`script[src*="${src}"]`)) return;
        window.$buoop = {
            vs: { i: 11, f: -4, o: -4, s: 9, c: -4 },
            api: 4,
            url: 'https://whatbrowser.org/',
            noclose: true, // Do not show the 'ignore' button to close the notification
            reminder: 0, // show all the time
            onshow: updateStore,
            nomessage: true,
            insecure: true,
        };
        if (document.body) {
            const script = document.createElement('script');
            script.setAttribute('src', src);
            document.body.appendChild(script);
        }
    };

    const updateStore = action('showError', () => {
        if (common_store) {
            common_store.showError({
                message: (
                    <Localize
                        i18n_default_text='Your web browser is out of date and may affect your trading experience. Please <0>update your browser</0>.'
                        components={[
                            <a
                                key={0}
                                href='http://outdatedbrowser.com'
                                rel='noopener noreferrer'
                                target='_blank'
                                className='link'
                            />,
                        ]}
                    />
                ),
            });
        }
    });

    return {
        init,
    };
})();

export default OutdatedBrowser;
