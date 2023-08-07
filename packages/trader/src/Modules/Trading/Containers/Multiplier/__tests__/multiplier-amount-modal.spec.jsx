import React from 'react';
import ReactDOM from 'react-dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../../trader-providers';
import MultiplierAmountModal from '../multiplier-amount-modal';
import * as preview_proposal_functions from 'Stores/Modules/Trading/Helpers/preview-proposal';

const default_mocked_props = {
    is_open: true,
    toggleModal: jest.fn(),
};
const default_mock_store = {
    modules: {
        trade: {
            amount: 10,
            currency: '',
            trade_stop_out: null,
        },
    },
};

const mockRequestPreviewProposal = jest.spyOn(preview_proposal_functions, 'requestPreviewProposal');

jest.mock('Modules/Trading/Components/Form/TradeParams/amount-mobile', () =>
    jest.fn(props => (
        <div>
            <span>AmountMobile component</span>
            <span> {props.stake_value}</span>
            <button onClick={() => props.setSelectedAmount(0, 20)}>SelectedAmount button</button>
            <button onClick={props.toggleModal}>ToggleModal button</button>
            <button onClick={props.setAmountError}>AmountError button</button>
        </div>
    ))
);
jest.mock('Modules/Trading/Components/Form/TradeParams/Multiplier/info', () =>
    jest.fn(() => (
        <div>
            <span>MultipliersInfo component</span>
        </div>
    ))
);

describe('<MultiplierAmountModal />', () => {
    const mockMultiplierAmountModal = (mocked_store, mocked_props) => {
        return (
            <TraderProviders store={mocked_store}>
                <MultiplierAmountModal {...mocked_props} />
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

    it('should render modal and <TradeParamsMobile/> inside if is_open == true', () => {
        const mock_root_store = mockStore(default_mock_store);
        render(mockMultiplierAmountModal(mock_root_store, default_mocked_props));

        expect(screen.getByText(/AmountMobile component/i)).toBeInTheDocument();
        expect(screen.getByText(/MultipliersInfo component/i)).toBeInTheDocument();
    });

    it('should render info icon and popover text if it was clicked', () => {
        const mock_root_store = mockStore(default_mock_store);
        render(mockMultiplierAmountModal(mock_root_store, default_mocked_props));

        const info_icon = screen.getByTestId(/dt_popover_wrapper/i);
        userEvent.click(info_icon);

        expect(screen.getByText(/To ensure your loss/i)).toBeInTheDocument();
    });
    it('should change stake_value and call mockRequestPreviewProposal after setSelectedAmount was called by pressing the proper button', () => {
        const mock_root_store = mockStore(default_mock_store);
        const { rerender } = render(mockMultiplierAmountModal(mock_root_store, default_mocked_props));

        expect(screen.getByText(10)).toBeInTheDocument();

        const selected_amount_button = screen.getByText(/SelectedAmount button/i);
        userEvent.click(selected_amount_button);
        rerender(mockMultiplierAmountModal(mock_root_store, default_mocked_props));

        expect(mockRequestPreviewProposal).toBeCalled();
        expect(screen.getByText(20)).toBeInTheDocument();
    });
    it('should call toggleModal if the proper button was clicked', () => {
        const mock_root_store = mockStore(default_mock_store);
        render(mockMultiplierAmountModal(mock_root_store, default_mocked_props));

        const toggle_modal_button = screen.getByText(/ToggleModal button/i);
        userEvent.click(toggle_modal_button);
        const amount_error_button = screen.getByText(/AmountError button/i);
        userEvent.click(amount_error_button);

        expect(default_mocked_props.toggleModal).toBeCalled();
    });
});
