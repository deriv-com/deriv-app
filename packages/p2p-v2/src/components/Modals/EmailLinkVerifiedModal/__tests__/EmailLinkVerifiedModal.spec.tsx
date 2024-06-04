import React from 'react';
import { render, screen } from '@testing-library/react';
import EmailLinkVerifiedModal from '../EmailLinkVerifiedModal';

describe('<EmailLinkVerifiedModal />', () => {
    it('it should render the EmailLinkVerifiedModal', () => {
        render(<EmailLinkVerifiedModal isModalOpen onRequestClose={jest.fn()} />);

        expect(screen.getByText('One last step before we close this order')).toBeInTheDocument();
        expect(
            screen.getByText(
                'If you’ve received 100 USD from Test in your bank account or e-wallet, hit the button below to complete the order.'
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    });
});
