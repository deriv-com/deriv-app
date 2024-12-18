import { useLocalStorageData } from '@deriv/hooks';
import { Localize } from '@deriv/translations';
import { getLocalStorage } from '@deriv/utils';
import React from 'react';
import { Step } from 'react-joyride';
import GuideContainer from '../GuideForPages/guide-container';

type TQuickAdjGuide = {
    is_minimized?: boolean;
    is_minimized_visible: boolean;
};
const QuickAdjGuide = ({ is_minimized, is_minimized_visible }: TQuickAdjGuide) => {
    const is_minimized_and_visible = is_minimized && is_minimized_visible;
    const [guide_dtrader_v2, setGuideDtraderV2] = useLocalStorageData<Record<string, boolean>>('guide_dtrader_v2');
    const [show_guide, setShowGuide] = React.useState(false);
    const timerRef = React.useRef<NodeJS.Timeout>();

    React.useEffect(() => {
        if (is_minimized_and_visible && !guide_dtrader_v2?.trade_param_quick_adjustment) {
            const latest_guide_dtrader_v2 = getLocalStorage('guide_dtrader_v2');
            timerRef.current = setTimeout(() => {
                setShowGuide(true);
                setGuideDtraderV2({ ...latest_guide_dtrader_v2, trade_param_quick_adjustment: true });
            }, 300);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            setShowGuide(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_minimized_and_visible]);

    const STEPS = [
        {
            content: <Localize i18n_default_text='Scroll left or right to adjust your trade parameters.' />,
            placement: 'top' as Step['placement'],
            target: '.trade-params__options__wrapper--minimized',
            // target: '.market-selector-info',
            title: <Localize i18n_default_text='Make quick adjustments.' />,
            disableBeacon: true,
            styles: {
                spotlight: {
                    height: 73,
                },
            },
        },
    ];
    return show_guide ? (
        <GuideContainer should_run={show_guide} steps={STEPS} callback={() => setShowGuide(false)} />
    ) : null;
};

export default QuickAdjGuide;
