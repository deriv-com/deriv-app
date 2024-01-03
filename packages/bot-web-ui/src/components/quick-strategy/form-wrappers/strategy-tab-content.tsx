import React, { useState } from 'react';
import { observer } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import { STRATEGIES } from '../config';
import { TDescription, TDescriptionItem } from '../types';
import AccordionStrategyGroup from './accordion-strategy-group';
import './strategy-accordion.scss';

type TStrategyDescription = Partial<{
    formfields: React.ReactNode;
    active_tab: string;
    tutorial_selected_strategy: string;
}>;

type TExpandedSubtitlesStorageDefault = {
    [key: string]: boolean;
};

export type TDataGroupedObjectsByTitle = {
    type: string;
    content: string[];
};

const StrategyTabContent: React.FC<TStrategyDescription> = observer(
    ({ formfields, active_tab, tutorial_selected_strategy }) => {
        const { quick_strategy } = useDBotStore();
        const { selected_strategy } = quick_strategy;

        const expanded_subtitles_storage_default: TExpandedSubtitlesStorageDefault = {};
        const [expanded_subtitles_storage, setExpandedSubtitlesStorage] = useState(expanded_subtitles_storage_default);

        const strategy = STRATEGIES[tutorial_selected_strategy || (selected_strategy as keyof typeof STRATEGIES)];

        const makeGroupedObjectsByTitle = () => {
            return strategy?.description?.reduce((acc: TDescription, obj: TDescriptionItem, idx) => {
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

                (acc[acc.length - 1] as TDescriptionItem[]).push({ ...obj, id: idx });
                return acc;
            }, []);
        };

        const grouped_objects_by_title: TDescription = Array.isArray(strategy?.description)
            ? makeGroupedObjectsByTitle()
            : [{ type: 'text', content: [strategy?.description] }];

        return (
            <>
                {active_tab === 'TRADE_PARAMETERS' ? (
                    <div className='qs__body__content__form'>{formfields}</div>
                ) : (
                    <div className='qs__body__content__description'>
                        <AccordionStrategyGroup
                            tutorial_selected_strategy={tutorial_selected_strategy}
                            grouped_objects_by_title={grouped_objects_by_title}
                            expanded_subtitles_storage={expanded_subtitles_storage}
                            setExpandedSubtitlesStorage={setExpandedSubtitlesStorage}
                        />
                    </div>
                )}
            </>
        );
    }
);

export default StrategyTabContent;
