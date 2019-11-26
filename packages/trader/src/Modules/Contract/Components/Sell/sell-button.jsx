import {
    Button,
    Popover }       from 'deriv-components';
import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';
import { localize } from 'deriv-translations';

const SellButton = ({
    contract_info,
    is_sell_requested,
    is_valid_to_sell,
    onClickSell,
}) => {
    const sell_message = is_valid_to_sell
        ? localize('Contract will be sold at the prevailing market price when the request is received by our servers. This price may differ from the indicated price.')
        : contract_info.validation_error;

    return (
        <React.Fragment>
            <Popover alignment='left' icon='question' message={sell_message} />
            <Button
                is_disabled={!is_valid_to_sell || is_sell_requested}
                text={localize('Sell')}
                onClick={onClickSell}
                secondary
            />
        </React.Fragment>
    );
};

SellButton.propTypes = {
    contract_info    : PropTypes.object,
    is_sell_requested: PropTypes.bool,
    is_valid_to_sell : PropTypes.bool,
    onClickSell      : PropTypes.func,
};

export default observer(SellButton);
