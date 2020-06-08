import React from 'react';
import PropTypes from 'prop-types';
import { Input, ThemedScrollbars, Button } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { Formik, Form, Field } from 'formik';
import { connect } from '../stores/connect';

class SelfExclusion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            limit_error: '',
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
            run_limit,
        } = this.props;
        const self_exclusion_status = max_losses || localize('Not set');

        const onSwitchAccount = async () => {
            const { switchAccount, virtual_account_loginid, checkClientRestriction } = this.props;
            await switchAccount(virtual_account_loginid);
            checkClientRestriction();
        };
        const onSubmitLimits = async () => {
            if (!max_losses && !set_max_losses) {
                this.setState({ limit_error: 'Daily limit on losses should set' });
                return;
            }
            if (!run_limit) {
                this.setState({ limit_error: 'Maximum consecutive trade should set' });
                return;
            }
            if (set_max_losses && set_max_losses !== max_losses) {
                const set_losses = await updateSelfExclusion({ max_losses: set_max_losses });
                if (set_losses?.error) {
                    this.setState({ limit_error: set_losses.error.message });
                    return;
                }
                setLimitations('max_losses', set_max_losses);
            }
            onRunButtonClick();
        };
        const onFormChange = (type, e) => {
            this.setState({ limit_error: '' });
            setLimitations(type, e.currentTarget.value);
        };
        return (
            <div className='self-exclusion'>
                <ThemedScrollbars
                    autohide
                    style={{
                        height: '250px',
                        width: '480px',
                    }}
                >
                    <div className='self-exclusion__info'>
                        <Localize
                            i18n_default_text='<0> Please enter the following limits. Your bot will stop trading if either of these limits are met.</0> Daily limit on losses: <1>{{self_exclusion_status}}</1>'
                            values={{ self_exclusion_status }}
                            components={[
                                <div key={0} />,
                                <span className='self-exclusion__limit-status--bold' key={1} />,
                            ]}
                        />
                        {this.state.limit_error && (
                            <div className='self-exclusion--danger'>{localize(this.state.limit_error)}</div>
                        )}
                    </div>
                    <Formik initialValues={initial_values}>
                        {({ handleChange }) => {
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
                                                placeholder='10'
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
                                                />
                                            );
                                        }}
                                    </Field>
                                </Form>
                            );
                        }}
                    </Formik>
                </ThemedScrollbars>

                <div className='self-exclusion__footer'>
                    <Button
                        large
                        text={localize('Continue with demo account')}
                        onClick={() => onSwitchAccount()}
                        secondary
                    />
                    <Button large text={localize('Apply limits')} onClick={() => onSubmitLimits()} primary />
                </div>
            </div>
        );
    }
}
SelfExclusion.propTypes = {
    setLimitations: PropTypes.func,
    checkClientRestriction: PropTypes.func,
    switchAccount: PropTypes.func,
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
    switchAccount: client.switchAccount,
    virtual_account_loginid: client.virtual_account_loginid,
    updateSelfExclusion: client.updateSelfExclusion,
    initial_values: self_exclusion.initial_values,
    max_losses: self_exclusion.max_losses,
    run_limit: self_exclusion.run_limit,
    set_max_losses: self_exclusion.set_max_losses,
}))(SelfExclusion);
