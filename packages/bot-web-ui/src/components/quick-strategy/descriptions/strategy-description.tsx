import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import { TStrategyDescription } from '../types';

const StrategyDescription = ({ item, font_size }: TStrategyDescription): React.ReactNode => {
    const class_name = item?.className ?? '';
    switch (item.type) {
        case 'text': {
            const class_names = classNames(`qs__description__content ${class_name}`);
            return item?.content?.map((text: string) => (
                <div className={class_names} key={text}>
                    <Text size={font_size} dangerouslySetInnerHTML={{ __html: text }} />
                </div>
            ));
        }
        case 'text_italic': {
            const class_names = classNames(`qs__description__content italic ${class_name}`);
            return item?.content?.map((text: string) => (
                <div className={class_names} key={text}>
                    <Text size={font_size} dangerouslySetInnerHTML={{ __html: text }} />
                </div>
            ));
        }
        case 'media':
            return (
                <div>
                    <img className='qs__description__image' src={item.src} alt={item.alt} />
                </div>
            );
        default:
            return null;
    }
};

export default StrategyDescription;
