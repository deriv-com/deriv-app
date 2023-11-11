import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
// import { VANILLALONG, TURBOS } from '@deriv/shared';
// import { ActiveSymbols } from '@deriv/api-types';
import ContractDrawerCard from '../contract-drawer-card';
import TraderProviders from '../../../../../trader-providers';

const mocked_props = {
    contract_info: {
        profit: -10,
        validation_error: 'This contract has been sold',
        shortcode: 'CALL_1HZ100V_19.54_1699708064_10T_S0P_0',
        underlying: '1HZ100V',
    },
    is_accumulator: false,
    is_collapsed: false,
    is_market_closed: false,
    is_mobile: false,
    is_multiplier: false,
    is_vanilla: false,
    is_smarttrader_contract: false,
    is_sell_requested: false,
    is_turbos: false,
    onClickCancel: jest.fn(),
    onClickSell: jest.fn(),
    onSwipedUp: jest.fn(),
    onSwipedDown: jest.fn(),
    result: 'won',
    status: 'won',
    toggleContractAuditDrawer: jest.fn(),
};
