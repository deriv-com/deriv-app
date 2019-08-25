import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import Popover             from 'Components/popover';
import './list.scss';

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
            className={classNames(
                'dc-list__item',
                { 'dc-list__item--highlighted': idx === index },
                { 'dc-list__item--selected': value === item.value },
                { 'dc-list__item--disabled': item.disabled }
            )}
            name={name}
            value={item.value}
            onClick={item.disabled ? null : handleSelect.bind(null, item)}
            key={idx}
        >
            {!!has_symbol && item.has_tooltip &&
                <Popover
                    alignment='left'
                    message={item.tooltip}
                >
                    <span
                        className={classNames(
                            'symbols',
                            'dc-list__item-symbol',
                            symbol_type_class_name
                        )}
                    />
                </Popover>
            }

            {!!has_symbol && !item.has_tooltip &&
                <span
                    className={classNames(
                        'symbols',
                        'dc-list__item-text',
                        symbol_type_class_name,
                    )}
                />
            }

            {!has_symbol &&
                <span className='dc-list__item-text'>{item.text}</span>
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
