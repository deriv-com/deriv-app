import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStores } from 'Stores/index';
import Verification from '../verification';

const mocked_store_values = {
    is_advertiser: false,
    nickname: '',
    p2p_poa_required: false,
    poa_status: '',
    poi_status: '',
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({
        general_store: { ...mocked_store_values },
    })),
}));

describe('<Verification />', () => {
    it('should render default state', () => {
        render(<Verification />);

        const el_dp2p_verification_container = screen.getByTestId('dt_verification_container');
        expect(el_dp2p_verification_container).toBeInTheDocument();
        expect(screen.getByText('Upload documents to verify your identity.')).toBeInTheDocument();
    });

    it('Should ask for proof of address if poa is required', () => {
        (useStores as jest.Mock).mockReturnValue({
            general_store: { ...mocked_store_values, p2p_poa_required: true },
        });
        render(<Verification />);

        expect(screen.getByText('Upload documents to verify your address.')).toBeInTheDocument();
    });

    it('Should redirect to account poi verification if poi has not been verified', () => {
        (useStores as jest.Mock).mockReturnValue({
            general_store: { ...mocked_store_values, p2p_poa_required: false },
        });

        Object.defineProperty(window, 'location', {
            value: {
                href: 'https://test.com',
            },
            writable: true,
        });

        render(<Verification />);

        const el_action_button = screen.getByTestId('dt_checklist_item_status_action');
        userEvent.click(el_action_button);
        expect(window.location.href).toBe('/account/proof-of-identity?ext_platform_url=/cashier/p2p');
    });

    it('Should redirect to account poa verification if poa has not been verified', () => {
        (useStores as jest.Mock).mockReturnValue({
            general_store: { ...mocked_store_values, p2p_poa_required: true, poi_status: 'verified' },
        });

        Object.defineProperty(window, 'location', {
            value: {
                href: 'https://test.com',
            },
            writable: true,
        });

        render(<Verification />);

        const el_action_button = screen.getByTestId('dt_checklist_item_status_action');
        userEvent.click(el_action_button);
        expect(window.location.href).toBe('/account/proof-of-address?ext_platform_url=/cashier/p2p');
    });

    it('Should render Dp2pBlocked component if user is not advertiser, but is poi verified and has nickname', () => {
        (useStores as jest.Mock).mockReturnValue({
            general_store: { ...mocked_store_values, poi_status: 'verified', nickname: 'test' },
        });

        render(<Verification />);

        const el_dp2p_Dp2pBlocked_container = screen.getByTestId('dt_dp2p-blocked-container');
        expect(el_dp2p_Dp2pBlocked_container).toBeInTheDocument();
    });
});
