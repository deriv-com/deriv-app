import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useDevice } from '@deriv-com/ui';
import { useStores } from 'Stores/index';
import MyProfileForm from '../my-profile-form';

let mock_store: DeepPartial<ReturnType<typeof useStores>>;

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    MobileFullPageModal: ({
        children,
        pageHeaderReturnFn = mock_store.setActiveTab,
        page_header_text = 'Ad details',
    }) => (
        <div>
            {page_header_text}
            <button onClick={pageHeaderReturnFn}>Return</button>
            {children}
        </div>
    ),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isDesktop: true }),
}));

describe('<MyProfileForm />', () => {
    beforeEach(() => {
        mock_store = {
            my_profile_store: {
                is_loading: false,
                setActiveTab: jest.fn(),
            },
            general_store: {
                contact_info: '',
                default_advert_description: '',
            },
        };
    });

    it('should render MyProfileForm component', () => {
        render(<MyProfileForm />);

        expect(screen.getByText('Contact details')).toBeInTheDocument();
        expect(screen.getByText('Instructions')).toBeInTheDocument();
    });

    it('should render the Loading component when my_profile_store.is_loading is set to true', () => {
        mock_store.my_profile_store.is_loading = true;

        render(<MyProfileForm />);

        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
    });

    it('expects the setActiveTab function to be called when return function is clicked', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });
        render(<MyProfileForm />);

        const returnButton = screen.getByRole('button', { name: 'Return' });
        userEvent.click(returnButton);

        expect(screen.getByText('Ad details')).toBeInTheDocument();
        expect(mock_store.my_profile_store.setActiveTab).toHaveBeenCalledTimes(1);
    });
});
