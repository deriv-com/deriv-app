import PropTypes                  from 'prop-types';
import React                      from 'react';
import { UnderlyingIcon }         from 'App/Components/Elements/underlying-icon.jsx';
import { Popover }                from 'App/Components/Elements/Popover';
import Icon                       from 'Assets/icon.jsx';
import { getContractTypeDisplay } from 'Constants';
import { getMarketInformation }   from '../Helpers/market-underlying';

const MarketSymbolIconRow = ({ payload, show_description }) => {
    const should_show_category_icon = typeof payload.shortcode === 'string';
    const market_information = getMarketInformation(payload);

    if (should_show_category_icon && market_information) {
        return (
            <div className='market-symbol-icon'>
                <div className='market-symbol-icon-name'>
                    <Popover
                        classNameBubble='market-symbol-icon__tooltip'
                        alignment='top'
                        message={payload.display_name}
                        disable_target_icon
                    >
                        <UnderlyingIcon market={market_information.underlying} />
                    </Popover>
                    {show_description && payload.display_name}
                </div>

                <div className='market-symbol-icon-category'>
                    <Popover
                        classNameBubble='market-symbol-icon__tooltip'
                        alignment='top'
                        message={getContractTypeDisplay(market_information.category)}
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
