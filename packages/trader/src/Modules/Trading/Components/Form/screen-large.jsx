import classNames            from 'classnames';
import PropTypes             from 'prop-types';
import React                 from 'react';
import { TradeParamsLoader } from 'App/Components/Elements/ContentLoader';
import Fieldset              from 'App/Components/Form/fieldset.jsx';
import ContractType          from '../../Containers/contract-type.jsx';
import Purchase              from '../../Containers/purchase.jsx';
import TradeParams           from '../../Containers/trade-params.jsx';

const ScreenLarge = ({ is_dark_theme, is_market_closed, is_trade_enabled }) => (
    <div className={classNames('sidebar__items', {
        'sidebar__items--market-closed': is_market_closed,
    })}
    >
        {!is_trade_enabled ?
            <TradeParamsLoader
                is_dark_theme={is_dark_theme}
                speed={2}
            />
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
    is_dark_theme   : PropTypes.bool,
    is_market_closed: PropTypes.bool,
    is_trade_enabled: PropTypes.bool,
};

export default ScreenLarge;
