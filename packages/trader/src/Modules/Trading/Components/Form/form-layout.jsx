import PropTypes from 'prop-types';
import React from 'react';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';
import Lazy from 'App/Containers/Lazy';
import ScreenLarge from './screen-large.jsx';

const FormLayout = ({ is_market_closed, is_trade_enabled }) => (
    <React.Fragment>
        <MobileWrapper>
            <Lazy
                ctor={() => import(/* webpackChunkName: "screen-small" */ './screen-small.jsx')}
                should_load={true}
                is_trade_enabled={is_trade_enabled}
            />
        </MobileWrapper>
        <DesktopWrapper>
            <ScreenLarge is_trade_enabled={is_trade_enabled} is_market_closed={is_market_closed} />
        </DesktopWrapper>
    </React.Fragment>
);

FormLayout.propTypes = {
    is_market_closed: PropTypes.bool,
    is_trade_enabled: PropTypes.bool,
};

export default React.memo(FormLayout);
