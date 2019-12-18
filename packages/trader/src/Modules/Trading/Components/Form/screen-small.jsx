import PropTypes         from 'prop-types';
import React             from 'react';
import { Collapsible }   from 'deriv-components';
import AllowEqualsMobile from 'Modules/Trading/Containers/allow-equals.jsx';
import MobileWidget      from '../Elements/mobile-widget.jsx';
import ContractType      from '../../Containers/contract-type.jsx';
import Purchase          from '../../Containers/purchase.jsx';
import 'Sass/app/_common/mobile-widget.scss';

const ScreenSmall = () => (
    <Collapsible
        position='top'
        is_collapsed
    >
        <ContractType />
        <MobileWidget />
        <AllowEqualsMobile collapsible />
        <div className='purchase-container'>
            <Purchase />
        </div>
    </Collapsible>
);

ScreenSmall.propTypes = {
    is_trade_enabled: PropTypes.bool,
};

export default ScreenSmall;
