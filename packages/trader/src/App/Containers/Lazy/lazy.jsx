import PropTypes from 'prop-types';
import React     from 'react';
import UILoader  from 'App/Components/Elements/ui-loader.jsx';

const Lazy = ({ should_load = true, ctor, is, has_progress, ...component_props }) => {
    if (!should_load) {
        return null;
    }
    const LazyLoadedComponent       = React.lazy(ctor);
    LazyLoadedComponent.displayName = is;
    return (
        <React.Suspense fallback={has_progress ? <UILoader /> : <div />}>
            <LazyLoadedComponent {...component_props} />
        </React.Suspense>
    );
};

// Lazy Load the component by default.
Lazy.defaultProps = {
    should_load : true,
    has_progress: false,
    is          : 'UnknownLazyLoadedComponent',
};

Lazy.propTypes = {
    ctor        : PropTypes.func.isRequired,
    has_progress: PropTypes.bool,
    should_load : PropTypes.bool,
};

export default Lazy;
