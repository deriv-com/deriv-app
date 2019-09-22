import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import Popover             from 'Components/popover';

const Items = ({
    className,
    index,
    handleSelect,
    has_symbol,
    items,
    name,
    is_align_text_left,
    value,
}) =>  items.map((item, idx) => {
    const symbol_type_class_name = item.text && typeof item.text === 'string' ? `symbols--${(item.text).toLowerCase()}` : null;

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
                    message={item.text}
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
                <span className={classNames('dc-list__item-text',
                    { 'dc-list__item-text--left': is_align_text_left },
                    className,
                )}
                >
                    {item.text}
                </span>
            }
        </div>
    );
});

Items.propTypes = {
    className   : PropTypes.string,
    handleSelect: PropTypes.func,
    has_symbol  : PropTypes.bool,
    name        : PropTypes.string,
    value       : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default Items;
