import React from 'react';
import classNames from 'classnames';
import { SelectField, InputField, data_fields, data_uniq_input_obj } from '.';
import { TDataFields } from './data/data-fields';
import {
    TDropdowns,
    TSelectedValuesSelect,
    TSelectsFieldNames,
    TDropdownItems,
    TInputBaseFields,
    TInputsFieldNames,
} from '../q-strategy.types';
import { TQStrategyFields } from './q-strategy-components.types';

const QStrategyFields = React.memo(
    ({
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
    }: TQStrategyFields) => {
        let tempIsDoubleIdx: number;

        const uniq_selected_input = React.useMemo(
            () => data_uniq_input_obj.filter(elem => elem.index === selected_type_strategy.index)[0],
            [selected_type_strategy]
        );

        const fields = React.useMemo(
            () =>
                data_fields.map((item, idx) => {
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
                    } = item as TDataFields;

                    const isUniqStrategyField = Array.isArray(item);

                    const isInputField = isUniqStrategyField || input_value.startsWith('input_');

                    const getDropdownList: TDropdowns = !isUniqStrategyField
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

                    const getSelectedValue: TSelectedValuesSelect = !isUniqStrategyField
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
                                    field_name={field_name as TSelectsFieldNames}
                                    id={id}
                                    is_mobile={is_mobile}
                                    getDropdownList={getDropdownList}
                                    getSelectedValue={getSelectedValue}
                                    label={label}
                                    input_value={input_value as TDropdownItems}
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
                                <InputField
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
                                <InputField
                                    idx={idx}
                                    handleChange={handleChange}
                                    onChangeInputValue={onChangeInputValue}
                                    setCurrentFocus={setCurrentFocus}
                                    is_mobile={is_mobile}
                                    field_name={field_name as TInputsFieldNames}
                                    id={id}
                                    className={className}
                                    label_className={label_className}
                                    field_className={field_className}
                                    label={label}
                                    input_value={input_value as TInputBaseFields}
                                    placeholder={placeholder}
                                    isUniqStrategyField={isUniqStrategyField}
                                    trailing_icon_message={trailing_icon_message}
                                    zIndex={zIndex}
                                    uniq_selected_input={uniq_selected_input}
                                />
                                <InputField
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
                                            field_name={field_name as TSelectsFieldNames}
                                            id={id}
                                            is_mobile={is_mobile}
                                            getDropdownList={getDropdownList}
                                            getSelectedValue={getSelectedValue}
                                            label={label}
                                            input_value={input_value as TDropdownItems}
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
                                        <div className='quick-strategy__description'>{description}</div>
                                    )}
                                </>
                            )
                        )
                    ) : (
                        <></>
                    );
                }),
            [
                data_fields,
                types_strategies_dropdown,
                symbol_dropdown,
                trade_type_dropdown,
                duration_unit_dropdown,
                selected_type_strategy,
                selected_trade_type,
                selected_symbol,
                selected_duration_unit,
            ]
        );

        return <>{fields}</>;
    },
    (prevProps, nextProps) => {
        return prevProps.values === nextProps.values;
    }
);

QStrategyFields.displayName = 'QStrategyFields';

export default QStrategyFields;
