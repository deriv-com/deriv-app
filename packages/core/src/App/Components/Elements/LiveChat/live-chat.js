import { livechat_license_id } from '@deriv/shared';

// Initialization code provided by Livechat
export const liveChatInitialization = () =>
    new Promise(resolve => {
        window.__lc = window.__lc || {}; // eslint-disable-line no-underscore-dangle
        window.__lc.license = livechat_license_id; // eslint-disable-line no-underscore-dangle
        (function (n, t, c) {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            function i(n) {
                // eslint-disable-next-line no-underscore-dangle
                return e._h ? e._h.apply(null, n) : e._q.push(n);
            }
            // eslint-disable-next-line
            var e = {
                _q: [],
                _h: null,
                _v: '2.0',
                on() {
                    // eslint-disable-next-line prefer-rest-params
                    i(['on', c.call(arguments)]);
                },
                once() {
                    // eslint-disable-next-line prefer-rest-params
                    i(['once', c.call(arguments)]);
                },
                off() {
                    // eslint-disable-next-line prefer-rest-params
                    i(['off', c.call(arguments)]);
                },
                get() {
                    if (!e._h) throw new Error("[LiveChatWidget] You can't use getters before load."); // eslint-disable-line no-underscore-dangle
                    // eslint-disable-next-line prefer-rest-params
                    return i(['get', c.call(arguments)]);
                },
                call() {
                    // eslint-disable-next-line prefer-rest-params
                    i(['call', c.call(arguments)]);
                },
                init() {
                    // eslint-disable-next-line
                    var n = t.createElement('script');
                    // eslint-disable-next-line no-unused-expressions
                    (n.async = !0), // eslint-disable-line no-sequences
                        (n.type = 'text/javascript'),
                        (n.src = 'https://cdn.livechatinc.com/tracking.js'),
                        t.head.appendChild(n);
                },
            };
            // eslint-disable-next-line no-unused-expressions
            !n.__lc.asyncInit && e.init(); // eslint-disable-line no-underscore-dangle
            n.LiveChatWidget = n.LiveChatWidget || e;
        })(window, document, [].slice); //eslint-disable-line
        resolve();
    });
