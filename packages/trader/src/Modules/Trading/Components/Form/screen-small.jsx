import PropTypes    from 'prop-types';
import React        from 'react';
import MobileWidget from '../Elements/mobile-widget.jsx';
import ContractType from '../../Containers/contract-type.jsx';
import Purchase     from '../../Containers/purchase.jsx';
import 'Sass/app/_common/mobile-widget.scss';

const ScreenSmall = (/* { is_trade_enabled } */) => (
    <React.Fragment>
        <ContractType />
        <div className='mobile-only'>
            <MobileWidget />
        </div>
        <div className='purchase-container'>
            <Purchase />
        </div>
    </React.Fragment>
);

ScreenSmall.propTypes = {
    is_trade_enabled: PropTypes.bool,
};

export default ScreenSmall;
