import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { DeactivateAccountReason } from '../deactivate-account-reason-old';

describe('<DeactivateAccountReason />', () => {
    it('Should render properly', async () => {
        render(<DeactivateAccountReason />);
        await waitFor(() => {
            screen.getAllByText(/Please tell us why you’re leaving/i);
        });
    });

    // it('Should be disable when no reason has been selected', async () => {
    //     render(<DeactivateAccountReason />);
    //     expect(screen.getByText(/Continue/i)).toHaveAttribute('disabled');
    // });

    test.todo('Should check at least one checkbox');
    test.todo('Should check at most three checkbox');
    test.todo('Should check at most 110 chars');
});
