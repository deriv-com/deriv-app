import PropTypes from 'prop-types';
import React from 'react';
import Button from '../button/button.jsx';
import Icon from '../icon/icon.jsx';

class SendEmailTemplate extends React.Component {
    resend_interval = null;

    state = {
        is_email_not_received_clicked: false,
        resend_timeout: this.props.resend_timeout || 60,
    };

    componentWillUnmount() {
        clearInterval(this.resend_interval);
    }

    onClickEmailNotReceived = () => {
        this.setState({ is_email_not_received_clicked: true });
    };

    onClickResendEmail = () => {
        this.startCountdownTimer();
        this.props.onClickSendEmail();
    };

    startCountdownTimer = () => {
        this.setState(
            prevState => ({
                resend_timeout: prevState.resend_timeout - 1,
            }),
            () => {
                this.resend_interval = setInterval(() => {
                    if (this.state.resend_timeout === 1) {
                        this.setState({ resend_timeout: 60 });
                        clearInterval(this.resend_interval);
                    } else {
                        this.setState(prevState => ({ resend_timeout: prevState.resend_timeout - 1 }));
                    }
                }, 1000);
            }
        );
    };

    render() {
        const is_resend_btn_disabled = this.state.resend_timeout < 60;
        const resend_email_btn_text =
            this.state.resend_timeout < 60
                ? this.props.txt_resend_in.replace('{{seconds}}', this.state.resend_timeout)
                : this.props.txt_resend;

        return (
            <div className='send-email-template'>
                <div className='send-email-template__sent'>
                    <Icon icon='IcEmailSent' className='send-email-template__icon' size={128} />
                    <h1 className='send-email-template__title'>{this.props.title}</h1>
                    <p className='send-email-template__subtitle'>{this.props.subtitle}</p>
                    <Button
                        className='send-email-template__btn'
                        onClick={this.onClickEmailNotReceived}
                        text={this.props.lbl_no_receive}
                        tertiary
                    />
                </div>
                {this.state.is_email_not_received_clicked && (
                    <>
                        <div className={`send-email-template__resend ${this.props.className}`}>
                            {this.props.children}
                        </div>
                        <div className='send-email-template__cta'>
                            <Button
                                className='send-email-template__cta-btn'
                                is_disabled={is_resend_btn_disabled}
                                has_effect
                                text={resend_email_btn_text}
                                onClick={this.onClickResendEmail}
                                primary
                            />
                        </div>
                    </>
                )}
            </div>
        );
    }
}

SendEmailTemplate.propTypes = {
    is_disabled: PropTypes.bool,
    lbl_no_receive: PropTypes.string,
    onClickSendEmail: PropTypes.func,
    subtitle: PropTypes.string,
    txt_resend: PropTypes.string,
    txt_resend_in: PropTypes.string,
    title: PropTypes.string,
};

export default SendEmailTemplate;
