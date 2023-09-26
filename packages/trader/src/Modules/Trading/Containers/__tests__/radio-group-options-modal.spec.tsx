import React from 'react';
import { render, screen } from '@testing-library/react';
import RadioGroupOptionsModal from '../radio-group-options-modal';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../trader-providers';

jest.mock('../Multiplier/multiplier-options', () => jest.fn(() => 'mockedMultiplierOptions'));
jest.mock('Modules/Trading/Components/Form/RadioGroupWithInfoMobile', () =>
    jest.fn(() => 'MockedRadioGroupWithInfoMobile')
);

type TModal = React.FC<{
    children: React.ReactNode;
    is_open: boolean;
    toggleModal: () => void;
    modal_title: string;
}>;

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    const Modal: TModal = jest.fn(({ children, is_open, toggleModal, modal_title }) => {
        if (is_open)
            return (
                <div data-testid='modal'>
                    <h3>{modal_title}</h3>
                    <span onClick={toggleModal}>IcCross</span>
                    {children}
                </div>
            );

        return null;
    });

    return {
        ...original_module,
        Modal,
    };
});

const mocked_props = {
    is_open: true,
    toggleModal: jest.fn(),
    modal_title: 'Multiplier',
};

const mock_connect_props = {
    modules: {
        trade: {
            accumulator_range_list: [0.01, 0.02, 0.03, 0.04, 0.05],
            growth_rate: 1,
            onChange: jest.fn(),
            proposal_info: {
                ACCU: {
                    has_error: false,
                    id: false,
                },
            },
        },
    },
};

describe('<RadioGroupOptionsModal />', () => {
    it('should render mockedMultiplierOptions when modal_title is Multiplier', () => {
        render(<RadioGroupOptionsModal {...mocked_props} />, {
            wrapper: ({ children }) => (
                <TraderProviders store={mockStore(mock_connect_props)}>{children}</TraderProviders>
            ),
        });
        expect(screen.getByText(/mockedmultiplieroptions/i)).toBeInTheDocument();
    });
    it('should render something when modal_title is not Multiplier', () => {
        mocked_props.modal_title = 'accumulator';
        render(<RadioGroupOptionsModal {...mocked_props} />, {
            wrapper: ({ children }) => (
                <TraderProviders store={mockStore(mock_connect_props)}>{children}</TraderProviders>
            ),
        });
        expect(screen.getByText(/mockedradiogroupwithinfomobile/i)).toBeInTheDocument();
    });
});
