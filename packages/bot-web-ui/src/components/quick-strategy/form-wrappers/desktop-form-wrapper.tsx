import React from 'react';
import classNames from 'classnames';
import { Button, Text, ThemedScrollbars } from '@deriv/components';
import Icon from '@deriv/components/src/components/icon/icon';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { FORM_TABS, STRATEGIES } from '../constants';
import '../quick-strategy.scss';

type TDesktopFormWrapper = {
    children: React.ReactNode;
};

const FormWrapper: React.FC<TDesktopFormWrapper> = observer(({ children }) => {
    const [active_tab, setActiveTab] = React.useState('TRADE_PARAMETERS');
    const { quick_strategy_store_1 } = useDBotStore();
    const { selected_strategy, setSelectedStrategy, setFormVisibility } = quick_strategy_store_1;
    const strategy = STRATEGIES[selected_strategy as keyof typeof STRATEGIES];
    const handleClose = () => {
        setFormVisibility(false);
    };

    const onChangeStrategy = (strategy: string) => {
        setSelectedStrategy(strategy);
    };

    return (
        <div className='qs'>
            <div className='qs__head'>
                <div className='qs__head__title'>
                    <Text weight='bold'>{localize('Quick Strategy')}</Text>
                </div>
                <div className='qs__head__action'>
                    <span onClick={() => handleClose()}>
                        <Icon icon='IcCloseIconDbot' />
                    </span>
                </div>
            </div>
            <div className='qs__body'>
                <div className='qs__body__sidebar'>
                    <div className='qs__body__sidebar__subtitle'>
                        <Text size='xs'>{localize('Choose a template below and set your trade parameters.')}</Text>
                    </div>
                    <div className='qs__body__sidebar__items'>
                        <ul>
                            {(Object.keys(STRATEGIES) as (keyof typeof STRATEGIES)[]).map(key => {
                                const st = STRATEGIES[key];
                                const active = key === selected_strategy;
                                return (
                                    <li
                                        className={classNames({ active })}
                                        key={key}
                                        onClick={() => onChangeStrategy(key)}
                                    >
                                        <Text size='xs' weight={active ? 'bold' : 'normal'}>
                                            {st.label}
                                        </Text>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
                <div className='qs__body__content'>
                    <ThemedScrollbars className='qs__form__container' autohide={false}>
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
                        <div className='qs__body__content__description'>
                            <div>
                                <Text size='xs'>{strategy.description}</Text>
                            </div>
                        </div>
                        <div className='qs__body__content__form'>{children}</div>
                    </ThemedScrollbars>
                    <div className='qs__body__content__footer'>
                        <Button secondary>{localize('Edit')}</Button>
                        <Button primary>{localize('Run')}</Button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default React.memo(FormWrapper);
