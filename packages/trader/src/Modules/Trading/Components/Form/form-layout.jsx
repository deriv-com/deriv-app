import PropTypes from 'prop-types';
import React from 'react';
import Loadable from 'react-loadable';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';
import ScreenLarge from './screen-large.jsx';

const ScreenSmall = Loadable({
    loader: () => import(/* webpackChunkName: "screen-small" */ './screen-small.jsx'),
    loading: () => null,
    render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} />;
    },
});

const FormLayout = ({ is_market_closed, is_trade_enabled }) => (
    <React.Fragment>
        <MobileWrapper>
            <ScreenSmall is_trade_enabled={is_trade_enabled} />
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
