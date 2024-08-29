import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { TStrategyDescription } from '../types';
import parse from 'html-react-parser';

const StrategyDescription = observer(({ item, font_size }: TStrategyDescription) => {
    const { ui } = useStore();
    const { is_dark_mode_on } = ui;
    const class_name = item?.className ?? '';
    switch (item.type) {
        case 'text': {
            const class_names = classNames(`qs__description__content ${class_name}`);
            return (
                <>
                    {item?.content?.map((text: string) => {
                        const parsed_text = parse(text);
                        return (
                            <div className={class_names} key={text}>
                                <Text size={font_size}>{parsed_text}</Text>
                            </div>
                        );
                    })}
                </>
            );
        }
        case 'text_italic': {
            const class_names = classNames(`qs__description__content italic ${class_name}`);
            return (
                <>
                    {item?.content?.map((text: string) => {
                        const parsed_text = parse(text);
                        return (
                            <div className={class_names} key={text}>
                                <Text size={font_size}>{parsed_text}</Text>
                            </div>
                        );
                    })}
                </>
            );
        }
        case 'media': {
            const class_names = classNames(`qs__description__image ${class_name}`);
            return (
                <div className={class_names} style={item?.styles}>
                    <img src={is_dark_mode_on ? item.dark_src ?? item.src : item.src} alt={item.alt} />
                </div>
            );
        }
        default:
            return null;
    }
});

export default StrategyDescription;
