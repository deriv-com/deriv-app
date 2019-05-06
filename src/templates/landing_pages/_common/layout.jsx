import React                  from 'react';
import OutdatedBrowserMessage from './outdated_browser_message.jsx';
import Title                  from '../../_common/components/title.jsx';
import AntiClickjack          from '../../_common/includes/anti_clickjack.jsx';
import Favicons               from '../../_common/includes/favicons.jsx';
import GoogleOptimizer        from '../../_common/includes/google_optimizer.jsx';
import Gtm                    from '../../_common/includes/gtm.jsx';

const Layout = ({
    meta_description,
    css_files,
    js_files,
    children,
}) => (
    <html>
        <head>
            <GoogleOptimizer />
            <AntiClickjack />

            <meta httpEquiv='Content-Type' content='text/html;charset=UTF-8' />
            <meta httpEquiv='Content-Language' content={it.language} />
            <meta name='description' content={meta_description || it.L('[_1] gives everyone an easy way to participate in the financial markets. Trade with as little as $1 USD on major currencies, indices, commodities, and volatility indices.', it.broker_name)} />
            <meta name='keywords' content={it.L('binary options, forex, forex trading, online trading, financial trading, binary trading, index trading, trading indices, forex trades, trading commodities, binary options strategy, binary broker, binary bet, binary options trading platform, binary strategy, finance, investment, trading')} />
            <meta name='author' content={it.broker_name} />
            <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' />
            <meta name='dcterms.rightsHolder' content={it.broker_name} />
            <meta name='dcterms.rights' content={it.broker_name} />
            <meta property='og:title' content={it.broker_name} />
            <meta property='og:type' content='website' />
            <meta property='og:image' content={it.url_for('images/common/og_image.gif')} />

            <Title />

            <Favicons />

            { css_files.map((css_file, idx) => (
                <link key={idx} rel='stylesheet' href={`${css_file}?${it.static_hash}`} />
            ))}
        </head>

        <body>
            <Gtm />

            {children}

            <OutdatedBrowserMessage />

            { js_files.map((js_file, idx) => (
                <script key={idx} src={`${js_file}?${it.static_hash}`} />
            ))}
        </body>
    </html>
);

export default Layout;
