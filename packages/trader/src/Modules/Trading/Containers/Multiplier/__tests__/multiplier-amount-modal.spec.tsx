import React from 'react';
import ReactDOM from 'react-dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { TTradeStore } from 'Types';
import MultiplierAmountModal from '../multiplier-amount-modal';
import TraderProviders from '../../../../../trader-providers';

type TResponse = {
    proposal: { commission: string; limit_order: { stop_out: { order_amount: string } } };
    echo_req: { contract_type: string; amount: number };
    subscription: Record<string, unknown>;
};

const default_mocked_props = {
    is_open: true,
    toggleModal: jest.fn(),
};
const default_mock_store = {
    modules: {
        trade: {
            amount: 10,
        },
    },
};

jest.mock('Modules/Trading/Components/Form/TradeParams/amount-mobile', () =>
    jest.fn(props => (
        <div>
            <span>AmountMobile component</span>
            <span> {props.stake_value}</span>
            <button onClick={() => props.setSelectedAmount(0, 20)}>SelectedAmount button</button>
            <button onClick={props.toggleModal}>ToggleModal button</button>
        </div>
    ))
);
jest.mock('Stores/Modules/Trading/Helpers/preview-proposal', () => ({
    ...jest.requireActual('Stores/Modules/Trading/Helpers/preview-proposal'),
    requestPreviewProposal: (
        store: TTradeStore,
        fn: (param: TResponse) => void,
        new_store: { amount: string | number }
    ) =>
        fn({
            proposal: { commission: '1%', limit_order: { stop_out: { order_amount: '10' } } },
            echo_req: { contract_type: 'MULTUP', amount: 20 },
            subscription: {},
        }),
}));
jest.mock('Modules/Trading/Components/Form/TradeParams/Multiplier/info', () =>
    jest.fn(props => (
        <div>
            <span>MultipliersInfo component</span>
            <span>{props.commission}</span>
        </div>
    ))
);

describe('<MultiplierAmountModal />', () => {
    const mockMultiplierAmountModal = () => {
        return (
            <TraderProviders store={mockStore(default_mock_store)}>
                <MultiplierAmountModal {...default_mocked_props} />
            </TraderProviders>
        );
    };

    beforeAll(() => {
        (ReactDOM.createPortal as jest.Mock) = jest.fn(component => {
            return component;
        });
    });

    afterAll(() => {
        (ReactDOM.createPortal as jest.Mock).mockClear();
        jest.clearAllMocks();
    });

    it('should render modal and <TradeParamsMobile/> inside', () => {
        render(mockMultiplierAmountModal());

        expect(screen.getByText(/AmountMobile component/i)).toBeInTheDocument();
        expect(screen.getByText(/MultipliersInfo component/i)).toBeInTheDocument();
    });

    it('should change stake_value and commission if setSelectedAmount was called by pressing on the proper button', () => {
        const { rerender } = render(mockMultiplierAmountModal());

        expect(screen.getByText(10)).toBeInTheDocument();
        expect(screen.queryByText(/1%/i)).not.toBeInTheDocument();

        const selected_amount_button = screen.getByText(/SelectedAmount button/i);
        userEvent.click(selected_amount_button);
        rerender(mockMultiplierAmountModal());

        expect(screen.getByText(20)).toBeInTheDocument();
        expect(screen.getByText(/1%/i)).toBeInTheDocument();
    });
    it('should call toggleModal if the proper button was clicked', () => {
        render(mockMultiplierAmountModal());

        const toggle_modal_button = screen.getByText(/ToggleModal button/i);
        userEvent.click(toggle_modal_button);

        expect(default_mocked_props.toggleModal).toBeCalled();
    });
});
