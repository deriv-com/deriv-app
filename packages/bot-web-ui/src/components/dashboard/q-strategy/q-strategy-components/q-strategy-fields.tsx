import { Field } from 'formik';
import React from 'react';
import { Icon, Input, Popover } from '@deriv/components';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import { SelectField, SecondInputField, data_fields, data_uniq_input_obj } from '.';

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

    const uniq_selected_input = data_uniq_input_obj.filter(elem => elem.index === selected_type_strategy.index)[0];

    const fields = data_fields.map((item, idx) => {
        const {
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

        const isUniqStrategyField = Array.isArray(item);

        const isInputField = isUniqStrategyField || input_value.startsWith('input_');

        const getDropdownList = !isUniqStrategyField
            ? name.endsWith('types-strategies')
                ? types_strategies_dropdown
                : name.endsWith('symbol')
                ? symbol_dropdown
                : name.endsWith('trade-type')
                ? trade_type_dropdown
                : name.endsWith('duration-unit')
                ? duration_unit_dropdown
                : ''
            : '';

        const getSelectedValue = !isUniqStrategyField
            ? name.endsWith('types-strategies')
                ? selected_type_strategy
                : name.endsWith('symbol')
                ? selected_symbol
                : name.endsWith('trade-type')
                ? selected_trade_type
                : name.endsWith('duration-unit')
                ? selected_duration_unit
                : ''
            : '';

        const isBaseField = !isUniqStrategyField && name.startsWith('base__');
        const isCurrentStrategyFields = isBaseField || isUniqStrategyField;

        const isDurationUnitField = !isUniqStrategyField && name.endsWith('duration-unit');
        const isDurationValueField = !isUniqStrategyField && name.endsWith('duration-value');
        if (tempIsDoubleIdx === idx || isDurationValueField) return;

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
                    <SecondInputField
                        idx={idx}
                        handleChange={handleChange}
                        onChangeInputValue={onChangeInputValue}
                        setCurrentFocus={setCurrentFocus}
                        is_mobile={is_mobile}
                    />
                </div>
            ) : isInputField && !isDurationValueField ? (
                <div
                    className={classNames('quick-strategy__form-row', {
                        'quick-strategy__form-row--multiple': !is_mobile,
                    })}
                >
                    <Field
                        name={isUniqStrategyField ? uniq_selected_input.field_name : field_name}
                        key={isUniqStrategyField ? uniq_selected_input.id : id}
                    >
                        {({ field }) => {
                            return (
                                <Input
                                    {...field}
                                    className={isUniqStrategyField ? uniq_selected_input.className : className}
                                    label_className={
                                        isUniqStrategyField ? uniq_selected_input.label_className : label_className
                                    }
                                    field_className={
                                        isUniqStrategyField ? uniq_selected_input.field_className : field_className
                                    }
                                    type='text'
                                    label={localize(isUniqStrategyField ? uniq_selected_input.label : label)}
                                    onChange={e => {
                                        handleChange(e);
                                        onChangeInputValue(
                                            isUniqStrategyField ? uniq_selected_input.input_value : input_value,
                                            e
                                        );
                                    }}
                                    onFocus={e => setCurrentFocus(e.currentTarget.name)}
                                    onBlur={() => setCurrentFocus(null)}
                                    placeholder={isUniqStrategyField ? uniq_selected_input.placeholder : placeholder}
                                    trailing_icon={
                                        <Popover
                                            alignment={is_mobile ? 'top' : 'bottom'}
                                            message={localize(
                                                isUniqStrategyField
                                                    ? uniq_selected_input.trailing_icon_message
                                                    : trailing_icon_message
                                            )}
                                            zIndex={isUniqStrategyField ? uniq_selected_input.zIndex : zIndex}
                                        >
                                            <Icon icon='IcInfoOutline' />
                                        </Popover>
                                    }
                                />
                            );
                        }}
                    </Field>
                    <SecondInputField
                        idx={idx}
                        handleChange={handleChange}
                        onChangeInputValue={onChangeInputValue}
                        setCurrentFocus={setCurrentFocus}
                        is_mobile={is_mobile}
                    />
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
