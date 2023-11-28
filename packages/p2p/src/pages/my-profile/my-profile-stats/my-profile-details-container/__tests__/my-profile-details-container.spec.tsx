import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { ModalManagerContextProvider } from 'Components/modal-manager';
import { useStores } from 'Stores/index';
import MyProfileDetailsContainer from '../my-profile-details-container';

let mock_store: DeepPartial<ReturnType<typeof useStores>>;

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

describe('<MyProfileDetailsContainer />', () => {
    const currentDate = Math.floor(Date.now() / 1000);

    beforeEach(() => {
        mock_store = {
            general_store: {
                advertiser_info: {
                    created_time: currentDate,
                },
            },
            my_profile_store: {
                full_name: 'test',
            },
        };
    });
    it('should render MyProfileDetailsContainer component', () => {
        render(<MyProfileDetailsContainer />, {
            wrapper: ({ children }) => (
                <ModalManagerContextProvider>
                    <StoreProvider store={mockStore({})}>{children}</StoreProvider>
                </ModalManagerContextProvider>
            ),
        });

        expect(screen.getByText('test')).toBeInTheDocument();
        expect(screen.getByText('Joined today')).toBeInTheDocument();
        expect(screen.getByText('Not rated yet')).toBeInTheDocument();
    });
});
