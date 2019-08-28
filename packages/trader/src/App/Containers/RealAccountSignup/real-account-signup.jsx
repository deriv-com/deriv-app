import { Button }           from 'deriv-components';
import React, { Component } from 'react';
import { localize }         from 'App/i18n';
import { Modal }            from 'App/Components/Elements/modal.jsx';
import AccountWizard        from './account-wizard';

const UpgradeButton = ({ text, toggleModal }) => (
    <div className='acc-switcher__new-account'>
        <Button
            id='upgrade-account'
            onClick={toggleModal}
            className='acc-switcher__new-account-link'
            text={text}
        />
    </div>
);

const modal_content = [
    {
        icon : 'IconTheme',
        label: localize('Add an account'),
        value: () => <AccountWizard />,
    },
];

class RealAccountSignup extends Component {
    state = {
        is_open: false,
    }

    closeModal = () => {
        this.setState({
            is_open: false,
        });
    };

    toggleWizard = () => {
        if (this.state.is_open === false) {
            this.setState({
                is_open: !this.state.is_open,
            });
        }
    };

    render () {
        return (
            <div>
                <UpgradeButton
                    toggleModal={this.toggleWizard}
                    text={this.props.text}
                />
                <Modal
                    modal_content={modal_content}
                    is_open={this.state.is_open}
                    is_sidebar_enabled={false}
                    title={localize('Add a real account')}
                    toggleModal={this.closeModal}
                />
            </div>
        );
    }
}

export default RealAccountSignup;
