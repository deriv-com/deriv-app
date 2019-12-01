import PropTypes              from 'prop-types';
import React                  from 'react';
import { Button }             from 'deriv-components';
import ButtonLink             from 'App/Components/Routes/button-link.jsx';
import { localize, Localize } from 'deriv-translations';
import Icon                   from 'Assets/icon.jsx';
import { WS }                 from 'Services';
import { connect }            from 'Stores/connect';

const ErrorComponent = ({
    header,
    message,
    button_link,
    onClickButton,
    button_text,
    footer,
}) => (
    <div className='cashier__wrapper'>
        <Icon icon='IconCashierError' className='cashier-error__icon' />
        {header && <h2 className='cashier-error__header'>{header}</h2>}
        {message && <p className='cashier__paragraph'>{message}</p>}
        {button_link &&
        <ButtonLink
            className='cashier-error__button'
            to={button_link}
            onClick={onClickButton}
            primary
            large
        >
            <span className='btn__text'>{button_text}</span>
        </ButtonLink>
        }
        {!button_link && button_text &&
            <Button
                className='cashier-error__button'
                onClick={onClickButton}
                text={button_text}
                primary
                large
            />
        }
        {footer && <h2 className='cashier-error__footer'>{footer}</h2>}
    </div>
);

class Error extends React.Component {
    error_fields = {
        address_city    : localize('Town/City'),
        address_line_1  : localize('First line of home address'),
        address_postcode: localize('Postal Code/ZIP'),
        address_state   : localize('State/Province'),
        email           : localize('Email address'),
        phone           : localize('Telephone'),
        residence       : localize('Country of Residence'),
    };

    onClickButton = () => {
        if (typeof this.props.error.onClickButton === 'function') {
            this.props.error.onClickButton();
        }
        this.clearErrorMessage();
    }

    closeCashierModal = () => {
        this.onClickButton();
        this.props.toggleCashierModal();
    }

    clearErrorMessage = () => {
        this.props.setErrorMessage('');
    };

    acceptTNC = async () => {
        await WS.tncApproval();
        this.onClickButton();
    };

    render() {
        let AccountError;
        switch (this.props.error.code) {
            case 'InvalidToken':
                AccountError = (
                    <ErrorComponent
                        header={localize('Identity confirmation failed')}
                        message={<Localize i18n_default_text='It looks like your link is incorrect or no longer valid.' />}
                        onClickButton={this.onClickButton}
                        button_text={localize('Request a new link')}
                    />
                );
                break;
            case 'ASK_TNC_APPROVAL':
                AccountError = (
                    <ErrorComponent
                        header={localize('Our terms and conditions have changed')}
                        message={
                            <Localize
                                i18n_default_text='Please accept our updated <0>terms and conditions</0> to continue.'
                                components={[ (
                                    <a
                                        key={0}
                                        className='link'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        href='https://www.deriv.com/terms-and-conditions/#general'
                                    />
                                ) ]}
                            />
                        }
                        onClickButton={this.acceptTNC}
                        button_text={localize('I accept')}
                    />
                );
                break;
            case 'ASK_FIX_DETAILS':
                AccountError = (
                    <ErrorComponent
                        header={localize('Update your personal details')}
                        message={
                            <React.Fragment>
                                <Localize i18n_default_text={'We can\'t validate your personal details because there is some information missing.'} />&nbsp;
                                {this.props.error.fields ?
                                    <Localize
                                        i18n_default_text={'Please update your {{details}} to continue.'}
                                        values={{
                                            details      : this.props.error.fields.map(field => (this.error_fields[field] || field)).join(', '),
                                            interpolation: { escapeValue: false },
                                        }}
                                    />
                                    :
                                    <Localize i18n_default_text={'Please update your details to continue.'} />
                                }
                            </React.Fragment>
                        }
                        button_link='/account/personal-details'
                        onClickButton={this.closeCashierModal}
                        button_text={localize('Update my details')}
                        footer={
                            <Localize
                                i18n_default_text='Need help? <0>Contact us</0>.'
                                components={[ (
                                    <a
                                        key={0}
                                        className='link'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        href='https://www.deriv.com/help-centre/'
                                    />
                                ) ]}
                            />
                        }
                    />
                );
                break;
            case 'WrongResponse':
                AccountError = (
                    <ErrorComponent
                        header={this.props.error.message}
                        onClickButton={this.onClickButton}
                        button_text={localize('Try again')}
                    />
                );
                break;
            default:
                AccountError = <ErrorComponent header={this.props.error.message} />;
                break;
        }
        return AccountError;
    }
}

Error.propTypes = {
    error             : PropTypes.object,
    setErrorMessage   : PropTypes.func,
    toggleCashierModal: PropTypes.func,
};

export default connect(
    ({ modules, ui }) => ({
        setErrorMessage   : modules.cashier.setErrorMessage,
        toggleCashierModal: ui.toggleCashierModal,
    })
)(Error);
