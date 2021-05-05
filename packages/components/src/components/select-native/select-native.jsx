import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import Field from '../field/field.jsx';
import Icon from '../icon/icon.jsx';
import Text from '../text/text.jsx';

const getDisplayText = (list_items, value) => {
    const dropdown_items = Array.isArray(list_items) ? list_items : [].concat(...Object.values(list_items));
    const list_obj = dropdown_items.find(item =>
        typeof item.value !== 'string' ? item.value === value : item.value.toLowerCase() === value.toLowerCase()
    );

    if (list_obj) return list_obj.text;
    return '';
};

const SelectNativeOptions = ({ list_items, should_hide_disabled_options, use_text }) => {
    const options = should_hide_disabled_options ? list_items.filter(opt => !opt.disabled) : list_items;

    return options.map(option => (
        <option key={option.value} value={use_text ? option.text : option.value}>
            {option.nativepicker_text || option.text}
        </option>
    ));
};

const SelectNative = ({
    className,
    classNameDisplay,
    disabled,
    error,
    hint,
    hide_selected_value,
    label,
    list_items,
    placeholder,
    should_show_empty_option = true,
    suffix_icon,
    use_text,
    value,
    should_hide_disabled_options,
    ...props
}) => (
    <div
        className={classNames(className, 'dc-select-native', {
            'dc-select-native--disabled': disabled,
            'dc-select-native--error': error,
            'dc-select-native--hide-selected-value': hide_selected_value,
        })}
    >
        <div className='dc-select-native__wrapper'>
            <div
                className={classNames('dc-input', {
                    'dc-input--disabled': disabled,
                    'dc-input--error': error,
                })}
            >
                <div className='dc-select-native__display'>
                    {list_items && value && (
                        <div className={classNames('dc-select-native__display-text', classNameDisplay)}>
                            {!hide_selected_value && (use_text ? value : getDisplayText(list_items, value))}
                        </div>
                    )}
                </div>
                <div
                    className={classNames('dc-select-native__placeholder', {
                        'dc-select-native__placeholder--has-value': value,
                        'dc-select-native__placeholder--disabled': disabled,
                    })}
                >
                    {label}
                </div>
                {!suffix_icon ? (
                    <Icon icon='IcChevronDown' className='dc-select-native__arrow' />
                ) : (
                    <Icon className='dc-select-native__suffix-icon' icon={suffix_icon} size={16} fill />
                )}
                <select
                    id='dt_components_select-native_select-tag'
                    className='dc-select-native__picker'
                    value={value}
                    disabled={disabled}
                    {...props}
                >
                    {Array.isArray(list_items) ? (
                        <React.Fragment>
                            {/*
                             * In native select, first option is selected by default.
                             * Added an empty option to avoid it from selecting first item
                             * from list_items provided
                             */}
                            {should_show_empty_option && <option value=''>{placeholder}</option>}
                            {/*
                             * Safari on ios allows to select a disabled option. So, we should avoid showing it
                             */}
                            <SelectNativeOptions
                                list_items={list_items}
                                should_hide_disabled_options={should_hide_disabled_options}
                                use_text={use_text}
                            />
                        </React.Fragment>
                    ) : (
                        Object.keys(list_items).map(key => {
                            const items = should_hide_disabled_options
                                ? list_items[key].filter(opt => !opt.disabled)
                                : list_items[key];

                            if (items.length > 0) {
                                return (
                                    <optgroup key={key} label={key}>
                                        {/*
                                         * Safari on ios allows to select a disabled option. So, we should avoid showing it
                                         */}
                                        <SelectNativeOptions
                                            list_items={list_items[key]}
                                            should_hide_disabled_options={should_hide_disabled_options}
                                            use_text={use_text}
                                        />
                                    </optgroup>
                                );
                            }

                            return null;
                        })
                    )}
                </select>
                {error && <Field message={error} type='error' />}
            </div>
        </div>
        {!error && hint && (
            <Text
                as='p'
                color='less-prominent'
                size='xxs'
                styles={{ lineHeight: '1.8' }}
                className='dc-select-native__hint'
            >
                {hint}
            </Text>
        )}
    </div>
);

const list_items_shape = PropTypes.oneOfType([
    PropTypes.arrayOf(
        PropTypes.shape({
            disabled: PropTypes.bool,
            nativepicker_text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
            text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        })
    ),
    PropTypes.object,
    PropTypes.array,
]);

SelectNative.propTypes = {
    className: PropTypes.string,
    classNameDisplay: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    hint: PropTypes.string,
    label: PropTypes.string,
    list_items: list_items_shape,
    placeholder: PropTypes.string,
    should_show_empty_option: PropTypes.bool,
    suffix_icon: PropTypes.string,
    use_text: PropTypes.bool,
    value: PropTypes.string,
    should_hide_disabled_options: PropTypes.bool,
};

SelectNative.defaultProps = {
    should_hide_disabled_options: true,
};

export default SelectNative;
