import React, { Component } from 'react';
import UILoader             from 'App/Components/Elements/ui-loader.jsx';

class Lazy extends Component {
    render() {
        if (!this.props.should_load) {
            return null;
        }
        const LazyLoadedComponent = React.lazy(this.props.ctor);
        LazyLoadedComponent.displayName = this.props.is || 'LazyLoadedComponent';
        return (
            <React.Suspense fallback={this.props.has_progress ? <UILoader /> : <div />}>
                <LazyLoadedComponent {...this.props} />
            </React.Suspense>
        );
    }
}

export default Lazy;
