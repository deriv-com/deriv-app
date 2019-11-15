import React           from 'react';
import GoogleOptimizer from './includes/google/google_optimizer.jsx';
import GTMScript       from './includes/google/gtm_script.jsx';
import URLHandler      from './includes/url_handler.jsx';
import Title           from '../_common/components/title.jsx';
import Favicons        from '../_common/includes/favicons.jsx';
import AntiClickjack   from '../_common/includes/anti_clickjack.jsx';

const Head = () => (
    <head>
        {
            // Prompt a message in the browser if the user has disabled JS
        }
        {/* <noscript>{ localize('Your browser does not support JavaScript!') }</noscript> */}
        {/* TODO: i18n_issue - these should be localized after the app has moved to mount on index.html */}
        <noscript>Your browser does not support JavaScript!</noscript>

        <GoogleOptimizer />
        <GTMScript />
        <AntiClickjack />
        <URLHandler />
        <meta httpEquiv='Content-Type' content='text/html;charset=UTF-8' />
        <meta httpEquiv='Content-Language' content={it.language} />
        {/*
                <meta name='description' content={` ${localize('{{broker_name}} gives everyone an easy way to participate in the financial markets. Trade with as little as $1 USD on major currencies, stocks, indices, and commodities.', { broker_name: it.broker_name })}`} />
        */}
        <meta name='description' content='Deriv gives everyone an easy way to participate in the financial markets. Trade with as little as $1 USD on major currencies, stocks, indices, and commodities.' />
        {/*
                <meta name='keywords' content={` ${localize('binary options, forex, forex trading, online trading, financial trading, binary trading, index trading, trading indices, forex trades, trading commodities, binary options strategy, binary broker, binary bet, binary options trading platform, binary strategy, finance, stocks, investment, trading')}`} />
        */}
        <meta name='keywords' content='binary options, forex, forex trading, online trading, financial trading, binary trading, index trading, trading indices, forex trades, trading commodities, binary options strategy, binary broker, binary bet, binary options trading platform, binary strategy, finance, stocks, investment, trading' />
        <meta name='author' content={it.broker_name} />
        <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' />
        <meta name='theme-color' content='#2a3052' />
        <meta name='dcterms.rightsHolder' content={it.broker_name} />
        <meta name='dcterms.rights' content={it.broker_name} />
        <meta name='google-site-verification' content='g5u3TyEdmYJ_HKZ6EmpW1nlKwD4XPVeLMhN9leeMfuw' />
        <meta property='og:title' content={it.broker_name} />
        <meta property='og:type' content='website' />
        <meta property='og:image' content={it.url_for('images/common/og_image.gif')} />
        <meta name='google' content='notranslate' />
        <meta name='referrer' content='origin' />

        { it.css_files.map((css_file, inx) => (
            <link key={inx} rel='preload' as='style' href={css_file} />
        ))}
        { it.js_files.map((js_file, inx) => (
            <link rel='preload' as='script' key={inx} href={js_file.replace('{PLACEHOLDER_FOR_LANG}', it.language.toLowerCase())} />
        ))}

        <link rel='preload' as='script' href={`${it.root_url}pushwoosh-web-notifications.js`} />
        <link rel='preconnect' href='https://fonts.gstatic.com' />
        <link rel='preconnect' href='https://www.googletagmanager.com' />
        <link rel='preconnect' href='https://browser-update.org' />

        <link rel='manifest' href={it.url_for(`/${it.language.toLowerCase()}/manifest.json`)} />

        <Title />

        <Favicons />

        { it.only_ja && it.language.toLowerCase() === 'en' &&
            <meta name='robots' content='noindex' />
        }
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
            <script key={inx} src={js_file.replace('{PLACEHOLDER_FOR_LANG}', it.language.toLowerCase())} defer />
        ))}
        <script type='text/javascript' src={`${it.root_url}pushwoosh-web-notifications.js`} defer />
    </head>
);

export default Head;
