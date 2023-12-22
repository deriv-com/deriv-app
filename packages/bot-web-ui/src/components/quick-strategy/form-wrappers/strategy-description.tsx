import React, { useState } from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import { STRATEGIES } from '../config';
import { TDescriptionItem, TDescription, TDataGroupedObjectsByTitle } from '../types';
import Accordion from '../../dashboard/dbot-tours/common/accordion';
import './strategy-description.scss';

type TStrategyDescription = Partial<{
    formfields: React.ReactNode;
    active_tab: string;
    tutorial_selected_strategy: string;
}>;

type TExpandedSubtitlesStorageDefault = {
    [key: string]: boolean;
};

const StrategyDescription: React.FC<TStrategyDescription> = observer(
    ({ formfields, active_tab, tutorial_selected_strategy }) => {
        const { ui } = useStore();
        const { quick_strategy } = useDBotStore();
        const { selected_strategy } = quick_strategy;
        const { is_mobile } = ui;

        const desktop_font_size = tutorial_selected_strategy ? 's' : 'xs';
        const font_size: string = React.useMemo<string>(() => (is_mobile ? 'xs' : desktop_font_size), [is_mobile]);

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

        const renderDescription = (data: TDescriptionItem) => {
            const class_name = data?.className ?? '';
            switch (data.type) {
                case 'subtitle':
                    return data?.content?.map(text => (
                        <div className='qs__description__title' key={text}>
                            <Text size={font_size} weight='bold' dangerouslySetInnerHTML={{ __html: text }} />
                        </div>
                    ));
                case 'text': {
                    const class_names = classNames(`qs__description__content ${class_name}`);
                    return data?.content?.map(text => (
                        <div className={class_names} key={text}>
                            <Text size={font_size} dangerouslySetInnerHTML={{ __html: text }} />
                        </div>
                    ));
                }
                case 'subtitle_italic':
                    return data?.content?.map(text => (
                        <div className='qs__description__title italic' key={text}>
                            <Text size={font_size} weight='bold' dangerouslySetInnerHTML={{ __html: text }} />
                        </div>
                    ));
                case 'text_italic': {
                    const class_names = classNames(`qs__description__content italic ${class_name}`);
                    return data?.content?.map(text => (
                        <div className={class_names} key={text}>
                            <Text size={font_size} dangerouslySetInnerHTML={{ __html: text }} />
                        </div>
                    ));
                }
                case 'media':
                    return (
                        <div>
                            <img className='qs__description__image' src={data.src} alt={data.alt} />
                        </div>
                    );
                default:
                    return null;
            }
        };

        return (
            <>
                {active_tab === 'TRADE_PARAMETERS' ? (
                    <div className='qs__body__content__form'>{formfields}</div>
                ) : (
                    <div className='qs__body__content__description'>
                        <div>
                            {Array.isArray(grouped_objects_by_title) &&
                                grouped_objects_by_title?.map((data: TDescription) => {
                                    const subtitle_value = (data as TDescriptionItem[])?.[0]?.content?.[0] ?? '';
                                    const executeContentData = () => ({
                                        header: subtitle_value,
                                        content:
                                            (renderDescription(
                                                data as TDataGroupedObjectsByTitle
                                            ) as React.ReactElement[]) ??
                                            (data as TDescriptionItem[])
                                                ?.slice(1)
                                                ?.map(element => renderDescription(element)),
                                    });
                                    return (
                                        <Accordion
                                            key={`accordion-${subtitle_value}`}
                                            content_data={executeContentData()}
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
                        </div>
                    </div>
                )}
            </>
        );
    }
);

export default StrategyDescription;
