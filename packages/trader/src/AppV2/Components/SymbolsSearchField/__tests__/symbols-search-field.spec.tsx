import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TraderProviders from '../../../../trader-providers';
import { TCoreStores } from '@deriv/stores/types';
import { mockStore } from '@deriv/stores';
import SymbolsSearchField, { TSymbolsSearchField } from '../symbols-search-field';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getContractTypesConfig: jest.fn(() => ({
        contract_type: {
            title: 'MockContractType',
        },
    })),
}));

describe('<SymbolsSearchField />', () => {
    let mocked_props: TSymbolsSearchField;
    const mocked_store = {
        ui: {
            is_dark_mode_on: false,
        },
        modules: {
            trade: {
                contract_type: 'contract_type',
            },
        },
    };
    const MockedSymbolsSearchField = (mocked_store: TCoreStores, mock_props: TSymbolsSearchField) => {
        return (
            <TraderProviders store={mocked_store}>
                <SymbolsSearchField {...mock_props} />
            </TraderProviders>
        );
    };

    beforeEach(() => {
        mocked_props = {
            isSearching: true,
            setIsSearching: jest.fn(),
            searchValue: '',
            setSearchValue: jest.fn(),
        };
        jest.clearAllMocks();
    });

    const placeholder_input = 'Search markets on MockContractType';
    it('should render the SymbolsSearchField component', () => {
        render(MockedSymbolsSearchField(mockStore(mocked_store), mocked_props));
        expect(screen.getByPlaceholderText(placeholder_input)).toBeInTheDocument();
    });
    it('should render cancel button if isSearching is true', () => {
        render(MockedSymbolsSearchField(mockStore(mocked_store), mocked_props));
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
    it('should not render cancel button if isSearching is false', () => {
        mocked_props.isSearching = false;
        render(MockedSymbolsSearchField(mockStore(mocked_store), mocked_props));
        expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    });
    it('should call setIsSearching when the input is focused', () => {
        render(MockedSymbolsSearchField(mockStore(mocked_store), mocked_props));
        const input = screen.getByPlaceholderText(placeholder_input);
        fireEvent.focus(input);
        expect(mocked_props.setIsSearching).toHaveBeenCalledWith(true);
    });
    it('should update search value on input change', () => {
        render(MockedSymbolsSearchField(mockStore(mocked_store), mocked_props));
        const input = screen.getByPlaceholderText(placeholder_input);
        fireEvent.change(input, { target: { value: 'test' } });
        expect(mocked_props.setSearchValue).toHaveBeenCalledWith('test');
    });
    it('should call handleClear when cancel button is clicked', () => {
        render(MockedSymbolsSearchField(mockStore(mocked_store), mocked_props));
        const cancelButton = screen.getByText('Cancel');
        fireEvent.click(cancelButton);
        expect(mocked_props.setSearchValue).toHaveBeenCalledWith('');
        expect(mocked_props.setIsSearching).toHaveBeenCalledWith(false);
    });
});
