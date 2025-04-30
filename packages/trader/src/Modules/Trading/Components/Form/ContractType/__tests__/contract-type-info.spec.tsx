import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore } from '@deriv/stores';
import Info from '../ContractTypeInfo/contract-type-info';
import { TContractCategory } from '../types';
import { TRADE_TYPES } from '@deriv/shared';
import TraderProviders from '../../../../../../trader-providers';

jest.mock('Assets/Trading/Categories/trade-categories-gif', () => jest.fn(() => 'TradeCategoriesGif'));
jest.mock('Assets/Trading/Categories/trade-categories', () => jest.fn(() => 'TradeDescription'));
jest.mock('../ContractTypeInfo/contract-type-glossary', () => jest.fn(() => 'TradeTypeGlossary'));
jest.mock('../../../../Helpers/contract-type', () => ({
    ...jest.requireActual('../../../../Helpers/contract-type'),
    isMajorPairsSymbol: jest.fn(() => true),
}));
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Dropdown: jest.fn(() => <div>Dropdown</div>),
}));

const mocked_props: React.ComponentProps<typeof Info> = {
    handleSelect: jest.fn(),
    item: {
        text: 'Multipliers',
        value: TRADE_TYPES.MULTIPLIER,
    },
    selected_value: TRADE_TYPES.MULTIPLIER,
    info_banner: <div>Info banner</div>,
    list: [
        {
            contract_categories: [
                {
                    contract_types: [
                        {
                            text: 'Multipliers',
                            value: TRADE_TYPES.MULTIPLIER,
                        },
                    ],
                    icon: 'IcMultiplier',
                    label: 'Multiplier',
                    key: 'Multiplier',
                },
                {
                    contract_types: [
                        {
                            text: 'Rise/Fall',
                            value: TRADE_TYPES.RISE_FALL,
                        },
                        {
                            text: 'Rise/Fall',
                            value: TRADE_TYPES.RISE_FALL_EQUAL,
                        },
                    ],
                    icon: 'IcUpsDowns',
                    label: 'Ups & Downs',
                    key: 'Ups & Downs',
                },
                {
                    contract_types: [
                        {
                            text: 'Higher/Lower',
                            value: TRADE_TYPES.HIGH_LOW,
                        },
                        {
                            text: 'Touch/No Touch',
                            value: TRADE_TYPES.TOUCH,
                        },
                    ],
                    icon: 'IcHighsLows',
                    label: 'Touch & No Touch',
                    key: 'Touch & No Touch',
                },
                {
                    contract_types: [
                        {
                            text: 'Matches/Differs',
                            value: TRADE_TYPES.MATCH_DIFF,
                        },
                        {
                            text: 'Even/Odd',
                            value: TRADE_TYPES.EVEN_ODD,
                        },
                        {
                            text: 'Over/Under',
                            value: TRADE_TYPES.OVER_UNDER,
                        },
                    ],
                    icon: 'IcDigits',
                    label: 'Digits',
                    key: 'Digits',
                },
                {
                    contract_types: [
                        {
                            text: 'Call/Put',
                            value: TRADE_TYPES.VANILLA.CALL,
                        },
                    ],
                    icon: 'IcVanilla',
                    label: 'Vanillas',
                    key: 'Vanillas',
                },
            ],
            contract_types: [
                {
                    text: 'Multipliers',
                    value: TRADE_TYPES.MULTIPLIER,
                },
                {
                    text: 'Rise/Fall',
                    value: TRADE_TYPES.RISE_FALL,
                },
                {
                    text: 'Rise/Fall',
                    value: TRADE_TYPES.RISE_FALL_EQUAL,
                },
                {
                    text: 'Higher/Lower',
                    value: TRADE_TYPES.HIGH_LOW,
                },
                {
                    text: 'Touch/No Touch',
                    value: TRADE_TYPES.TOUCH,
                },
                {
                    text: 'Matches/Differs',
                    value: TRADE_TYPES.MATCH_DIFF,
                },
                {
                    text: 'Even/Odd',
                    value: TRADE_TYPES.EVEN_ODD,
                },
                {
                    text: 'Over/Under',
                    value: TRADE_TYPES.OVER_UNDER,
                },
                {
                    text: 'Call/Put',
                    value: TRADE_TYPES.VANILLA.CALL,
                },
            ],
            icon: 'IcCatAll',
            label: 'All',
            key: 'All',
        },
        {
            contract_categories: [
                {
                    contract_types: [
                        {
                            text: 'Multipliers',
                            value: TRADE_TYPES.MULTIPLIER,
                        },
                    ],
                    icon: 'IcMultiplier',
                    label: 'Multiplier',
                    key: 'Multiplier',
                },
            ],
            contract_types: [
                {
                    text: 'Multipliers',
                    value: TRADE_TYPES.MULTIPLIER,
                },
            ],
            icon: 'IcCatMultiplier',
            label: 'Multipliers',
            key: 'Multipliers',
        },
        {
            contract_categories: [
                {
                    contract_types: [
                        {
                            text: 'Rise/Fall',
                            value: TRADE_TYPES.RISE_FALL,
                        },
                        {
                            text: 'Rise/Fall',
                            value: TRADE_TYPES.RISE_FALL_EQUAL,
                        },
                    ],
                    icon: 'IcUpsDowns',
                    label: 'Ups & Downs',
                    key: 'Ups & Downs',
                },
                {
                    contract_types: [
                        {
                            text: 'Higher/Lower',
                            value: TRADE_TYPES.HIGH_LOW,
                        },
                        {
                            text: 'Touch/No Touch',
                            value: TRADE_TYPES.TOUCH,
                        },
                    ],
                    icon: 'IcHighsLows',
                    label: 'Touch & No Touch',
                    key: 'Touch & No Touch',
                },
                {
                    contract_types: [
                        {
                            text: 'Matches/Differs',
                            value: TRADE_TYPES.MATCH_DIFF,
                        },
                        {
                            text: 'Even/Odd',
                            value: TRADE_TYPES.EVEN_ODD,
                        },
                        {
                            text: 'Over/Under',
                            value: TRADE_TYPES.OVER_UNDER,
                        },
                    ],
                    icon: 'IcDigits',
                    label: 'Digits',
                    key: 'Digits',
                },
                {
                    contract_types: [
                        {
                            text: 'Call/Put',
                            value: TRADE_TYPES.VANILLA.CALL,
                        },
                    ],
                    icon: 'IcVanilla',
                    label: 'Vanillas',
                    key: 'Vanillas',
                },
            ],
            contract_types: [
                {
                    text: 'Rise/Fall',
                    value: TRADE_TYPES.RISE_FALL,
                },
                {
                    text: 'Rise/Fall',
                    value: TRADE_TYPES.RISE_FALL_EQUAL,
                },
                {
                    text: 'Higher/Lower',
                    value: TRADE_TYPES.HIGH_LOW,
                },
                {
                    text: 'Touch/No Touch',
                    value: TRADE_TYPES.TOUCH,
                },
                {
                    text: 'Matches/Differs',
                    value: TRADE_TYPES.MATCH_DIFF,
                },
                {
                    text: 'Even/Odd',
                    value: TRADE_TYPES.EVEN_ODD,
                },
                {
                    text: 'Over/Under',
                    value: TRADE_TYPES.OVER_UNDER,
                },
                {
                    text: 'Call/Put',
                    value: TRADE_TYPES.VANILLA.CALL,
                },
            ],
            icon: 'IcCatOptions',
            label: 'Options',
            key: 'Options',
        },
    ],
};

const default_mock_store = {
    modules: {
        trade: {
            cached_multiplier_cancellation_list: [],
            symbol: 'test_symbol',
            is_vanilla_fx: false,
        },
    },
    active_symbols: {
        active_symbols: [],
    },
    ui: { is_mobile: false },
};

const choose_multipliers = 'Choose Multipliers';
const description = 'Description';
const glossary = 'Glossary';

describe('<Info />', () => {
    const mockInfoProvider = () => (
        <TraderProviders store={mockStore(default_mock_store)}>
            <Info {...mocked_props} />
        </TraderProviders>
    );

    it('Should render only one "Choose Multipliers" button', () => {
        render(mockInfoProvider());

        expect(screen.queryByText(choose_multipliers)).toBeInTheDocument();
    });
    it('Should call handleSelect when clicking on "Choose Multipliers" button', async () => {
        render(mockInfoProvider());

        const trade_type_button = screen.queryByText(choose_multipliers) as HTMLButtonElement;
        await userEvent.click(trade_type_button);

        expect(trade_type_button).toBeInTheDocument();
        expect(mocked_props.handleSelect).toHaveBeenCalled();
    });
    it('Should render toggle buttons if TRADE_TYPES.VANILLA.CALL info page is open', () => {
        mocked_props.item.text = 'Call/Put';
        mocked_props.item.value = TRADE_TYPES.VANILLA.CALL;
        mocked_props.selected_value = TRADE_TYPES.VANILLA.CALL;
        render(mockInfoProvider());

        expect(screen.getByText(description)).toBeInTheDocument();
        expect(screen.getByText(glossary)).toBeInTheDocument();
        expect(screen.getByText('Choose Call/Put')).toBeInTheDocument();
    });
    it('Should render toggle buttons if TRADE_TYPES.MULTIPLIER info page is open', () => {
        mocked_props.item.text = 'Multipliers';
        mocked_props.item.value = TRADE_TYPES.MULTIPLIER;
        mocked_props.selected_value = TRADE_TYPES.MULTIPLIER;

        render(mockInfoProvider());

        expect(screen.getByText(description)).toBeInTheDocument();
        expect(screen.getByText(glossary)).toBeInTheDocument();
        expect(screen.getByText(choose_multipliers)).toBeInTheDocument();
    });
    it('Should render Dropdown component if contract_types.length > 1', () => {
        render(mockInfoProvider());
        expect(screen.getByText('Dropdown')).toBeInTheDocument();
    });
    it('Should render info_banner if selected contract type is unavailable', () => {
        (mocked_props.list[0].contract_categories as TContractCategory[])[0].is_unavailable = true;
        render(mockInfoProvider());

        expect(screen.getByText('Info banner')).toBeInTheDocument();
    });
});
