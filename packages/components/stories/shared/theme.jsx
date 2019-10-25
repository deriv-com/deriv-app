import React, { Component } from 'react';

class Theme extends Component {
    render () {
        return (
            <div
                className={this.props.is_dark ? 'theme--dark' : 'theme--light'}
                style={{
                    width: this.props.max_width ? `${this.props.max_width}px` : '100%',
                    background: 'var(--general-main-1)',
                }}
            >
                {this.props.children}
            </div>
        );
    }
}

export default Theme;
