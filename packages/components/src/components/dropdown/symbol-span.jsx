import classNames                       from 'classnames';
import PropTypes                        from 'prop-types';
import React, { Component }             from 'react';
import { getDisplayText, listPropType } from './dropdown';

class SymbolSpan extends Component {
    render () {
        if (this.props.has_symbol) {
            return (
                <span
                    name={this.props.name}
                    value={this.props.value}
                    className={
                        classNames('symbols', 'dc-dropdown__display-symbol',
                            this.props.className,
                            { [`symbols--${this.props.value.toLowerCase()}`]: this.props.value },
                        )
                    }
                />
            );
        }
        return (
            <span
                name={this.props.name}
                value={this.props.value}
                className={classNames('dc-dropdown__display-text', this.props.className)}
            >
                {getDisplayText(this.props.list, this.props.value)}
            </span>
        );

    }
}

SymbolSpan.propTypes = {
    className : PropTypes.string,
    has_symbol: PropTypes.bool,
    list      : listPropType(),
    name      : PropTypes.string,
    value     : PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
    ]),
};
export default SymbolSpan;
