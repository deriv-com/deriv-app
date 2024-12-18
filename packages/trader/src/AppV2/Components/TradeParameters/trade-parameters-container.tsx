import React from 'react';
import clsx from 'clsx';
import { Localize } from '@deriv/translations';
// import { LocalStorageUtils } from '@deriv-com/utils';
// const latest_guide_dtrader_v2 = LocalStorageUtils.getValue<object>('guide_dtrader_v2');
import { Text } from '@deriv-com/quill-ui';
import Guide from '../Guide';
import useGuideStates from 'AppV2/Hooks/useGuideStates';
import { useLocalStorageData } from '@deriv/hooks';
import GuideContainer from '../OnboardingGuide/GuideForPages/guide-container';
import { Step } from 'react-joyride';

type TTradeParametersContainer = {
    is_minimized?: boolean;
    is_minimized_visible?: boolean;
};

const TradeParametersContainer = ({
    children,
    is_minimized,
    is_minimized_visible,
}: React.PropsWithChildren<TTradeParametersContainer>) => {
    const is_minimized_and_visible = is_minimized && is_minimized_visible;
    const [guide_dtrader_v2, setGuideDtraderV2] = useLocalStorageData<Record<string, boolean>>('guide_dtrader_v2', {
        trade_types_selection: false,
        trade_page: false,
        positions_page: false,
        market_selector: false,
        trade_param_quick_adjustment: false,
    });
    const { guideStates, setGuideState } = useGuideStates();
    const { should_run_trade_param_quick_adjustment_guide } = guideStates;
    const STEPS = [
        {
            content: <Localize i18n_default_text='Scroll left or right to adjust your trade parameters.' />,
            offset: 4,
            placement: 'top' as Step['placement'],
            target: '.trade-params--minimized',
            title: <Localize i18n_default_text='Make quick adjustments.' />,
            disableBeacon: true,
            styles: {
                spotlight: {
                    height: 73,
                },
            },
        },
    ];

    React.useEffect(() => {
        if (is_minimized_and_visible && !guide_dtrader_v2?.trade_param_quick_adjustment) {
            setGuideState('should_run_trade_param_quick_adjustment_guide', true);
            setGuideDtraderV2({ ...guide_dtrader_v2, trade_param_quick_adjustment: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_minimized_and_visible]);
    return (
        <section
            className={clsx('', {
                'trade-params--minimized': is_minimized_and_visible,
                'trade-params': !is_minimized_and_visible,
            })}
        >
            <GuideContainer
                should_run={
                    should_run_trade_param_quick_adjustment_guide && !guide_dtrader_v2?.trade_param_quick_adjustment
                }
                steps={STEPS}
                callback={() => setGuideState('should_run_market_selector_guide', false)}
            />
            {!is_minimized_and_visible && (
                <div className='trade-params__title'>
                    <Text>
                        <Localize i18n_default_text='Set your trade' />
                    </Text>
                    <Guide has_label show_guide_for_selected_contract />
                </div>
            )}
            {children}
        </section>
    );
};

export default React.memo(TradeParametersContainer);
