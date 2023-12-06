import React from 'react';
import { Icon, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { STRATEGIES } from 'Components/quick-strategy/config';
import QuickStrategyContentDetail from './quick-strategy-guides-details';
import './index.scss';

type Tcontent = {
    qs_name: string;
    content: string[];
    type: string;
};
type TQuickStrategyContent = {
    quick_strategy_content: Tcontent[];
};

const QuickStrategyContent = observer(({ quick_strategy_content }: TQuickStrategyContent) => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const [tutorial_selected_strategy, setTutorialSelectedStrategy] = React.useState('');
    const QuickStrategyCards = () => {
        return (
            <>
                {tutorial_selected_strategy === '' ? (
                    <div className='tutorials-quick-strategy__cards'>
                        {quick_strategy_content?.map(({ qs_name, content, type }) => (
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
                                <Icon icon='IcChevronRightBold' onClick={() => setTutorialSelectedStrategy(qs_name)} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className='tutorials-quick-strategy__breadcrumb'>
                            <Text
                                className='tutorials-quick-strategy__breadcrumb--click'
                                color='prominent'
                                line_height='s'
                                size={is_mobile ? 'xxs' : 's'}
                                as='div'
                                onClick={() => {
                                    setTutorialSelectedStrategy('');
                                }}
                            >
                                <Localize i18n_default_text={'Quick strategy guides >'} />
                            </Text>
                            <Text
                                weight='lighter'
                                color='prominent'
                                line_height='s'
                                size={is_mobile ? 'xxs' : 's'}
                                as='div'
                            >
                                <Localize i18n_default_text={`About ${STRATEGIES[tutorial_selected_strategy].label}`} />
                            </Text>
                        </div>
                        <QuickStrategyContentDetail tutorial_selected_strategy={tutorial_selected_strategy} />
                    </>
                )}
            </>
        );
    };

    return (
        <div className='tutorials-quick-strategy'>
            {tutorial_selected_strategy === '' && (
                <Text
                    className='tutorials-quick-strategy__title'
                    weight='bold'
                    color='prominent'
                    line_height='s'
                    size={is_mobile ? 'xxs' : 's'}
                    as='div'
                >
                    {localize('Quick strategy guides')}
                </Text>
            )}
            <QuickStrategyCards />
        </div>
    );
});

export default QuickStrategyContent;
