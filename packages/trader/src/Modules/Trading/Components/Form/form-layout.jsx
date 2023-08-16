import PropTypes from 'prop-types';
import React from 'react';
import Loadable from 'react-loadable';
import { isMobile } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';

const Screen = Loadable({
    loader: () =>
        isMobile()
            ? import(/* webpackChunkName: "screen-small" */ './screen-small.jsx')
            : import(/* webpackChunkName: "screen-large" */ './screen-large.jsx'),
    loading: () => null,
    render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} />;
    },
});

const FormLayout = observer(({ is_market_closed, is_trade_enabled }) => {
    const { common } = useStore();
    const { current_language } = common;
    return (
        <React.Fragment key={current_language}>
            <Screen is_trade_enabled={is_trade_enabled} is_market_closed={isMobile() ? undefined : is_market_closed} />
        </React.Fragment>
    );
});

FormLayout.propTypes = {
    is_market_closed: PropTypes.bool,
    is_trade_enabled: PropTypes.bool,
};

export default React.memo(FormLayout);
