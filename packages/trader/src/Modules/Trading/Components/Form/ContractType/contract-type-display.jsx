import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from '@deriv/components';
import IconTradeCategory from 'Assets/Trading/Categories/icon-trade-categories.jsx';

const Display = ({ is_open, name, onClick, value, text }) => {
    // const getDisplayText = () =>
    //     findContractCategory(list, { value }).contract_types.find(item => item.value === value).text;

    // let text = getDisplayText();

    // // Reset Call/Reset Puts needs to be broken into 2 lines as
    // // per design but we can't do that in the config because it adds
    // // a space when we force into one line when used in other components.
    // if (value === 'reset_call_put') {
    //     const text_split = text.split('/');
    //     text = `${text_split[0]}/\n${text_split[1]}`;
    // }

    return (
        <div
            className={classNames('contract-type-widget__display', {
                'contract-type-widget__display--clicked': is_open,
            })}
            onClick={onClick}
        >
            <IconTradeCategory category={value} className='contract-type-widget__icon-wrapper' />
            <span name={name} value={value}>
                {text}
            </span>
            <Icon
                icon='IcChevronDown'
                className={classNames('contract-type-widget__select-arrow', 'contract-type-widget__select-arrow--left')}
            />
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
