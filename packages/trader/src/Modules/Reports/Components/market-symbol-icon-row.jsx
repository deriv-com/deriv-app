import {
    Popover,
    UnderlyingIcon }   from 'deriv-components';
import PropTypes       from 'prop-types';
import React           from 'react';
import Icon            from 'Assets/icon.jsx';
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
                        <UnderlyingIcon market={info_from_shortcode.underlying} />
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
                        <Icon
                            icon='IconTradeType'
                            type={(Shortcode.isHighLow({ shortcode_info: info_from_shortcode }))
                                ? `${info_from_shortcode.category.toLowerCase()}_barrier`
                                : info_from_shortcode.category.toLowerCase()}
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
                        <Icon icon='IconDeposit' />
                    ) : (
                        <Icon icon='IconWithdrawal' />
                    )
                }
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
