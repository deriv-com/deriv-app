import React, { useRef, useState } from 'react';
import { Form as FormikForm, Formik } from 'formik';
import * as Yup from 'yup';
import { MobileFullPageModal, Modal } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { SERVER_BOT_CONFIG } from '../config';
import DesktopFormWrapper from './form-wrappers/desktop-form-wrapper';
import MobileFormWrapper from './form-wrappers/mobile-form-wrapper';
import LossThresholdWarningDialog from './parts/loss-threshold-warning-dialog';
import { STRATEGIES } from './config';
import { SERVER_BOT_FIELDS } from './constants';
import Form from './form';
import { TConfigItem, TFormData } from './types';
import './add-bot.scss';

type TFormikWrapper = {
    children: React.ReactNode;
    setFormVisibility: (visibility: boolean) => void;
};

const getErrorMessage = (dir: 'MIN' | 'MAX', value: number, type = 'DEFAULT') => {
    const errors: { [key: string]: { MIN: string; MAX: string } } = {
        DURATION: {
            MIN: localize('Minimum duration: {{ value }}', { value }),
            MAX: localize('Maximum duration: {{ value }}', { value }),
        },
        LAST_DIGIT_PREDICTION: {
            MIN: localize('Enter a value from {{ value }} to 9.', { value }),
            MAX: localize('Enter a value from 0 to {{ value }}.', { value }),
        },
        DEFAULT: {
            MIN: localize('The value must be equal or greater than {{ value }}', { value }),
            MAX: localize('The value must be equal or less than {{ value }}', { value }),
        },
    };
    return errors[type][dir];
};

export const FormikWrapper: React.FC<TFormikWrapper> = observer(({ children, setFormVisibility }) => {
    const { server_bot } = useDBotStore();
    const { selected_strategy, current_duration_min_max, initializeLossThresholdWarningData, createBot } = server_bot;
    const config: TConfigItem[][] = STRATEGIES[selected_strategy]?.fields;
    const [dynamic_schema, setDynamicSchema] = useState(Yup.object().shape({}));
    const is_mounted = useRef(true);

    let initial_value: TFormData | null = null;

    const getSavedValues = () => {
        let data: TFormData | null = null;
        try {
            data = JSON.parse(localStorage.getItem(SERVER_BOT_FIELDS) || '{}');
        } catch {
            data = null;
        }
        return data;
    };

    const getInitialValue = () => {
        const data = getSavedValues();
        initial_value = {
            name: data?.name ?? 'Martingale',
            symbol: data?.symbol ?? SERVER_BOT_CONFIG.DEFAULT.symbol,
            tradetype: data?.tradetype ?? '',
            type: data?.type ?? '',
            durationtype: data?.durationtype ?? SERVER_BOT_CONFIG.DEFAULT.durationtype,
            duration: data?.duration ?? '1',
            stake: data?.stake ?? '1',
            loss: data?.loss ?? '',
            profit: data?.profit ?? '',
            size: data?.size ?? String(SERVER_BOT_CONFIG.DEFAULT.size),
            max_stake: data?.max_stake ?? 10,
        };
        return initial_value;
    };

    React.useEffect(() => {
        initializeLossThresholdWarningData();

        return () => {
            is_mounted.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getErrors = (formikData: TFormData) => {
        const sub_schema: Record<string, any> = {};
        config.forEach(group => {
            if (!group?.length) return null;
            group.forEach(field => {
                if (field?.validation?.length && field?.name) {
                    if (field.validation.includes('number')) {
                        let schema: Record<string, any> = Yup.number().typeError(localize('Must be a number'));
                        let min = 0;
                        let max = 10;
                        let min_error = getErrorMessage('MIN', min);
                        let max_error = getErrorMessage('MAX', max);
                        let integer_error_message = '';
                        if (field.name === 'duration' && current_duration_min_max) {
                            min = current_duration_min_max.min;
                            max = current_duration_min_max.max;
                            min_error = getErrorMessage('MIN', min, 'DURATION');
                            max_error = getErrorMessage('MAX', max, 'DURATION');
                        }
                        const should_validate = field.should_have
                            ? field.should_have?.every(item => {
                                  const item_value = formikData?.[item.key]?.toString();
                                  if (item.multiple) return item.multiple.includes(item_value);
                                  return formikData?.[item.key] === item.value;
                              })
                            : true;
                        if (should_validate && field.name === 'max_stake') {
                            min = +form_data?.stake;
                            if (isNaN(min)) {
                                min = +(initial_value?.stake ?? 0);
                            }
                            min_error = getErrorMessage('MIN', min);
                        }
                        if (should_validate && field.name === 'last_digit_prediction') {
                            min = 0;
                            max = 9;
                            max_error = getErrorMessage('MAX', max, 'LAST_DIGIT_PREDICTION');
                            integer_error_message = 'Enter a value from 0 to 9.';
                        }
                        if (should_validate) {
                            field.validation.forEach(validation => {
                                if (typeof validation === 'string') {
                                    switch (validation) {
                                        case 'required':
                                            schema = schema.required(localize('Field cannot be empty'));
                                            break;
                                        case 'min':
                                            schema = schema.min(min, min_error);
                                            break;
                                        case 'max':
                                            schema = schema.max(max, max_error);
                                            break;
                                        case 'ceil':
                                            schema = schema.round('ceil');
                                            break;
                                        case 'floor':
                                            schema = schema.round('floor');
                                            break;
                                        case 'integer':
                                            schema = schema.integer(integer_error_message);
                                            break;
                                        default:
                                            break;
                                    }
                                } else if (typeof validation === 'object') {
                                    if (validation?.type) {
                                        schema = schema[validation.type](
                                            validation.value,
                                            localize(validation.getMessage(validation.value))
                                        );
                                    }
                                }
                            });
                        }
                        sub_schema[field.name] = schema;
                    } else if (field.validation.includes('required') && field?.type === 'text') {
                        const schema = Yup.string().required(localize('Field cannot be empty'));
                        sub_schema[field.name] = schema;
                    }
                }
            });
        });
        if (is_mounted.current) {
            setDynamicSchema(Yup.object().shape(sub_schema));
        }
    };

    const handleSubmit = (form_data: TFormData) => {
        setFormVisibility(false);
        localStorage?.setItem(SERVER_BOT_FIELDS, JSON.stringify(form_data));
        createBot(form_data);
    };

    return (
        <Formik
            initialValues={getInitialValue()}
            validationSchema={dynamic_schema}
            onSubmit={handleSubmit}
            validate={values => getErrors(values)}
            validateOnChange={false}
        >
            {children}
        </Formik>
    );
});

type TAddForm = {
    setFormVisibility: (visibility: boolean) => void;
    is_open: boolean;
};

const AddForm: React.FC<TAddForm> = observer(({ setFormVisibility, is_open }) => {
    const { ui } = useStore();
    const { is_desktop } = ui;

    const handleClose = () => {
        setFormVisibility(false);
    };

    return (
        <FormikWrapper setFormVisibility={setFormVisibility}>
            <FormikForm>
                <LossThresholdWarningDialog />
                {is_desktop ? (
                    <Modal className='modal--strategy' is_open={is_open} width='58rem'>
                        <DesktopFormWrapper onClickClose={handleClose}>
                            <Form />
                        </DesktopFormWrapper>
                    </Modal>
                ) : (
                    <MobileFullPageModal
                        is_modal_open={is_open}
                        className='quick-strategy__wrapper'
                        header={localize('Add Bot')}
                        onClickClose={handleClose}
                        height_offset='8rem'
                    >
                        <MobileFormWrapper>
                            <Form />
                        </MobileFormWrapper>
                    </MobileFullPageModal>
                )}
            </FormikForm>
        </FormikWrapper>
    );
});

export default AddForm;
