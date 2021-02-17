import PropTypes from 'prop-types';
import React from 'react';
import Button from '../button/button.jsx';
import Icon from '../icon/icon.jsx';
import Text from '../text';

const SendEmailTemplate = ({
    children,
    className,
    lbl_no_receive,
    onClickSendEmail,
    resend_timeout,
    subtitle,
    title,
    txt_resend,
    txt_resend_in,
}) => {
    const [is_email_not_received_clicked, setIsEmailNotReceivedClicked] = React.useState(false);
    const [is_resend_btn_disabled, setIsResendBtnDisabled] = React.useState(false);
    const [resend_email_btn_text, setResendEmailBtnText] = React.useState(txt_resend);

    const timeout_limit = resend_timeout || 60;
    let resend_interval = null;

    React.useEffect(() => {
        return () => {
            clearInterval(resend_interval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onClickEmailNotReceived = () => {
        if (!is_email_not_received_clicked) {
            setIsEmailNotReceivedClicked(true);
        }
    };

    const onClickResendEmail = () => {
        startCountdownTimer();
        onClickSendEmail();
    };

    const startCountdownTimer = () => {
        let timeout = timeout_limit;
        setIsResendBtnDisabled(true);
        resend_interval = setInterval(() => {
            if (--timeout) {
                setResendEmailBtnText(txt_resend_in.replace('{{seconds}}', timeout));
            } else {
                setIsResendBtnDisabled(false);
                setResendEmailBtnText(txt_resend);
                clearInterval(resend_interval);
            }
        }, 1000);
    };

    return (
        <div className='send-email-template'>
            <div className='send-email-template__sent'>
                <Icon icon='IcEmailSent' className='send-email-template__icon' size={128} />
                <h1 className='send-email-template__title'>{title}</h1>
                <Text
                    as='p'
                    size='xs'
                    align='center'
                    styles={{ lineHeight: '20px' }}
                    className='send-email-template__subtitle'
                >
                    {subtitle}
                </Text>
                <Button
                    className='send-email-template__btn'
                    onClick={onClickEmailNotReceived}
                    text={lbl_no_receive}
                    tertiary
                />
            </div>
            {is_email_not_received_clicked && (
                <>
                    <div className={`send-email-template__resend ${className}`}>{children}</div>
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
};

SendEmailTemplate.propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    is_disabled: PropTypes.bool,
    lbl_no_receive: PropTypes.string,
    onClickSendEmail: PropTypes.func,
    subtitle: PropTypes.string,
    txt_resend: PropTypes.string,
    txt_resend_in: PropTypes.string,
    title: PropTypes.string,
};

export default SendEmailTemplate;
