import React from 'react';
import classNames from 'classnames';
import { SelectField, InputField, data_fields, data_uniq_input_obj } from '.';
import { TDataFields } from './data/data-fields';
import {
    TSelectsFieldNames,
    TDropdownItems,
    TInputBaseFields,
    TInputsFieldNames,
    TDropdowns,
    TSelectedValuesSelect,
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
        errors,
    }: TQStrategyFields) => {
        const tempIsDoubleIdxRef: React.MutableRefObject<number | undefined> = React.useRef();

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

                    const d_types_strategies = name?.endsWith('types-strategies') ? types_strategies_dropdown : '';
                    const d_symbol = name?.endsWith('symbol') ? symbol_dropdown : '';
                    const d_trade_type = name?.endsWith('trade-type') ? trade_type_dropdown : '';
                    const d_duration_unit = name?.endsWith('duration-unit') ? duration_unit_dropdown : '';

                    const dropdowns: TDropdowns = d_types_strategies || d_symbol || d_trade_type || d_duration_unit;
                    const getDropdownList: TDropdowns = !isUniqStrategyField ? dropdowns : '';

                    const s_type_strategy = name?.endsWith('types-strategies') ? selected_type_strategy : '';
                    const s_symbol = name?.endsWith('symbol') ? selected_symbol : '';
                    const s_trade_type = name?.endsWith('trade-type') ? selected_trade_type : '';
                    const s_duration_unit = name?.endsWith('duration-unit') ? selected_duration_unit : '';

                    const selected_items = s_type_strategy || s_symbol || s_trade_type || s_duration_unit;

                    const getSelectedValue: TSelectedValuesSelect = !isUniqStrategyField ? selected_items : '';

                    const isBaseField = !isUniqStrategyField && name.startsWith('base__');
                    const isCurrentStrategyFields = isBaseField || isUniqStrategyField;

                    const isDurationUnitField = !isUniqStrategyField && name.endsWith('duration-unit');
                    const isDurationValueField = !isUniqStrategyField && name.endsWith('duration-value');
                    if (tempIsDoubleIdxRef.current === idx || isDurationValueField) {
                        return false;
                    }

                    if (isCurrentStrategyFields && isInputField) {
                        tempIsDoubleIdxRef.current = idx + 1;
                    }

                    if (isCurrentStrategyFields) {
                        if (isDurationUnitField) {
                            return (
                                <div
                                    key={idx}
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
                                        errors={errors}
                                    />
                                </div>
                            );
                        } else if (isInputField) {
                            return (
                                <div
                                    key={idx}
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
                                        errors={errors}
                                    />
                                    <InputField
                                        idx={idx}
                                        handleChange={handleChange}
                                        onChangeInputValue={onChangeInputValue}
                                        setCurrentFocus={setCurrentFocus}
                                        is_mobile={is_mobile}
                                        errors={errors}
                                    />
                                </div>
                            );
                        }
                        return (
                            <div key={idx}>
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
                                    <div key='description' className='quick-strategy__description'>
                                        {description}
                                    </div>
                                )}
                            </div>
                        );
                    }
                    return false;
                }),
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [
                types_strategies_dropdown,
                symbol_dropdown,
                trade_type_dropdown,
                duration_unit_dropdown,
                selected_type_strategy,
                selected_trade_type,
                selected_symbol,
                selected_duration_unit,
                errors,
            ]
        );

        return <>{fields}</>;
    },
    (prevProps, nextProps) => prevProps.values === nextProps.values && prevProps.errors === nextProps.errors
);

QStrategyFields.displayName = 'QStrategyFields';

export default QStrategyFields;
