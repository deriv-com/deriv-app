import React from 'react';

const URLHandler = () => (
    <React.Fragment>
        <script
            type='text/javascript'
            dangerouslySetInnerHTML={{ __html: `
                if (location.protocol !== 'https:') {
                    location.href = location.href.replace("http://", "https://");
                } else {
                    (function(l) {
                        if (l.search) {
                            var query = {};

                            // Gets query strings of the url
                            l.search.slice(1).split('&').forEach(function(v) {
                                var a = v.split('=');

                                query[a[0]] = a.slice(1).join('=').replace(/~and~/g, '&');
                            });

                            // Converts paths in query string to HTML5 route and refresh the url
                            if (query.p !== undefined) {
                                window.history.replaceState(null, null,
                                    l.pathname.slice(0) + (query.p.split('::').join('/') || '') +
                                    (query.q ? ('?' + query.q) : '') + l.hash
                                );
                            }
                        }
                    }(window.location));
                }
            ` }}
        />
    </React.Fragment>
);

export default URLHandler;
