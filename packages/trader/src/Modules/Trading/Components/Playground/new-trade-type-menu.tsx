import React from 'react';
import classNames from 'classnames';
import { Icon } from '@deriv/components';
import NewFooterNavigation from './new-footer-navigation';

const NewTradeTypeMenu = ({ onGoBackClick }: { onGoBackClick: () => void }) => {
    const [show_trade_type, setShowTradeType] = React.useState(true);
    const [show_trading_asset, setShowTradingAsset] = React.useState(false);

    const trade_types = [
        'Accumulators',
        'Vanillas',
        'Turbos',
        'Multipliers',
        'Rise/Fall',
        'Higher/Lower',
        'Touch/No Touch',
        'Matches/Differs',
        'Even/Odd',
        'Over/Under',
    ];

    return (
        <div className='trade-type_menu_overlay'>
            <div onClick={onGoBackClick} className='trade-type_menu_header'>
                <Icon icon='IcArrowLeftBold' className='arrow_icon' height={22} width={13} />
                <div className='trade-type_menu_header_text'>Trade Types & Assets</div>
            </div>
            <div className='trade-type_menu_central-container'>
                <div className='trade-type_menu_section'>
                    <div className='trade-type_menu_section_header' onClick={() => setShowTradeType(!show_trade_type)}>
                        <span className='trade-type_menu_section_header_number'>1</span>
                        <div className='trade-type_menu_section_header_text'>Choose a trade type</div>
                        <Icon icon={show_trade_type ? 'IcChevronUpBold' : 'IcChevronDownBold'} width={16} height={24} />
                    </div>
                    <div className='trade-type_menu_section_sort'>
                        {show_trade_type ? 'All Digital Accumulator Vanilla' : 'Multipliers'}
                    </div>
                    {show_trade_type && (
                        <div className='trade-type_menu_section_menu-container'>
                            {trade_types.map((contract, index) => (
                                <div
                                    key={index}
                                    className={classNames('contract-card', {
                                        'contract-card--selected': contract === 'Multipliers',
                                    })}
                                >
                                    {contract}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className='trade-type_menu_section'>
                    <div
                        className='trade-type_menu_section_header'
                        onClick={() => setShowTradingAsset(!show_trading_asset)}
                        style={{ margin: '0.8rem 1.6rem' }}
                    >
                        <span className='trade-type_menu_section_header_number'>2</span>
                        <div className='trade-type_menu_section_header_text'>Choose a trading asset</div>
                        <Icon
                            icon={show_trading_asset ? 'IcChevronUpBold' : 'IcChevronDownBold'}
                            width={16}
                            height={24}
                        />
                    </div>
                </div>
            </div>
            <NewFooterNavigation />
        </div>
    );
};

export default NewTradeTypeMenu;
