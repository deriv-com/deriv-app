import PropTypes from 'prop-types';
import React     from 'react';
import UILoader  from 'App/Components/Elements/ui-loader.jsx';

const Lazy = (props) => {
    if (!props.should_load) {
        return null;
    }
    const LazyLoadedComponent       = React.lazy(props.ctor);
    LazyLoadedComponent.displayName = props.is || 'LazyLoadedComponent';
    return (
        <React.Suspense fallback={props.has_progress ? <UILoader /> : <div />}>
            <LazyLoadedComponent {...props} />
        </React.Suspense>
    );
};

Lazy.propTypes = {
    ctor        : PropTypes.func.isRequired,
    has_progress: PropTypes.bool,
    should_load : PropTypes.bool,
};

export default Lazy;
