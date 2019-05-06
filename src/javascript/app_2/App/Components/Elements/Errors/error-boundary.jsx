import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch = (error, info) => {
        this.setState({
            hasError: true,
            error,
            info,
        });
    }

    render = () => this.state.hasError ?
        (
            <div className='error-box'>
                {this.state.error.message}
            </div>
        ) : this.props.children
}
