import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStores } from 'Stores';
import AdvertiserPageDropdownMenu from '../advertiser-page-dropdown-menu';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    advertiser_page_store: {
        setIsDropdownMenuVisible: jest.fn(),
        is_counterparty_advertiser_blocked: false,
        is_dropdown_menu_visible: false,
        showBlockUserModal: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

describe('<AdvertiserPageDropdownMenu/>', () => {
    it('should display clickable dots icon if user is not blocked', () => {
        render(<AdvertiserPageDropdownMenu />);
        expect(screen.getByTestId('dt_advertiser_page_menu_dots_icon')).toBeInTheDocument();
    });
    it('should call setIsDropdownMenuVisible on clicking dots icon', () => {
        render(<AdvertiserPageDropdownMenu />);
        const icon = screen.getByTestId('dt_advertiser_page_menu_dots_icon');
        expect(screen.queryByTestId('dt_advertiser_page_dropdown')).not.toBeInTheDocument();
        userEvent.click(icon);
        expect(mock_store.advertiser_page_store.setIsDropdownMenuVisible).toHaveBeenCalledTimes(1);
    });
    it('should display dropdown menu when is_dropdown_menu_visible is true', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            advertiser_page_store: {
                ...mock_store.advertiser_page_store,
                is_dropdown_menu_visible: true,
            },
        });
        render(<AdvertiserPageDropdownMenu />);
        expect(screen.getByTestId('dt_advertiser_page_dropdown')).toBeInTheDocument();
    });
    it('should call showblockusermodal when user clicks on dropdown option', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            advertiser_page_store: {
                ...mock_store.advertiser_page_store,
                is_dropdown_menu_visible: true,
            },
        });
        render(<AdvertiserPageDropdownMenu />);
        const dropdown = screen.getByTestId('dt_advertiser_page_dropdown');
        expect(dropdown).toBeInTheDocument();
        userEvent.click(dropdown);
        expect(mock_store.advertiser_page_store.showBlockUserModal).toHaveBeenCalledTimes(1);
    });
    it('should close dropdown menu when clicked outside the dropdown menu section', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            advertiser_page_store: {
                ...mock_store.advertiser_page_store,
                is_dropdown_menu_visible: true,
            },
        });
        render(<AdvertiserPageDropdownMenu />);
        const dropdown = screen.getByTestId('dt_advertiser_page_dropdown');
        expect(dropdown).toBeInTheDocument();
        userEvent.click(dropdown);
        expect(mock_store.advertiser_page_store.showBlockUserModal).toHaveBeenCalledTimes(1);
        userEvent.click(document.body);
        expect(mock_store.advertiser_page_store.setIsDropdownMenuVisible).toHaveBeenCalled();
    });
});
