import classNames from 'classnames';
import React from 'react';
import { Wizard, Text, Icon, Loading } from '@deriv/components';
import { useIsMounted } from '@deriv/shared';
import { GetSettings } from '@deriv/api-types';
import { useStores } from 'Stores';
import { getItems } from './items';
import { TWizardItemConfig } from './types';

const StepperHeader = ({ items, getCurrentStep }: { items: TWizardItemConfig[]; getCurrentStep?: () => number }) => {
    const current_step = (getCurrentStep?.() || 1) - 1;

    return (
        <div className='dw-account-wizard__header'>
            <div className='dw-account-wizard__header-steps'>
                {items.map((item, i) => (
                    <div key={i} className='dw-account-wizard__header-step'>
                        <Icon size={24} icon='IcDashboardWallet' />
                        <Text size='xxs' weight='bold' className='dw-account-wizard__header-step-title'>
                            {i + 1}. {item.header.title}
                        </Text>
                        <div className='dw-account-wizard__header-step-line' />
                    </div>
                ))}
            </div>
            <div className='dw-account-wizard__header-active-title'>
                <Text size='m' weight='bold' styles={{ lineHeight: '3.6rem' }}>
                    {items[current_step]?.header.active_title}
                </Text>
            </div>
        </div>
    );
};

type TAccountWizard = {
    fetchResidenceList: () => void;
    fetchStatesList: () => void;
    fetchFinancialAssessment: () => void;
    needs_financial_assessment: () => boolean;
    has_currency: () => boolean;
    has_real_account: () => boolean;
    account_settings: GetSettings;
    [x: string]: any;
};

const AccountWizard: React.FC<TAccountWizard> = (props: TAccountWizard) => {
    const [form_error, setFormError] = React.useState('');
    const [previous_data, setPreviousData] = React.useState([]);
    const [state_items, setStateItems] = React.useState<TWizardItemConfig[]>([]);
    const [has_previous_data, setHasPreviousData] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);
    const isMounted = useIsMounted();
    const {
        fetchStatesList,
        fetchResidenceList,
        fetchFinancialAssessment,
        account_settings,
        createRealAccount,
        has_currency,
        has_real_account,
        is_loading,
    } = props;

    React.useEffect(() => {
        if (!account_settings) return;

        Promise.all([fetchStatesList(), fetchResidenceList(), fetchFinancialAssessment()]).then(() => {
            if (isMounted()) {
                setStateItems((previous_state: any) => {
                    if (!previous_state.length) {
                        return getItems(props);
                    }
                    return previous_state;
                });
                setPreviousData(fetchFromStorage());
                setMounted(true);
            }
        });
    }, [account_settings]);

    React.useEffect(() => {
        if (previous_data.length > 0) {
            const items = [...state_items];
            previous_data.forEach((item: any, index) => {
                if (item instanceof Object) {
                    items[index].form_value = item;
                }
            });
            setStateItems(items);
            setHasPreviousData(true);
            setPreviousData([]);
        }
    }, [previous_data]);

    const fetchFromStorage = () => {
        const stored_items = localStorage.getItem('real_account_signup_wizard');
        try {
            const items = stored_items ? JSON.parse(stored_items) : {};
            localStorage.removeItem('real_account_signup_wizard');
            return items || [];
        } catch (e) {
            localStorage.removeItem('real_account_signup_wizard');
            return [];
        }
    };

    const clearError = () => {
        setFormError('');
    };

    const prevStep = (current_step: number, goToPreviousStep: () => void) => {
        if (current_step - 1 < 0) {
            props.onClose();
            return;
        }

        goToPreviousStep();
    };

    const updateValue = (index: number, value: any, setSubmitting: () => void, goToNextStep: () => void) => {
        saveFormData(index, value);
        clearError();
        // Check if account wizard is not finished
        if ((!has_currency && has_real_account) || index + 1 >= state_items.length) {
            createRealAccount(setSubmitting);
        } else {
            goToNextStep();
        }
    };

    const saveFormData = (index: number, value: { [x: string]: unknown }) => {
        const cloned_items: TWizardItemConfig[] = Object.assign([], state_items);
        cloned_items[index].form_value = value;
        setStateItems(cloned_items);
    };

    const getCurrent = (key: keyof TWizardItemConfig, step_index: number) => {
        return key ? state_items[step_index][key] : state_items[step_index];
    };

    const getPropsForChild = (step_index: number) => {
        const passthrough: TWizardItemConfig['passthrough'] = getCurrent(
            'passthrough',
            step_index
        ) as TWizardItemConfig['passthrough'];
        const properties: TWizardItemConfig['props'] = (getCurrent('props', step_index) ||
            {}) as TWizardItemConfig['props'];

        if (passthrough && passthrough.length) {
            passthrough.forEach((item: string) => {
                Object.assign(properties, { [item]: props[item] });
            });
            properties.bypass_to_personal = has_previous_data;
        }
        return properties;
    };

    if (is_loading) return <Loading is_fullscreen />;
    if (!mounted) return null;

    const wizard_steps = state_items.map((step: TWizardItemConfig, step_index: number) => {
        const passthrough = getPropsForChild(step_index);
        const BodyComponent = step.body;
        return (
            <BodyComponent
                value={getCurrent('form_value', step_index)}
                index={step_index}
                onSubmit={updateValue}
                onCancel={prevStep}
                onSave={saveFormData}
                has_currency={has_currency}
                form_error={form_error}
                {...passthrough}
                key={step_index}
            />
        );
    });
    return (
        <Wizard nav={<StepperHeader items={state_items} />} className={classNames('dw-account-wizard')}>
            {wizard_steps}
        </Wizard>
    );
};

const AccountWizardWrapper: React.FC = () => {
    const { client_store, ui_store, mt5_store } = useStores();
    const {
        account_settings,
        is_fully_authenticated,
        realAccountSignup,
        has_active_real_account,
        upgrade_info,
        has_currency,
        setAccountCurrency,
        residence,
        residence_list,
        states_list,
        fetchResidenceList,
        fetchStatesList,
        fetchFinancialAssessment,
        needs_financial_assessment,
        financial_assessment,
    } = client_store;
    const { real_account_signup_target } = ui_store;

    return (
        <AccountWizard
            {...{
                account_settings,
                is_fully_authenticated,
                realAccountSignup,
                has_real_account: has_active_real_account,
                upgrade_info,
                real_account_signup_target,
                has_currency,
                setAccountCurrency,
                residence,
                residence_list,
                states_list,
                fetchResidenceList,
                fetchStatesList,
                fetchFinancialAssessment,
                needs_financial_assessment,
                financial_assessment,
            }}
        />
    );
};

export default AccountWizardWrapper;
