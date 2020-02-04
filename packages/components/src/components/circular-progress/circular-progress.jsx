import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

class ProgressRing extends React.Component {
    constructor(props) {
        super(props);

        const { radius, stroke } = this.props;
        this.normalizedRadius = radius - stroke * 2;
        this.circumference = this.normalizedRadius * 2 * Math.PI;
    }

    render() {
        const { radius, stroke, progress } = this.props;
        const strokeDashoffset = this.circumference - (progress / 100) * this.circumference;

        return (
            <svg height={radius * 2} width={radius * 2}>
                <circle
                    stroke='red'
                    fill='transparent'
                    strokeWidth={stroke}
                    strokeDasharray={this.circumference + ' ' + this.circumference}
                    style={{ strokeDashoffset }}
                    stroke-width={stroke}
                    r={this.normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>
        );
    }
}
