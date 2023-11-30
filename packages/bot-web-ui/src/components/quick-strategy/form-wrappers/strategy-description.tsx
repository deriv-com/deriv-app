import React from 'react';
import { Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import { STRATEGIES } from '../config';

type TStrategyDescription = {
    formfields: React.ReactNode;
    active_tab: string;
};

type TDescriptionItem = {
    content: string[];
    type: string;
    src?: string;
};

const StrategyDescription: React.FC<TStrategyDescription> = observer(({ formfields, active_tab }) => {
    const { ui } = useStore();
    const { quick_strategy } = useDBotStore();
    const { selected_strategy } = quick_strategy;
    const { is_mobile } = ui;
    const strategy = STRATEGIES[selected_strategy as keyof typeof STRATEGIES];

    const renderDescription = (data: TDescriptionItem) => {
        switch (data.type) {
            case 'subtitle':
                return data?.content?.map(text => (
                    <div className='long_description__title' key={text}>
                        <Text
                            size={is_mobile ? 'xxs' : 'xs'}
                            weight='bold'
                            dangerouslySetInnerHTML={{ __html: text }}
                        />
                    </div>
                ));
            case 'text': {
                return data?.content?.map(text => (
                    <div className='long_description__content' key={text}>
                        <Text size={is_mobile ? 'xxs' : 'xs'} dangerouslySetInnerHTML={{ __html: text }} />
                    </div>
                ));
            }
            case 'media':
                return (
                    <div>
                        <img className='long_description__image' src={data.src} />
                    </div>
                );
            default:
                return null;
        }
    };

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
                            <div key={index}>{renderDescription(data)}</div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
});

export default StrategyDescription;
