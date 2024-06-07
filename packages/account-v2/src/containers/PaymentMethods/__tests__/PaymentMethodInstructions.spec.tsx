import React from 'react';
import { render, screen } from '@testing-library/react';
import { PaymentMethodInstructions } from '../PaymentMethodInstructions';

describe('PaymentMethodInstructions', () => {
    it('should render correct instructions for advcash', () => {
        render(<PaymentMethodInstructions paymentMethod='advcash' />);
        expect(
            screen.getByText(
                'Upload a screenshot of your name and email address from the personal information section.'
            )
        ).toBeInTheDocument();
    });

    it('should render correct instructions for neteller', () => {
        render(<PaymentMethodInstructions paymentMethod='neteller' />);
        expect(
            screen.getByText(
                'Upload a screenshot of your name and email address from the personal information section.'
            )
        ).toBeInTheDocument();
    });

    it('should render correct instructions for astropay', () => {
        render(<PaymentMethodInstructions paymentMethod='astropay' />);
        expect(
            screen.getByText('Upload 2 separate screenshots from the personal details page and the account page via')
        ).toBeInTheDocument();
        expect(screen.getByText('https://app.astropay.com/profile')).toBeInTheDocument();
    });

    it('should render correct instructions for beyonic', () => {
        render(<PaymentMethodInstructions paymentMethod='beyonic' />);
        expect(
            screen.getByText('Upload your mobile bill statement showing your name and phone number.')
        ).toBeInTheDocument();
    });

    it('should render correct instructions for boleto (d24 voucher)', () => {
        render(<PaymentMethodInstructions paymentMethod='boleto (d24 voucher)' />);
        expect(
            screen.getByText('Upload your bank statement showing your name and account details.')
        ).toBeInTheDocument();
    });

    it('should render correct instructions for jeton', () => {
        render(<PaymentMethodInstructions paymentMethod='jeton' />);
        expect(
            screen.getByText('Upload a screenshot of your name and account number from the personal details section.')
        ).toBeInTheDocument();
    });

    it('should render correct instructions for mastercard', () => {
        render(<PaymentMethodInstructions paymentMethod='mastercard' />);
        expect(
            screen.getByText(
                'Upload a photo showing your name and the first six and last four digits of your card number. If the card does not display your name, upload the bank statement showing your name and card number in the transaction history.'
            )
        ).toBeInTheDocument();
    });

    it('should render correct instructions for visa', () => {
        render(<PaymentMethodInstructions paymentMethod='visa' />);
        expect(
            screen.getByText(
                'Upload a photo showing your name and the first six and last four digits of your card number. If the card does not display your name, upload the bank statement showing your name and card number in the transaction history.'
            )
        ).toBeInTheDocument();
    });

    it('should render correct instructions for onlinenaira', () => {
        render(<PaymentMethodInstructions paymentMethod='onlinenaira' />);
        expect(screen.getAllByRole('listitem')).toHaveLength(2);
        expect(screen.getByText('https://onlinenaira.com/members/index.htm')).toBeInTheDocument();
        expect(screen.getByText('https://onlinenaira.com/members/bank.htm')).toBeInTheDocument();
    });

    it('should render correct instructions for pix', () => {
        render(<PaymentMethodInstructions paymentMethod='pix' />);
        expect(
            screen.getByText('Upload a screenshot of either of the following to process the transaction:')
        ).toBeInTheDocument();
        expect(screen.getByText('- your account profile section on the website')).toBeInTheDocument();
        expect(screen.getByText('- the Account Information page on the app')).toBeInTheDocument();
        expect(screen.getByText('- your account details of the bank linked to your account')).toBeInTheDocument();
    });

    it('should render correct instructions for skrill', () => {
        render(<PaymentMethodInstructions paymentMethod='skrill' />);
        expect(
            screen.getByText(
                'Upload a screenshot of your name, account number, and email address from the personal details section of the app or profile section of your account on the website.'
            )
        ).toBeInTheDocument();
    });

    it('should render correct instructions for sticpay', () => {
        render(<PaymentMethodInstructions paymentMethod='sticpay' />);
        expect(
            screen.getByText('Upload a screenshot of your name and email address from the personal details section.')
        ).toBeInTheDocument();
    });

    it('should render correct instructions for webmoney', () => {
        render(<PaymentMethodInstructions paymentMethod='webmoney' />);
        expect(
            screen.getByText(
                'Upload a screenshot of your account and personal details page with your name, account number, phone number, and email address.'
            )
        ).toBeInTheDocument();
    });

    it('should render correct instructions for zingpay', () => {
        render(<PaymentMethodInstructions paymentMethod='zingpay' />);
        expect(
            screen.getByText('Upload your bank statement showing your name, account number, and transaction history.')
        ).toBeInTheDocument();
    });

    it('should render correct instructions for other payment methods', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: Ignore the type error related to paymentMethod
        render(<PaymentMethodInstructions paymentMethod='yandex' />);
        expect(
            screen.getByText('Upload a document showing your name and bank account number or account details.')
        ).toBeInTheDocument();
    });
});
