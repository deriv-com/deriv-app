import React from 'react';
import Title from '../../_common/components/title.jsx';
import Favicons from '../../_common/includes/favicons.jsx';
import AntiClickjack from '../../_common/includes/anti_clickjack.jsx';
import GoogleOptimizer from '../../_common/includes/google_optimizer.jsx';

const Head = () => (
    <head>
        <GoogleOptimizer />
        <AntiClickjack />
        <meta httpEquiv='Content-Type' content='text/html;charset=UTF-8' />
        <meta httpEquiv='Content-Language' content={it.language} />
        <meta name='description' content={` ${it.L('[_1] gives everyone an easy way to participate in the financial markets. Trade with as little as $1 USD on major currencies, indices, commodities, and volatility indices.', it.broker_name)}`} />
        <meta name='keywords' content={` ${it.L('binary options, forex, forex trading, online trading, financial trading, binary trading, index trading, trading indices, forex trades, trading commodities, binary options strategy, binary broker, binary bet, binary options trading platform, binary strategy, finance, investment, trading')}`} />
        <meta name='author' content={it.broker_name} />
        <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' />
        <meta name='dcterms.rightsHolder' content={it.broker_name} />
        <meta name='dcterms.rights' content={it.broker_name} />
        <meta name='google-site-verification' content='roReCEK-wNa1EMA6ZM9a4zCOQOMqxfJjvfsZMC9qh_k' />
        <meta property='og:title' content={it.broker_name} />
        <meta property='og:type' content='website' />
        <meta property='og:image' content={it.url_for('images/common/og_image.gif')} />
        <meta name='format-detection' content='telephone=no' />

        <Title />

        <link rel='manifest' href={`${it.root_url}manifest.json`} />
        <script type='text/javascript' src={`${it.root_url}pushwoosh-web-notifications.js`} async />

        <Favicons />

        { it.languages
            .filter(lang => lang !== it.language)
            .map((lang, inx) => (
                <link key={inx} rel='alternate' href={it.url_for(it.current_path, lang.toLowerCase())} hrefLang={lang} />
            ))
        }

        { it.css_files.map((css_file, inx) => (
            <link key={inx} rel='stylesheet' href={css_file} />
        ))}
        { it.js_files.map((js_file, inx) => (
            <script key={inx} src={js_file.replace('{PLACEHOLDER_FOR_LANG}', it.language.toLowerCase())} />
        ))}
    </head>
);

export default Head;
