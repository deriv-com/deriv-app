import React from 'react';

type GuideFlags =
    | 'should_run_trade_types_selection_guide'
    | 'should_run_trade_page_guide'
    | 'should_run_positions_page_guide'
    | 'should_run_market_selector_guide';

export const useGuideStates = () => {
    const [guideStates, setGuideStates] = React.useState({
        should_run_trade_types_selection_guide: false,
        should_run_trade_page_guide: false,
        should_run_positions_page_guide: false,
        should_run_market_selector_guide: false,
    });

    const setGuideState = React.useCallback((flag: GuideFlags, value: boolean) => {
        setGuideStates(prev => ({
            ...prev,
            [flag]: value,
        }));
    }, []);

    return { guideStates, setGuideState };
};
