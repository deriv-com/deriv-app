import React from 'react';
import { TSortByValues } from '@/utils';
import { useDevice } from '@deriv-com/ui';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BuySellHeader from '../BuySellHeader';

const mockProps = {
    activeTab: 'Buy',
    list: [
        {
            text: 'Exchange rate',
            value: 'rate',
        },
        {
            text: 'User rating',
            value: 'rating',
        },
    ],
    selectedCurrency: 'IDR',
    selectedPaymentMethods: [],
    setActiveTab: jest.fn(),
    setIsFilterModalOpen: jest.fn(),
    setSearchValue: jest.fn(),
    setSelectedCurrency: jest.fn(),
    setSelectedPaymentMethods: jest.fn(),
    setShouldUseClientLimits: jest.fn(),
    setSortDropdownValue: jest.fn(),
    shouldUseClientLimits: false,
    sortDropdownValue: 'rate' as TSortByValues,
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({
        isMobile: false,
    }),
}));

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    p2p: {
        settings: {
            useGetSettings: () => ({
                data: {},
            }),
        },
    },
}));

jest.mock('../../../components/CurrencyDropdown/CurrencyDropdown', () => jest.fn(() => <div>CurrencyDropdown</div>));
jest.mock('@/components/Modals/FilterModal/FilterModal', () => jest.fn(() => <div>FilterModal</div>));

const mockUseDevice = useDevice as jest.Mock;

jest.useFakeTimers();

describe('<BuySellHeader />', () => {
    it('should render the BuySellHeader', () => {
        render(<BuySellHeader {...mockProps} />);

        const buySellHeader = screen.getByTestId('dt_p2p_v2_buy_sell_header');

        expect(within(buySellHeader).getByRole('button', { name: 'Buy' })).toBeInTheDocument();
        expect(within(buySellHeader).getByRole('button', { name: 'Sell' })).toBeInTheDocument();
        expect(screen.getByRole('searchbox')).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Sort by' })).toBeInTheDocument();
    });

    it('should call setActiveTab when Sell tab is clicked', () => {
        render(<BuySellHeader {...mockProps} />);

        const sellTab = screen.getByRole('button', { name: 'Sell' });

        userEvent.click(sellTab);
        expect(mockProps.setActiveTab).toHaveBeenCalledWith('Sell');
    });

    it('should call setActiveTab when Buy tab is clicked', () => {
        render(<BuySellHeader {...mockProps} />);

        const buyTab = screen.getByRole('button', { name: 'Buy' });

        userEvent.click(buyTab);
        expect(mockProps.setActiveTab).toHaveBeenCalledWith('Buy');
    });

    it('should call setSearchValue when a value is entered in the search input', () => {
        render(<BuySellHeader {...mockProps} />);

        const searchInput = screen.getByRole('searchbox');

        act(() => {
            userEvent.type(searchInput, 'John Doe');
        });

        act(() => {
            jest.runAllTimers();
        });

        expect(mockProps.setSearchValue).toHaveBeenCalledWith('John Doe');
    });

    it('should call setSortDropdownValue when a value is selected from the dropdown', () => {
        render(<BuySellHeader {...mockProps} />);

        const dropdown = screen.getByRole('combobox', { name: 'Sort by' });

        userEvent.click(dropdown);

        const ratingOption = screen.getByRole('option', { name: 'User rating' });

        userEvent.click(ratingOption);

        expect(mockProps.setSortDropdownValue).toHaveBeenCalledWith('rating');
    });

    it('should call setIsFilterModalOpen when the filter button is clicked on responsive', () => {
        mockUseDevice.mockReturnValue({ isMobile: true });

        render(<BuySellHeader {...mockProps} />);

        const filterButton = screen.getByTestId('dt_p2p_v2_sort_dropdown_button');

        userEvent.click(filterButton);

        expect(mockProps.setIsFilterModalOpen).toHaveBeenCalledWith(true);
    });

    it('should allow users to click on filter button', () => {
        render(<BuySellHeader {...mockProps} />);

        const filterButton = screen.getByTestId('dt_p2p_v2_buy_sell_header_filter_button');

        userEvent.click(filterButton);

        expect(screen.getByText('FilterModal')).toBeInTheDocument();
    });
});
