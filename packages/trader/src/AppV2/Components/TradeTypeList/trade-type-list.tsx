import React from 'react';
import TradeTypeListItem from './trade-type-list-item';
import { Button, Text } from '@deriv-com/quill-ui';
import './trade-type-list.scss';
import { Localize } from '@deriv/translations';
import clsx from 'clsx';

type TTradeTypeItem = {
    id: string;
    title: string;
    icon?: React.ReactNode;
};

type TTradeTypeCategory = {
    id: string;
    title?: string;
    button_title?: string;
    items: TTradeTypeItem[];
};

type TTradeTypeListProps = {
    categories?: TTradeTypeCategory[];
    isSelected: (id: string) => boolean;
    selectable?: boolean;
    show_divider?: boolean;
    onRightIconClick?: (item: TTradeTypeItem) => void;
    onTradeTypeClick?: (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
};

const TradeTypeList: React.FC<TTradeTypeListProps> = ({
    categories,
    isSelected,
    selectable,
    show_divider,
    onRightIconClick,
    onTradeTypeClick,
}) => {
    const [category_list, setCategoryList] = React.useState(categories);

    React.useEffect(() => {
        setCategoryList(categories);
    }, [categories]);

    if (!categories?.[0]?.items.length) return null;
    return (
        <React.Fragment>
            {category_list?.map(category => (
                <div
                    key={category.id}
                    className={clsx('trade-type-list-category', {
                        'trade-type-list-category__border': category.items && category.items.length > 0 && show_divider,
                    })}
                >
                    <div className='trade-type-list-category__items'>
                        {category.items?.map((item: TTradeTypeItem) => (
                            <div key={item.id}>
                                <TradeTypeListItem
                                    title={item.title}
                                    selected={!!selectable && isSelected(item.id)}
                                    onRightIconClick={onRightIconClick && (() => onRightIconClick(item))}
                                    onTradeTypeClick={onTradeTypeClick}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </React.Fragment>
    );
};

export default TradeTypeList;
