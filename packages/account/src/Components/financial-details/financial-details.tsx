import classNames from 'classnames';
import { Formik } from 'formik';
import React from 'react';
import {
    AutoHeightWrapper,
    Div100vhContainer,
    FormSubmitButton,
    Modal,
    Text,
    ThemedScrollbars,
} from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { EMPLOYMENT_VALUES } from '../../Constants/financial-details';
import FinancialInformation from './financial-details-partials';
import { splitValidationResultTypes } from '../real-account-signup/helpers/utils';
import ScrollToFieldWithError from '../forms/scroll-to-field-with-error';
import InlineNoteWithIcon from '../inline-note-with-icon';

type TFinancialDetailsFormValues = {
    income_source: string;
    employment_industry: string;
    occupation: string;
    source_of_wealth: string;
    education_level: string;
    net_income: string;
    estimated_worth: string;
    account_turnover: string;
};

type TFinancialDetails = {
    goToPreviousStep: () => void;
    goToNextStep: () => void;
    getCurrentStep: () => number;
    onSave: (current_step: number, values: TFinancialDetailsFormValues) => void;
    onSubmit: (
        current_step: number,
        values: TFinancialDetailsFormValues,
        actions: (isSubmitting: boolean) => void,
        props: () => void
    ) => void;
    onCancel: (current_step: number, props: () => void) => void;
    validate: (values: TFinancialDetailsFormValues) => object;
    is_eu_user: boolean;
    value: TFinancialDetailsFormValues;
    employment_status: string;
};

/**
 * A wrapper for the financial details form.
 * @name FinancialDetails
 * @param {TFinancialDetails} props  - props of the component
 * @returns {React.ReactNode} React component that renders FinancialDetails form.
 */
const FinancialDetails = observer((props: TFinancialDetails) => {
    const handleCancel = (values: TFinancialDetailsFormValues) => {
        const current_step = props.getCurrentStep() - 1;
        props.onSave(current_step, values);
        props.onCancel(current_step, props.goToPreviousStep);
    };

    const {
        traders_hub: { is_eu_user },
    } = useStore();

    const handleValidate = (values: TFinancialDetailsFormValues) => {
        const { errors } = splitValidationResultTypes(props.validate(values));
        return errors;
    };

    const fields_to_scroll_top = isMobile()
        ? ['income_source', 'account_turnover', 'estimated_worth']
        : ['income_source'];
    const fields_to_scroll_bottom = isMobile() ? [] : ['account_turnover', 'estimated_worth'];

    return (
        <Formik
            initialValues={{ ...props.value }}
            validate={handleValidate}
            onSubmit={(values, actions) => {
                props.onSubmit(props.getCurrentStep() - 1, values, actions.setSubmitting, props.goToNextStep);
            }}
            validateOnMount
        >
            {({ handleSubmit, isSubmitting, values }) => {
                return (
                    <AutoHeightWrapper default_height={200}>
                        {({
                            setRef,
                            height,
                        }: {
                            setRef: (instance: HTMLFormElement) => void;
                            height?: number | string;
                        }) => (
                            <form ref={setRef} onSubmit={handleSubmit} noValidate>
                                <ScrollToFieldWithError
                                    fields_to_scroll_top={fields_to_scroll_top}
                                    fields_to_scroll_bottom={fields_to_scroll_bottom}
                                />
                                <Div100vhContainer
                                    className={classNames('details-form', 'financial-assessment')}
                                    height_offset='110px'
                                    is_disabled={isDesktop()}
                                >
                                    {is_eu_user ? (
                                        <div className='details-form__banner-container'>
                                            <InlineNoteWithIcon
                                                icon='IcAlertWarning'
                                                message={
                                                    <Localize i18n_default_text='We collect information about your employment as part of our due diligence obligations, as required by anti-money laundering legislation.' />
                                                }
                                                title={localize('Why do we collect this?')}
                                            />
                                        </div>
                                    ) : (
                                        <Text
                                            as='p'
                                            color='prominent'
                                            size='xxs'
                                            className='trading-assessment__side-note'
                                        >
                                            <Localize i18n_default_text='We collect information about your employment as part of our due diligence obligations, as required by anti-money laundering legislation.' />
                                        </Text>
                                    )}
                                    <ThemedScrollbars autohide={window.innerHeight >= 890} height={Number(height) - 77}>
                                        <div
                                            className={classNames(
                                                'details-form__elements',
                                                'financial-assessment__form'
                                            )}
                                        >
                                            <FinancialInformation employment_status={props.employment_status} />
                                        </div>
                                    </ThemedScrollbars>
                                </Div100vhContainer>
                                <Modal.Footer has_separator is_bypassed={isMobile()}>
                                    <FormSubmitButton
                                        is_disabled={
                                            isSubmitting ||
                                            !!(
                                                props.employment_status === EMPLOYMENT_VALUES.EMPLOYED &&
                                                values?.occupation === EMPLOYMENT_VALUES.UNEMPLOYED
                                            )
                                        }
                                        is_absolute={isMobile()}
                                        label={localize('Next')}
                                        has_cancel
                                        cancel_label={localize('Previous')}
                                        onCancel={() => handleCancel(values)}
                                    />
                                </Modal.Footer>
                            </form>
                        )}
                    </AutoHeightWrapper>
                );
            }}
        </Formik>
    );
});

export default FinancialDetails;
