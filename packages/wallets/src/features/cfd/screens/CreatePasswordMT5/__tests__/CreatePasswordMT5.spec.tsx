import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { fireEvent, render, screen } from '@testing-library/react';
import CreatePasswordMT5 from '../CreatePasswordMT5';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({})),
}));

jest.mock('../../../../../components/Base', () => ({
    WalletPasswordFieldLazy: ({
        label,
        onChange,
        password,
    }: {
        label: string;
        onChange: () => void;
        password: string;
    }) => (
        <input
            data-testid='dt_password_field'
            onChange={onChange}
            placeholder={label}
            type='password'
            value={password}
        />
    ),
}));

jest.mock('../../components', () => ({
    ...jest.requireActual('../../components'),
    MT5LicenceMessage: jest.fn(() => <div>MT5LicenceMessage</div>),
    MT5PasswordModalTnc: jest.fn(() => <div>MT5PasswordModalTnc</div>),
}));

describe('CreatePasswordMT5', () => {
    const defaultProps = {
        account: {
            login: 'CRW123',
            shortcode: 'maltainvest',
        },
        isLoading: false,
        isTncChecked: false,
        isVirtual: false,
        onPasswordChange: jest.fn(),
        onPrimaryClick: jest.fn(),
        onTncChange: jest.fn(),
        password: 'password',
        platform: 'mt5',
    };

    beforeEach(() => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correct content for MT5 real account', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<CreatePasswordMT5 {...defaultProps} />);
        expect(screen.getByText('Create a Deriv MT5 password')).toBeInTheDocument();
        expect(
            screen.getByText('Note: You can use this password for all your Deriv MT5 accounts.')
        ).toBeInTheDocument();
        expect(screen.getByText('MT5LicenceMessage')).toBeInTheDocument();
        expect(screen.getByText('MT5PasswordModalTnc')).toBeInTheDocument();
    });

    it('renders correct content for MT5 demo account when isVirtual is true', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<CreatePasswordMT5 {...defaultProps} isVirtual />);
        expect(screen.getByText('Create a demo Deriv MT5 password')).toBeInTheDocument();
        expect(
            screen.getByText('Note: You can use this password for all your Deriv MT5 accounts.')
        ).toBeInTheDocument();
        expect(screen.queryByText('MT5LicenceMessage')).not.toBeInTheDocument();
        expect(screen.queryByText('MT5PasswordModalTnc')).not.toBeInTheDocument();
    });

    it('calls onPasswordChange when password input changes', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<CreatePasswordMT5 {...defaultProps} />);
        fireEvent.change(screen.getByTestId('dt_password_field'), {
            target: { value: 'newPassword123' },
        });
        expect(defaultProps.onPasswordChange).toHaveBeenCalled();
    });

    it('disables submit button when password is invalid', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<CreatePasswordMT5 {...defaultProps} password='weak' platform='ctrader' />);
        expect(screen.getByTestId('dt_create_password_mt5_button')).toBeDisabled();
    });

    it('enables submit button when password is valid and TnC is checked', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<CreatePasswordMT5 {...defaultProps} isTncChecked={true} password='StrongPass123!' />);
        expect(screen.getByTestId('dt_create_password_mt5_button')).toBeEnabled();
    });

    it('does not show TnC checkbox for SVG accounts', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });
        render(
            // @ts-expect-error - since this is a mock, we only need partial properties of the account
            <CreatePasswordMT5 {...defaultProps} account={{ ...defaultProps.account, shortcode: 'svg' }} />
        );
        expect(screen.queryByTestId('dt_tnc_checkbox')).not.toBeInTheDocument();
    });
});
