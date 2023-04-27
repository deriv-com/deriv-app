import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CFDDxtradeDemoAccountDisplay from '../cfd-dxtrade-demo-account-display';
import { TCFDPlatform } from '../props.types';

const mock_connect_props = {
    dxtrade_tokens: {
        demo: '',
        real: '',
    },
};

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => props => Component({ ...props, ...mock_connect_props }),
}));

const mock_props = {
    has_cfd_account_error: false,
    standpoint: {
        financial_company: 'svg',
        gaming_company: 'svg',
        iom: false,
        malta: false,
        maltainvest: false,
        svg: true,
    },
    is_loading: false,
    is_logged_in: true,
    onSelectAccount: jest.fn(),
    openAccountTransfer: jest.fn(),
    platform: 'dxtrade' as TCFDPlatform,
    current_list: { 'dxtrade.demo.dxtrade': { enabled: 1 } },
    openPasswordManager: jest.fn(),
};

describe('CFDDxtradeDemoAccountDisplay', () => {
    it('should render Loading component if is_loading === true', () => {
        render(<CFDDxtradeDemoAccountDisplay {...mock_props} is_loading />);

        expect(screen.getByTestId('dt_barspinner')).toBeInTheDocument();
    });
    it('should render CFDAccountCard component if is_loading === false', () => {
        render(<CFDDxtradeDemoAccountDisplay {...mock_props} />);

        expect(screen.getByText('Deriv X')).toBeInTheDocument();
    });
    it('should render CFDAccountCard with Top Up button if existing_accounts_data fucntion does not return undefined', () => {
        render(<CFDDxtradeDemoAccountDisplay {...mock_props} />);

        expect(screen.getByText('Top up')).toBeInTheDocument();
    });
    it('should not render Top Up button in CFDAccountCard if existing_accounts_data returns undefined ', () => {
        render(<CFDDxtradeDemoAccountDisplay {...mock_props} current_list={{ wrong_data: { enabled: 1 } }} />);

        expect(screen.queryByText('Top up')).not.toBeInTheDocument();
    });
    it('should call function openAccountTransfer with certain arguments when Top Up button was clicked', () => {
        render(<CFDDxtradeDemoAccountDisplay {...mock_props} />);
        const top_up_button = screen.getByText('Top up');
        userEvent.click(top_up_button);

        expect(mock_props.openAccountTransfer).toHaveBeenCalledWith(mock_props.current_list['dxtrade.demo.dxtrade'], {
            category: 'demo',
            type: 'all',
        });
    });
});
