import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import { TDescriptionItem } from '../types';

type TStrategyDescription = {
    data: TDescriptionItem;
    font_size: string;
};

const StrategyDescription: React.FC<TStrategyDescription> = ({ data, font_size }) => {
    const descriptionContent = () => {
        switch (data.type) {
            case 'subtitle':
                return data?.content?.map(text => (
                    <div className='qs__long_description__title' key={text}>
                        <Text size={font_size} weight='bold' dangerouslySetInnerHTML={{ __html: text }} />
                    </div>
                ));
            case 'text': {
                const class_names = classNames(`qs__long_description__content ${data?.className ?? ''}`);
                return data?.content?.map(text => (
                    <div className={class_names} key={text}>
                        <Text size={font_size} dangerouslySetInnerHTML={{ __html: text }} />
                    </div>
                ));
            }
            case 'subtitle_italic':
                return data?.content?.map(text => (
                    <div className='qs__long_description__title italic' key={text}>
                        <Text size={font_size} weight='bold' dangerouslySetInnerHTML={{ __html: text }} />
                    </div>
                ));
            case 'text_italic': {
                const class_names = classNames(`qs__long_description__content italic ${data?.className ?? ''}`);
                return data?.content?.map(text => (
                    <div className={class_names} key={text}>
                        <Text size={font_size} dangerouslySetInnerHTML={{ __html: text }} />
                    </div>
                ));
            }
            case 'media':
                return (
                    <div>
                        <img className='qs__long_description__image' src={data.src} alt={data.alt} />
                    </div>
                );
            default:
                return null;
        }
    };

    return <div>{descriptionContent()}</div>;
};

export default StrategyDescription;
