import React from 'react';
import { Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import { STRATEGIES } from './config';

type TQSTabContent = {
    formfields: React.ReactNode;
    active_tab: string;
};

const QSTabContent: React.FC<TQSTabContent> = observer(({ formfields, active_tab }) => {
    const { ui } = useStore();
    const { quick_strategy } = useDBotStore();
    const { selected_strategy } = quick_strategy;
    const { is_mobile } = ui;
    const strategy = STRATEGIES[selected_strategy as keyof typeof STRATEGIES];
    return (
        <>
            {active_tab === 'TRADE_PARAMETERS' ? (
                <>
                    <div className='qs__body__content__description'>
                        <div>
                            <Text size={is_mobile ? 'xxs' : 'xs'}>{strategy.description}</Text>
                        </div>
                    </div>
                    <div className='qs__body__content__form'>{formfields}</div>
                </>
            ) : (
                <div className='qs__body__content__description'>
                    <div>
                        {strategy?.long_description?.map((data, index) => (
                            <div key={index}>
                                {data.title && (
                                    <div className='long_description__title'>
                                        <Text size={is_mobile ? 'xxs' : 'xs'} weight='bold'>
                                            {data.title}
                                        </Text>
                                    </div>
                                )}
                                {data.content && (
                                    <div className='long_description__content'>
                                        <Text size={is_mobile ? 'xxs' : 'xs'}>{data.content}</Text>
                                    </div>
                                )}
                                {data.image && (
                                    <div>
                                        <img className='long_description__image' src={data.image} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
});

export default QSTabContent;
