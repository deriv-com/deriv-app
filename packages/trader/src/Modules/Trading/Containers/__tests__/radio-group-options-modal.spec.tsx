import React from 'react';
import { render, screen } from '@testing-library/react';
import RadioGroupOptionsModal from '../radio-group-options-modal';

jest.mock('Trading/Containers/Multiplier/multiplier-options.jsx', () => jest.fn(() => 'mockedMultiplierOptions'));
jest.mock('Trading/Components/Form/RadioGroupWithInfoMobile/radio-group-with-info-mobile', () =>
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
    modal_title: 'accumulator',
};

const mock_connect_props = {
    accumulator_range_list: [0, 1, 2, 3, 4],
    growth_rate: 1,
    onChange: jest.fn(),
    proposal_info: {
        ACCU: {
            has_error: false,
            id: false,
        },
    },
};

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect:
        () =>
        <T extends React.FC>(Component: T) =>
        (props: React.ComponentProps<T>) =>
            Component({ ...props, ...mock_connect_props }),
}));

describe('<RadioGroupOptionsModal />', () => {
    it('', () => {
        render(<RadioGroupOptionsModal {...mocked_props} />);
    });
});
