import React from 'react';
import classNames from 'classnames';
import { Icon } from '@deriv/components';
import { TRADE_TYPES } from '@deriv/shared';
import IconTradeCategory from 'Assets/Trading/Categories/icon-trade-categories';
import NewFooterNavigation from './new-footer-navigation';
import NewHorizontalCarousel from './new-horizontal-carousel';

const NewTradeTypeMenu = ({ onGoBackClick }: { onGoBackClick: () => void }) => {
    const [show_trade_type, setShowTradeType] = React.useState(true);
    // const [show_trading_asset, setShowTradingAsset] = React.useState(false);

    const trade_types = [
        { text: 'Accumulators', value: TRADE_TYPES.ACCUMULATOR },
        { text: 'Vanillas', value: TRADE_TYPES.VANILLA.CALL },
        { text: 'Turbos', value: TRADE_TYPES.TURBOS.LONG },
        { text: 'Multipliers', value: TRADE_TYPES.MULTIPLIER },
        { text: 'Rise/Fall', value: TRADE_TYPES.RISE_FALL },
        { text: 'Higher/Lower', value: TRADE_TYPES.HIGH_LOW },
        { text: 'Touch/No Touch', value: TRADE_TYPES.TOUCH },
        { text: 'Matches/Differs', value: TRADE_TYPES.MATCH_DIFF },
        { text: 'Even/Odd', value: TRADE_TYPES.EVEN_ODD },
        { text: 'Over/Under', value: TRADE_TYPES.OVER_UNDER },
    ];
    const assets_types = [
        { text: 'Volatility 75 (1s) Index', value: TRADE_TYPES.ACCUMULATOR },
        { text: 'Volatility 75 (1s) Index', value: TRADE_TYPES.VANILLA.CALL },
        { text: 'Volatility 75 (1s) Index', value: TRADE_TYPES.TURBOS.LONG },
        { text: 'Volatility 75 (1s) Index', value: TRADE_TYPES.MULTIPLIER },
        { text: 'Volatility 75 (1s) Index', value: TRADE_TYPES.RISE_FALL },
        { text: 'Volatility 75 (1s) Index', value: TRADE_TYPES.HIGH_LOW },
        { text: 'Volatility 75 (1s) Index', value: TRADE_TYPES.TOUCH },
        { text: 'Volatility 75 (1s) Index', value: TRADE_TYPES.MATCH_DIFF },
        { text: 'Volatility 75 (1s) Index', value: TRADE_TYPES.EVEN_ODD },
        { text: 'Volatility 75 (1s) Index', value: TRADE_TYPES.OVER_UNDER },
    ];

    const filters = ['All', 'Digital', 'Accumulators', 'Vanillas', 'Turbos', 'Multipliers', 'Ups&Downs', 'Highs&Lows'];
    const market_filters = ['Favorites', 'All', 'Synthetic_Indices', 'Forex', 'Stock_Indices', 'Cryptocurrencies'];

    return (
        <div className='trade-type_menu_overlay'>
            <div onClick={onGoBackClick} className='trade-type_menu_header'>
                <Icon icon='IcArrowLeftBold' className='arrow_icon' height={22} width={13} />
                <div className='trade-type_menu_header_text'>Trade Types & Assets</div>
            </div>
            <div className='trade-type_menu_central-container'>
                <div className='trade-type_menu_section' style={{ minHeight: '88px' }}>
                    <div className='trade-type_menu_section_header' onClick={() => setShowTradeType(!show_trade_type)}>
                        <span className='trade-type_menu_section_header_number'>1</span>
                        <div className='trade-type_menu_section_header_text'>Choose a trade type</div>
                        <Icon icon={show_trade_type ? 'IcChevronUpBold' : 'IcChevronDownBold'} width={16} height={24} />
                    </div>
                    <div className='trade-type_menu_section_sort'>
                        {show_trade_type ? (
                            <NewHorizontalCarousel list={filters} />
                        ) : (
                            <div className='trade-type_menu_section_selected'>
                                <IconTradeCategory category={TRADE_TYPES.MULTIPLIER} />
                                <div className='trade-type_menu_section_selected_text'>Multipliers</div>
                            </div>
                        )}
                    </div>
                    {show_trade_type && (
                        <div className='trade-type_menu_section_menu-container'>
                            {trade_types.map(({ text, value }, index) => (
                                <div
                                    key={index}
                                    className={classNames('contract-card', {
                                        'contract-card--selected': text === 'Multipliers',
                                    })}
                                    onClick={() => setShowTradeType(!show_trade_type)}
                                >
                                    <IconTradeCategory category={value} />
                                    <div className='contract-card_text'>{text}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className='trade-type_menu_section'>
                    <div
                        className='trade-type_menu_section_header'
                        onClick={() => setShowTradeType(!show_trade_type)}
                        // style={{ margin: '0.8rem 1.6rem' }}
                    >
                        <span className='trade-type_menu_section_header_number'>2</span>
                        <div className='trade-type_menu_section_header_text'>Choose a trading asset</div>
                        <Icon
                            icon={!show_trade_type ? 'IcChevronUpBold' : 'IcChevronDownBold'}
                            width={16}
                            height={24}
                        />
                    </div>
                    {!show_trade_type && (
                        <div className='trade-type_menu_section_sort'>
                            <NewHorizontalCarousel list={market_filters} />
                        </div>
                    )}
                    {!show_trade_type && (
                        <div className='trade-type_menu_section_menu-container_asset'>
                            {assets_types.map(({ text, value }, index) => (
                                <div
                                    key={index}
                                    // className={classNames('contract-card', {
                                    //     'contract-card--selected': text === 'Multipliers',
                                    // })}
                                    // onClick={() => setShowTradeType(!show_trade_type)}
                                >
                                    {/* <IconTradeCategory category={value} /> */}
                                    <div className='contract-card_text' onClick={onGoBackClick}>
                                        {text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <NewFooterNavigation />
        </div>
    );
};

export default NewTradeTypeMenu;
