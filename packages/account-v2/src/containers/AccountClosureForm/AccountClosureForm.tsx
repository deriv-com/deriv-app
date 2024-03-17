import React, { Fragment, useReducer, useRef } from 'react';
import { Field, Form, Formik, FormikProps } from 'formik';
import { StandaloneTriangleExclamationRegularIcon } from '@deriv/quill-icons';
import { Button, Checkbox, Modal, Text, TextArea } from '@deriv-com/ui';
import {
    accountClosureReasons,
    CHARACTER_LIMIT_FOR_CLOSING_ACCOUNT,
    MAX_ALLOWED_REASONS_FOR_CLOSING_ACCOUNT,
    TAccountClosureFormActions,
} from '../../constants';
import { getAccountClosureValidationSchema, TAccountClosureReasonsFormValues } from '../../utils/accountClosure';

export const AccountClosureForm = ({ handleOnBack }: { handleOnBack: () => void }) => {
    const reasons = accountClosureReasons();
    const validationSchema = getAccountClosureValidationSchema();

    const formRef = useRef<FormikProps<TAccountClosureReasonsFormValues>>(null);

    const initialState = {
        disableCheckbox: false,
        displayConfirmModal: false,
        displaySuccessModal: false,
        remainingCharacters: CHARACTER_LIMIT_FOR_CLOSING_ACCOUNT,
    };

    const reducer = (state: typeof initialState, action: TAccountClosureFormActions) => {
        switch (action.type) {
            case 'disableCheckbox': {
                const disableCheckbox =
                    Object.values(action.payload).filter(Boolean).length >= MAX_ALLOWED_REASONS_FOR_CLOSING_ACCOUNT;
                return { ...state, disableCheckbox };
            }

            case 'remainingCharacters': {
                const { doToImprove, otherTradingPlatforms } = action.payload;
                const remainingCharacters =
                    CHARACTER_LIMIT_FOR_CLOSING_ACCOUNT -
                    (doToImprove ?? '').concat(otherTradingPlatforms ?? '').length;
                return { ...state, remainingCharacters };
            }
            case 'displayConfirmModal': {
                return { ...state, displayConfirmModal: !state.displayConfirmModal };
            }
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <Fragment>
            <Formik
                initialValues={validationSchema.getDefault()}
                innerRef={formRef}
                onSubmit={() => dispatch({ payload: true, type: 'displayConfirmModal' })}
                validationSchema={validationSchema}
            >
                {({ setFieldValue, values }) => (
                    <Form>
                        <section>
                            <div className='gap-8 flex flex-col my-16'>
                                {reasons.map(({ label, ref, value }) => (
                                    <Field
                                        as={Checkbox}
                                        disabled={
                                            state.disableCheckbox &&
                                            !values[ref as keyof TAccountClosureReasonsFormValues]
                                        }
                                        key={value}
                                        label={label}
                                        name={ref}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            setFieldValue(ref, event.target.checked);
                                            dispatch({
                                                payload: { ...values, [ref]: event.target.checked },
                                                type: 'disableCheckbox',
                                            });
                                        }}
                                        type='checkbox'
                                    />
                                ))}
                            </div>
                            <Field
                                as={TextArea}
                                className='mb-12'
                                label="If you don't mind sharing, which other trading platforms do you use?"
                                name='otherTradingPlatforms'
                                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                                    setFieldValue('otherTradingPlatforms', event.target.value);
                                    dispatch({
                                        payload: { ...values, otherTradingPlatforms: event.target.value },
                                        type: 'remainingCharacters',
                                    });
                                }}
                                textSize={'sm'}
                                type='textarea'
                            />
                            <Field
                                as={TextArea}
                                hint={`Remaining characters: ${state.remainingCharacters}`}
                                label='What could we do to improve?'
                                name='doToImprove'
                                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                                    setFieldValue('doToImprove', event.target.value);
                                    dispatch({
                                        payload: { ...values, doToImprove: event.target.value },
                                        type: 'remainingCharacters',
                                    });
                                }}
                                textSize={'sm'}
                                type='textarea'
                            />
                        </section>
                        <section className='mt-24 flex gap-x-16 justify-end'>
                            <Button
                                color='black'
                                onClick={handleOnBack}
                                rounded='sm'
                                size='md'
                                type='button'
                                variant='outlined'
                            >
                                Back
                            </Button>
                            <Button color='primary' rounded='sm' size='md' type='submit' variant='contained'>
                                Continue
                            </Button>
                        </section>
                    </Form>
                )}
            </Formik>
            <Modal className='p-24 w-[440px] sm:w-[312px]' isOpen={state.displayConfirmModal}>
                <Modal.Body className='flex flex-col'>
                    <StandaloneTriangleExclamationRegularIcon
                        className='self-center fill-status-light-danger'
                        iconSize='2xl'
                    />
                    <Text align='center' as='h4' size='md' weight='bold'>
                        Close your account?
                    </Text>
                    <Text align='center' as='p' className='mt-24' size='sm'>
                        Closing your account will automatically log you out. We shall delete your personal information
                        as soon as our legal obligations are met.
                    </Text>
                </Modal.Body>
                <Modal.Footer className='mt-24 flex gap-x-16 justify-end' hideBorder>
                    <Button
                        color='black'
                        onClick={() => {
                            dispatch({ payload: false, type: 'displayConfirmModal' });
                            // [TODO]: Handle Form submission by enabling the below lines and make API call
                        }}
                        rounded='sm'
                        size='md'
                        type='button'
                        variant='outlined'
                    >
                        Go back
                    </Button>
                    <Button
                        color='primary'
                        onClick={() => dispatch({ payload: false, type: 'displayConfirmModal' })}
                        rounded='sm'
                        size='md'
                    >
                        Close account
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};
