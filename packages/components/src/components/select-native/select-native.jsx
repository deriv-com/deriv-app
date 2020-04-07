import classNames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FieldError from 'Components/field-error';
import Icon from 'Components/icon/icon.jsx';

class SelectNative extends Component {
    getDisplayText = value => {
        const { list_items } = this.props;
        const dropdown_items = Array.isArray(list_items) ? list_items : [].concat(...Object.values(list_items));
        const list_obj = dropdown_items.find(item => item.value.toLowerCase() === value.toLowerCase());

        if (list_obj) return list_obj.text;
        return '';
    };
    render() {
        const { className, list_items, value, label, use_text, error, hint, ...props } = this.props;
        return (
            <div className='dc-select-native-wrapper'>
                <div
                    className={classNames('dc-input', {
                        'dc-input--error': this.props.error,
                    })}
                >
                    <div
                        className={classNames(className, 'dc-select-native', {
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
                            {Array.isArray(list_items)
                                ? list_items.map((option, idx) => (
                                      <option key={idx} value={use_text ? option.text : option.value}>
                                          {option.nativepicker_text || option.text}
                                      </option>
                                  ))
                                : Object.keys(list_items).map(key => (
                                      <optgroup key={key} label={key}>
                                          {list_items[key].map((option, idx) => (
                                              <option
                                                  key={idx}
                                                  value={use_text ? option.text : option.value}
                                                  disabled={option.disabled}
                                              >
                                                  {option.nativepicker_text || option.text}
                                              </option>
                                          ))}
                                      </optgroup>
                                  ))}
                        </select>
                    </div>
                    {error && <FieldError message={error} />}
                </div>
                {!error && hint && <p className='dc-select-native__hint'>{hint}</p>}
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
