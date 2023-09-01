import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../trader-providers';
import RadioGroupOptionsModal from '../radio-group-options-modal';

const default_mocked_props = {
    is_open: true,
    modal_title: 'tests title',
    toggleModal: jest.fn(),
};
const default_mock_store = {
    modules: {
        trade: {
            accumulator_range_list: [1, 2, 3],
            growth_rate: 0.03,
            onChange: jest.fn(),
            tick_size_barrier: 0,
            proposal_info: {},
        },
    },
};

jest.mock('Modules/Trading/Containers/Multiplier/multiplier-options', () =>
    jest.fn(() => <div>MultiplierOptions component</div>)
);
jest.mock('Modules/Trading/Components/Form/RadioGroupWithInfoMobile', () =>
    jest.fn(props => <div data-test={props.has_error_or_not_loaded}>RadioGroupWithInfoMobile component</div>)
);

describe('<RadioGroupOptionsModal />', () => {
    const mockRadioGroupOptionsModal = (mocked_store, mocked_props) => {
        return (
            <TraderProviders store={mocked_store}>
                <RadioGroupOptionsModal {...mocked_props} />
            </TraderProviders>
        );
    };
    beforeAll(() => {
        ReactDOM.createPortal = jest.fn(component => {
            return component;
        });
    });

    afterAll(() => {
        ReactDOM.createPortal.mockClear();
    });

    it('should render component with <RadioGroupWithInfoMobile /> inside if modal_title !== Multiplier ', () => {
        const mock_root_store = mockStore(default_mock_store);
        render(mockRadioGroupOptionsModal(mock_root_store, default_mocked_props));

        expect(screen.queryByText(/MultiplierOptions/i)).not.toBeInTheDocument();
        expect(screen.getByText(/RadioGroupWithInfoMobile/i)).toBeInTheDocument();
    });
    it('should render component with <MultiplierOptions /> inside if modal_title === Multiplier ', () => {
        const new_mock_props = { ...default_mocked_props, modal_title: 'Multiplier' };
        const mock_root_store = mockStore(default_mock_store);
        render(mockRadioGroupOptionsModal(mock_root_store, new_mock_props));

        expect(screen.getByText(/MultiplierOptions/i)).toBeInTheDocument();
        expect(screen.queryByText(/RadioGroupWithInfoMobile/i)).not.toBeInTheDocument();
    });
    it('has_error_or_not_loaded should be falsy if proposal_info includes proper information', () => {
        const new_mock_store = { ...default_mocked_props };
        new_mock_store.modules = {
            trade: {
                accumulator_range_list: [1, 2, 3],
                growth_rate: 0.03,
                onChange: jest.fn(),
                tick_size_barrier: 0,
                proposal_info: { ACCU: { has_error: false, id: 'testid' } },
            },
        };
        const mock_root_store = mockStore(new_mock_store);
        render(mockRadioGroupOptionsModal(mock_root_store, default_mocked_props));

        expect(screen.getByText(/RadioGroupWithInfoMobile/i)).not.toHaveAttribute('data-test');
    });
});
