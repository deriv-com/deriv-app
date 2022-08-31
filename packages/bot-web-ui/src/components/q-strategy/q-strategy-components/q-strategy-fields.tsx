import { Field } from 'formik';
import React from 'react';
import { Icon, Input, Popover } from '@deriv/components';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import { data_fields, SelectField } from '.';

const QStrategyFields = ({
    is_mobile,
    types_strategies_dropdown,
    symbol_dropdown,
    trade_type_dropdown,
    duration_unit_dropdown,
    selected_type_strategy,
    selected_trade_type,
    selected_symbol,
    selected_duration_unit,
    onChangeDropdownItem,
    onHideDropdownList,
    setFieldValue,
    onScrollStopDropdownList,
    handleChange,
    onChangeInputValue,
    setCurrentFocus,
    values,
    description,
    getFieldMap,
}: any) => {
    let tempIsDoubleIdx: number;

    const fields = data_fields.map((item, idx) => {
        const {
            index,
            id,
            name,
            field_name,
            className,
            label_className,
            field_className,
            input_value,
            label,
            placeholder,
            trailing_icon_message,
            zIndex,
            is_able_disabled,
        } = item;

        const isInputField = input_value.startsWith('input_');

        const getDropdownList = name.endsWith('types-strategies')
            ? types_strategies_dropdown
            : name.endsWith('symbol')
            ? symbol_dropdown
            : name.endsWith('trade-type')
            ? trade_type_dropdown
            : name.endsWith('duration-unit')
            ? duration_unit_dropdown
            : '';

        const getSelectedValue = name.endsWith('types-strategies')
            ? selected_type_strategy
            : name.endsWith('symbol')
            ? selected_symbol
            : name.endsWith('trade-type')
            ? selected_trade_type
            : name.endsWith('duration-unit')
            ? selected_duration_unit
            : '';

        const isBaseField = name.startsWith('base__');
        const isUniqStrategyField = index === selected_type_strategy.index;
        const isCurrentStrategyFields = isBaseField || isUniqStrategyField;

        const isDurationUnitField = name.endsWith('duration-unit');
        const isDurationValueField = name.endsWith('duration-value');
        const isProfitField = name.endsWith('profit');
        if (tempIsDoubleIdx === idx || isDurationValueField || isProfitField) return;

        if (isCurrentStrategyFields && isInputField) {
            tempIsDoubleIdx = idx + 1;
        }

        /* eslint consistent-return: off */
        return isCurrentStrategyFields ? (
            isDurationUnitField ? (
                <div
                    className={classNames('quick-strategy__form-row', {
                        'quick-strategy__form-row--multiple': !is_mobile,
                    })}
                >
                    <SelectField
                        field_name={field_name}
                        id={id}
                        is_mobile={is_mobile}
                        getDropdownList={getDropdownList}
                        getSelectedValue={getSelectedValue}
                        label={label}
                        input_value={input_value}
                        setFieldValue={setFieldValue}
                        className={className}
                        is_able_disabled={is_able_disabled}
                        values={values}
                        onChangeDropdownItem={onChangeDropdownItem}
                        onHideDropdownList={onHideDropdownList}
                        onScrollStopDropdownList={onScrollStopDropdownList}
                        selected_trade_type={selected_trade_type}
                        selected_symbol={selected_symbol}
                    />
                    <Field name={data_fields[4]?.field_name} key={data_fields[4]?.id}>
                        {({ field }) => {
                            return (
                                <Input
                                    {...field}
                                    className={data_fields[4]?.className}
                                    label_className={data_fields[4]?.label_className}
                                    field_className={data_fields[4]?.field_className}
                                    type='text'
                                    label={localize(data_fields[4]?.label)}
                                    onChange={e => {
                                        handleChange(e);
                                        onChangeInputValue(data_fields[4]?.input_value, e);
                                    }}
                                    onFocus={e => setCurrentFocus(e.currentTarget.name)}
                                    onBlur={() => setCurrentFocus(null)}
                                    placeholder={data_fields[4]?.placeholder}
                                    trailing_icon={
                                        <Popover
                                            alignment={is_mobile ? 'top' : 'bottom'}
                                            message={localize(data_fields[4]?.trailing_icon_message)}
                                            zIndex={data_fields[4]?.zIndex}
                                        >
                                            <Icon icon='IcInfoOutline' />
                                        </Popover>
                                    }
                                />
                            );
                        }}
                    </Field>
                </div>
            ) : isInputField && !isDurationValueField ? (
                <div
                    className={classNames('quick-strategy__form-row', {
                        'quick-strategy__form-row--multiple': !is_mobile,
                    })}
                >
                    <Field name={field_name} key={id}>
                        {({ field }) => {
                            return (
                                <Input
                                    {...field}
                                    className={className}
                                    label_className={label_className}
                                    field_className={field_className}
                                    type='text'
                                    label={localize(label)}
                                    onChange={e => {
                                        handleChange(e);
                                        onChangeInputValue(input_value, e);
                                    }}
                                    onFocus={e => setCurrentFocus(e.currentTarget.name)}
                                    onBlur={() => setCurrentFocus(null)}
                                    placeholder={placeholder}
                                    trailing_icon={
                                        <Popover
                                            alignment={is_mobile ? 'top' : 'bottom'}
                                            message={localize(trailing_icon_message)}
                                            zIndex={zIndex}
                                        >
                                            <Icon icon='IcInfoOutline' />
                                        </Popover>
                                    }
                                />
                            );
                        }}
                    </Field>
                    <Field
                        name={isUniqStrategyField ? data_fields[10]?.field_name : data_fields[idx + 1]?.field_name}
                        key={isUniqStrategyField ? data_fields[10]?.id : data_fields[idx + 1]?.id}
                    >
                        {({ field }) => {
                            return (
                                <Input
                                    {...field}
                                    className={
                                        isUniqStrategyField
                                            ? data_fields[10]?.className
                                            : data_fields[idx + 1]?.className
                                    }
                                    label_className={
                                        isUniqStrategyField
                                            ? data_fields[10]?.label_className
                                            : data_fields[idx + 1]?.label_className
                                    }
                                    field_className={
                                        isUniqStrategyField
                                            ? data_fields[10]?.field_className
                                            : data_fields[idx + 1]?.field_className
                                    }
                                    type='text'
                                    label={localize(
                                        isUniqStrategyField ? data_fields[10]?.label : data_fields[idx + 1]?.label
                                    )}
                                    onChange={e => {
                                        handleChange(e);
                                        onChangeInputValue(
                                            isUniqStrategyField
                                                ? data_fields[10]?.input_value
                                                : data_fields[idx + 1]?.input_value,
                                            e
                                        );
                                    }}
                                    onFocus={e => setCurrentFocus(e.currentTarget.name)}
                                    onBlur={() => setCurrentFocus(null)}
                                    placeholder={
                                        isUniqStrategyField
                                            ? data_fields[10]?.placeholder
                                            : data_fields[idx + 1]?.placeholder
                                    }
                                    trailing_icon={
                                        <Popover
                                            alignment={is_mobile ? 'top' : 'bottom'}
                                            message={localize(
                                                isUniqStrategyField
                                                    ? data_fields[10]?.trailing_icon_message
                                                    : data_fields[idx + 1]?.trailing_icon_message
                                            )}
                                            zIndex={
                                                isUniqStrategyField
                                                    ? data_fields[10]?.zIndex
                                                    : data_fields[idx + 1]?.zIndex
                                            }
                                        >
                                            <Icon icon='IcInfoOutline' />
                                        </Popover>
                                    }
                                />
                            );
                        }}
                    </Field>
                </div>
            ) : (
                !isDurationValueField && (
                    <>
                        <div className='quick-strategy__form-row'>
                            <SelectField
                                field_name={field_name}
                                id={id}
                                is_mobile={is_mobile}
                                getDropdownList={getDropdownList}
                                getSelectedValue={getSelectedValue}
                                label={label}
                                input_value={input_value}
                                setFieldValue={setFieldValue}
                                className={className}
                                is_able_disabled={is_able_disabled}
                                values={values}
                                onChangeDropdownItem={onChangeDropdownItem}
                                onHideDropdownList={onHideDropdownList}
                                onScrollStopDropdownList={onScrollStopDropdownList}
                                selected_trade_type={selected_trade_type}
                                selected_symbol={selected_symbol}
                            />
                        </div>
                        {name.endsWith('types-strategies') && (
                            <div className='q-strategy__description'>{description}</div>
                        )}
                    </>
                )
            )
        ) : (
            <></>
        );
    });

    return <>{fields}</>;
};

export default QStrategyFields;
