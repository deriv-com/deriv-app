import React, { Component } from 'react';

class Lazy extends Component {
    render() {
        if (!this.props.should_load) {
            return null;
        }
        const LazyLoadedComponent = React.lazy(this.props.ctor);
        LazyLoadedComponent.displayName = this.props.is || 'LazyLoadedComponent';
        return <LazyLoadedComponent {...this.props} />;
    }
}

export default Lazy;
