import React         from 'react';
import PropTypes     from 'prop-types';
import Input         from 'deriv-components/lib/input';
import Form          from 'deriv-components/lib/form';
import FullPageModal from 'App/Components/Elements/FullPageModal/full-page-modal.jsx';
import Localize      from 'App/Components/Elements/localize.jsx';
import Button        from 'deriv-components/lib/button';
// import Dropdown      from 'App/Components/Form/DropDown';
import { localize }  from 'App/i18n';
import { connect }   from 'Stores/connect';
import Icon          from 'Assets/icon.jsx';

// const onClose = (ui) => {
//     ui.toggleUnsupportedContractModal(false);
// };

const signupInitialValues = { password: '', residence: '' };

const validateSignup = (values) => {
    const errors = {};

    if (!values.password) {
        errors.password = 'Password is required';
    }

    if (!values.residence) {
        errors.residence = 'Residence is required';
    }

    return errors;
};

const AccountSignup = ({ onSignup, residence_list }) => {
    return (
        <div className='account-signup'>
            {/* <h3> */}
            {/*    <Localize i18n_default_text='Thanks for verifying your email.' /> */}
            {/* </h3> */}
            <Form
                initialValues={signupInitialValues}
                validate={validateSignup}
                onSubmit={onSignup}
            >
                {
                    ({ resetForm }) => (
                        <React.Fragment>
                            <Input
                                type='text'
                                name='residence'
                                label={localize('Choose country')}
                                required
                                trailing_icon={<Icon icon='IconArrow' />}
                            />

                            <Button type='submit'>
                                <Localize i18n_default_text='Start trading' />
                            </Button>
                            <Button type='button' onClick={resetForm}>
                                <Localize i18n_default_text='Reset form (remove this)' />
                            </Button>
                        </React.Fragment>
                    )
                }
            </Form>
        </div>
    );
};

const AccountSignupModal = ({ is_visible, onSignup, residence_list }) => {
    return (
        <FullPageModal is_visible={is_visible}>
            <AccountSignup onSignup={onSignup} residence_list={residence_list} />
        </FullPageModal>
    );
};

AccountSignupModal.propTypes = {
    is_visible    : PropTypes.bool,
    onSignup      : PropTypes.func,
    residence_list: PropTypes.arrayOf(PropTypes.object),
};

export default connect(
    ({ ui, client }) => ({
        is_visible    : ui.is_account_signup_modal_visible,
        onSignup      : client.onSignup,
        residence_list: client.residence_list,
    }),
)(AccountSignupModal);
