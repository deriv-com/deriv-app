import PropTypes from 'prop-types';
import React     from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch = (error, info) => {
        window.__response_error = JSON.parse(JSON.stringify(this.props.root_store)); // eslint-disable-line
        this.setState({
            hasError: true,
            error,
            info,
        });
    };

    render = () => this.state.hasError ? (
        <div className='error-box'>
            {this.state.error.message}
        </div>
    ) : this.props.children;
}

ErrorBoundary.propTypes = {
    root_store: PropTypes.object,
};
