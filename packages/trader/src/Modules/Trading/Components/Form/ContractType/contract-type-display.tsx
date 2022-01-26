import classNames from 'classnames';
import React from 'react';
import { Icon, DesktopWrapper } from '@deriv/components';
import IconTradeCategory from 'Assets/Trading/Categories/icon-trade-categories.jsx';
import { findContractCategory } from '../../../Helpers/contract-type';

type DisplayProps = {
    is_open: boolean;
    list: unknown;
    name: string;
    onChange: () => void;
    value: string;
};

const Display = ({ is_open, list, name, onClick, value }: DisplayProps) => {
    const getDisplayText = () =>
        findContractCategory(list, { value })?.contract_types.find(item => item.value === value).text;

    return (
        <div
            data-testid='dt_contract_dropdown'
            className={classNames('contract-type-widget__display', {
                'contract-type-widget__display--clicked': is_open,
            })}
            onClick={onClick}
        >
            <IconTradeCategory category={value} className='contract-type-widget__icon-wrapper' />
            <span name={name} value={value}>
                {getDisplayText()}
            </span>
            <DesktopWrapper>
                <Icon
                    icon='IcChevronDown'
                    className={classNames(
                        'contract-type-widget__select-arrow',
                        'contract-type-widget__select-arrow--left'
                    )}
                />
            </DesktopWrapper>
        </div>
    );
};

export default Display;
