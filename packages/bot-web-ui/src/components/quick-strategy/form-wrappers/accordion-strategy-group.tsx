import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { TDescriptionItem, TDescription, TDataGroupedObjectsByTitle } from '../types';
import Accordion from '../../dashboard/dbot-tours/common/accordion';

type TDescriptionContent = {
    data: TDataGroupedObjectsByTitle;
    font_size: string;
};

type TAccordionStrategyGroupProps = {
    tutorial_selected_strategy?: string;
    grouped_objects_by_title: TDescription[];
    expanded_subtitles_storage: { [key: string]: boolean };
    setExpandedSubtitlesStorage: (value: { [key: string]: boolean }) => void;
};

const DescriptionItem = ({ item, font_size }: TDescriptionItem): React.ReactNode => {
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

const DescriptionContent = ({ data, font_size }: TDescriptionContent): React.ReactNode => {
    const content_data = Array.isArray(data) ? data : (data as unknown as TDescriptionItem[]).slice(1);
    return content_data.map(item => (
        <React.Fragment key={item?.content && item?.content[0]}>
            <DescriptionItem item={item} font_size={font_size} />
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
        const font_size: string = React.useMemo<string>(() => (is_mobile ? 'xs' : desktop_font_size), [is_mobile]);

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
    }
);

export default AccordionStrategyGroup;
