import classNames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FieldError from 'Components/field-error';
import Icon from 'Components/icon/icon.jsx';

class SelectNative extends Component {
    getDisplayText = value => {
        const list_obj = this.props.list_items.find(item => item.value.toLowerCase() === value.toLowerCase());

        if (list_obj) return list_obj.text;
        return '';
    };
    render() {
        const { list_items, value, label, use_text, error, ...props } = this.props;
        return (
            <div
                className={classNames('dc-input', {
                    'dc-input--error': this.props.error,
                })}
            >
                <div
                    className={classNames('dc-select-native', {
                        'dc-select-native--disabled': this.props.disabled,
                        'dc-select-native--error': this.props.error,
                    })}
                >
                    <div className='dc-select-native__display'>
                        {list_items && value && (
                            <span className='dc-select-native__display-text'>
                                {use_text ? value : this.getDisplayText(value)}
                            </span>
                        )}
                    </div>
                    <div
                        className={classNames('dc-select-native__placeholder', {
                            'dc-select-native__placeholder--has-value': value,
                        })}
                    >
                        {label}
                    </div>
                    <Icon icon='IcChevronDown' className='dc-select-native__arrow' />
                    <select className='dc-select-native__picker' value={value} {...props}>
                        {list_items.map((option, idx) => (
                            <option key={idx} value={use_text ? option.text : option.value}>
                                {option.text}
                            </option>
                        ))}
                    </select>
                </div>
                {error && <FieldError message={error} />}
            </div>
        );
    }
}

SelectNative.props = {
    className: PropTypes.string,
    list_items: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.arrayOf(
            PropTypes.shape({
                text: PropTypes.string.isRequired,
                value: PropTypes.string.isRequired,
            })
        ),
    ]),
    value: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func,
};

export default SelectNative;
