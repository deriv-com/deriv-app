/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { FormikProps, FormikValues } from 'formik';
import fromEntries from 'object.fromentries';
import { personalDetailsConfig, addressDetailsConfig } from '@deriv/account';
import {
    Wizard,
    Text,
    Icon,
    Loading,
    FormCancelButton,
    DesktopWrapper,
    MobileWrapper,
    Dialog,
} from '@deriv/components';
import { useIsMounted, isMobile, getLocation, toMoment, isDesktop } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { useStores } from 'Stores';
import NewWalletModal from 'Components/modals/new-wallet-modal';
import { getItems } from './items';
import { TWizardItemConfig, TAccountWizard } from './types';

type TCancelProgressModalProps = {
    is_visible: boolean;
    onConfirm: () => void;
    onClose: () => void;
};

const CancelProgressModal = ({ is_visible, onConfirm, onClose }: TCancelProgressModalProps) => (
    <Dialog
        className='cancel-progress-modal'
        title={localize('Cancel add wallet?')}
        confirm_button_text={localize('Yes')}
        cancel_button_text={localize('No')}
        onConfirm={onConfirm}
        onCancel={onClose}
        is_closed_on_cancel
        is_visible={is_visible}
    >
        <Localize i18n_default_text='Are you sure you want to cancel adding a wallet?' />
    </Dialog>
);

type TStepperHeaderProps = {
    items: TWizardItemConfig[];
    getCurrentStep?: () => number;
    goToStep?: (step: number) => void;
    onCancel: () => void;
    items_enabled: boolean[];
    selected_step_ref?: React.RefObject<FormikProps<FormikValues>>;
};

const StepperHeader = ({
    items,
    getCurrentStep,
    goToStep,
    onCancel,
    items_enabled,
    selected_step_ref,
}: TStepperHeaderProps) => {
    const current_step = (getCurrentStep?.() || 1) - 1;

    const isDisabled = (i: number) => {
        if (i > current_step && items_enabled[i - 1]) {
            return false;
        }
        if (i <= current_step) return false;

        return true;
    };

    const navigateTo = (i: number) => {
        if (!isDisabled(i) && isDesktop()) {
            // next step
            if (i === current_step + 1) {
                selected_step_ref?.current?.submitForm();
            } else {
                goToStep?.(i + 1);
            }
        }
    };

    const filtered_items = isMobile() ? items.filter((_item, i) => i === current_step) : items;

    return (
        <div className='dw-account-wizard__header'>
            <div className='dw-account-wizard__header-steps'>
                {filtered_items.map((item, i) => (
                    <div
                        key={i}
                        className={classNames('dw-account-wizard__header-step', {
                            'dw-account-wizard__header-step--disabled': isDisabled(i),
                            'dw-account-wizard__header-step--active': i === current_step,
                        })}
                        onClick={() => navigateTo(i)}
                    >
                        <Icon
                            size={24}
                            icon={i < current_step ? 'IcDashboardCheck' : item.icon}
                            custom_color={i < current_step ? 'var(--brand-red-coral)' : ''}
                            color={isDisabled(i) ? 'disabled' : ''}
                        />
                        <DesktopWrapper>
                            <Text
                                size='xxs'
                                weight={i === current_step ? 'bold' : ''}
                                className='dw-account-wizard__header-step-title'
                                color={isDisabled(i) ? 'disabled' : ''}
                            >
                                {i + 1}. {item.header.title}
                            </Text>
                            <div className='dw-account-wizard__header-step-line' />
                        </DesktopWrapper>
                        <MobileWrapper>
                            <div className='dw-account-wizard__header-step-title-wrapper'>
                                <Text size='xxs' className='dw-account-wizard__header-step-title'>
                                    {localize('Step {{current_step}} of {{total_step}}', {
                                        current_step: current_step + 1,
                                        total_step: items.length,
                                    })}
                                </Text>
                                <Text size='s' weight='bold' className='dw-account-wizard__header-step-title'>
                                    {item.header.title}
                                </Text>
                            </div>
                            <Icon icon='IcCross' onClick={onCancel} />
                        </MobileWrapper>
                    </div>
                ))}
            </div>
            <div className='dw-account-wizard__header-active-title'>
                <Text size={isMobile() ? 'xsm' : 'm'} weight='bold'>
                    {items[current_step]?.header.active_title}
                </Text>
            </div>
        </div>
    );
};

const AccountWizard: React.FC<TAccountWizard> = (props: TAccountWizard) => {
    const [form_error, setFormError] = React.useState('');
    const [previous_data, setPreviousData] = React.useState([]);
    const [state_items, setStateItems] = React.useState<TWizardItemConfig[]>([]);
    const [items_enabled, setItemsEnabled] = React.useState<boolean[]>([]);
    const isMounted = useIsMounted();
    const selected_step_ref = React.useRef(null);
    const props_ref = React.useRef<TAccountWizard>(props);
    props_ref.current = props;

    const {
        fetchStatesList,
        fetchResidenceList,
        fetchFinancialAssessment,
        account_settings,
        has_currency,
        is_loading,
        onCancel,
    } = props;

    React.useEffect(() => {
        if (!account_settings) return;

        Promise.all([fetchStatesList?.(), fetchResidenceList?.(), fetchFinancialAssessment?.()]).then(() => {
            if (isMounted()) {
                setStateItems((previous_state: TWizardItemConfig[]) => {
                    if (!previous_state.length) {
                        return getItems(props_ref.current);
                    }
                    return previous_state;
                });
                setPreviousData(fetchFromStorage());
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            setPreviousData([]);
        }
    }, [previous_data, state_items]);

    const fetchFromStorage = () => {
        const stored_items = localStorage.getItem('real_account_signup_wizard');
        try {
            const items = stored_items ? JSON.parse(stored_items) : {};
            return items || [];
        } catch (e) {
            return [];
        } finally {
            localStorage.removeItem('real_account_signup_wizard');
        }
    };

    const getFormValues = () => {
        const wizard_steps = state_items;

        if (props.has_wallet_account) {
            // To get default personal and address details from `account_settings`
            wizard_steps.push(personalDetailsConfig(props), addressDetailsConfig(props));
        }

        return wizard_steps
            .map(item => item.form_value)
            .reduce((obj, item: any) => {
                const values = fromEntries(new Map(Object.entries(item)));
                if (values.date_of_birth) {
                    values.date_of_birth = toMoment(values.date_of_birth).format('YYYY-MM-DD');
                }
                if (values.place_of_birth) {
                    values.place_of_birth = values.place_of_birth
                        ? getLocation(props.residence_list, values.place_of_birth, 'value')
                        : '';
                }
                if (values.citizen) {
                    values.citizen = values.citizen ? getLocation(props.residence_list, values.citizen, 'value') : '';
                }

                if (values.tax_residence) {
                    values.tax_residence = values.tax_residence
                        ? getLocation(props.residence_list, values.tax_residence, 'value')
                        : values.tax_residence;
                }

                return {
                    ...obj,
                    ...values,
                };
            });
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

    const updateValue = (index: number, value: any, _setSubmitting: () => void, goToNextStep: () => void) => {
        saveFormData(index, value);
        clearError();
        // Check if account wizard is not finished
        if (index + 1 >= state_items.length) {
            submitForm();
        } else {
            goToNextStep();
        }
    };

    const saveFormData = (index: number, value: { [x: string]: unknown }) => {
        const cloned_items: TWizardItemConfig[] = Object.assign([], state_items);
        cloned_items[index].form_value = value;
        setStateItems(cloned_items);
    };

    const submitForm = () => {
        const clone = { ...getFormValues() };
        delete clone.tax_identification_confirm; // This is a manual field and it does not require to be sent over

        // Todo: wallet creation api integration
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
            properties.bypass_to_personal = previous_data.length > 0;
        }
        return properties;
    };

    const onSubmitEnabledChange = (step_index: number, is_enabled: boolean) => {
        const items_enabled_clone = items_enabled.slice(0, is_enabled ? items_enabled.length : step_index);
        items_enabled_clone[step_index] = is_enabled;
        setItemsEnabled(items_enabled_clone);
    };

    if (is_loading) return <Loading is_fullscreen />;
    if (!isMounted()) return null;

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
                onSubmitEnabledChange={(is_enabled: boolean) => onSubmitEnabledChange(step_index, is_enabled)}
                has_currency={has_currency}
                form_error={form_error}
                {...passthrough}
                key={step_index}
            />
        );
    });
    return (
        <React.Fragment>
            <Wizard
                nav={<StepperHeader items={state_items} onCancel={onCancel} items_enabled={items_enabled} />}
                className={classNames('dw-account-wizard')}
                selected_step_ref={selected_step_ref}
            >
                {wizard_steps}
            </Wizard>
            <DesktopWrapper>
                <FormCancelButton label={localize('Cancel')} is_absolute onCancel={onCancel} />
            </DesktopWrapper>
        </React.Fragment>
    );
};

const AccountWizardWrapper: React.FC = () => {
    const { client, ui } = useStores();
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
        financial_assessment,
        has_wallet_account,
    } = client;
    const { real_account_signup_target } = ui;
    const [is_cancel_visible, setIsCancelVisisible] = React.useState(false);
    const [is_new_wallet_modal_visible, setIsNewWalletModalVisible] = React.useState(false);

    return (
        <React.Fragment>
            <AccountWizard
                account_settings={account_settings}
                is_fully_authenticated={is_fully_authenticated}
                realAccountSignup={realAccountSignup}
                has_real_account={has_active_real_account}
                upgrade_info={upgrade_info}
                real_account_signup_target={real_account_signup_target}
                has_currency={has_currency}
                setAccountCurrency={setAccountCurrency}
                residence={residence}
                residence_list={residence_list}
                states_list={states_list}
                fetchResidenceList={fetchResidenceList}
                fetchStatesList={fetchStatesList}
                fetchFinancialAssessment={fetchFinancialAssessment}
                financial_assessment={financial_assessment}
                has_wallet_account={has_wallet_account}
                onCancel={() => setIsCancelVisisible(true)}
            />
            <CancelProgressModal
                is_visible={is_cancel_visible}
                onClose={() => setIsCancelVisisible(false)}
                onConfirm={() => setIsCancelVisisible(true)}
            />
            <NewWalletModal
                is_open={is_new_wallet_modal_visible}
                onClose={() => setIsNewWalletModalVisible(false)}
                onConfirm={() => setIsNewWalletModalVisible(true)}
            />
        </React.Fragment>
    );
};

export default observer(AccountWizardWrapper);
