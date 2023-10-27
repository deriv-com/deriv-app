import React from 'react';
import { localize } from '@deriv/translations';
import { Icon, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';

type Tcontent = {
    content: string[];
    type: string;
};
type TQuickStrategyContent = {
    quick_strategy_content: Tcontent[];
};

const QuickStrategyContent = observer(({ quick_strategy_content }: TQuickStrategyContent) => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const { dashboard } = useDBotStore();
    const { QuickStrategyDetailsModal } = dashboard;

    const Cards = () => {
        return (
            <div className='tutorials-quick-strategy__cards'>
                {quick_strategy_content?.map(({ content, type }) => (
                    <div className='tutorials-quick-strategy__placeholder' key={type}>
                        <div>
                            <div className='tutorials-quick-strategy__placeholder__title'>
                                <Text
                                    align='center'
                                    weight='bold'
                                    color='prominent'
                                    line_height='s'
                                    size={is_mobile ? 'xxs' : 's'}
                                >
                                    {type}
                                </Text>
                            </div>
                            <div className='tutorials-quick-strategy__placeholder__content'>
                                <ul>
                                    {content.map(data => (
                                        <li key={data}>
                                            <Text
                                                align='center'
                                                color='prominent'
                                                line_height='s'
                                                size={is_mobile ? 'xxs' : 's'}
                                            >
                                                {data}
                                            </Text>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <Icon icon='IcChevronRightBold' onClick={QuickStrategyDetailsModal} />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className='tutorials-quick-strategy'>
            <Text
                className='tutorials-quick-strategy__title'
                weight='bold'
                color='prominent'
                line_height='s'
                size={is_mobile ? 'xxs' : 's'}
                as='div'
            >
                {localize('All Quick strategies')}
            </Text>
            <Cards />
        </div>
    );
});

export default QuickStrategyContent;
