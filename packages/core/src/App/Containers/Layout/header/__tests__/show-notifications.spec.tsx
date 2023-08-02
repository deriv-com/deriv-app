import React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { TStores } from '@deriv/stores/types';
import { render, screen } from '@testing-library/react';
import ShowNotifications from '../show-notifications';

jest.mock('App/Components/Layout/Header', () => {
    const original_module = jest.requireActual('App/Components/Layout/Header');
    return {
        ...original_module,
        ToggleNotifications: () => <div>mockedToggleNotifications</div>,
    };
});

describe('ShowNotifications', () => {
    let store: TStores;
    beforeEach(() => {
        store = mockStore({});
    });

    it('should render the component', () => {
        render(
            <StoreProvider store={store}>
                <ShowNotifications />
            </StoreProvider>
        );
    });

    it('should render the ToggleNotifications child component', () => {
        render(
            <StoreProvider store={store}>
                <ShowNotifications />
            </StoreProvider>
        );
        expect(screen.getByText('mockedToggleNotifications')).toBeInTheDocument();
    });
});
