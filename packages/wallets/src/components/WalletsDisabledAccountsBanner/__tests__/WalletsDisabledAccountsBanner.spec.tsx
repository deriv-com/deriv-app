import React, { ComponentProps } from 'react';
import { Localize, useTranslations } from '@deriv-com/translations';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WalletsDisabledAccountsBanner from '../WalletsDisabledAccountsBanner';

jest.mock('@deriv-com/translations', () => ({
    // eslint-disable-next-line camelcase
    Localize: ({ components, i18n_default_text, values }: ComponentProps<typeof Localize>) => {
        // eslint-disable-next-line camelcase
        let text = i18n_default_text;

        if (values) {
            Object.entries(values).forEach(([key, value]) => {
                text = text.replace(new RegExp(`{{${key}}}`, 'g'), value);
            });
        }

        if (components) {
            components.forEach((component, index) => {
                text = text.replace(new RegExp(`<${index}>`, 'g'), `<${component.type}>`);
                text = text.replace(new RegExp(`</${index}>`, 'g'), `</${component.type}>`);
            });
        }
        return <div dangerouslySetInnerHTML={{ __html: text }} />;
    },
    useTranslations: jest.fn(),
}));

window.LC_API = {
    on_chat_ended: jest.fn(),
    open_chat_window: jest.fn(),
};

describe('WalletsDisabledAccountsBanner', () => {
    const mockDisabledAccounts: ComponentProps<typeof WalletsDisabledAccountsBanner>['disabledAccounts'] = [
        {
            created_at: undefined,
            currency: 'USD',
            currency_config: undefined,
            dtrade_loginid: undefined,
            excluded_until: undefined,
            is_active: false,
            is_crypto: undefined,
            is_disabled: false,
            is_linked_account_active: undefined,
            is_malta_wallet: false,
            is_virtual: false,
            landing_company_name: undefined,
            loginid: '',
            wallet_currency_type: '',
        },
        {
            created_at: undefined,
            currency: 'EUR',
            currency_config: undefined,
            dtrade_loginid: undefined,
            excluded_until: undefined,
            is_active: false,
            is_crypto: undefined,
            is_disabled: false,
            is_linked_account_active: undefined,
            is_malta_wallet: false,
            is_virtual: false,
            landing_company_name: undefined,
            loginid: '',
            wallet_currency_type: '',
        },
        {
            created_at: undefined,
            currency: 'BTC',
            currency_config: undefined,
            dtrade_loginid: undefined,
            excluded_until: undefined,
            is_active: false,
            is_crypto: true,
            is_disabled: false,
            is_linked_account_active: undefined,
            is_malta_wallet: false,
            is_virtual: false,
            landing_company_name: undefined,
            loginid: '',
            wallet_currency_type: '',
        },
    ];
    const mockLocalize = jest.fn((text, params) => {
        const { title = '' } = params || {};
        return text.replace('{{title}}', title);
    });

    beforeAll(() => {
        (useTranslations as jest.Mock).mockReturnValue({ localize: mockLocalize });
    });

    it('renders correctly with one disabled account', () => {
        render(<WalletsDisabledAccountsBanner disabledAccounts={[mockDisabledAccounts[0]]} />);

        expect(screen.getByText(/Your USD Wallet is disabled/)).toBeInTheDocument();
    });

    it('renders correctly with multiple disabled accounts', () => {
        render(<WalletsDisabledAccountsBanner disabledAccounts={mockDisabledAccounts} />);

        expect(screen.getByText(/Your USD, EUR, and BTC Wallets are disabled/)).toBeInTheDocument();
    });

    it('calls open_chat_window on button click', () => {
        render(<WalletsDisabledAccountsBanner disabledAccounts={[mockDisabledAccounts[0], mockDisabledAccounts[1]]} />);

        const chatButton = screen.getByRole('button');
        chatButton.addEventListener('click', window.LC_API.open_chat_window);
        userEvent.click(chatButton);

        expect(window.LC_API.open_chat_window).toHaveBeenCalled();
    });

    it('renders the icon', () => {
        render(<WalletsDisabledAccountsBanner disabledAccounts={[mockDisabledAccounts[0]]} />);
        expect(screen.getByTestId('dt_wallets_disabled_account_notification_icon')).toBeInTheDocument();
    });
});
