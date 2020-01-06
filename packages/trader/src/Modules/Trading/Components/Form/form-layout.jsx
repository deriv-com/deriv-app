import PropTypes   from 'prop-types';
import React       from 'react';
import Lazy        from 'App/Containers/Lazy';
import ScreenLarge from './screen-large.jsx';

// Check if device is touch capable
const isTouchDevice = 'ontouchstart' in document.documentElement;

const FormLayout = ({
    is_dark_theme,
    is_market_closed,
    is_mobile,
    is_tablet,
    is_trade_enabled,
}) => (
    (is_mobile || (is_tablet && isTouchDevice)) ?
        <Lazy
            ctor={() => import(/* webpackChunkName: "screen-small" */'./screen-small.jsx')}
            should_load={is_mobile}
            is_trade_enabled={is_trade_enabled}
            is_dark_theme={is_dark_theme}
            
        />
        :
        <ScreenLarge
            is_dark_theme={is_dark_theme}
            is_trade_enabled={is_trade_enabled}
            is_market_closed={is_market_closed}
        />
);

FormLayout.propTypes = {
    is_dark_theme   : PropTypes.bool,
    is_market_closed: PropTypes.bool,
    is_mobile       : PropTypes.bool,
    is_tablet       : PropTypes.bool,
    is_trade_enabled: PropTypes.bool,
};

export default FormLayout;
