import React from 'react';
import classNames from 'classnames';
import { Button, SelectNative, Text, ThemedScrollbars } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { FORM_TABS, STRATEGIES } from '../constants';
import '../quick-strategy.scss';

type TMobileFormWrapper = {
    children: React.ReactNode;
};

const MobileFormWrapper: React.FC<TMobileFormWrapper> = observer(({ children }) => {
    const [active_tab, setActiveTab] = React.useState('TRADE_PARAMETERS');
    const { quick_strategy_store_1 } = useDBotStore();
    const { selected_strategy, setSelectedStrategy, setFormVisibility } = quick_strategy_store_1;
    const strategy = STRATEGIES[selected_strategy as keyof typeof STRATEGIES];

    // eslint-disable-next-line no-console
    console.log(setFormVisibility);
    // const handleClose = () => {
    //     setFormVisibility(false);
    // };

    const onChangeStrategy = (strategy: string) => {
        setSelectedStrategy(strategy);
    };

    const dropdown_list = Object.keys(STRATEGIES).map(key => ({
        value: key,
        text: STRATEGIES[key as keyof typeof STRATEGIES].label,
        description: STRATEGIES[key as keyof typeof STRATEGIES].description,
    }));

    return (
        <div className='qs'>
            <div className='qs__body'>
                <div className='qs__body__content'>
                    <ThemedScrollbars className='qs__form__container' autohide={false}>
                        <div className='qs__body__content__title'>
                            <div className='qs__body__content__description'>
                                <Text size='xxs'>
                                    {localize('Choose a template below and set your trade parameters.')}
                                </Text>
                            </div>
                            <div className='qs__body__content__select'>
                                <SelectNative
                                    list_items={dropdown_list}
                                    value={selected_strategy}
                                    // label={localize(label)}
                                    should_show_empty_option={false}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        onChangeStrategy(e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className='qs__body__content__description'>
                            <div>
                                <Text size='xxs'>{strategy.description}</Text>
                            </div>
                        </div>
                        <div className='qs__body__content__head'>
                            <div className='qs__body__content__head__tabs'>
                                {FORM_TABS.map(tab => {
                                    const active = tab.value === active_tab;
                                    const cs = 'qs__body__content__head__tabs__tab';
                                    return (
                                        <span
                                            className={classNames(cs, { active, disabled: tab?.disabled })}
                                            key={tab.value}
                                            onClick={() => setActiveTab(tab.value)}
                                        >
                                            <Text size='xs' weight={active ? 'bold' : 'normal'}>
                                                {tab.label}
                                            </Text>
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                        <div className='qs__body__content__form'>{children}</div>
                    </ThemedScrollbars>
                    <div className='qs__body__content__footer'>
                        <Button primary>{localize('Run')}</Button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default MobileFormWrapper;
