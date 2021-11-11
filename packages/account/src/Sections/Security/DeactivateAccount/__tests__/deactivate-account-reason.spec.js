import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DeactivateAccountReason from '../deactivate-account-reason';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<DeactivateAccountReason />', () => {
    it('Should render properly', async () => {
        render(<DeactivateAccountReason />);
        await waitFor(() => {
            screen.getAllByText(/Please tell us why you’re leaving/i);
        });
    });

    test.todo('Should check at least one checkbox');
    test.todo('Should check at most three checkbox');
    test.todo('Should check at most 110 chars');
});
