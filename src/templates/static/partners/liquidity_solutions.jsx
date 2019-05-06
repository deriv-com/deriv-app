import React             from 'react';
import { SeparatorLine } from '../../_common/components/separator_line.jsx';

const Box = ({ image, header, text }) => (
    <div className='gr-4 gr-12-p gr-12-m gr-padding-30 gr-parent'>
        <div className='white-bg box gr-gutter gr-padding-30'>
            <img className='responsive gr-padding-20' src={it.url_for(`images/pages/liquidity_solutions/${image}.svg`)} />
            <strong>{header}</strong>
            <p>{text}</p>
        </div>
    </div>
);

const TextImage = ({ image, header, text }) => (
    <React.Fragment>
        <div className='gr-row'>
            <div className='gr-4 gr-12-p gr-12-m'>
                <strong>{header}</strong>
                <p>{text}</p>
            </div>
            <div className='gr-7 gr-12-p gr-12-m gr-push-1 gr-push-0-p gr-push-0-m'>
                <img className='responsive' src={it.url_for(`images/pages/liquidity_solutions/${image}.svg`)} />
            </div>
        </div>
        <SeparatorLine show_mobile className='gr-padding-30' />
    </React.Fragment>
);

const LiquiditySolutions = () => (
    <React.Fragment>
        <div className='container'>
            <div className='static_full'>
                <h1>{it.L('Multi-asset liquidity solutions')}</h1>
                <p>{it.L('[_1] provides institutional clients around the world with market quotes and trade execution across a wide range of assets, including major currency pairs, spot metals, CFD indices and popular cryptocurrencies.', it.website_name)}</p>
                <p>{it.L('Our commitment to integrity and reliability means that we always strive to give you access to the best pricing and liquidity possible.')}</p>
            </div>
        </div>
        <div className='fill-bg-color center-text gr-padding-20'>
            <h2 className='gr-padding-20 gr-child'>{it.L('Key features')}</h2>
            <div className='container gr-row'>
                <Box
                    image='multi_asset'
                    header={it.L('Multi-asset execution')}
                    text={it.L('Over 50 FX pairs, plus spot metals, CFD indices, commodities, and cryptocurrencies.')}
                />
                <Box
                    image='liquidity'
                    header={it.L('Top-tier liquidity')}
                    text={it.L('Access market quotes and trade execution from top-tier liquidity providers, including banks and non-banks.')}
                />
                <Box
                    image='bo_support'
                    header={it.L('Back-office support')}
                    text={it.L('Receive back-office support for post-trade risk management and real-time trade/position monitoring.')}
                />
            </div>
        </div>

        <div className='container gr-padding-30 gr-child'>
            <h2 className='center-text'>{it.L('How it works')}</h2>
            <TextImage
                image='one_zero'
                header={it.L('One Zero')}
                text={it.L('MT4 and MT5 brokers can connect directly to our liquidity on the One Zero bridge by using built-in plugins.')}
            />
            <TextImage
                image='fix_api'
                header={it.L('FIX API')}
                text={it.L('Everyone else can use the FIX API to connect to our One Zero bridge – subject to a conformance test.')}
            />
        </div>

        <div className='container'>
            <h2>{it.L('Highlights')}</h2>
            <ul className='bullet'>
                <li>{it.L('Access to multi-asset liquidity and back-office functionality via margin accounts')}</li>
                <li>{it.L('Carefully handpicked network of liquidity providers allow us to pass on tight spreads and competitive margins to both retail and institutional clients')}</li>
                <li>{it.L('Access to Advanced trading')}</li>
            </ul>
            <p>{it.L('Interested in our liquidity solutions? Contact us at [_1] for more info.', '<a href="mailto:marketing@binary.com">marketing@binary.com</a>')}</p>
        </div>
    </React.Fragment>
);

export default LiquiditySolutions;
