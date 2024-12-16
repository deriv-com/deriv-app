import React from 'react';
import clsx from 'clsx';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv-com/quill-ui';
import Guide from '../Guide';
import { useLocalStorageData } from '@deriv/hooks';
import GuideContainer from '../OnboardingGuide/GuideForPages/guide-container';
import { Step } from 'react-joyride';
import { useStore } from '@deriv/stores';

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
    const {
        client: { is_logged_in },
    } = useStore();
    const [guide_dtrader_v2, setGuideDtraderV2] = useLocalStorageData<Record<string, boolean>>('guide_dtrader_v2', {
        trade_types_selection: false,
        trade_page: false,
        positions_page: false,
        market_selector: false,
        trade_param_quick_adjustment: false,
    });
    const [show_guide, setShowGuide] = React.useState(false);
    const timerRef = React.useRef<NodeJS.Timeout>();

    React.useEffect(() => {
        if (is_minimized_and_visible && !guide_dtrader_v2?.trade_param_quick_adjustment) {
            timerRef.current = setTimeout(() => {
                setShowGuide(true);
                setGuideDtraderV2({ ...guide_dtrader_v2, trade_param_quick_adjustment: true });
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

    return (
        <section
            className={clsx('', {
                'trade-params--minimized': is_minimized_and_visible,
                'trade-params': !is_minimized_and_visible,
            })}
        >
            {is_logged_in && (
                <GuideContainer should_run={show_guide} steps={STEPS} callback={() => setShowGuide(false)} />
            )}
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
