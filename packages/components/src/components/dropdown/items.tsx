import classNames from 'classnames';
import React from 'react';
import { getCurrencyDisplayCode } from '@deriv/shared';
import Popover from '../popover';
import Text from '../text';

type ItemsProps = {
    className: string;
    handleSelect: () => void;
    has_symbol: boolean;
    onKeyPressed: () => void;
    name: string;
    value: unknown | number | string;
};

const Items = ({ items, ...props }: ItemsProps) =>
    items.map((item, idx) => {
        return <Item key={idx} item={item} {...props} />;
    });

const Item = ({ onKeyPressed, value, item, handleSelect, nodes, has_symbol, is_align_text_left, className }) => {
    const item_ref = React.useRef(null);
    const symbol_type_class_name =
        item.text && typeof item.text === 'string' ? `symbols--${item.text.toLowerCase()}` : null;

    React.useEffect(() => {
        const removeListeners = () => {
            nodes.delete(item.value, item_ref.current);
            item_ref.current.removeEventListener('keydown', onKeyPressed);
        };

        if (item.disabled) removeListeners();
        else {
            const handleKeyPress = e => onKeyPressed(e, item);
            item_ref.current.addEventListener('keydown', handleKeyPress);
            nodes.set(item.value.toString(), item_ref.current);
        }

        return () => removeListeners();
    }, [item]);

    return (
        <div
            className={classNames(
                'dc-list__item',
                { 'dc-list__item--selected': value === item.value },
                { 'dc-list__item--disabled': item.disabled }
            )}
            name={name}
            value={item.value}
            onClick={item.disabled ? null : handleSelect.bind(null, item)}
            ref={item_ref}
            tabIndex={item.disabled ? null : 0}
            id={item.value}
        >
            {!!has_symbol && item.has_tooltip && (
                <Popover alignment='left' message={getCurrencyDisplayCode(item.text)}>
                    <Text
                        size='xs'
                        line_height='s'
                        align='center'
                        className={classNames('dc-list__item-symbol', symbol_type_class_name)}
                    />
                </Popover>
            )}

            {!!has_symbol && !item.has_tooltip && (
                <Text size='xs' line_height='s' className={classNames('dc-list__item-text', symbol_type_class_name)} />
            )}

            {!has_symbol && (
                <Text
                    size='xs'
                    line_height='s'
                    className={classNames(
                        'dc-list__item-text',
                        { 'dc-list__item-text--left': is_align_text_left },
                        className
                    )}
                >
                    {item.text}
                </Text>
            )}
        </div>
    );
};

export default Items;
