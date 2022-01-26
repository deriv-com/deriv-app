import React from 'react';
import { connect } from 'Stores/connect';
import ErrorComponent from './index';

type ErrorBoundaryProps = {
    root_store: unknown;
};

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch = (error, info) => {
        if (window.TrackJS) window.TrackJS.console.log(this.props.root_store);

        this.setState({
            hasError: true,
            error,
            info,
        });
    };

    render = () => (this.state.hasError ? <ErrorComponent should_show_refresh={true} /> : this.props.children);
}

export default connect(store => ({
    root_store: store,
}))(ErrorBoundary);
