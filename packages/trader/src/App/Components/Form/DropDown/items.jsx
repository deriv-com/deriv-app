import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import { Popover }         from 'App/Components/Elements/Popover';
import { getCurrencyName } from '_common/base/currency_base';

const Items = ({
    index,
    handleSelect,
    has_symbol,
    items,
    name,
    value,
}) =>  items.map((item, idx) => {
    const symbol_type_class_name = item.text ? `symbols--${(item.text).toLowerCase()}` : '';
    return (
        <div
            id={`dt_duration_${item.value}_item`}
            className={classNames(
                'list__item',
                { 'list__item--highlighted': idx === index },
                { 'list__item--selected': value === item.value },
                { 'list__item--disabled': item.disabled }
            )}
            name={name}
            value={item.value}
            onClick={item.disabled ? null : handleSelect.bind(null, item)}
            key={idx}
        >
            {!!has_symbol && item.has_tooltip &&
                <Popover
                    alignment='left'
                    message={getCurrencyName(item.value)}
                >
                    <span
                        className={classNames(
                            'symbols',
                            'list__item-symbol',
                            symbol_type_class_name
                        )}
                    />
                </Popover>
            }

            {!!has_symbol && !item.has_tooltip &&
                <span
                    className={classNames(
                        'symbols',
                        'list__item-text',
                        symbol_type_class_name,
                    )}
                />
            }

            {!has_symbol &&
                <span className='list__item-text'>{item.text}</span>
            }
        </div>
    );
});

Items.propTypes = {
    handleSelect: PropTypes.func,
    has_symbol  : PropTypes.bool,
    name        : PropTypes.string,
    value       : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default Items;
