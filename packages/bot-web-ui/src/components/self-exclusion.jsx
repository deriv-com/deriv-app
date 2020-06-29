import React from 'react';
import PropTypes from 'prop-types';
import {
    Input,
    ThemedScrollbars,
    Button,
    Modal,
    MobileWrapper,
    Div100vhContainer,
    FadeWrapper,
    PageOverlay,
} from '@deriv/components';
import { localize } from '@deriv/translations';
import { Formik, Form, Field } from 'formik';
import { connect } from '../stores/connect';

class SelfExclustionForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: '',
        };
    }
    render() {
        const {
            initial_values,
            max_losses,
            onRunButtonClick,
            run_limit,
            set_max_losses,
            setLimitations,
            ToggleSelfExclusion,
            updateSelfExclusion,
            is_mobile,
        } = this.props;
        const form_errors = this.state.errors;
        const setErrors = () => {
            const errors = {};
            if (!max_losses && !set_max_losses) {
                errors.set_max_losses = localize('This field is required.');
            }
            if (!run_limit) {
                errors.run_limit = localize('This field is required.');
            }
            this.setState({ errors });
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
                            set_max_losses: localize(set_losses.error.message),
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
                            height: is_mobile ? 'calc(100vh - 250px)' : '246',
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
                    <Button large text={localize('Apply and run')} onClick={() => onSubmitLimits()} primary />
                </div>
            </div>
        );
    }
}

class SelfExclusion extends React.PureComponent {
    render() {
        const { is_restricted, ToggleSelfExclusion, is_mobile } = this.props;
        return (
            <>
                {is_mobile ? (
                    <FadeWrapper is_visible={is_restricted} className='limits__wrapper' keyname='limitis__wrapper'>
                        <PageOverlay header={localize('Limits')} onClickClose={ToggleSelfExclusion}>
                            <MobileWrapper>
                                <Div100vhContainer className='limits__wrapper--is-mobile' height_offset='80px'>
                                    <SelfExclustionForm {...this.props} />
                                </Div100vhContainer>
                            </MobileWrapper>
                        </PageOverlay>
                    </FadeWrapper>
                ) : (
                    <Modal
                        is_open={is_restricted}
                        has_close_icon
                        width='500px'
                        toggleModal={ToggleSelfExclusion}
                        className='self-exclusion__modal'
                        title={localize('Limits')}
                    >
                        <SelfExclustionForm {...this.props} />
                    </Modal>
                )}
            </>
        );
    }
}
SelfExclusion.propTypes = {
    checkClientRestriction: PropTypes.func,
    is_mobile: PropTypes.bool,
    is_restricted: PropTypes.bool,
    initial_values: PropTypes.object,
    max_losses: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    run_limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    set_max_losses: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    setLimitations: PropTypes.func,
    ToggleSelfExclusion: PropTypes.func,
    updateSelfExclusion: PropTypes.func,
    virtual_account_loginid: PropTypes.string,
};

export default connect(({ client, self_exclusion, ui }) => ({
    checkClientRestriction: self_exclusion.checkClientRestriction,
    initial_values: self_exclusion.initial_values,
    is_mobile: ui.is_mobile,
    is_restricted: self_exclusion.is_restricted,
    max_losses: self_exclusion.max_losses,
    set_max_losses: self_exclusion.set_max_losses,
    run_limit: self_exclusion.run_limit,
    setLimitations: self_exclusion.setLimitations,
    ToggleSelfExclusion: self_exclusion.ToggleSelfExclusion,
    updateSelfExclusion: client.updateSelfExclusion,
    virtual_account_loginid: client.virtual_account_loginid,
}))(SelfExclusion);
