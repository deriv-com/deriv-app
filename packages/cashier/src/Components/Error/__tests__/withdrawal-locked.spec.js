import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Checklist } from '@deriv/components';
import WithdrawalLocked from '../withdrawal-locked';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

const setAccountStatus = (identity_status, document_status, needs_verification) => {
    return {
        authentication: {
            identity: {
                status: identity_status,
            },
            document: {
                status: document_status,
            },
            needs_verification: [needs_verification],
        },
    };
};

describe('WithdrawalLocked', () => {
    it('Should show proof of identity document verification status message', () => {
        const need_poi_account_status = setAccountStatus('pending', '', '');

        render(<WithdrawalLocked account_status={need_poi_account_status} is_10K_limit />);

        expect(screen.getByText('Check proof of identity document verification status')).toBeInTheDocument();
    });

    it('Should show upload a proof of identity to verify your identity message', () => {
        const need_poi_account_status = setAccountStatus('none', '', '');

        render(<WithdrawalLocked account_status={need_poi_account_status} is_10K_limit />);

        expect(screen.getByText('Upload a proof of identity to verify your identity')).toBeInTheDocument();
    });

    it('Should show proof of address document verification status message', () => {
        const need_poa_account_status = setAccountStatus('', 'pending', 'document');

        render(<WithdrawalLocked account_status={need_poa_account_status} is_10K_limit />);

        expect(screen.getByText('Check proof of address document verification status')).toBeInTheDocument();
    });

    it('Should show proof of address document verification status message', () => {
        const need_poa_account_status = setAccountStatus('', 'none', 'document');

        render(<WithdrawalLocked account_status={need_poa_account_status} is_10K_limit />);

        expect(screen.getByText('Upload a proof of address to verify your address')).toBeInTheDocument();
    });

    it('Should show Complete the financial assessment message', () => {
        const account_status = setAccountStatus('', '', '');

        render(<WithdrawalLocked account_status={account_status} is_10K_limit is_ask_financial_risk_approval />);

        expect(screen.getByText('Complete the financial assessment form')).toBeInTheDocument();
    });

    it('Should trigger click on the checklist item', () => {
        const onClick = jest.fn();
        const items = [
            {
                content: 'Complete the financial assessment form',
                status: 'action',
                onClick: onClick,
            },
        ];
        const { container } = render(<Checklist className='cashier-locked__checklist' items={items} />);
        const btn = container.querySelector('.dc-checklist__item-status--action');

        fireEvent.click(btn);
        expect(onClick).toHaveBeenCalled();
    });
});
