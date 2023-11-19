import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore } from '@deriv/stores';
import Info from '../ContractTypeInfo/contract-type-info';
import TraderProviders from '../../../../../../trader-providers';

jest.mock('Assets/Trading/Categories/trade-categories-gif', () => jest.fn(() => 'TradeCategoriesGif'));
jest.mock('Assets/Trading/Categories/trade-categories', () => jest.fn(() => 'TradeDescription'));
jest.mock('../ContractTypeInfo/contract-type-glossary', () => jest.fn(() => 'TradeTypeGlossary'));
jest.mock('../../../../Helpers/contract-type', () => ({
    ...jest.requireActual('../../../../Helpers/contract-type'),
    isMajorPairsSymbol: jest.fn(() => true),
}));

const mocked_props: React.ComponentProps<typeof Info> = {
    handleSelect: jest.fn(),
    item: {
        text: 'Multipliers',
        value: 'multiplier',
    },
    list: [
        {
            contract_categories: [
                {
                    contract_types: [
                        {
                            text: 'Multipliers',
                            value: 'multiplier',
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
                            value: 'rise_fall',
                        },
                        {
                            text: 'Rise/Fall',
                            value: 'rise_fall_equal',
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
                            value: 'high_low',
                        },
                        {
                            text: 'Touch/No Touch',
                            value: 'touch',
                        },
                    ],
                    icon: 'IcHighsLows',
                    label: 'Highs & Lows',
                    key: 'Highs & Lows',
                },
                {
                    contract_types: [
                        {
                            text: 'Matches/Differs',
                            value: 'match_diff',
                        },
                        {
                            text: 'Even/Odd',
                            value: 'even_odd',
                        },
                        {
                            text: 'Over/Under',
                            value: 'over_under',
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
                            value: 'vanillalongcall',
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
                    value: 'multiplier',
                },
                {
                    text: 'Rise/Fall',
                    value: 'rise_fall',
                },
                {
                    text: 'Rise/Fall',
                    value: 'rise_fall_equal',
                },
                {
                    text: 'Higher/Lower',
                    value: 'high_low',
                },
                {
                    text: 'Touch/No Touch',
                    value: 'touch',
                },
                {
                    text: 'Matches/Differs',
                    value: 'match_diff',
                },
                {
                    text: 'Even/Odd',
                    value: 'even_odd',
                },
                {
                    text: 'Over/Under',
                    value: 'over_under',
                },
                {
                    text: 'Call/Put',
                    value: 'vanillalongcall',
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
                            value: 'multiplier',
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
                    value: 'multiplier',
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
                            value: 'rise_fall',
                        },
                        {
                            text: 'Rise/Fall',
                            value: 'rise_fall_equal',
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
                            value: 'high_low',
                        },
                        {
                            text: 'Touch/No Touch',
                            value: 'touch',
                        },
                    ],
                    icon: 'IcHighsLows',
                    label: 'Highs & Lows',
                    key: 'Highs & Lows',
                },
                {
                    contract_types: [
                        {
                            text: 'Matches/Differs',
                            value: 'match_diff',
                        },
                        {
                            text: 'Even/Odd',
                            value: 'even_odd',
                        },
                        {
                            text: 'Over/Under',
                            value: 'over_under',
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
                            value: 'vanillalongcall',
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
                    value: 'rise_fall',
                },
                {
                    text: 'Rise/Fall',
                    value: 'rise_fall_equal',
                },
                {
                    text: 'Higher/Lower',
                    value: 'high_low',
                },
                {
                    text: 'Touch/No Touch',
                    value: 'touch',
                },
                {
                    text: 'Matches/Differs',
                    value: 'match_diff',
                },
                {
                    text: 'Even/Odd',
                    value: 'even_odd',
                },
                {
                    text: 'Over/Under',
                    value: 'over_under',
                },
                {
                    text: 'Call/Put',
                    value: 'vanillalongcall',
                },
            ],
            icon: 'IcCatOptions',
            label: 'Options',
            key: 'Options',
        },
    ],
    videos: [],
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
    it('Should call handleSelect when clicking on "Choose Multipliers" button', () => {
        render(mockInfoProvider());

        const trade_type_button = screen.queryByText(choose_multipliers) as HTMLButtonElement;
        userEvent.click(trade_type_button);

        expect(trade_type_button).toBeInTheDocument();
        expect(mocked_props.handleSelect).toHaveBeenCalled();
    });
    it('Should render toggle buttons if vanilla info page is open', () => {
        mocked_props.item.text = 'Call/Put';
        mocked_props.item.value = 'vanillalongcall';
        render(mockInfoProvider());

        expect(screen.getByText(description)).toBeInTheDocument();
        expect(screen.getByText(glossary)).toBeInTheDocument();
        expect(screen.getByText('Choose Call/Put')).toBeInTheDocument();
    });
    it('Should render toggle buttons if multiplier info page is open', () => {
        mocked_props.item.text = 'Multipliers';
        mocked_props.item.value = 'multiplier';
        render(mockInfoProvider());

        expect(screen.getByText(description)).toBeInTheDocument();
        expect(screen.getByText(glossary)).toBeInTheDocument();
        expect(screen.getByText(choose_multipliers)).toBeInTheDocument();
    });
});
