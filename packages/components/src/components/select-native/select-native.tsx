import classNames from 'classnames';
import React from 'react';
import Field from '../field/field';
import Text from '../text/text';
import Icon from '../icon/icon';

type TSelectNative = {
    className?: string;
    classNameDisplay?: string;
    classNameHint?: string;
    error?: string;
    hint?: string;
    label?: string;
    placeholder?: string;
    should_show_empty_option?: boolean;
    suffix_icon?: string;
    data_testid?: string;
    hide_selected_value?: boolean;
    hide_top_placeholder?: boolean;
    value?: string | number;
    list_items: Array<TListItem> | { [key: string]: Array<TListItem> };
} & Omit<TSelectNativeOptions, 'list_items'> &
    Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value'>; // Default type of value in HTMLSelectElement is only string but here string | number is required

type TSelectNativeOptions = {
    list_items: Array<TListItem>;
    should_hide_disabled_options?: boolean;
    use_text?: boolean;
};

type TListItem = {
    text: string;
    value: string;
    disabled?: boolean;
    nativepicker_text?: React.ReactNode;
    group?: string;
    id?: string;
};

const getDisplayText = (list_items: Array<TListItem> | { [key: string]: Array<TListItem> }, value: string | number) => {
    const dropdown_items = Array.isArray(list_items)
        ? list_items
        : ([] as Array<TListItem>).concat(...Object.values(list_items)); //typecasting since [] is inferred to be type never[]
    const list_obj = dropdown_items.find(item =>
        typeof item.value !== 'string'
            ? item.value === value
            : item.value.toLowerCase() === (value as string).toLowerCase()
    );

    if (list_obj) return list_obj.text;
    return '';
};

const SelectNativeOptions = ({ list_items, should_hide_disabled_options, use_text }: TSelectNativeOptions) => {
    const options = should_hide_disabled_options ? list_items.filter(opt => !opt.disabled) : list_items;
    const has_group = Array.isArray(list_items) && !!list_items[0]?.group;

    if (has_group) {
        const dropdown_items = options.reduce((dropdown_map: { [key: string]: Array<TListItem> }, item) => {
            if (item.group) {
                const index = item.group;
                dropdown_map[index] = dropdown_map[index] || [];
                dropdown_map[index].push(item);
            }
            return dropdown_map;
        }, {});
        const group_names = Object.keys(dropdown_items);
        return (
            <React.Fragment>
                {group_names.map(option => (
                    <optgroup key={option} label={option}>
                        {dropdown_items[option].map((value: TListItem) => (
                            <option key={value.value} value={use_text ? value.text : value.value}>
                                {value.nativepicker_text || value.text}
                            </option>
                        ))}
                    </optgroup>
                ))}
            </React.Fragment>
        );
    }
    return (
        <React.Fragment>
            {options.map(option => (
                <option key={option.id || option.value} value={use_text ? option.text : option.value}>
                    {option.nativepicker_text || option.text}
                </option>
            ))}
        </React.Fragment>
    );
};

const SelectNative = ({
    className,
    classNameDisplay,
    classNameHint,
    disabled,
    error,
    hide_selected_value,
    hint,
    label,
    list_items,
    placeholder,
    should_hide_disabled_options = true,
    should_show_empty_option = true,
    suffix_icon,
    use_text,
    value,
    data_testid,
    hide_top_placeholder = false,
    ...props
}: TSelectNative) => (
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
                <div
                    className={classNames('dc-select-native__container', {
                        'dc-select-native__container--error': error,
                        'dc-select-native__container--disabled': disabled,
                    })}
                >
                    <div className='dc-select-native__display'>
                        {list_items && value && (
                            <div
                                className={classNames('dc-select-native__display-text', classNameDisplay)}
                                data-testid='selected_value'
                            >
                                {!hide_selected_value && (use_text ? value : getDisplayText(list_items, value))}
                            </div>
                        )}
                    </div>
                    <div
                        className={classNames('dc-select-native__placeholder', {
                            'dc-select-native__placeholder--has-value': value,
                            'dc-select-native__placeholder--hide-top-placeholder': value && hide_top_placeholder,
                            'dc-select-native__placeholder--disabled': disabled,
                        })}
                    >
                        {label}
                    </div>
                    {!suffix_icon ? (
                        <Icon icon='IcChevronDown' className='dc-select-native__arrow' />
                    ) : (
                        <Icon className='dc-select-native__suffix-icon' icon={suffix_icon} />
                    )}
                    <select
                        className='dc-select-native__picker'
                        value={value}
                        disabled={disabled}
                        data-testid={data_testid}
                        {...props}
                        id='dt_components_select-native_select-tag'
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
                                    use_text={use_text && label !== 'Code*'}
                                />
                            </React.Fragment>
                        ) : (
                            Object.keys(list_items).map((key: string) => {
                                const items = should_hide_disabled_options
                                    ? list_items[key].filter((opt: TListItem) => !opt.disabled)
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
                </div>
                {error && <Field message={error} type='error' />}
            </div>
        </div>
        {!error && hint && (
            <Text
                as='p'
                color='less-prominent'
                size='xxs'
                line_height='l'
                className={classNames('dc-select-native__hint', classNameHint)}
            >
                {hint}
            </Text>
        )}
    </div>
);

export default SelectNative;
