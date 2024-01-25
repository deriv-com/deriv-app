import React from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { useSwipeable } from 'react-swipeable';
import { Icon } from '@deriv/components';
import { TRADE_TYPES } from '@deriv/shared';
import { TList } from '../Form/ContractType/types';
import IconTradeCategory from 'Assets/Trading/Categories/icon-trade-categories';
import ContractType from '../Form/ContractType/contract-type';
import NewFooterNavigation from './new-footer-navigation';
import NewHorizontalCarousel from './new-horizontal-carousel';

const NewTradeTypeMenu = ({ onGoBackClick }: { onGoBackClick: () => void }) => {
    const [show_trade_type, setShowTradeType] = React.useState(true);
    const [show_search_input, setShowSearchInput] = React.useState(false);
    const [show_description, setShowDescription] = React.useState(false);

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
        { text: 'Volatility 10 Index', value: 'IcUnderlyingR_10' },
        { text: 'Volatility 10 (1s) Index', value: 'IcUnderlying1HZ10V' },
        { text: 'Volatility 75 Index', value: 'IcUnderlyingR_75' },
        { text: 'Volatility 75 (1s) Index', value: 'IcUnderlying1HZ75V' },
        { text: 'Volatility 100 Index', value: 'IcUnderlyingR_100' },
        { text: 'Volatility 100 (1s) Index', value: 'IcUnderlying1HZ100V' },
        { text: 'Volatility 250 (1s) Index', value: 'IcUnderlying1HZ250V' },
        { text: 'Boom 1000 Index', value: 'IcUnderlyingBOOM1000' },
        { text: 'Crash 1000 Index', value: 'IcUnderlyingCRASH1000' },
        { text: 'AUD/JPY', value: 'IcUnderlyingFRXAUDJPY' },
        { text: 'AUD/USD', value: 'IcUnderlyingFRXAUDUSD' },
        { text: 'EUR/AUD', value: 'IcUnderlyingFRXEURAUD' },
    ];

    const filters = ['All', 'Digital', 'Accumulators', 'Vanillas', 'Turbos', 'Multipliers', 'Ups&Downs', 'Highs&Lows'];
    const market_filters = ['Favorites', 'All', 'Synthetic_Indices', 'Forex', 'Stock_Indices', 'Cryptocurrencies'];

    const swipe_handlers = useSwipeable({
        onSwipedDown: () => setShowDescription(!show_description),
        onSwipedUp: () => setShowDescription(!show_description),
    });

    const item = { text: 'Multipliers', value: 'multiplier' };
    const list = [
        {
            label: 'All',
            key: 'All',
            contract_categories: [
                {
                    key: 'Accumulators',
                    label: 'Accumulators',
                    contract_types: [{ text: 'Accumulators', value: 'accumulator' }],
                },
                {
                    key: 'Multipliers',
                    label: 'Multipliers',
                    contract_types: [{ text: 'Multipliers', value: 'multiplier' }],
                },
                {
                    key: 'Vanillas',
                    label: 'Vanillas',
                    contract_types: [{ text: 'Call/Put', value: 'vanillalongcall' }],
                },
                {
                    key: 'Turbos',
                    label: 'Turbos',
                    contract_types: [{ text: 'Long/Short', value: 'turboslong' }],
                },
                {
                    key: 'Ups & Downs',
                    label: 'Ups & Downs',
                    contract_types: [{ text: 'Rise/Fall', value: 'rise_fall' }],
                },
                {
                    key: 'Highs & Lows',
                    label: 'Highs & Lows',
                    contract_types: [
                        { text: 'Higher/Lower', value: 'high_low' },
                        { text: 'Touch/No Touch', value: 'touch' },
                    ],
                },
                {
                    key: 'Digits',
                    label: 'Digits',
                    contract_types: [
                        { text: 'Matches/Differs', value: 'match_diff' },
                        { text: 'Even/Odd', value: 'even_odd' },
                        { text: 'Over/Under', value: 'over_under' },
                    ],
                },
            ],
            contract_types: [
                { text: 'Accumulators', value: 'accumulator' },
                { text: 'Multipliers', value: 'multiplier' },
                { text: 'Call/Put', value: 'vanillalongcall' },
                { text: 'Long/Short', value: 'turboslong' },
                { text: 'Rise/Fall', value: 'rise_fall' },
                { text: 'Higher/Lower', value: 'high_low' },
                { text: 'Touch/No Touch', value: 'touch' },
                { text: 'Matches/Differs', value: 'match_diff' },
                { text: 'Even/Odd', value: 'even_odd' },
                { text: 'Over/Under', value: 'over_under' },
            ],
        },
    ];

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
                            <div className='learn-more_widget' onClick={() => setShowDescription(!show_description)}>
                                Learn more about our trade types
                                <Icon
                                    icon='IcChevronRightBold'
                                    width={16}
                                    height={24}
                                    custom_color='var(--general-main-1)'
                                />
                            </div>
                        </div>
                    )}
                </div>
                <div className='trade-type_menu_section'>
                    <div className='trade-type_menu_section_header' onClick={() => setShowTradeType(!show_trade_type)}>
                        <span className='trade-type_menu_section_header_number'>2</span>
                        <div className='trade-type_menu_section_header_text'>Choose a trading asset</div>
                        <Icon
                            icon={!show_trade_type ? 'IcChevronUpBold' : 'IcChevronDownBold'}
                            width={16}
                            height={24}
                        />
                    </div>
                    {!show_trade_type && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                margin: '0 1.6rem',
                                height: '4rem',
                                position: 'relative',
                            }}
                        >
                            {show_search_input ? (
                                <React.Fragment>
                                    <Icon icon='IcNewSearch' size={24} className='search_icon-input' />
                                    <input type='text' placeholder='Search Trading asset' className='search_input' />
                                    <Icon
                                        icon='IcCloseIconDbot'
                                        size={12}
                                        className='search_icon-close'
                                        onClick={() => setShowSearchInput(!show_search_input)}
                                    />
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <Icon
                                        icon='IcNewSearch'
                                        width={24}
                                        height={24}
                                        className='search_icon'
                                        onClick={() => setShowSearchInput(!show_search_input)}
                                    />
                                    <div className='trade-type_menu_section_sort'>
                                        <NewHorizontalCarousel list={market_filters} />
                                    </div>
                                </React.Fragment>
                            )}
                        </div>
                    )}
                    {!show_trade_type && (
                        <div className='trade-type_menu_section_menu-container_asset'>
                            {assets_types.map(({ text, value }, index) => (
                                <div
                                    key={index}
                                    className={classNames('asset-wrapper', {
                                        'asset-wrapper--selected': text === 'Volatility 75 (1s) Index',
                                    })}
                                >
                                    <div onClick={onGoBackClick} style={{ flex: '1', display: 'flex' }}>
                                        <Icon icon={value} size={24} />
                                        <span className='asset-text'>{text}</span>
                                    </div>
                                    <Icon
                                        icon={text === 'Volatility 75 (1s) Index' ? 'IcNewStarLight' : 'IcNewStartDark'}
                                        size={24}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <NewFooterNavigation />
            <div
                className={show_description ? 'trade-param_popup_overlay' : ''}
                onClick={() => setShowDescription(!show_description)}
            >
                <CSSTransition
                    appear
                    classNames={{
                        appear: `trade-param_popup_container-appear`,
                        appearDone: `trade-param_popup_container-appear-done`,
                        enter: `trade-param_popup_container-enter`,
                        enterDone: `trade-param_popup_container-enter-done`,
                        exit: `trade-param_popup_container-exit`,
                    }}
                    in={show_description}
                    timeout={300}
                    unmountOnExit
                >
                    <div
                        style={{ backgroundColor: 'white', height: '95%' }}
                        className='trade-param_popup_container'
                        onClick={e => e.stopPropagation()}
                    >
                        <div className='footer-new_bottom-sheet_separator' {...swipe_handlers} />
                        <ContractType.Info item={item} list={list as TList[]} />
                    </div>
                </CSSTransition>
            </div>
        </div>
    );
};

export default NewTradeTypeMenu;
