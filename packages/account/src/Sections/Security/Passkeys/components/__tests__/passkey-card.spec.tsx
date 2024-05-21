import React from 'react';
import { screen, render } from '@testing-library/react';
import { PasskeyCard } from '../passkey-card';
import { mock_passkeys_list } from '../../__tests__/passkeys.spec';

describe('PasskeyCard', () => {
    it('renders the passkey card correctly', () => {
        const mock_card = mock_passkeys_list[0];

        render(<PasskeyCard {...mock_card} />);

        expect(screen.getByText(/test passkey/i)).toBeInTheDocument();
        expect(screen.getByText(/stored on/i)).toBeInTheDocument();
        expect(screen.getByText(/last used/i)).toBeInTheDocument();
    });
});
