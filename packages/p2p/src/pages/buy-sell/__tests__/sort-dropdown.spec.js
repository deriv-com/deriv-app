import React from 'react';
import { useStores } from 'Stores';
import { fireEvent, render, screen } from '@testing-library/react';
import SortDropdown from '../sort-dropdown.jsx';
import { useDevice } from '@deriv-com/ui';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn().mockReturnValue(false),
}));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn().mockReturnValue({
        buy_sell_store: {
            sort_list: [
                { disabled: false, has_tooltip: false, text: 'Drop 1', tooltip: '', value: '1' },
                { disabled: false, has_tooltip: false, text: 'Drop 2', tooltip: '', value: '2' },
            ],
            handleChange: jest.fn(),
            setIsSortDropdownOpen: jest.fn(),
            selected_value: null,
        },
    }),
}));

jest.mock('@sendbird/chat', () => ({
    SendbirdChat: jest.fn().mockReturnValue({}),
}));

jest.mock('@sendbird/chat/groupChannel', () => ({
    SendbirdChat: jest.fn().mockReturnValue({}),
}));

jest.mock('@sendbird/chat/message', () => ({
    SendbirdChat: jest.fn().mockReturnValue({}),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isDesktop: false }),
}));
describe('<SortDropdown/>', () => {
    it('should render the mobile view containing icon', () => {
        render(<SortDropdown />);

        expect(screen.getByTestId('mobile-view-sort-icon')).toBeInTheDocument();
    });

    it('should invoke isSortDropDown method on click', () => {
        const { buy_sell_store } = useStores();
        render(<SortDropdown />);
        fireEvent.click(screen.getByTestId('sort-div'));

        expect(buy_sell_store.setIsSortDropdownOpen).toHaveBeenCalled();
    });

    it('should render dropdown in desktop view', () => {
        useDevice.mockReturnValue({ isDesktop: true });
        render(<SortDropdown />);

        expect(screen.getByTestId('dt_dropdown_display')).toBeInTheDocument();
    });
});
