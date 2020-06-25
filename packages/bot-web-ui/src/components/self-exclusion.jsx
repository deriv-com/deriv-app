import React from 'react';
import PropTypes from 'prop-types';
import { Input, ThemedScrollbars, Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { Formik, Form, Field } from 'formik';
import { connect } from '../stores/connect';

class SelfExclusion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: '',
        };
    }
    render() {
        const {
            max_losses,
            set_max_losses,
            initial_values,
            updateSelfExclusion,
            setLimitations,
            onRunButtonClick,
            ToggleSelfExclusion,
            run_limit,
        } = this.props;
        const form_errors = this.state.errors;
        const setErrors = () => {
            const errors = {};
            if (!max_losses && !set_max_losses) {
                errors.set_max_losses = 'Daily limit on losses should set';
            }
            if (!run_limit) {
                errors.run_limit = 'Maximum consecutive trade should set';
            }
            this.setState({ errors: errors });
        };

        const onSubmitLimits = async () => {
            this.setState({ errors: {} });
            setErrors();
            if (set_max_losses && set_max_losses !== max_losses) {
                const set_losses = await updateSelfExclusion({ max_losses: set_max_losses });
                if (set_losses?.error) {
                    this.setState(pre => ({
                        errors: {
                            ...pre.errors,
                            set_max_losses: set_losses.error.message,
                        },
                    }));
                    return;
                }
                setLimitations('max_losses', set_max_losses);
            }
            onRunButtonClick();
        };
        const onFormChange = (type, e) => {
            setLimitations(type, e.currentTarget.value);
        };
        return (
            <div className='self-exclusion'>
                <div className='self-exclusion__content'>
                    <ThemedScrollbars
                        autohide
                        style={{
                            height: '246px',
                            width: '392px',
                        }}
                    >
                        <div className='self-exclusion__info'>
                            {localize(
                                ' Enter limits to stop your bot from trading when any of these conditions are met.'
                            )}
                        </div>
                        <Formik initialValues={initial_values}>
                            {({ errors, handleChange }) => {
                                return (
                                    <Form>
                                        <Field name='set_max_losses'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    className='self-exclusion__input'
                                                    type='number'
                                                    label={localize('Daily loss limit')}
                                                    onChange={e => {
                                                        handleChange(e);
                                                        onFormChange('set_max_losses', e);
                                                    }}
                                                    error={errors[field.name] || form_errors[field.name]}
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
                                                        onChange={e => {
                                                            handleChange(e);
                                                            onFormChange('run_limit', e);
                                                        }}
                                                        error={errors[field.name] || form_errors[field.name]}
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
                    </ThemedScrollbars>
                </div>

                <div className='self-exclusion__footer'>
                    <Button large text={localize('Cancel')} onClick={ToggleSelfExclusion} secondary />
                    <Button large text={localize('Apply run and bot')} onClick={() => onSubmitLimits()} primary />
                </div>
            </div>
        );
    }
}
SelfExclusion.propTypes = {
    setLimitations: PropTypes.func,
    checkClientRestriction: PropTypes.func,
    virtual_account_loginid: PropTypes.string,
    updateSelfExclusion: PropTypes.func,
    initial_values: PropTypes.object,
    max_losses: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    run_limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    set_max_losses: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default connect(({ client, self_exclusion }) => ({
    setLimitations: self_exclusion.setLimitations,
    checkClientRestriction: self_exclusion.checkClientRestriction,
    virtual_account_loginid: client.virtual_account_loginid,
    updateSelfExclusion: client.updateSelfExclusion,
    initial_values: self_exclusion.initial_values,
    max_losses: self_exclusion.max_losses,
    run_limit: self_exclusion.run_limit,
    set_max_losses: self_exclusion.set_max_losses,
}))(SelfExclusion);
