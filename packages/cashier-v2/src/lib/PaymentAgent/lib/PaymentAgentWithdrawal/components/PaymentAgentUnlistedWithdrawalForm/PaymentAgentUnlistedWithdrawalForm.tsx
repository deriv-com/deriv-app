import React from 'react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useActiveAccount } from '@deriv/api-v2';
import { LabelPairedCircleXmarkMdFillIcon, StandaloneArrowLeftBoldIcon } from '@deriv/quill-icons';
import { Button, Input, Text } from '@deriv-com/ui';
import styles from './PaymentAgentUnlistedWithdrawalForm.module.scss';

const PaymentAgentUnlistedWithdrawalForm = () => {
    const { data: activeAccount } = useActiveAccount();
    const onSubmitHandler = () => undefined;

    return (
        <div className={styles.container}>
            <div className={styles['back-section']}>
                <StandaloneArrowLeftBoldIcon data-testid='dt-back-arrow-icon' iconSize='md' />
                <Text size='sm' weight='bold'>
                    Back to list
                </Text>
            </div>
            <Formik
                initialValues={{
                    accountNumber: '',
                    amount: '',
                }}
                onSubmit={onSubmitHandler}
            >
                {({ errors, isSubmitting, isValid, setFieldValue, touched, values }) => {
                    const isFormEmpty = !Object.values(values).some(Boolean);

                    return (
                        <Form className={styles.form}>
                            <Field name='account_number'>
                                {({ field }: FieldProps) => (
                                    <Input
                                        {...field}
                                        autoComplete='off'
                                        error={touched.accountNumber && Boolean(errors.accountNumber)}
                                        isFullWidth
                                        label='Enter the payment agent account number'
                                        maxLength={30}
                                        message='Example: CR123456789'
                                        required
                                        rightPlaceholder={
                                            errors.accountNumber ? (
                                                <LabelPairedCircleXmarkMdFillIcon
                                                    onClick={() => setFieldValue('accountNumber', '')}
                                                />
                                            ) : null
                                        }
                                        type='text'
                                    />
                                )}
                            </Field>
                            <div className={styles['amount-input']}>
                                <Field name='amount'>
                                    {({ field }: FieldProps) => (
                                        <Input
                                            {...field}
                                            autoComplete='off'
                                            error={touched.amount && Boolean(errors.amount)}
                                            isFullWidth
                                            label='Enter amount'
                                            maxLength={30}
                                            required
                                            rightPlaceholder={
                                                <Text as='span' size='sm'>
                                                    {activeAccount?.currency_config?.display_code}
                                                </Text>
                                            }
                                            type='text'
                                        />
                                    )}
                                </Field>
                                <Button
                                    disabled={!isValid || isSubmitting || isFormEmpty}
                                    size='lg'
                                    textSize='sm'
                                    type='submit'
                                >
                                    Continue
                                </Button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
            <Text as='p' color='less-prominent' size='xs'>
                Note: Deriv does not charge any transfer fees.
            </Text>
        </div>
    );
};

export default PaymentAgentUnlistedWithdrawalForm;
