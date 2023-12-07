import React from 'react';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { Button, Text, ThemedScrollbars } from '@deriv/components';
import Icon from '@deriv/components/src/components/icon/icon';
import { observer, useStore } from '@deriv/stores';
import { Analytics } from '@deriv/analytics';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { STRATEGIES } from '../config';
import FormTabs from './form-tabs';
import StrategyDescription from './strategy-description';
import useQsSubmitHandler from './useQsSubmitHandler';
import '../quick-strategy.scss';

type TDesktopFormWrapper = {
    children: React.ReactNode;
};

const FormWrapper: React.FC<TDesktopFormWrapper> = observer(({ children }) => {
    const [activeTab, setActiveTab] = React.useState('TRADE_PARAMETERS');
    const { submitForm, isValid, setFieldValue, validateForm } = useFormikContext();
    const { quick_strategy } = useDBotStore();
    const { selected_strategy, setSelectedStrategy, setFormVisibility } = quick_strategy;
    const strategy = STRATEGIES[selected_strategy as keyof typeof STRATEGIES];
    const { handleSubmit } = useQsSubmitHandler();
    const handleClose = () => {
        Analytics.trackEvent('ce_bot_quick_strategy_form', {
            action: 'close',
            form_source: 'ce_bot_quick_strategy_form',
        });
        setFormVisibility(false);
    };

    React.useEffect(() => {
        validateForm();
    }, [selected_strategy, validateForm]);

    const onChangeStrategy = (strategy: string) => {
        setSelectedStrategy(strategy);
        setActiveTab('TRADE_PARAMETERS');
        // on strategy selection
        Analytics.trackEvent('ce_bot_quick_strategy_form', {
            action: 'choose_strategy',
            strategy_type: strategy,
        });
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const onEdit = async () => {
        await setFieldValue('action', 'EDIT');
        submitForm();
    };

    return (
        <div className='qs'>
            <div className='qs__head'>
                <div className='qs__head__title'>
                    <Text weight='bold'>{localize('Quick Strategy')}</Text>
                </div>
                <div className='qs__head__action'>
                    <span data-testid='qs-desktop-close-button' onClick={() => handleClose()}>
                        <Icon icon='IcCross' />
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
                                const str = STRATEGIES[key];
                                const active = key === selected_strategy;
                                return (
                                    <li
                                        className={classNames({ active })}
                                        key={key}
                                        onClick={() => onChangeStrategy(String(key))}
                                    >
                                        <Text size='xs' weight={active ? 'bold' : 'normal'}>
                                            {str.label}
                                        </Text>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
                <div className='qs__body__content'>
                    <ThemedScrollbars
                        className={classNames('qs__form__container', {
                            'qs__form__container--no-footer': activeTab !== 'TRADE_PARAMETERS',
                        })}
                        autohide={false}
                    >
                        <FormTabs
                            active_tab={activeTab}
                            onChange={handleTabChange}
                            description={strategy?.long_description}
                        />
                        <StrategyDescription formfields={children} active_tab={activeTab} />
                    </ThemedScrollbars>
                    {activeTab === 'TRADE_PARAMETERS' && (
                        <div className='qs__body__content__footer'>
                            <Button secondary disabled={!isValid} onClick={onEdit}>
                                {localize('Edit')}
                            </Button>
                            <Button data-testid='qs-run-button' primary onClick={handleSubmit} disabled={!isValid}>
                                {localize('Run')}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

export default React.memo(FormWrapper);
