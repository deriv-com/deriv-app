import PropTypes from 'prop-types';
import React from 'react';
import { Collapsible } from '@deriv/components';
import { TradeParamsLoader } from 'App/Components/Elements/ContentLoader';
import AllowEqualsMobile from 'Modules/Trading/Containers/allow-equals.jsx';
import LastDigit from 'Modules/Trading/Components/Form/TradeParams/last-digit.jsx';
import MobileWidget from '../Elements/mobile-widget.jsx';
import ContractType from '../../Containers/contract-type.jsx';
import Purchase from '../../Containers/purchase.jsx';
import 'Sass/app/_common/mobile-widget.scss';

const ScreenSmall = ({ is_trade_enabled }) =>
    !is_trade_enabled ? (
        <div className='mobile-wrapper__content-loader'>
            <TradeParamsLoader speed={2} />
        </div>
    ) : (
        <Collapsible position='top' is_collapsed>
            <ContractType />
            <div collapsible='true'>
                <LastDigit />
            </div>
            <MobileWidget />
            <AllowEqualsMobile collapsible='true' />
            <div className='purchase-container'>
                <Purchase />
            </div>
        </Collapsible>
    );

ScreenSmall.propTypes = {
    is_trade_enabled: PropTypes.bool,
};

export default ScreenSmall;
