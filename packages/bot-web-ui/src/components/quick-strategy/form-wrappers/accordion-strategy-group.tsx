import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { TDescriptionItem, TDescription, TDataGroupedObjectsByTitle, TStrategyDescription } from '../types';
import Accordion from '../../dashboard/dbot-tours/common/accordion';
import StrategyDescription from '../descriptions/strategy-description';

type TAccordionStrategyGroupProps = {
    tutorial_selected_strategy?: string;
    grouped_objects_by_title: TDescription[];
    expanded_subtitles_storage: { [key: string]: boolean };
    setExpandedSubtitlesStorage: (value: { [key: string]: boolean }) => void;
};

const DescriptionContent = ({ item, font_size }: TStrategyDescription) => {
    const content_data = Array.isArray(item) ? item : (item as unknown as TDescriptionItem[]).slice(1);

    return content_data.map(item => (
        <React.Fragment key={item.id}>
            <StrategyDescription item={item} font_size={font_size} />
        </React.Fragment>
    ));
};

const AccordionStrategyGroup = observer(
    ({
        tutorial_selected_strategy,
        grouped_objects_by_title,
        expanded_subtitles_storage,
        setExpandedSubtitlesStorage,
    }: TAccordionStrategyGroupProps) => {
        const { ui } = useStore();
        const { is_mobile } = ui;
        const desktop_font_size = tutorial_selected_strategy ? 's' : 'xs';
        const font_size: string = React.useMemo<string>(
            () => (is_mobile ? 'xs' : desktop_font_size),
            [is_mobile, desktop_font_size]
        );

        return (
            <>
                {Array.isArray(grouped_objects_by_title) &&
                    grouped_objects_by_title.map((data: TDescription, key: number) => {
                        const subtitle_value = (data as TDescriptionItem[])?.[0]?.content?.[0] ?? '';
                        return (
                            <Accordion
                                key={`accordion-${subtitle_value}`}
                                content_data={{
                                    header: subtitle_value,
                                    content: <DescriptionContent item={data} font_size={font_size} />,
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
    }
);

export default AccordionStrategyGroup;
