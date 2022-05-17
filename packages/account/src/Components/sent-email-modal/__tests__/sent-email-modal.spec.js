import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { isMobile } from '@deriv/shared';
import SendEmailModal from '../sent-email-modal';

let onClose, onClickSendEmail;

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(),
    isDesktop: jest.fn(),
}));

describe('<SendEmailModal/>', () => {
    beforeAll(() => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    beforeEach(() => {
        onClose = jest.fn();
        onClickSendEmail = jest.fn();
    });

    it('should render SendEmailModal component to change dmt5 password', () => {
        render(<SendEmailModal identifier_title='mt5' is_open onClose={onClose} onClickSendEmail={onClickSendEmail} />);
        expect(
            screen.getByText(/Please click on the link in the email to change your DMT5 password./i)
        ).toBeInTheDocument();
    });

    it('should render SendEmailModal component to change deriv x password', () => {
        render(
            <SendEmailModal identifier_title='dxtrade' is_open onClose={onClose} onClickSendEmail={onClickSendEmail} />
        );
        expect(screen.getByText(/Deriv X/i)).toBeInTheDocument();
    });

    it('should render SendEmailModal component to change password through google account', () => {
        render(
            <SendEmailModal identifier_title='Google' is_open onClose={onClose} onClickSendEmail={onClickSendEmail} />
        );
        expect(
            screen.getByText(/Check your Google account email and click the link in the email to proceed./i)
        ).toBeInTheDocument();
    });

    it('should render SendEmailModal component to change email', () => {
        render(
            <SendEmailModal
                identifier_title='Change_Email'
                is_open
                onClose={onClose}
                onClickSendEmail={onClickSendEmail}
            />
        );
        expect(screen.getByText(/Check your email and click the link in the email to proceed./i)).toBeInTheDocument();
    });

    it('should display default message when no appropriate identifier_title is passed', () => {
        render(<SendEmailModal identifier_title='' is_open onClose={onClose} onClickSendEmail={onClickSendEmail} />);
        expect(screen.getByText(/Please click on the link in the email to reset your password/i)).toBeInTheDocument();
    });

    it('should trigger onClose function when modal close button is clicked', () => {
        render(<SendEmailModal identifier_title='mt5' is_open onClose={onClose} onClickSendEmail={onClickSendEmail} />);
        const btn = screen.getByTestId('send-email-template-close-test-id');
        fireEvent.click(btn);
        expect(onClose).toBeCalledTimes(1);
    });

    it('should render SendEmailModal component when isMobile is true', () => {
        isMobile.mockReturnValue(true);
        render(
            <SendEmailModal
                identifier_title='Change_Email'
                is_open
                onClose={onClose}
                onClickSendEmail={onClickSendEmail}
            />
        );
        expect(screen.getByText(/Check your email and click the link in the email to proceed./i)).toBeInTheDocument();
    });
});
