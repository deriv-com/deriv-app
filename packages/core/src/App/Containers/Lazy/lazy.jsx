import PropTypes from 'prop-types';
import React     from 'react';
import UILoader  from 'App/Components/Elements/ui-loader.jsx';

class Lazy extends React.PureComponent {
    render() {
        const {
            should_load = true,
            ctor,
            has_progress,
            ...component_props
        } = this.props;

        if (!should_load) {
            return null;
        }

        const LazyLoadedComponent = React.lazy(ctor);

        return (
            <React.Suspense fallback={has_progress ? <UILoader /> : <div />}>
                <LazyLoadedComponent {...component_props} />
            </React.Suspense>
        );
    }
}

// Lazy Load the component by default.
Lazy.defaultProps = {
    should_load : true,
    has_progress: false,
};

Lazy.propTypes = {
    ctor        : PropTypes.func.isRequired,
    has_progress: PropTypes.bool,
    should_load : PropTypes.bool,
};

export default Lazy;
