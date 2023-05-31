import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import { useStores } from 'Stores/index';
import Verification from '../verification';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn().mockImplementation(() => () => true),
}));

const mocked_store_values = {
    is_advertiser: false,
    nickname: '',
    poi_status: '',
    poiStatusText: jest.fn(),
    props: {
        history: '',
    },
};

describe('<Verification />', () => {
    it('Component should be rendered', () => {
        (useStores as jest.Mock).mockReturnValue({
            general_store: { ...mocked_store_values },
        });

        render(<Verification should_wrap={false} />);

        const el_dp2p_verification_container = screen.getByTestId('dt_verification_container');
        expect(el_dp2p_verification_container).toBeInTheDocument();
    });

    it('Component should take default value false for should_wrap when not passed', () => {
        (useStores as jest.Mock).mockReturnValue({
            general_store: { ...mocked_store_values },
        });

        render(<Verification />);

        const el_dp2p_verification_container = screen.getByTestId('dt_verification_container');
        expect(el_dp2p_verification_container).toBeInTheDocument();
    });

    it('Component should take checklist items status as done', () => {
        (useStores as jest.Mock).mockReturnValue({
            general_store: { ...mocked_store_values, nickname: 'test', poi_status: 'verified', is_advertiser: true },
        });

        render(<Verification />);

        const el_dp2p_verification_container = screen.getByTestId('dt_verification_container');
        expect(el_dp2p_verification_container).toBeInTheDocument();
    });

    it('Component should handle onclick for going to account poi verification', () => {
        (useStores as jest.Mock).mockReturnValue({
            general_store: { ...mocked_store_values, nickname: 'test', is_advertiser: true },
        });

        Object.defineProperty(window, 'location', {
            value: {
                href: 'https://test.com',
            },
            writable: true,
        });

        render(<Verification should_wrap />);

        const el_action_button = screen.getByTestId('dt_checklist_item_status_action');
        fireEvent.click(el_action_button);
        expect(window.location.href).toBe('/account/proof-of-identity?ext_platform_url=/cashier/p2p');
    });

    it('Should show verification wrapper if should_wrap prop is true', () => {
        (useStores as jest.Mock).mockReturnValue({
            general_store: { ...mocked_store_values },
        });

        render(<Verification should_wrap />);

        const el_dp2p_verification_wrapper = screen.getByTestId('dt_verification_wrapper');
        expect(el_dp2p_verification_wrapper).toBeInTheDocument();
    });

    it('Should render Dp2pBlocked component', () => {
        (useStores as jest.Mock).mockReturnValue({
            general_store: { ...mocked_store_values, poi_status: 'verified', nickname: 'test' },
        });

        render(<Verification should_wrap={false} />);

        const el_dp2p_Dp2pBlocked_container = screen.getByTestId('dt_dp2p-blocked-container');
        expect(el_dp2p_Dp2pBlocked_container).toBeInTheDocument();
    });
});
