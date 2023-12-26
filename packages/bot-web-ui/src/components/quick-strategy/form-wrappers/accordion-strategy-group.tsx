import React, { useState } from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import { STRATEGIES } from '../config';
import { TDescriptionItem, TDescription, TDataGroupedObjectsByTitle } from '../types';
import Accordion from '../../dashboard/dbot-tours/common/accordion';

type TDescriptionContent = {
    data: TDataGroupedObjectsByTitle;
    font_size: string;
};

type TAccordionStrategyGroupProps = {
    tutorial_selected_strategy?: string;
};

type TExpandedSubtitlesStorageDefault = {
    [key: string]: boolean;
};

const DescriptionItem = ({ item, font_size }: TDescriptionItem) => {
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

const DescriptionContent = ({ data, font_size }: TDescriptionContent): React.ReactElement[] => {
    const content_data = Array.isArray(data) ? data : (data as unknown as TDescriptionItem[]).slice(1);
    return content_data.map(item => (
        <DescriptionItem item={item} font_size={font_size} key={item?.content && item?.content[0]} />
    ));
};

const AccordionStrategyGroup = observer(({ tutorial_selected_strategy }: TAccordionStrategyGroupProps) => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const desktop_font_size = tutorial_selected_strategy ? 's' : 'xs';
    const font_size: string = React.useMemo<string>(() => (is_mobile ? 'xs' : desktop_font_size), [is_mobile]);

    const { quick_strategy } = useDBotStore();
    const { selected_strategy } = quick_strategy;

    const expanded_subtitles_storage_default: TExpandedSubtitlesStorageDefault = {};
    const [expanded_subtitles_storage, setExpandedSubtitlesStorage] = useState(expanded_subtitles_storage_default);

    const strategy = STRATEGIES[tutorial_selected_strategy || (selected_strategy as keyof typeof STRATEGIES)];

    const makeGroupedObjectsByTitle = () => {
        return strategy?.description?.reduce((acc: TDescriptionItem[][], obj: TDescriptionItem) => {
            const is_subtitle = obj.type === 'subtitle_italic' || obj.type === 'subtitle';
            if (is_subtitle) {
                acc.push([]);

                const generateStorageKey = (obj: TDataGroupedObjectsByTitle, selected_strategy: string): string => {
                    return `${obj.content[0]}__${selected_strategy}`.split(' ').join('_').toLowerCase();
                };

                expanded_subtitles_storage_default[
                    generateStorageKey(obj as TDataGroupedObjectsByTitle, selected_strategy)
                ] = obj?.expanded ?? false;
            }
            //If long description available, show content intro paragraph under heading, skip short description.
            const shouldShowLongDescriptionIntro = () => {
                return acc.length - 1 === 0 && obj.type === 'text' && obj.content?.length === 2;
            };
            if (shouldShowLongDescriptionIntro()) {
                obj.content?.shift();
            }
            acc[acc.length - 1].push(obj);
            return acc;
        }, []);
    };

    const grouped_objects_by_title = Array.isArray(strategy?.description)
        ? makeGroupedObjectsByTitle()
        : [{ type: 'text', content: [strategy?.description] }];

    return (
        <>
            {Array.isArray(grouped_objects_by_title) &&
                grouped_objects_by_title.map((data: TDescription, idx: number) => {
                    const subtitle_value = (data as TDescriptionItem[])?.[0]?.content?.[0] ?? '';
                    return (
                        <Accordion
                            key={`accordion-${subtitle_value}-${idx}`}
                            content_data={{
                                header: subtitle_value,
                                content: <DescriptionContent data={data} font_size={font_size} />,
                            }}
                            expanded={!!(data as TDescriptionItem[])[0]?.expanded}
                            is_cursive={false}
                            no_collapsible={(data as TDescriptionItem[])[0]?.no_collapsible}
                            has_subtitle={!!subtitle_value}
                            expanded_subtitles_storage={expanded_subtitles_storage}
                            setExpandedSubtitlesStorage={setExpandedSubtitlesStorage}
                            font_size={font_size}
                        />
                    );
                })}
        </>
    );
});

export default AccordionStrategyGroup;
