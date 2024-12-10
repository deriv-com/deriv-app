import React from 'react';

type GuideFlags =
    | 'should_run_trade_types_selection_guide'
    | 'should_run_trade_page_guide'
    | 'should_run_positions_page_guide'
    | 'should_run_market_selector_guide';

type GuideStates = Record<GuideFlags, boolean>;

let sharedGuideStates: GuideStates = {
    should_run_trade_types_selection_guide: false,
    should_run_trade_page_guide: false,
    should_run_positions_page_guide: false,
    should_run_market_selector_guide: false,
};

const listeners = new Set<() => void>();

const useGuideStates = () => {
    const [, setUpdate] = React.useState({});

    React.useEffect(() => {
        const update = () => setUpdate({});
        listeners.add(update);
        return () => {
            listeners.delete(update);
        };
    }, []);

    const setGuideState = (flag: GuideFlags, value: boolean) => {
        sharedGuideStates = {
            ...sharedGuideStates,
            [flag]: value,
        };
        listeners.forEach(listener => listener());
    };

    return {
        guideStates: sharedGuideStates,
        setGuideState,
    };
};

export default useGuideStates;
