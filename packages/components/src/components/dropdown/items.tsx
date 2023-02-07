import React from 'react';
import classNames from 'classnames';
import { getCurrencyDisplayCode } from '@deriv/shared';
import Popover from '../popover';
import Text from '../text';
import { TListItem } from './utility';

type TItem = {
    className?: string;
    handleSelect: (item: TListItem) => void;
    has_symbol?: boolean;
    onKeyPressed: (event: KeyboardEvent, item: TListItem) => void;
    value?: string | number;
    is_align_text_left?: boolean;
    nodes: Map<string, HTMLDivElement | null> | null;
    item: TListItem;
};

type TItems = Omit<TItem, 'item'> & {
    items: TListItem[];
};

const Items = ({ items, ...props }: TItems) => {
    return (
        <>
            {items.map((item, idx) => {
                return <Item key={idx} item={item} {...props} />;
            })}
        </>
    );
};

const Item = ({ onKeyPressed, value, item, handleSelect, nodes, has_symbol, is_align_text_left, className }: TItem) => {
    const item_ref = React.useRef<HTMLDivElement>(null);
    const symbol_type_class_name =
        item.text && typeof item.text === 'string' ? `symbols--${item.text.toLowerCase()}` : null;

    React.useEffect(() => {
        const removeListeners = () => {
            nodes?.delete(item.value);
            item_ref?.current?.removeEventListener('keydown', onKeyPressed as (event: KeyboardEvent) => void);
        };

        if (item.disabled) removeListeners();
        else {
            const handleKeyPress = (e: KeyboardEvent) => onKeyPressed(e, item);
            item_ref?.current?.addEventListener('keydown', handleKeyPress);
            nodes?.set(item.value.toString(), item_ref.current);
        }

        return () => removeListeners();
    }, [item, nodes, onKeyPressed]);

    return (
        <div
            className={classNames(
                'dc-list__item',
                { 'dc-list__item--selected': value === item.value },
                { 'dc-list__item--disabled': item.disabled }
            )}
            data-testid='dti_list_item'
            onClick={item.disabled ? undefined : handleSelect.bind(null, item)}
            ref={item_ref}
            tabIndex={item.disabled ? undefined : 0}
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
