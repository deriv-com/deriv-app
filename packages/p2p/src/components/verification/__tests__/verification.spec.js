import React from 'react';
import { screen, render } from '@testing-library/react';
import { useStores } from 'Stores';
import Verification from '../verification.jsx';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(),
}));

const mockProps = () => ({
    should_wrap: false,
});

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
        const props = mockProps();
        useStores.mockImplementation(() => ({
            general_store: { ...mocked_store_values },
        }));

        render(<Verification {...props} />);

        const el_component_container = screen.getByTestId('component_container');
        expect(el_component_container).toBeInTheDocument();
    });

    it('Should show verification wrapper if should_wrap prop is true', () => {
        const props = mockProps();
        props.should_wrap = true;
        useStores.mockImplementation(() => ({
            general_store: { ...mocked_store_values },
        }));

        render(<Verification {...props} />);

        const el_verification_wrapper = screen.getByTestId('verification_wrapper');
        expect(el_verification_wrapper).toBeInTheDocument();
    });

    it('Should render Dp2pBlocked component', () => {
        const props = mockProps();
        useStores.mockImplementation(() => ({
            general_store: { ...mocked_store_values, poi_status: 'verified', nickname: 'test' },
        }));

        render(<Verification {...props} />);

        const el_Dp2pBlocked_component = screen.getByTestId('component_container');
        expect(el_Dp2pBlocked_component).toBeInTheDocument();
    });
});
