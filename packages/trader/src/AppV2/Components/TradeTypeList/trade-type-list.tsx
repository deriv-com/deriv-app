import React, { useState } from 'react';
import TradeTypeListItem from './trade-type-list-item';
import { Text } from '@deriv-com/quill-ui';
import './trade-type-list.scss';

type TradeTypeItem = {
    id: string;
    title: string;
    icon?: React.ReactNode;
}

type TradeTypeCategory = {
    id: string;
    title?: string;
    items: TradeTypeItem[];
}

type TradeTypeListProps = {
    categories: TradeTypeCategory[];
    onRightIconClick: (item: TradeTypeItem) => void;
}

const TradeTypeList: React.FC<TradeTypeListProps> = ({ categories, onRightIconClick }) => {
    const [category_list, setCategoryList] = useState(categories);

    React.useEffect(() => {
        setCategoryList(categories);
    }, [categories]);

    return (
        <div>
            {category_list.map(category => (
                <div key={category.id} className='trade-type-list-category'>
                    <Text size='sm' bold className='draggable-list-category-title'>
                        {category?.title}
                    </Text>
                    <div
                        className='trade-type-list-category__droppable-area'
                    >
                        {category.items.map((item) => (
                            <div
                            >
                                <TradeTypeListItem 
                                    title={item.title}
                                    onRightIconClick={() => onRightIconClick(item)}
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
