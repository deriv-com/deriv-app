import React from 'react';
import { SelectField } from '.';
import { TSelectsFieldNames, TDropdownItems } from '../quick-strategy.types';
import { TSelects } from './components.types';
import { isMobile } from '@deriv/shared';

const Selects = ({
    field_name,
    id,
    dropdown_list,
    selected_value,
    label,
    select_value,
    setFieldValue,
    className,
    is_able_disabled,
    values,
    onChangeDropdownItem,
    onHideDropdownList,
    onScrollStopDropdownList,
    selected_trade_type,
    selected_symbol,
    is_input_field,
}: TSelects & { is_input_field: boolean }) =>
    !is_input_field && id !== 'duration-unit' ? (
        <div className='quick-strategy__form-row'>
            <SelectField
                field_name={field_name as TSelectsFieldNames}
                id={id}
                is_mobile={isMobile()}
                dropdown_list={dropdown_list}
                selected_value={selected_value}
                label={label}
                select_value={select_value as TDropdownItems}
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
    ) : (
        <></>
    );

Selects.displayName = 'Selects';

export default React.memo(Selects);
