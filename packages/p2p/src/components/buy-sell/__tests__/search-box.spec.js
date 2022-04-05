import React from 'react';
import { fireEvent, screen, render, waitFor } from '@testing-library/react';
import { isDesktop } from '@deriv/shared';
import { useStores } from 'Stores';
import SearchBox from '../search-box.jsx';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(),
}));

jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/screen/responsive'),
    isDesktop: jest.fn(),
}));

const setIsLoading = jest.fn();
const setSearchResults = jest.fn();
const setSearchTerm = jest.fn();

const mockUseStores = () => {
    useStores.mockImplementation(() => ({
        buy_sell_store: {
            setIsLoading,
            setSearchResults,
            setSearchTerm,
        },
    }));
};

beforeAll(() => mockUseStores());

describe('<SearchBox />', () => {
    it('Component should be rendered and show proper input placeholder', () => {
        isDesktop.mockReturnValue(true);
        render(<SearchBox />);

        expect(screen.getByTestId('dp2p-search-box_container')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search by nickname')).toBeInTheDocument();
    });

    it('Should show different placeholder text if isDesktop is false ', () => {
        isDesktop.mockReturnValue(false);
        render(<SearchBox />);

        expect(screen.getByTestId('dp2p-search-box_container')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    });

    it('Should show cross icon when input is not empty', async () => {
        render(<SearchBox />);

        const el_dp2p_search_box__search_input = screen.getByPlaceholderText('Search');
        fireEvent.change(el_dp2p_search_box__search_input, { target: { value: '42' } });

        await waitFor(() => {
            expect(screen.getByTestId('dp2p-search-box__cross_icon')).toBeInTheDocument();
        });
    });

    it('Input must be clear after click on cross icon', async () => {
        render(<SearchBox />);

        const el_dp2p_search_box__search_input = screen.getByPlaceholderText('Search');
        fireEvent.change(el_dp2p_search_box__search_input, { target: { value: '42' } });

        await waitFor(() => {
            const el_dp2p_search_box__cross_icon = screen.getByTestId('dp2p-search-box__cross_icon');
            fireEvent.click(el_dp2p_search_box__cross_icon);

            expect(setSearchTerm).toHaveBeenCalledWith('');
            expect(setSearchResults).toHaveBeenCalledWith([]);
        });
        await waitFor(() => {
            expect(el_dp2p_search_box__search_input).toHaveValue('');
        });
    });

    it('setIsLoading and setSearchTerm funcs must be called with proper props when form is submitted', async () => {
        render(<SearchBox />);

        const el_dp2p_search_box__search_input = screen.getByPlaceholderText('Search');
        fireEvent.change(el_dp2p_search_box__search_input, { target: { value: '42' } });
        fireEvent.keyUp(el_dp2p_search_box__search_input);
        fireEvent.focus(el_dp2p_search_box__search_input);

        await waitFor(() => {
            expect(setIsLoading).toHaveBeenCalledWith(true);
            expect(setSearchTerm).toHaveBeenCalledWith('42');
        });
    });

    it('Response must be empty if request body is empty', async () => {
        render(<SearchBox />);

        const el_dp2p_search_box__search_input = screen.getByPlaceholderText('Search');
        fireEvent.change(el_dp2p_search_box__search_input, { target: { value: '' } });
        fireEvent.focus(el_dp2p_search_box__search_input);

        await waitFor(() => {
            expect(setSearchResults).toHaveBeenCalledWith([]);
            expect(setSearchTerm).toHaveBeenCalledWith('');
        });
    });
});
