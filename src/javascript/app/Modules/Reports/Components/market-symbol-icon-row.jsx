import PropTypes                from 'prop-types';
import React                    from 'react';
import { UnderlyingIcon }       from 'App/Components/Elements/underlying-icon.jsx';
import { IconTradeType }        from 'Assets/Trading/Types';
import { getMarketInformation } from '../Helpers/market-underyling';

const MarketSymbolIconRow = ({ payload, show_description }) => {
    const should_show_category_icon = typeof payload.shortcode === 'string';
    const market_information = getMarketInformation(payload);

    if (should_show_category_icon && market_information) {
        return (
            <div className='market-symbol-icon'>
                <div className='market-symbol-icon-name'>
                    <UnderlyingIcon market={market_information.underlying} />
                    {show_description && payload.display_name}
                </div>

                <div className='market-symbol-icon-category'>
                    <IconTradeType type={market_information.category} />
                    {show_description && market_information.category}
                </div>
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
