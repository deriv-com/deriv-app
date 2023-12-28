import React, { KeyboardEvent } from 'react';
import { Icon, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { STRATEGIES } from 'Components/quick-strategy/config';
import StrategyDescription from 'Components/quick-strategy/descriptions/strategy-description';
import { useDBotStore } from 'Stores/useDBotStore';

type Tcontent = {
    qs_name: string;
    content: string[];
    type: string;
};

type TQuickStrategyGuides = {
    quick_strategy_content: Tcontent[];
    tutorial_selected_strategy: string;
    setTutorialSelectedStrategy: (value: string) => void;
};

const QuickStrategyGuidesDetail = observer(
    ({ quick_strategy_content, tutorial_selected_strategy, setTutorialSelectedStrategy }: TQuickStrategyGuides) => {
        const { ui } = useStore();
        const { is_mobile } = ui;
        const { quick_strategy } = useDBotStore();
        const { selected_strategy } = quick_strategy;
        const strategy = STRATEGIES[tutorial_selected_strategy || (selected_strategy as keyof typeof STRATEGIES)];
        const text_size = is_mobile ? 'xxs' : 's';

        return (
            <>
                {tutorial_selected_strategy === '' ? (
                    <div className='tutorials-quick-strategy__cards'>
                        {quick_strategy_content?.map(({ qs_name, content, type }, index) => (
                            <div
                                className='tutorials-quick-strategy__placeholder'
                                key={type}
                                onClick={() => setTutorialSelectedStrategy(qs_name)}
                                tabIndex={index}
                                onKeyDown={(e: KeyboardEvent) => {
                                    if (e.key === 'Enter') {
                                        setTutorialSelectedStrategy(qs_name);
                                    }
                                }}
                            >
                                <div>
                                    <div className='tutorials-quick-strategy__placeholder__title'>
                                        <Text
                                            align='center'
                                            weight='bold'
                                            color='prominent'
                                            line_height='s'
                                            size={text_size}
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
                                                        size={text_size}
                                                        className='tutorials-quick-strategy__placeholder__content__text'
                                                    >
                                                        {data}
                                                    </Text>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <Icon
                                    className='tutorials-quick-strategy__placeholder__icon'
                                    icon='IcChevronRightBold'
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className='tutorials-quick-strategy__breadcrumb'>
                            <Text
                                className='tutorials-quick-strategy__breadcrumb__clickable'
                                color='prominent'
                                line_height='s'
                                size={text_size}
                                as='div'
                                onClick={() => {
                                    setTutorialSelectedStrategy('');
                                }}
                            >
                                <Localize i18n_default_text={'Quick strategy guides >'} />
                            </Text>
                            <Text color='less-prominent' line_height='s' size={text_size} as='div'>
                                <Localize i18n_default_text={`About ${STRATEGIES[tutorial_selected_strategy].label}`} />
                            </Text>
                        </div>
                        <div>
                            {strategy?.long_description?.map((data, index) => (
                                <StrategyDescription key={index} data={data} font_size={text_size} />
                            ))}
                        </div>
                    </>
                )}
            </>
        );
    }
);

export default QuickStrategyGuidesDetail;
