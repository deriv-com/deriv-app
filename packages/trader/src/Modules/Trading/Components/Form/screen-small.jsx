import PropTypes             from 'prop-types';
import React                 from 'react';
import { TradeParamsLoader } from 'App/Components/Elements/ContentLoader';
import MobileWidget          from '../Elements/mobile-widget.jsx';
import ContractType          from '../../Containers/contract-type.jsx';
import Purchase              from '../../Containers/purchase.jsx';
import                            'Sass/app/_common/mobile-widget.scss';

const ScreenSmall = ({ is_dark_theme, is_trade_enabled }) => (
    !is_trade_enabled ?
        <TradeParamsLoader
            is_dark_theme={is_dark_theme}
            is_mobile
            speed={2}
        />
        :
        <React.Fragment>
            <ContractType />
            <div className='mobile-only'>
                <MobileWidget />
            </div>
            <div className='purchase-container purchase-container--is-mobile'>
                <Purchase />
            </div>
        </React.Fragment>
);

ScreenSmall.propTypes = {
    is_dark_theme   : PropTypes.bool,
    is_trade_enabled: PropTypes.bool,
};

export default ScreenSmall;
