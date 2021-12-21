import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Checklist } from '@deriv/components';
import DepositsLocked from '../deposit-locked';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<DepositsLocked />', () => {
    const onMount = jest.fn();
    const standpoint = {
        iom: false,
    };
    const account_status = {
        authentication: {
            identity: {
                status: '',
            },
            document: {
                status: '',
            },
            needs_verification: [],
        },
    };

    it('should show the proof of identity document verification message', () => {
        account_status.authentication.identity.status = 'pending';
        account_status.authentication.document.status = 'none';
        account_status.authentication.needs_verification = ['identity'];

        const screen = render(
            <DepositsLocked
                account_status={account_status}
                is_tnc_needed={false}
                is_financial_information_incomplete={false}
                is_trading_experience_incomplete={false}
                is_financial_account={false}
                onMount={onMount}
                standpoint={standpoint}
            />
        );

        expect(screen.getByText('To enable this feature you must complete the following:')).toBeInTheDocument();
        expect(screen.getByText('Check proof of identity document verification status')).toBeInTheDocument();
    });

    it('should show the proof of address document verification message', () => {
        account_status.authentication.identity.status = 'none';
        account_status.authentication.document.status = 'pending';
        account_status.authentication.needs_verification = ['document'];

        const screen = render(
            <DepositsLocked
                account_status={account_status}
                is_tnc_needed={false}
                is_financial_information_incomplete={false}
                is_trading_experience_incomplete={false}
                is_financial_account={false}
                onMount={onMount}
                standpoint={standpoint}
            />
        );

        expect(screen.getByText('To enable this feature you must complete the following:')).toBeInTheDocument();
        expect(screen.getByText('Check proof of address document verification status')).toBeInTheDocument();
    });

    it('should show the terms and conditions accept button', () => {
        account_status.authentication.identity.status = '';
        account_status.authentication.document.status = '';
        account_status.authentication.needs_verification = [];

        const screen = render(
            <DepositsLocked
                account_status={account_status}
                is_tnc_needed
                is_financial_information_incomplete={false}
                is_trading_experience_incomplete={false}
                is_financial_account={false}
                onMount={onMount}
                standpoint={standpoint}
            />
        );

        expect(screen.getByText('To enable this feature you must complete the following:')).toBeInTheDocument();
        expect(
            screen.getByRole('button', {
                name: /I accept/i,
            })
        ).toBeInTheDocument();
    });

    it('should show the financial assessment completion message', () => {
        standpoint.iom = true;

        const screen = render(
            <DepositsLocked
                account_status={account_status}
                is_tnc_needed={false}
                is_financial_information_incomplete
                is_trading_experience_incomplete={false}
                is_financial_account
                onMount={onMount}
                standpoint={standpoint}
            />
        );

        expect(
            screen.getByText(
                'We were unable to verify your information automatically. To enable this function, you must complete the following:'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Complete the financial assessment form')).toBeInTheDocument();
    });

    it('should trigger click on the checklist item', () => {
        const onClick = jest.fn();
        const items = [
            {
                content: 'Check proof of identity document verification status',
                status: 'action',
                onClick: onClick,
            },
        ];
        const screen = render(<Checklist className='cashier-locked__checklist' items={items} />);
        const btn = screen.container.querySelector('.dc-checklist__item-status--action');

        fireEvent.click(btn);
        expect(onClick).toHaveBeenCalled();
    });
});
