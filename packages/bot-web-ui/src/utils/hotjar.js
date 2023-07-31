import { epochToMoment, toMoment } from '@deriv/shared';

const hotjar = client => {
    /**
     * Inject: External Script Hotjar - for DBot only
     */
    (function (h, o, t, j) {
        /* eslint-disable */
        h.hj =
            h.hj ||
            function () {
                (h.hj.q = h.hj.q || []).push(arguments);
            };
        /* eslint-enable */
        h._hjSettings = { hjid: 3050531, hjsv: 6 };
        const a = o.getElementsByTagName('head')[0];
        const r = o.createElement('script');
        r.async = 1;
        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
        a.appendChild(r);

        // Hotjar attribution code for user segmentation
        const user_id = client?.loginid;
        const account_type = client.is_virtual ? 'Demo' : 'Real';
        const account_open_date = epochToMoment(client.account_open_date);

        window.hj('identify', user_id, {
            'Account created': toMoment(account_open_date).format('YYYY-MM-DD'),
            'Account type': account_type,
            'User country': client.clients_country,
        });
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
};
export default hotjar;
