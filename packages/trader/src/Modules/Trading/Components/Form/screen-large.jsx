import classNames   from 'classnames';
import PropTypes    from 'prop-types';
import React        from 'react';
import UILoader     from 'App/Components/Elements/ui-loader.jsx';
import Fieldset     from 'App/Components/Form/fieldset.jsx';
import ContractType from '../../Containers/contract-type.jsx';
import Purchase     from '../../Containers/purchase.jsx';
import TradeParams  from '../../Containers/trade-params.jsx';

const ScreenLarge = ({ is_contract_visible, is_trade_enabled, is_blurred }) => (
    <div className={classNames('sidebar__items', {
        'sidebar__items--blur': is_contract_visible || is_blurred,
    })}
    >
        {!is_trade_enabled && !is_contract_visible ?
            <UILoader />
            :
            <React.Fragment>
                <Fieldset className='trade-container__fieldset trade-types'>
                    <ContractType />
                </Fieldset>
                <TradeParams />
                <div className='purchase-container'>
                    <Purchase />
                </div>
            </React.Fragment>
        }
    </div>
);

ScreenLarge.propTypes = {
    is_blurred         : PropTypes.bool,
    is_contract_visible: PropTypes.bool,
    is_trade_enabled   : PropTypes.bool,
};

export default ScreenLarge;
