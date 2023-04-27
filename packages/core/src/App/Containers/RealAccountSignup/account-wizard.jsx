/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames';
import fromEntries from 'object.fromentries';
import PropTypes from 'prop-types';
import React from 'react';
import { DesktopWrapper, FormProgress, MobileWrapper, Text, Wizard } from '@deriv/components';
import { WS, getLocation, makeCancellablePromise, toMoment } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import AcceptRiskForm from './accept-risk-form.jsx';
import LoadingModal from './real-account-signup-loader.jsx';
import { getItems } from './account-wizard-form';
import { observer, useStore } from '@deriv/stores';
import 'Sass/details-form.scss';

const StepperHeader = ({ has_target, has_real_account, items, getCurrentStep, getTotalSteps, sub_section_index }) => {
    const step = getCurrentStep() - 1;
    const step_title = items[step].header ? items[step].header.title : '';

    return (
        <React.Fragment>
            {(!has_real_account || has_target) && (
                <React.Fragment>
                    <DesktopWrapper>
                        <FormProgress steps={items} current_step={step} sub_section_index={sub_section_index} />
                    </DesktopWrapper>
                    <MobileWrapper>
                        <FormProgress steps={items} current_step={step} sub_section_index={sub_section_index} />
                        <div className='account-wizard__header-steps'>
                            <Text
                                as='h4'
                                styles={{ lineHeight: '20px', color: 'var(--brand-red-coral)' }}
                                size='xs'
                                weight='bold'
                                className='account-wizard__header-steps-title'
                            >
                                <Localize
                                    i18n_default_text='Step {{step}}: {{step_title}} ({{step}} of {{steps}})'
                                    values={{
                                        step: step + 1,
                                        steps: getTotalSteps(),
                                        step_title,
                                    }}
                                />
                            </Text>
                        </div>
                    </MobileWrapper>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

const AccountWizard = observer(props => {
    const { client, ui } = useStore();
    const {
        account_settings,
        fetchAccountSettings,
        fetchFinancialAssessment,
        fetchResidenceList,
        fetchStatesList,
        currency,
        has_active_real_account: has_real_account,
        is_virtual,
        realAccountSignup,
        residence_list,
        residence,
    } = client;
    const {
        closeRealAccountSignup,
        real_account_signup_target,
        setIsTradingAssessmentForNewUserEnabled,
        setShouldShowAppropriatenessWarningModal,
        setShouldShowRiskWarningModal,
        sub_section_index,
    } = ui;
    const has_currency = !!currency;
    const [finished] = React.useState(undefined);
    const [mounted, setMounted] = React.useState(false);
    const [form_error, setFormError] = React.useState('');
    const [previous_data, setPreviousData] = React.useState([]);
    const [state_items, setStateItems] = React.useState([]);
    const [should_accept_financial_risk, setShouldAcceptFinancialRisk] = React.useState(false);

    React.useEffect(() => {
        setIsTradingAssessmentForNewUserEnabled(true);
        fetchStatesList();
        const { cancel, promise } = makeCancellablePromise(fetchResidenceList());
        const { cancel: cancelFinancialAssessment, promise: financial_assessment_promise } = makeCancellablePromise(
            fetchFinancialAssessment()
        );

        Promise.all([promise, financial_assessment_promise]).then(() => {
            setStateItems(previous_state => {
                if (!previous_state.length) {
                    return getItems(props);
                }
                return previous_state;
            });
            setPreviousData(fetchFromStorage());
            setMounted(true);
        });

        return () => {
            cancel();
            cancelFinancialAssessment();
        };
    }, []);

    React.useEffect(() => {
        if (previous_data.length > 0) {
            const items = [...state_items];
            previous_data.forEach((item, index) => {
                if (item instanceof Object) {
                    items[index].form_value = item;
                }
            });
            setStateItems(items);
            setPreviousData([]);
        }
    }, [previous_data]);

    React.useEffect(() => {
        if (residence_list.length) {
            const setDefaultPhone = country_code => {
                let items;
                if (state_items.length) {
                    items = state_items;
                } else {
                    items = getItems(props);
                }

                if (items.length > 1 && 'phone' in items[1]?.form_value) {
                    items[1].form_value.phone = items[1].form_value.phone || country_code || '';
                    setStateItems(items);
                }
            };
            getCountryCode(residence_list).then(setDefaultPhone);
        }
    }, [residence_list]);

    const fetchFromStorage = () => {
        const stored_items = localStorage.getItem('real_account_signup_wizard');
        try {
            const items = JSON.parse(stored_items);
            return items || [];
        } catch (e) {
            return [];
        } finally {
            localStorage.removeItem('real_account_signup_wizard');
        }
    };

    const getCountryCode = async residence_lists => {
        const response = residence_lists.find(item => item.value === residence);
        if (!response || !response.phone_idd) return '';
        return `+${response.phone_idd}`;
    };

    const form_values = () => {
        return state_items
            .map(item => item.form_value)
            .reduce((obj, item) => {
                const original_form_values = fromEntries(new Map(Object.entries(item)));
                const values = Object.keys(original_form_values).reduce((acc, current) => {
                    acc[current] =
                        typeof original_form_values[current] === 'string'
                            ? original_form_values[current].trim()
                            : original_form_values[current];
                    return acc;
                }, {});
                if (values.date_of_birth) {
                    values.date_of_birth = toMoment(values.date_of_birth).format('YYYY-MM-DD');
                }
                if (values.place_of_birth) {
                    values.place_of_birth = values.place_of_birth
                        ? getLocation(residence_list, values.place_of_birth, 'value')
                        : '';
                }
                if (values.citizen) {
                    values.citizen = values.citizen ? getLocation(residence_list, values.citizen, 'value') : '';
                }

                if (values.tax_residence) {
                    values.tax_residence = values.tax_residence
                        ? getLocation(residence_list, values.tax_residence, 'value')
                        : values.tax_residence;
                }

                return {
                    ...obj,
                    ...values,
                };
            }, {});
    };

    const clearError = () => {
        setFormError('');
    };

    const getFinishedComponent = () => {
        return finished;
    };

    const prevStep = (current_step, goToPreviousStep) => {
        if (current_step - 1 < 0) {
            props.onClose();
            return;
        }

        goToPreviousStep();
        clearError();
    };

    const processInputData = data => {
        if (data?.risk_tolerance === 'No') {
            return Object.entries(data).reduce((accumulator, [key, val]) => {
                if (val) {
                    return { ...accumulator, [key]: val };
                }
                return { ...accumulator };
            }, {});
        }
        return data;
    };

    const submitForm = (payload = undefined) => {
        let clone = { ...form_values() };
        delete clone?.tax_identification_confirm;
        delete clone?.agreed_tnc;
        delete clone?.agreed_tos;
        clone = processInputData(clone);
        props.setRealAccountFormData(clone);
        if (payload) {
            clone = {
                ...clone,
                ...payload,
            };
        }
        return realAccountSignup(clone);
    };

    const updateValue = (index, value, setSubmitting, goToNextStep, should_override = false) => {
        saveFormData(index, value);
        clearError();

        // Check if account wizard is not finished
        if (should_override || index + 1 >= state_items.length) {
            createRealAccount({});
        } else {
            goToNextStep();
        }
    };

    const saveFormData = (index, value) => {
        const cloned_items = Object.assign([], state_items);
        cloned_items[index].form_value = value;
        setStateItems(cloned_items);
    };

    const getCurrent = (key, step_index) => {
        return key ? state_items[step_index][key] : state_items[step_index];
    };

    const getPropsForChild = step_index => {
        const passthrough = getCurrent('passthrough', step_index);
        const properties = getCurrent('props', step_index) || {};

        if (passthrough && passthrough.length) {
            passthrough.forEach(item => {
                Object.assign(properties, { [item]: props[item] });
            });
            properties.bypass_to_personal = previous_data.length > 0;
        }
        return properties;
    };

    const submitIDVData = async (document_type, document_number, document_additional = '', country_code) => {
        const idv_submit_data = {
            identity_verification_document_add: 1,
            document_number,
            document_additional,
            document_type: document_type.id,
            issuing_country: country_code,
        };
        await WS.send(idv_submit_data);
    };

    const createRealAccount = (payload = undefined) => {
        props.setLoading(true);
        const form_data = { ...form_values() };
        submitForm(payload)
            .then(response => {
                props.setIsRiskWarningVisible(false);
                if (real_account_signup_target === 'maltainvest') {
                    props.onFinishSuccess(response.new_account_maltainvest.currency.toLowerCase());
                } else if (real_account_signup_target === 'samoa') {
                    props.onOpenWelcomeModal(response.new_account_samoa.currency.toLowerCase());
                } else {
                    props.onFinishSuccess(response.new_account_real.currency.toLowerCase());
                }
                const { document_type, document_number, document_additional } = { ...form_values() };
                if (document_type && document_number) {
                    const country_code = account_settings.citizen || residence;
                    submitIDVData(document_type, document_number, document_additional, country_code);
                }
            })
            .catch(error => {
                if (error.code === 'show risk disclaimer') {
                    props.setIsRiskWarningVisible(true);
                    setShouldAcceptFinancialRisk(true);
                } else if (error.code === 'AppropriatenessTestFailed') {
                    if (form_data?.risk_tolerance === 'No') {
                        fetchAccountSettings();
                        setShouldShowRiskWarningModal(true);
                    } else {
                        setShouldShowAppropriatenessWarningModal(true);
                    }
                } else {
                    props.onError(error, state_items);
                }
            })
            .finally(() => {
                props.setLoading(false);
                localStorage.removeItem('current_question_index');
            });
    };

    const onAcceptRisk = () => {
        createRealAccount({ accept_risk: 1 });
    };

    const onDeclineRisk = () => {
        props.onClose();
        props.setIsRiskWarningVisible(false);
    };

    if (props.is_loading) return <LoadingModal />;

    if (should_accept_financial_risk) {
        return <AcceptRiskForm onConfirm={onAcceptRisk} onClose={onDeclineRisk} />;
    }

    if (!mounted) return null;
    if (!finished) {
        const wizard_steps = state_items.map((step, step_index) => {
            const passthrough = getPropsForChild(step_index);
            const BodyComponent = step.body;
            return (
                <BodyComponent
                    value={getCurrent('form_value', step_index)}
                    index={step_index}
                    onSubmit={updateValue}
                    onCancel={prevStep}
                    onSave={saveFormData}
                    closeRealAccountSignup={closeRealAccountSignup}
                    is_virtual={is_virtual}
                    has_currency={has_currency}
                    form_error={form_error}
                    {...passthrough}
                    key={step_index}
                />
            );
        });

        let navHeader = <div />;
        if (real_account_signup_target !== 'samoa') {
            navHeader = (
                <StepperHeader
                    has_real_account={has_real_account}
                    items={state_items}
                    has_currency={has_currency}
                    has_target={real_account_signup_target !== 'manage'}
                    setIsRiskWarningVisible={props.setIsRiskWarningVisible}
                    sub_section_index={sub_section_index}
                />
            );
        }

        return (
            <Wizard
                nav={navHeader}
                className={classNames('account-wizard', {
                    'account-wizard--set-currency': !has_currency,
                    'account-wizard--deriv-crypto': real_account_signup_target === 'samoa',
                })}
            >
                {wizard_steps}
            </Wizard>
        );
    }

    const FinishedModalItem = getFinishedComponent();
    return <FinishedModalItem />;
});

AccountWizard.propTypes = {
    is_loading: PropTypes.bool,
    onClose: PropTypes.func,
    onError: PropTypes.func,
    onFinishSuccess: PropTypes.func,
    onLoading: PropTypes.func,
    onOpenWelcomeModal: PropTypes.func,
    setIsRiskWarningVisible: PropTypes.func,
    setLoading: PropTypes.func,
};

export default AccountWizard;
