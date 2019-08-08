import React         from 'react';
import PropTypes     from 'prop-types';
import FullPageModal from 'App/Components/Elements/FullPageModal/full-page-modal.jsx';
import Localize      from 'App/Components/Elements/localize.jsx';
import Button        from 'App/Components/Form/button.jsx';
import Dropdown      from 'App/Components/Form/DropDown';
// import InputField    from 'App/Components/Form/InputField/input-field.jsx';
import { localize }  from 'App/i18n';
import { connect }   from 'Stores/connect';

// const onClose = (ui) => {
//     ui.toggleUnsupportedContractModal(false);
// };

const AccountSignup = ({ onSignup, residence_list }) => {
    // THIS COMPONENT IS A WIP; IT IS NOT READY FOR USE.
    const obj_user_input = { password: null, residence: null };

    const onInputChange = ({ target }) => {
        const { name, value } = target;
        obj_user_input[name] = value;
    };

    const onSubmitSignup = () => onSignup(obj_user_input);

    return (
        <div className='account-signup'>
            <h3>
                <Localize i18n_default_text='Thanks for verifying your email.' />
            </h3>
            <input type='password' name='password' onChange={onInputChange} required placeholder={localize('Create a password')} />
            {/* <InputField */}
            {/*    name='password' */}
            {/*    type='password' */}
            {/*    placeholder='Create a password' */}
            {/*    required */}
            {/*    onChange={onInputChange} */}
            {/* /> */}
            <Dropdown
                id='signup_modal'
                is_alignment_left
                is_nativepicker={false}
                list={residence_list}
                name='residence'
                onChange={onInputChange}
            />
            <Button onClick={onSubmitSignup}>
                <Localize i18n_default_text='Start trading' />
            </Button>
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
