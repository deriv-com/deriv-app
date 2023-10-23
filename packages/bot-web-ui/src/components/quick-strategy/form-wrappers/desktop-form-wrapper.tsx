import React from 'react';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { Button, Text, ThemedScrollbars } from '@deriv/components';
import Icon from '@deriv/components/src/components/icon/icon';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { STRATEGIES } from '../config';
import '../quick-strategy.scss';

type TDesktopFormWrapper = {
    children: React.ReactNode;
};

const FormWrapper: React.FC<TDesktopFormWrapper> = observer(({ children }) => {
    // const [active_tab, setActiveTab] = React.useState('TRADE_PARAMETERS');
    const { submitForm, isValid, setFieldValue, validateForm } = useFormikContext();
    const { quick_strategy, run_panel } = useDBotStore();
    const { selected_strategy, setSelectedStrategy, setFormVisibility, toggleStopBotDialog } = quick_strategy;
    const strategy = STRATEGIES[selected_strategy as keyof typeof STRATEGIES];
    const handleClose = () => {
        setFormVisibility(false);
    };

    React.useEffect(() => {
        validateForm();
    }, [selected_strategy, validateForm]);

    const onChangeStrategy = (strategy: string) => {
        setSelectedStrategy(strategy);
    };

    const onEdit = async () => {
        await setFieldValue('action', 'EDIT');
        submitForm();
    };

    const handleSubmit = async () => {
        if (run_panel.is_running) {
            await setFieldValue('action', 'EDIT');
            submitForm();
            toggleStopBotDialog();
        } else {
            await setFieldValue('action', 'RUN');
            submitForm();
        }
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
                    <ThemedScrollbars className='qs__form__container' autohide={false}>
                        {/* <div className='qs__body__content__head'>
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
                        </div> */}
                        <div className='qs__body__content__description'>
                            <div>
                                <Text size='xs'>{strategy.description}</Text>
                            </div>
                        </div>
                        <div className='qs__body__content__form'>{children}</div>
                    </ThemedScrollbars>
                    <div className='qs__body__content__footer'>
                        <Button secondary disabled={!isValid} onClick={onEdit}>
                            {localize('Edit')}
                        </Button>
                        <Button data-testid='qs-run-button' primary onClick={handleSubmit} disabled={!isValid}>
                            {localize('Run')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default React.memo(FormWrapper);
