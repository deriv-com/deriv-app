import PropTypes                  from 'prop-types';
import React                      from 'react';
import { UnderlyingIcon }         from 'App/Components/Elements/underlying-icon.jsx';
import { Popover }                from 'App/Components/Elements/Popover';
import Icon                       from 'Assets/icon.jsx';
import {  getMarketName,
    getTradeTypeName,
    getMarketInformation }        from '../Helpers/market-underlying';

const MarketSymbolIconRow = ({ payload, show_description }) => {
    const should_show_category_icon = typeof payload.shortcode === 'string';
    const market_information = getMarketInformation(payload.shortcode);

    if (should_show_category_icon && market_information) {
        return (
            <div className='market-symbol-icon'>
                <div className='market-symbol-icon-name'>
                    <Popover
                        classNameTarget='market-symbol-icon__popover'
                        classNameBubble='market-symbol-icon__popover-bubble'
                        alignment='top'
                        message={getMarketName(market_information.underlying)}
                        disable_target_icon
                    >
                        <UnderlyingIcon market={market_information.underlying} />
                    </Popover>
                    {show_description && payload.display_name}
                </div>

                <div className='market-symbol-icon-category'>
                    <Popover
                        classNameTarget='category-type-icon__popover'
                        classNameBubble='category-type-icon__popover-bubble'
                        alignment='top'
                        message={getTradeTypeName(market_information.category)}
                        disable_target_icon
                    >
                        <Icon icon='IconTradeType' type={market_information.category} />
                    </Popover>
                    {show_description && market_information.category}
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
