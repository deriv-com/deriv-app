import React, { useState } from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import { STRATEGIES } from '../config';
import { TDescriptionItem } from '../types';
import Accordion from '../../dashboard/dbot-tours/common/accordion';
import './strategy-description.scss';

type TStrategyDescription = {
    formfields: React.ReactNode;
    active_tab: string;
};

type TDataGroupedObjectsByTitle = {
    type: string;
    content: string[];
};

type TExpandedSubtitlesStorageDefault = {
    [key: string]: boolean;
};

const StrategyDescription: React.FC<TStrategyDescription> = observer(({ formfields, active_tab }) => {
    const { ui } = useStore();
    const { quick_strategy } = useDBotStore();
    const { selected_strategy } = quick_strategy;
    const { is_mobile } = ui;
    const strategy = STRATEGIES[selected_strategy as keyof typeof STRATEGIES];
    const font_size: string = React.useMemo<string>(() => (is_mobile ? 'xxs' : 'xs'), [is_mobile]);

    const renderDescription = (data: TDescriptionItem) => {
        switch (data.type) {
            case 'subtitle':
                return data?.content?.map(text => (
                    <div className='long_description__title' key={text}>
                        <Text size={font_size} weight='bold' dangerouslySetInnerHTML={{ __html: text }} />
                    </div>
                ));
            case 'text': {
                const class_names = classNames(`long_description__content ${data?.className || ''}`);
                return data?.content?.map(text => (
                    <div className={class_names} key={text}>
                        <Text size={font_size} dangerouslySetInnerHTML={{ __html: text }} />
                    </div>
                ));
            }
            case 'subtitle_italic':
                return data?.content?.map(text => (
                    <div className='long_description__title italic' key={text}>
                        <Text size={font_size} weight='bold' dangerouslySetInnerHTML={{ __html: text }} />
                    </div>
                ));
            case 'text_italic': {
                const class_names = classNames(`long_description__content italic ${data?.className || ''}`);
                return data?.content?.map(text => (
                    <div className={class_names} key={text}>
                        <Text size={font_size} dangerouslySetInnerHTML={{ __html: text }} />
                    </div>
                ));
            }
            case 'media':
                return (
                    <div key={data.alt}>
                        <img className='long_description__image' src={data.src} alt={data.alt} />
                    </div>
                );
            default:
                return null;
        }
    };

    const expanded_subtitles_storage_default: TExpandedSubtitlesStorageDefault = {};
    const grouped_objects_by_title =
        Array.isArray(strategy?.long_description) &&
        strategy?.long_description?.reduce((acc: TDescriptionItem[][], obj: TDescriptionItem) => {
            if (obj.type === 'subtitle_italic' || obj.type === 'subtitle') {
                acc.push([]);
                expanded_subtitles_storage_default[
                    `${(obj as TDataGroupedObjectsByTitle).content[0]}__${selected_strategy}`
                        .split(' ')
                        .join('_')
                        .toLocaleLowerCase()
                ] = obj?.expanded ?? false;
            }
            acc[acc.length - 1].push(obj);
            return acc;
        }, []);

    const [expanded_subtitles_storage, setExpandedSubtitlesStorage] = useState(expanded_subtitles_storage_default);

    return (
        <>
            {active_tab === 'TRADE_PARAMETERS' ? (
                <>
                    <div className='qs__body__content__description'>
                        <div>
                            <Text size={font_size}>{strategy.description}</Text>
                        </div>
                    </div>
                    <div className='qs__body__content__form'>{formfields}</div>
                </>
            ) : (
                <div className='qs__body__content__description'>
                    <div>
                        {Array.isArray(grouped_objects_by_title) &&
                            grouped_objects_by_title?.map((data: TDescriptionItem[]) => {
                                const subtitle_value = data?.[0]?.content?.[0] ?? '';
                                return (
                                    <Accordion
                                        key={`accordion-${subtitle_value}`}
                                        content_data={{
                                            header: subtitle_value,
                                            content: data
                                                .slice(1)
                                                ?.map(element => renderDescription(element))
                                                .flatMap(item => item) as React.ReactElement[],
                                        }}
                                        expanded={data[0]?.expanded ?? false}
                                        icon={{
                                            open_icon: 'IcAccordionMinus',
                                            close_icon: 'IcAccordionPlus',
                                        }}
                                        is_cursive={data[0]?.type === 'subtitle_italic'}
                                        no_collapsible={data[0]?.no_collapsible}
                                        expanded_subtitles_storage={expanded_subtitles_storage}
                                        setExpandedSubtitlesStorage={setExpandedSubtitlesStorage}
                                    />
                                );
                            })}
                    </div>
                </div>
            )}
        </>
    );
});

export default StrategyDescription;
