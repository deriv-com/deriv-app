import React             from 'react';
import { SeparatorLine } from '../../_common/components/separator_line.jsx';

export const Section = ({ id, header, children }) => (
    <div className='sections invisible' id={id}>
        <h2 className='primary-color'>{header}</h2>
        {children}
    </div>
);

export const HeaderSecondary = ({ header, ...props }) => (
    <React.Fragment>
        <SeparatorLine invisible show_mobile className='gr-padding-10' />
        <h3 className='secondary-color' {...props}>{header}</h3>
    </React.Fragment>
);

export const ListStrong = ({ header, text }) => (
    <li><strong>{header}</strong><br />{text}</li>
);

export const BoxText = ({ text, text_two }) => (
    <React.Fragment>
        <p className={`no-margin${text_two ? ' gr-padding-10 gr-parent' : ''}`}><strong>{text}</strong></p>
        { text_two && <p className='no-margin'><strong>{text_two}</strong></p> }
    </React.Fragment>
);

export const Box = ({ text, text_two, children }) => (
    <div className='gr-padding-20 fill-bg-color center-text primary-color'>
        { text ? <BoxText text={text} text_two={text_two} /> : children }
    </div>
);

export const NavButtons = ({ parent, section }) => (
    <React.Fragment>
        <SeparatorLine show_mobile className='gr-padding-30' />

        <div className='gr-padding-20'>
            <div className='gr-row gr-row-align-center'>
                <a className='button-secondary' id='go_back'><span>{`< ${it.L('Back')}`}</span></a>
                <div className='gr-gutter' />
                <a className='button' id='go_next'><span>{`${it.L('Next')} >`}</span></a>
            </div>
            <div className='center-text'>
                <a className='button-secondary' href={`${it.url_for('get-started')}?get_started_tabs=${parent}&section=${section}`}><span>{it.L('Back to menu')}</span></a>
            </div>
        </div>

        <SeparatorLine invisible className='gr-padding-10' />
    </React.Fragment>
);

export const ImageBox = ({ header, text, image }) => (
    <div className='gr-5 gr-12-m gr-padding-10'>
        <div className='gr-padding-20 fill-bg-color center-text gr-gutter'>
            <div><img src={it.url_for(`images/pages/get-started/mt5/common/${image}.svg`)} /></div>
            <p><strong>{header}</strong></p>
            <p className='gr-gutter'>{text}</p>
        </div>
    </div>
);

export const BuySellImage = () => (
    <div className='gr-row'>
        <ImageBox image='buy'  header={it.L('Buy')}  text={it.L('In this case, you predict that the price will rise. This is also known as \'going long\'.')} />
        <div className='gr-2 gr-hide-m' />
        <ImageBox image='sell' header={it.L('Sell')} text={it.L('In this case, you predict that the price will fall. This is also known as \'going short\'.')} />
    </div>
);

export const BuySellCurrency = ({ currency_one, currency_two }) => (
    <div className='gr-row'>
        <div className='gr-6 gr-12-m'>
            <h2 className='primary-color'>{it.L('Buy')}</h2>
            <ul className='bullet'>
                <li>{it.L('You\'re buying the [_1] and selling the [_2]', currency_one, currency_two)}</li>
                <li>{it.L('You expect the [_1] to rise in value so you can sell it back for a profit', currency_one)}</li>
                <li>{it.L('Buy = go long')}</li>
            </ul>
        </div>
        <div className='gr-6 gr-12-m'>
            <h2 className='primary-color'>{it.L('Sell')}</h2>
            <ul className='bullet'>
                <li>{it.L('You\'re selling the [_1] and buying the [_2]', currency_one, currency_two)}</li>
                <li>{it.L('You expect the [_1] to fall in value so you can buy it back at a lower price (and make a profit)', currency_one)}</li>
                <li>{it.L('Sell = go short')}</li>
            </ul>
        </div>
    </div>
);

export const MtBox = ({ text, icon_1, icon_2 }) => (
    <div className='gr-12 gr-centered gr-padding-10'>
        <div className={`mt-img ${icon_1}`} />
        <p className='fill-bg-color gr-padding-20 gr-gutter'>{text}</p>
        <div className={`mt-img ${icon_2}`} />
    </div>
);

export const MTAccountOpeningButton = () => (
    <div className='center-text gr-padding-10 client_logged_in invisible'>
        <p>
            <a className='button' href={it.url_for('user/metatrader')}>
                <span>{it.L('Create an MT5 account now')}</span>
            </a>
        </p>
    </div>
);
