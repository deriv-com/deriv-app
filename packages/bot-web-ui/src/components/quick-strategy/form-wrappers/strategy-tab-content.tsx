import React from 'react';
import { Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import { STRATEGIES } from '../config';
import StrategyDescription from '../descriptions/strategy-description';

type TStrategyTabContent = Partial<{
    formfields: React.ReactNode;
    active_tab: string;
    tutorial_selected_strategy: string;
}>;

const StrategyTabContent: React.FC<TStrategyTabContent> = observer(
    ({ formfields, active_tab, tutorial_selected_strategy }) => {
        const { ui } = useStore();
        const { quick_strategy } = useDBotStore();
        const { selected_strategy } = quick_strategy;
        const { is_mobile } = ui;
        const strategy = STRATEGIES[tutorial_selected_strategy || (selected_strategy as keyof typeof STRATEGIES)];
        const desktop_font_size = tutorial_selected_strategy ? 's' : 'xs';
        const font_size: string = React.useMemo<string>(() => (is_mobile ? 'xxs' : desktop_font_size), [is_mobile]);

        return (
            <>
                {active_tab === 'TRADE_PARAMETERS' ? (
                    <>
                        {strategy.description && (
                            <div className='qs__body__content__description'>
                                <div>
                                    <Text size={font_size}>{strategy.description}</Text>
                                </div>
                            </div>
                        )}
                        <div className='qs__body__content__form'>{formfields}</div>
                    </>
                ) : (
                    <div className='qs__body__content__description'>
                        <div>
                            {strategy?.long_description?.map((data, index) => (
                                <StrategyDescription key={index} data={data} font_size={font_size} />
                            ))}
                        </div>
                    </div>
                )}
            </>
        );
    }
);

export default StrategyTabContent;
