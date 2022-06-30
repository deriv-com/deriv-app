import VerificationStore from '../verification-store';

let root_store, verification_store, WS;

beforeEach(() => {
    WS = {
        verifyEmail: jest.fn(),
    };
    root_store = {
        client: {
            email: 'george@gmail.com',
            setVerificationCode: jest.fn(),
        },
        modules: {
            cashier: {
                general_store: {
                    active_container: 'payment_agent',
                },
                payment_agent: jest.fn(),
            },
        },
    };
    verification_store = new VerificationStore({ WS, root_store });
});

describe('VerificationStore', () => {
    it('should change value of the variable is_button_clicked', () => {
        verification_store.setIsButtonClicked(false);

        expect(verification_store.is_button_clicked).toBeFalsy();

        verification_store.setIsButtonClicked(true);

        expect(verification_store.is_button_clicked).toBeTruthy();
    });
    it('should change value of the variable timeout_button', () => {
        verification_store.setTimeoutButton('100');

        expect(verification_store.timeout_button).toBe('100');
    });
    it('should change value of the variable is_email_sent', () => {
        verification_store.setIsEmailSent(false);

        expect(verification_store.is_email_sent).toBeFalsy();

        verification_store.setIsEmailSent(true);

        expect(verification_store.is_email_sent).toBeTruthy();
    });
    it('should change value of the variable is_resend_clicked', () => {
        verification_store.setIsResendClicked(false);

        expect(verification_store.is_resend_clicked).toBeFalsy();

        verification_store.setIsResendClicked(true);

        expect(verification_store.is_resend_clicked).toBeTruthy();
    });
    it('should change value of the variable resend_timeout', () => {
        verification_store.setResendTimeout('20');

        expect(verification_store.resend_timeout).toBe('20');
    });
    it('should clear verification timeout', () => {
        jest.useFakeTimers();
        verification_store.setTimeoutButton('123');
        verification_store.clearTimeoutVerification();

        expect(clearTimeout).toHaveBeenCalledTimes(1);
        expect(clearTimeout).toHaveBeenCalledWith('123');
        jest.useRealTimers();
    });
    it('should set verification timeout', () => {
        jest.useFakeTimers();
        const spyClearTimeoutVerification = jest.spyOn(verification_store, 'clearTimeoutVerification');
        const spyClearVerification = jest.spyOn(verification_store, 'clearVerification');
        verification_store.setTimeoutVerification();
        jest.runAllTimers();

        expect(spyClearTimeoutVerification).toHaveBeenCalled();
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 3600000);
        expect(spyClearVerification).toHaveBeenCalledTimes(1);
        jest.useRealTimers();
    });
    it('should not send an email if is_button_clicked="true"', async () => {
        verification_store.WS.verifyEmail.mockResolvedValue({});
        verification_store.setIsButtonClicked(true);
        await verification_store.sendVerificationEmail();

        expect(verification_store.is_email_sent).toBeFalsy();
    });
    it('should not send an email if there is no client email', async () => {
        verification_store.root_store.client.email = '';
        verification_store.WS.verifyEmail.mockResolvedValue({});
        await verification_store.sendVerificationEmail();

        expect(verification_store.is_email_sent).toBeFalsy();
    });
    it('should send an email if there is no error in response_verify_email', async () => {
        verification_store.WS.verifyEmail.mockResolvedValue({});
        await verification_store.sendVerificationEmail();

        expect(verification_store.is_email_sent).toBeTruthy();
    });
    it('should set an error message when there is an error in response_verify_email with code="PaymentAgentWithdrawError"', async () => {
        verification_store.WS.verifyEmail.mockResolvedValue({
            error: { code: 'PaymentAgentWithdrawError', message: 'ERROR' },
        });
        await verification_store.sendVerificationEmail();

        expect(verification_store.error.message).toBe('ERROR');
    });
    it('should set an error message when there is an error in response_verify_email with custom error code', async () => {
        verification_store.WS.verifyEmail.mockResolvedValue({
            error: { code: 'error_code', message: 'CUSTOM_ERROR' },
        });
        await verification_store.sendVerificationEmail();

        expect(verification_store.error.message).toBe('CUSTOM_ERROR');
    });
    it('should resend verification email', () => {
        const spySendVerificationEmail = jest.spyOn(verification_store, 'sendVerificationEmail');
        verification_store.WS.verifyEmail.mockResolvedValue({});
        verification_store.resendVerificationEmail();

        expect(spySendVerificationEmail).toHaveBeenCalled();
    });
    it('should not resend verification email, if resend_timeout less then 60', () => {
        const spySendVerificationEmail = jest.spyOn(verification_store, 'sendVerificationEmail');
        verification_store.setResendTimeout(1);
        verification_store.resendVerificationEmail();

        expect(spySendVerificationEmail).not.toHaveBeenCalled();
    });
    it('should run clearInterval in setCountDownResendVerification function when resend_timeout === 1 ', () => {
        jest.useFakeTimers();
        verification_store.setCountDownResendVerification();
        jest.runAllTimers();

        expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000);
        expect(verification_store.resend_timeout).toBe(60);
        expect(clearInterval).toHaveBeenCalled();
        jest.useRealTimers();
    });
    it('should clear verification', () => {
        const spyClearTimeoutVerification = jest.spyOn(verification_store, 'clearTimeoutVerification');
        const spySetResendTimeout = jest.spyOn(verification_store, 'setResendTimeout');
        const spySetErrorMessage = jest.spyOn(verification_store.error, 'setErrorMessage');
        verification_store.clearVerification();

        expect(spyClearTimeoutVerification).toHaveBeenCalledTimes(1);
        expect(verification_store.is_button_clicked).toBeFalsy();
        expect(verification_store.is_email_sent).toBeFalsy();
        expect(verification_store.is_resend_clicked).toBeFalsy();
        expect(spySetResendTimeout).toHaveBeenCalledWith(60);
        expect(spySetErrorMessage).toHaveBeenCalledWith('', null, null);
        expect(verification_store.root_store.client.setVerificationCode).toHaveBeenCalledWith(
            '',
            'payment_agent_withdraw'
        );
    });
});
