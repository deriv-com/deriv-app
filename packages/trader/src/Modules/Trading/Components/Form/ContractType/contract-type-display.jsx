import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon, DesktopWrapper } from '@deriv/components';
import IconTradeCategory from 'Assets/Trading/Categories/icon-trade-categories.jsx';
import { findContractCategory } from '../../../Helpers/contract-type';

const Display = ({ is_open, list, name, onClick, value }) => {
    const getDisplayText = () =>
        findContractCategory(list, { value }).contract_types.find(item => item.value === value).text;

    return (
        <div
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

Display.propTypes = {
    is_open: PropTypes.bool,
    list: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string,
};

export default Display;
