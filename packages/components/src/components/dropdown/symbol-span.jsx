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
                    className={`symbols dc-dropdown__display-symbol symbols--${(this.props.value || '').toLowerCase()}`}
                />
            );
        }
        return (
            <span
                name={this.props.name}
                value={this.props.value}
                className='dc-dropdown__display-text'
            >
                {getDisplayText(this.props.list, this.props.value)}
            </span>
        );

    }
}

SymbolSpan.propTypes = {
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
