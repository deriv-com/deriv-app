import React, { useState } from 'react';
import TradeTypeListItem from './trade-type-list-item';
import { Text } from '@deriv-com/quill-ui';
import './trade-type-list.scss';
import { Localize } from '@deriv/translations';

type TTradeTypeItem = {
    id: string;
    title: React.ReactNode;
    icon?: React.ReactNode;
};

type TTradeTypeCategory = {
    id: string;
    title?: React.ReactNode;
    button_title?: React.ReactNode;
    items: TTradeTypeItem[];
};

type TTradeTypeListProps = {
    categories?: TTradeTypeCategory[];
    selected?: string;
    selectable?: boolean;
    onRightIconClick?: (item: TTradeTypeItem) => void;
    onTradeTypeClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onAction?: () => void;
    should_show_title?: boolean;
};

const TradeTypeList: React.FC<TTradeTypeListProps> = ({
    categories,
    selected,
    selectable,
    onRightIconClick,
    onTradeTypeClick,
    onAction,
    should_show_title = true,
}) => {
    const [category_list, setCategoryList] = useState(categories);

    React.useEffect(() => {
        setCategoryList(categories);
    }, [categories]);

    return (
        <div>
            {category_list?.map(category => (
                <div key={category.id} className='trade-type-list-category'>
                    <div className='trade-type-list-category-header'>
                        <Text size='sm' bold className='trade-type-list-category-header-title'>
                            {should_show_title && category?.title}
                        </Text>
                        {onAction && (
                            <Text
                                size='sm'
                                bold
                                underlined
                                className='trade-type-list-category-header-button'
                                onClick={onAction}
                            >
                                {category.button_title || <Localize i18n_default_text='Customize' />}
                            </Text>
                        )}
                    </div>
                    <div className='trade-type-list-category__items'>
                        {category.items.map((item: TTradeTypeItem) => (
                            <div key={item.id}>
                                <TradeTypeListItem
                                    title={item.title}
                                    selected={!!selectable && item.id === selected}
                                    onRightIconClick={onRightIconClick && (() => onRightIconClick(item))}
                                    onTradeTypeClick={onTradeTypeClick}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TradeTypeList;
