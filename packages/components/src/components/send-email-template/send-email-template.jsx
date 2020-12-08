import PropTypes from 'prop-types';
import React from 'react';
import { useEffect } from 'react';
import Button from '../button/button.jsx';
import Icon from '../icon/icon.jsx';

const SendEmailTemplate = ({ resend_timeout, onClickSendEmail, txt_resend_in, txt_resend, title, subtitle, lbl_no_receive, className, children, }) => {
    const [resend_timeout_state, setResendTimeoutState] = useState(resend_timeout || 60);
    const [is_email_not_received_clicked, setIsEmailNotReceivedClicked] = useState(false);
    
    const resend_interval = null;

    useEffect(() => {
        return () => {
            clearInterval(resend_interval);
        }
    }, []);

    const onClickResendEmail = () => {
        startCountdownTimer();
        onClickSendEmail();
    };

    const startCountdownTimer = () => {
        setResendTimeoutState(resend_timeout - 1);
        resend_interval = setInterval(() => {
            if (!!resend_timeout_state) {
                clearInterval(resend_interval);
            }
            setResendTimeoutState(!!resend_timeout_state ? 60 : resend_timeout_state - 1);
        }, 1000);
    };

    const is_resend_btn_disabled = resend_timeout_state < 60;
    const resend_email_btn_text =
        resend_timeout_state < 60
            ? txt_resend_in.replace('{{seconds}}', resend_timeout_state)
            : txt_resend;

    return (
        <div className='send-email-template'>
            <div className='send-email-template__sent'>
                <Icon icon='IcEmailSent' className='send-email-template__icon' size={128} />
                <h1 className='send-email-template__title'>{title}</h1>
                <p className='send-email-template__subtitle'>{subtitle}</p>
                <Button
                    className='send-email-template__btn'
                    onClick={setIsEmailNotReceivedClicked(true)}
                    text={lbl_no_receive}
                    tertiary
                />
            </div>
            {is_email_not_received_clicked && (
                <>
                    <div className={`send-email-template__resend ${className}`}>
                        {children}
                    </div>
                    <div className='send-email-template__cta'>
                        <Button
                            className='send-email-template__cta-btn'
                            is_disabled={is_resend_btn_disabled}
                            has_effect
                            text={resend_email_btn_text}
                            onClick={onClickResendEmail}
                            primary
                        />
                    </div>
                </>
            )}
        </div>
    );
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
