import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoginButton } from '../login-button.jsx';
import { mockStore, StoreProvider } from '@deriv/stores';

describe('LoginButton', () => {
    const mockStoreData = mockStore({});
    it('should have the right className base on the property', () => {
        render(
            <StoreProvider store={mockStoreData}>
                <LoginButton className='acc-info__button' />
            </StoreProvider>
        );
        const button = screen.getByRole('button');
        expect(button).toHaveClass('acc-info__button');
    });
});
