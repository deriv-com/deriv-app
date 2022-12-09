import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Checklist } from '@deriv/components';
import { StoreProvider } from '@deriv/stores';
import DepositLocked from '../deposit-locked';
import { TRootStore } from '../../../../types';

jest.mock('Components/cashier-locked', () => {
    const CashierLocked = () => (
        <div>
            <div>
                We were unable to verify your information automatically. To enable this function, you must complete the
                following:
            </div>
            <div>Complete the financial assessment form</div>
        </div>
    );
    return CashierLocked;
});

describe('<DepositLocked />', () => {
    it('should show the proof of identity document verification message', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            client: {
                account_status: {
                    cashier_validation: [],
                    authentication: {
                        identity: {
                            status: 'pending',
                        },
                        document: {
                            status: 'none',
                        },
                        needs_verification: ['identity'],
                    },
                },
                standpoint: { iom: undefined },
                is_tnc_needed: false,
                is_financial_information_incomplete: false,
                is_trading_experience_incomplete: false,
                is_financial_account: false,
            },
            modules: { cashier: { deposit: { onMountDeposit: jest.fn() } } },
        };

        render(<DepositLocked />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText('To enable this feature you must complete the following:')).toBeInTheDocument();
        expect(screen.getByText('Check proof of identity document verification status')).toBeInTheDocument();
    });

    it('should show the proof of address document verification message', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            client: {
                account_status: {
                    cashier_validation: [],
                    authentication: {
                        identity: {
                            status: 'none',
                        },
                        document: {
                            status: 'pending',
                        },
                        needs_verification: ['document'],
                    },
                },
                standpoint: { iom: undefined },
                is_tnc_needed: false,
                is_financial_information_incomplete: false,
                is_trading_experience_incomplete: false,
                is_financial_account: false,
            },
            modules: { cashier: { deposit: { onMountDeposit: jest.fn() } } },
        };

        render(<DepositLocked />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText('To enable this feature you must complete the following:')).toBeInTheDocument();
        expect(screen.getByText('Check proof of address document verification status')).toBeInTheDocument();
    });

    it('should show the terms and conditions accept button', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            client: {
                account_status: {
                    cashier_validation: [],
                    authentication: {},
                },
                standpoint: { iom: undefined },
                is_tnc_needed: true,
                is_financial_information_incomplete: false,
                is_trading_experience_incomplete: false,
                is_financial_account: false,
            },
            modules: { cashier: { deposit: { onMountDeposit: jest.fn() } } },
        };

        render(<DepositLocked />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText('To enable this feature you must complete the following:')).toBeInTheDocument();
        expect(
            screen.getByRole('button', {
                name: /I accept/i,
            })
        ).toBeInTheDocument();
    });

    it('should show the financial assessment completion message', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            client: {
                account_status: {
                    cashier_validation: [],
                    authentication: {},
                },
                standpoint: { iom: 'true' },
                is_tnc_needed: false,
                is_financial_information_incomplete: true,
                is_trading_experience_incomplete: false,
                is_financial_account: false,
            },
            modules: { cashier: { deposit: { onMountDeposit: jest.fn() } } },
        };

        render(<DepositLocked />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TRootStore}>{children}</StoreProvider>,
        });

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
                onClick,
            },
        ];
        render(<Checklist className='cashier-locked__checklist' items={items} />);
        const btn = screen.getByTestId('dt_checklist_item_status_action');

        fireEvent.click(btn);
        expect(onClick).toHaveBeenCalled();
    });
});
