import { useLocalStorageData } from '@deriv/hooks';
import { Localize } from '@deriv/translations';
import { getLocalStorage } from '@deriv/utils';
import React from 'react';
import { Step } from 'react-joyride';
import GuideContainer from '../GuideForPages/guide-container';

const TradeParamsGuide = React.memo(() => {
    const [guide_dtrader_v2, setGuideDtraderV2] = useLocalStorageData<Record<string, boolean>>('guide_dtrader_v2');
    const [show_guide, setShowGuide] = React.useState(false);
    const timerRef = React.useRef<NodeJS.Timeout>();

    React.useEffect(() => {
        if (!guide_dtrader_v2?.trade_params) {
            const element = document.querySelector('.trade');
            const observer = new MutationObserver(() => {
                if (document.querySelector('.trade__parameter-tooltip-info')) {
                    const latest_guide_dtrader_v2 = getLocalStorage('guide_dtrader_v2');
                    timerRef.current = setTimeout(() => {
                        setShowGuide(true);
                        setGuideDtraderV2({ ...latest_guide_dtrader_v2, trade_params: true });
                    }, 300);
                    observer.disconnect();
                }
            });
            if (element) observer.observe(element, { childList: true, subtree: true });
        }
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [guide_dtrader_v2, setGuideDtraderV2]);

    const STEPS = React.useMemo(
        () => [
            {
                content: <Localize i18n_default_text='Define your trade parameters.' />,
                placement: 'top' as Step['placement'],
                target: '.trade__parameter-tooltip-info',
                spotlightPadding: 4,
                title: <Localize i18n_default_text='Set your trade' />,
                disableBeacon: true,
                offset: 0,
            },
        ],
        []
    );

    const handleCallback = React.useCallback(() => {
        setShowGuide(false);
    }, []);

    return <GuideContainer should_run={show_guide} steps={STEPS} callback={handleCallback} />;
});

TradeParamsGuide.displayName = 'TradeParamsGuide';

export default TradeParamsGuide;
