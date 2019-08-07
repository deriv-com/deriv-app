import PropTypes   from 'prop-types';
import React       from 'react';
import Lazy        from 'App/Containers/Lazy';
import ScreenLarge from './screen-large.jsx';

const FormLayout = ({
    is_contract_visible,
    is_blurred,
    is_mobile,
    is_trade_enabled,
}) => (
    is_mobile ?
        <Lazy
            ctor={() => import(/* webpackChunkName: "screen-small" */'./screen-small.jsx')}
            should_load={is_mobile}
            is_trade_enabled={is_trade_enabled}
        />
        :
        <ScreenLarge
            is_contract_visible={is_contract_visible}
            is_trade_enabled={is_trade_enabled}
            is_blurred={is_blurred}
        />
);

FormLayout.propTypes = {
    is_blurred         : PropTypes.bool,
    is_contract_visible: PropTypes.bool,
    is_mobile          : PropTypes.bool,
    is_trade_enabled   : PropTypes.bool,
};

export default FormLayout;
