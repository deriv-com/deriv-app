import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import { mockContractInfo, CONTRACT_TYPES } from '@deriv/shared';
import TogglePositionsMobile from '../toggle-positions-mobile';
import TraderProviders from '../../../../../trader-providers';

const default_mocked_props: React.ComponentProps<typeof TogglePositionsMobile> = {
    active_positions_count: 0,
    currency: 'USD',
    error: '',
    filtered_positions: [
        {
            contract_info: mockContractInfo({
                contract_id: 215925907928,
                contract_type: CONTRACT_TYPES.CALL,
                is_sold: 0,
                shortcode: 'CALL_1HZ100V_76.33_1692187938_1692188838_S0P_0',
                underlying: '1HZ100V',
            }),
            contract_update: {},
            display_name: 'Volatility 100 (1s) Index',
            indicative: 29.55,
            reference: 430851089968,
            is_sell_requested: false,
            is_unsupported: false,
            profit_loss: -9.45,
        },
        {
            contract_info: mockContractInfo({
                contract_id: 2,
                contract_type: CONTRACT_TYPES.PUT,
                is_sold: 0,
                shortcode: 'PUT_R_10_19.53_1691443887_1691444787_S0P_0',
                underlying: 'R_100',
            }),
            contract_update: {},
            display_name: 'Volatility 100 (1s) Index',
            indicative: 29.55,
            reference: 430851089968,
            is_sell_requested: false,
            is_unsupported: false,
            profit_loss: -9.45,
        },
    ],
    is_empty: true,
    onClickSell: jest.fn(),
    onClickCancel: jest.fn(),
};

const default_mock_store = {
    ui: {
        togglePositionsDrawer: jest.fn(),
        is_positions_drawer_on: false,
    },
};

jest.mock('App/Components/Elements/PositionsDrawer/positions-modal-card', () =>
    jest.fn(props => <div key={props.key}>PositionsModalCard</div>)
);

describe('TogglePositionsMobile component', () => {
    let modal_root_el: HTMLDivElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });
    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });
    const mockTogglePositionsMobile = (
        mocked_store: TCoreStores,
        mocked_props: React.ComponentProps<typeof TogglePositionsMobile>
    ) => {
        return (
            <BrowserRouter>
                <TraderProviders store={mocked_store}>
                    <TogglePositionsMobile {...mocked_props} />
                </TraderProviders>
            </BrowserRouter>
        );
    };
    it('should display TogglePositions with portfolio icon by default when is_positions_drawer_on === false', () => {
        const mock_root_store = mockStore(default_mock_store);
        render(mockTogglePositionsMobile(mock_root_store, default_mocked_props));
        expect(screen.getByTestId('dt_positions_toggle')).toBeInTheDocument();
        expect(screen.queryByText(/Recent positions/i)).not.toBeInTheDocument();
    });
    it('should display an empty Modal when is_positions_drawer_on === true and is_empty === true', () => {
        const mock_root_store = mockStore({
            ...default_mock_store,
            ui: { ...default_mock_store.ui, is_positions_drawer_on: true },
        });
        render(mockTogglePositionsMobile(mock_root_store, { ...default_mocked_props, is_empty: true }));
        expect(screen.getByText(/Recent positions/i)).toBeInTheDocument();
    });
    it('should display 2 positions when is_positions_drawer_on === true, is_empty === false, and has 2 active positions', () => {
        const new_mocked_props: React.ComponentProps<typeof TogglePositionsMobile> = {
            active_positions_count: 2,
            currency: 'USD',
            error: '',
            filtered_positions: [
                {
                    contract_info: mockContractInfo({
                        contract_id: 1,
                        contract_type: CONTRACT_TYPES.CALL,
                        is_sold: 0,
                        shortcode: 'CALL_R_10_19.54_1691443851_1691444751_S0P_0',
                        underlying: 'R_100',
                    }),
                    contract_update: {},
                    display_name: 'Volatility 100 (1s) Index',
                    indicative: 29.55,
                    reference: 430851089968,
                    is_sell_requested: false,
                    is_unsupported: false,
                    profit_loss: -9.45,
                },
                {
                    contract_info: mockContractInfo({
                        contract_id: 2,
                        contract_type: CONTRACT_TYPES.PUT,
                        is_sold: 0,
                        shortcode: 'PUT_R_10_19.53_1691443887_1691444787_S0P_0',
                        underlying: 'R_100',
                    }),
                    contract_update: {},
                    display_name: 'Volatility 100 (1s) Index',
                    indicative: 29.55,
                    reference: 430851089968,
                    is_sell_requested: false,
                    is_unsupported: false,
                    profit_loss: -9.45,
                },
            ],
            is_empty: false,
            onClickSell: jest.fn(),
            onClickCancel: jest.fn(),
        };
        const mock_root_store = mockStore({
            ...default_mock_store,
            ui: { ...default_mock_store.ui, is_positions_drawer_on: true },
        });
        render(mockTogglePositionsMobile(mock_root_store, { ...default_mocked_props, ...new_mocked_props }));
        expect(screen.getByText(/Recent positions/i)).toBeInTheDocument();
        expect(screen.getAllByText(/PositionsModalCard/i)).toHaveLength(2);
    });
    it('should display 1 of 2 positions after closing the modal if one of the 2 positions is sold', async () => {
        const new_mocked_props: React.ComponentProps<typeof TogglePositionsMobile> = {
            active_positions_count: 1,
            currency: 'USD',
            error: '',
            filtered_positions: [
                {
                    contract_info: mockContractInfo({
                        contract_id: 1,
                        contract_type: CONTRACT_TYPES.CALL,
                        is_sold: 0,
                        shortcode: 'CALL_R_10_19.54_1691443851_1691444751_S0P_0',
                        underlying: 'R_100',
                    }),
                    contract_update: {},
                    display_name: 'Volatility 100 (1s) Index',
                    indicative: 29.55,
                    reference: 430851089968,
                    is_sell_requested: false,
                    is_unsupported: false,
                    profit_loss: -9.45,
                },
                {
                    contract_info: mockContractInfo({
                        contract_id: 2,
                        contract_type: CONTRACT_TYPES.PUT,
                        is_sold: 1,
                        shortcode: 'PUT_R_10_19.53_1691443887_1691444787_S0P_0',
                        underlying: 'R_100',
                    }),
                    contract_update: {},
                    display_name: 'Volatility 100 (1s) Index',
                    indicative: 29.55,
                    reference: 430851089968,
                    is_sell_requested: false,
                    is_unsupported: false,
                    profit_loss: -9.45,
                },
            ],
            is_empty: false,
            onClickSell: jest.fn(),
            onClickCancel: jest.fn(),
        };
        const mock_root_store = mockStore({
            ...default_mock_store,
            ui: { ...default_mock_store.ui, is_positions_drawer_on: true },
        });
        render(mockTogglePositionsMobile(mock_root_store, { ...default_mocked_props, ...new_mocked_props }));
        expect(screen.getAllByText(/PositionsModalCard/i)).toHaveLength(2);

        const close_icon = screen.getByTestId('dt_modal_header_close');
        await userEvent.click(close_icon);
        await waitFor(() => {
            expect(mock_root_store.ui.togglePositionsDrawer).toHaveBeenCalled();
            expect(screen.getByText(/PositionsModalCard/i)).toBeInTheDocument();
        });
    });
    it('should display no more than 5 recent positions', () => {
        const positions_pair: React.ComponentProps<typeof TogglePositionsMobile>['filtered_positions'] = [
            {
                contract_info: mockContractInfo({
                    contract_id: 1,
                    contract_type: CONTRACT_TYPES.CALL,
                    is_sold: 0,
                    shortcode: 'CALL_R_10_19.54_1691443851_1691444751_S0P_0',
                    underlying: 'R_100',
                }),
                contract_update: {},
                display_name: 'Volatility 100 (1s) Index',
                indicative: 29.55,
                reference: 430851089968,
                is_sell_requested: false,
                is_unsupported: false,
                profit_loss: -9.45,
            },
            {
                contract_info: mockContractInfo({
                    contract_id: 2,
                    contract_type: CONTRACT_TYPES.PUT,
                    is_sold: 0,
                    shortcode: 'PUT_R_10_19.53_1691443887_1691444787_S0P_0',
                    underlying: 'R_100',
                }),
                contract_update: {},
                display_name: 'Volatility 100 (1s) Index',
                indicative: 29.55,
                reference: 430851089968,
                is_sell_requested: false,
                is_unsupported: false,
                profit_loss: -9.45,
            },
        ];
        const new_mocked_props = {
            active_positions_count: 6,
            filtered_positions: [...positions_pair, ...positions_pair, ...positions_pair],
            is_empty: false,
        };
        const mock_root_store = mockStore({
            ...default_mock_store,
            ui: { ...default_mock_store.ui, is_positions_drawer_on: true },
        });
        render(mockTogglePositionsMobile(mock_root_store, { ...default_mocked_props, ...new_mocked_props }));
        expect(screen.getAllByText(/PositionsModalCard/i)).toHaveLength(5);
    });
});
