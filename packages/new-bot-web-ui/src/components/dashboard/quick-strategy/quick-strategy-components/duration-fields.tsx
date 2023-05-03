import React from 'react';
import classNames from 'classnames';
import { SelectField } from '.';
import { TDropdownItems, TSelectsFieldNames } from '../quick-strategy.types';
import { TDurationFields } from './components.types';
import { isMobile } from '@deriv/shared';

const DurationFields = ({
    id,
    field_name,
    dropdown_list,
    selected_value,
    label,
    select_value,
    className,
    is_able_disabled,
    values,
    selected_trade_type,
    selected_symbol,
    setFieldValue,
    onChangeDropdownItem,
    onHideDropdownList,
    onScrollStopDropdownList,
}: TDurationFields) => {
    const is_mobile = isMobile();
    return id === 'duration-unit' ? (
        <div
            className={classNames('quick-strategy__form-row', {
                'quick-strategy__form-row--multiple': !is_mobile,
            })}
        >
            <SelectField
                field_name={field_name as TSelectsFieldNames}
                id={id}
                is_mobile={is_mobile}
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
};

export default React.memo(DurationFields);
