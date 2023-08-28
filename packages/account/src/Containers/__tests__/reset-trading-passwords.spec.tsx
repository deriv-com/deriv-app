import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ResetTradingPassword from '../reset-trading-password';
import { StoreProvider, mockStore } from '@deriv/stores';

const MockResetTradingPasswordModal = ({
    platform,
    verification_code,
}: {
    platform: string;
    verification_code: string;
}) => (
    <div>
        <p>{platform}</p>
        <p>{verification_code}</p>
    </div>
);

jest.mock('../../Components/reset-trading-password-modal', () =>
    jest.fn(({ platform, verification_code }) => (
        <MockResetTradingPasswordModal platform={platform} verification_code={verification_code} />
    ))
);

describe('ResetTradingPassword', () => {
    const MOCK_MT5_CODE = 'reset_mt5';
    const MOCK_DXTRADE_CODE = 'reset_dxtrade';
    const mock_store = mockStore({
        ui: {
            is_reset_trading_password_modal_visible: true,
        },
        client: {
            verification_code: {
                trading_platform_mt5_password_reset: MOCK_MT5_CODE, // Mock data
                trading_platform_dxtrade_password_reset: MOCK_DXTRADE_CODE, // Mock data,
            },
        },
    });

    const renderComponent = ({ store = mock_store, search = '?action=trading_platform_mt5_password_reset' }) =>
        render(
            <StoreProvider store={store}>
                <MemoryRouter initialEntries={[{ pathname: '/', search }]}>
                    <ResetTradingPassword />
                </MemoryRouter>
            </StoreProvider>
        );

    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render ResetTradingPassword component for MT5', () => {
        renderComponent({});

        expect(screen.getByText('mt5')).toBeInTheDocument();
        expect(screen.getByText(MOCK_MT5_CODE)).toBeInTheDocument();
    });

    it('should render ResetTradingPassword component for DxTrade', () => {
        renderComponent({ search: '?action=trading_platform_dxtrade_password_reset' });

        expect(screen.getByText('dxtrade')).toBeInTheDocument();
        expect(screen.getByText(MOCK_DXTRADE_CODE)).toBeInTheDocument();
    });
});
