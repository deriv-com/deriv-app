import PropTypes from 'prop-types';
import React     from 'react';
import UILoader  from 'App/Components/Elements/ui-loader.jsx';

const PositionsDrawerComponent = ({ should_load }) => {
    if (should_load) {
        const PositionsDrawerChunk = React.lazy(() => import(/* webpackChunkName: "positions-drawer" */'App/Components/Elements/PositionsDrawer'));
        return (
            <React.Suspense fallback={<UILoader />}>
                <PositionsDrawerChunk />
            </React.Suspense>
        );
    }

    return null;
};

PositionsDrawerComponent.displayName = 'PositionsDrawer';
PositionsDrawerComponent.propTypes = {
    should_load: PropTypes.bool,
};

export default React.memo(PositionsDrawerComponent);
