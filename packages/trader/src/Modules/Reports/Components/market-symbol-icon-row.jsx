import {
    Icon,
    Popover }          from 'deriv-components';
import PropTypes       from 'prop-types';
import React           from 'react';
import IconTradeType   from 'Assets/Trading/Types/icon-trade-types.jsx';
import {
    getMarketName,
    getTradeTypeName } from '../Helpers/market-underlying';
import Shortcode       from '../Helpers/shortcode';

const MarketSymbolIconRow = ({ payload, show_description }) => {
    const should_show_category_icon = typeof payload.shortcode === 'string';
    const info_from_shortcode = Shortcode.extractInfoFromShortcode(payload.shortcode);

    if (should_show_category_icon && info_from_shortcode) {
        return (
            <div className='market-symbol-icon'>
                <div className='market-symbol-icon-name'>
                    <Popover
                        classNameTarget='market-symbol-icon__popover'
                        classNameBubble='market-symbol-icon__popover-bubble'
                        alignment='top'
                        message={getMarketName(info_from_shortcode.underlying)}
                        disable_target_icon
                    >
                        <Icon icon={info_from_shortcode.underlying ? `IcUnderlying${info_from_shortcode.underlying}` : 'IcUnknown'} size={32} />
                    </Popover>
                    {show_description && payload.display_name}
                </div>

                <div className='market-symbol-icon-category'>
                    <Popover
                        classNameTarget='category-type-icon__popover'
                        classNameBubble='category-type-icon__popover-bubble'
                        alignment='top'
                        message={getTradeTypeName(info_from_shortcode.category)}
                        disable_target_icon
                    >
                        <IconTradeType
                            type={
                                Shortcode.isHighLow({ shortcode_info: info_from_shortcode })
                                    ? `${info_from_shortcode.category.toLowerCase()}_barrier`
                                    : info_from_shortcode.category.toLowerCase()
                            }
                            color='brand'
                        />
                    </Popover>
                    {show_description && info_from_shortcode.category}
                </div>
            </div>
        );
    } else if (['deposit', 'withdrawal'].includes(payload.action_type)) {
        return (
            <div className='market-symbol-icon'>
                {
                    payload.action_type === 'deposit' ? (
                        <Icon icon='IcCashierDeposit' size={32} />
                    ) : (
                        <Icon icon='IcCashierWithdrawal' size={32} />
                    )
                }
            </div>
        );
    } else if (payload.action_type === 'escrow') {
        return (
            <div className='market-symbol-icon'>
                <Icon icon='IconP2PCashier' />
            </div>
        );
    }

    return (
        <svg width='32' height='32' className='unknown-icon'>
            <rect width='32' height='32' />
        </svg>
    );
};

MarketSymbolIconRow.propTypes = {
    action          : PropTypes.string,
    payload         : PropTypes.object,
    show_description: PropTypes.bool,
};

export default MarketSymbolIconRow;
