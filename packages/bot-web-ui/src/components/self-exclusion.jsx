import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Modal, MobileWrapper, Div100vhContainer, FadeWrapper, PageOverlay } from '@deriv/components';
import { localize } from '@deriv/translations';
import { Formik, Form, Field } from 'formik';
import { connect } from '../stores/connect';

const SelfExclusionForm = props => {
    const [form_max_losses, setFormMaxLosses] = React.useState(0);
    const [max_losses_error, setMaxLossesError] = React.useState('');
    const [run_limit_error, setRunLimitError] = React.useState('');
    const {
        initial_values,
        api_max_losses,
        onRunButtonClick,
        run_limit,
        resetSelfExclusion,
        updateSelfExclusion,
        setRunLimit,
    } = props;
    React.useEffect(() => {
        setFormMaxLosses(api_max_losses);
    }, []);

    const resetErrors = () => {
        setMaxLossesError('');
        setRunLimitError('');
    };
    const initialFormErrors = () => {
        if (form_max_losses === 0) {
            setMaxLossesError(localize('This field is required.'));
        }
        if (run_limit < 0) {
            setRunLimitError(localize('This field is required.'));
        }
    };

    const onSubmitLimits = async () => {
        resetErrors();
        initialFormErrors();
        if (form_max_losses !== api_max_losses) {
            if (api_max_losses !== 0 && (form_max_losses === 0 || form_max_losses > api_max_losses)) {
                setMaxLossesError(
                    localize('Please enter a number between 0 and {{api_max_losses}}.', { api_max_losses })
                );
                return;
            }
            const set_losses = await updateSelfExclusion({ max_losses: form_max_losses });
            if (set_losses?.error) {
                setMaxLossesError(localize(set_losses.error.message));
                return;
            }
        }
        onRunButtonClick();
    };
    const onFormLimitUpdate = e => {
        const value = parseInt(e.currentTarget.value);
        if (value) {
            setRunLimit(value);
        }
    };

    const onFormMaxLossesUpdate = e => {
        const value = parseFloat(e.currentTarget.value) || 0;
        setFormMaxLosses(value);
    };
    return (
        <div className='self-exclusion'>
            <div className='self-exclusion__content'>
                <div className='self-exclusion__info'>
                    {localize('Enter limits to stop your bot from trading when any of these conditions are met.')}
                </div>
                <Formik initialValues={initial_values}>
                    {({ errors, handleChange }) => {
                        return (
                            <Form>
                                <Field name='form_max_losses'>
                                    {({ field }) => (
                                        <Input
                                            {...field}
                                            className='self-exclusion__input'
                                            type='number'
                                            label={localize('Daily loss limit')}
                                            value={form_max_losses !== 0 ? form_max_losses : ''}
                                            onChange={e => {
                                                handleChange(e);
                                                onFormMaxLossesUpdate(e);
                                            }}
                                            error={errors[field.name] || max_losses_error}
                                            placeholder='10'
                                            hint={localize(
                                                'Maximum number of trades your bot will execute for this run.'
                                            )}
                                        />
                                    )}
                                </Field>
                                <Field name='run_limit'>
                                    {({ field }) => {
                                        return (
                                            <Input
                                                {...field}
                                                className='self-exclusion__input'
                                                type='number'
                                                label={localize('Maximum consecutive trades')}
                                                placeholder='10'
                                                value={run_limit > 0 ? run_limit : ''}
                                                onChange={e => {
                                                    handleChange(e);
                                                    onFormLimitUpdate(e);
                                                }}
                                                error={errors[field.name] || run_limit_error}
                                                hint={localize(
                                                    'Maximum number of trades your bot will execute for this run.'
                                                )}
                                            />
                                        );
                                    }}
                                </Field>
                            </Form>
                        );
                    }}
                </Formik>
            </div>

            <div className='self-exclusion__footer'>
                <Button large text={localize('Cancel')} onClick={resetSelfExclusion} secondary />
                <Button large text={localize('Apply and run')} onClick={onSubmitLimits} primary />
            </div>
        </div>
    );
};

const SelfExclusion = props => {
    const { is_restricted, resetSelfExclusion, is_mobile } = props;
    return (
        <>
            {is_mobile ? (
                <FadeWrapper is_visible={is_restricted} className='limits__wrapper' keyname='limitis__wrapper'>
                    <PageOverlay header={localize('Limits')} onClickClose={resetSelfExclusion}>
                        <MobileWrapper>
                            <Div100vhContainer className='limits__wrapper--is-mobile' height_offset='80px'>
                                <SelfExclusionForm {...props} />
                            </Div100vhContainer>
                        </MobileWrapper>
                    </PageOverlay>
                </FadeWrapper>
            ) : (
                <Modal
                    is_open={is_restricted}
                    has_close_icon
                    width='500px'
                    toggleModal={resetSelfExclusion}
                    className='self-exclusion__modal'
                    title={localize('Limits')}
                >
                    <SelfExclusionForm {...props} />
                </Modal>
            )}
        </>
    );
};

SelfExclusion.propTypes = {
    is_mobile: PropTypes.bool,
    is_restricted: PropTypes.bool,
    initial_values: PropTypes.object,
    api_max_losses: PropTypes.number,
    run_limit: PropTypes.PropTypes.number,
    resetSelfExclusion: PropTypes.func,
    setRunLimit: PropTypes.func,
    updateSelfExclusion: PropTypes.func,
    virtual_account_loginid: PropTypes.string,
};

export default connect(({ client, self_exclusion, ui }) => ({
    initial_values: self_exclusion.initial_values,
    is_mobile: ui.is_mobile,
    is_restricted: self_exclusion.is_restricted,
    api_max_losses: self_exclusion.api_max_losses,
    run_limit: self_exclusion.run_limit,
    resetSelfExclusion: self_exclusion.resetSelfExclusion,
    setRunLimit: self_exclusion.setRunLimit,
    updateSelfExclusion: client.updateSelfExclusion,
    virtual_account_loginid: client.virtual_account_loginid,
}))(SelfExclusion);
