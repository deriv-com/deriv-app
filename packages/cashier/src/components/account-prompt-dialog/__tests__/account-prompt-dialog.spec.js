import React from 'react';
import { render, screen } from '@testing-library/react';
import AccountPromptDialog from '../account-prompt-dialog.jsx';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Dialog: () => <div>Dialog</div>,
}));

describe('<AccountPromptDialog />', () => {
    const props = {
        accounts: {
            CR90000001: { is_virtual: 0, currency: 'USD' },
            CR90000002: { is_virtual: 0, currency: 'BTC' },
        },
        currency: 'USD',
        continueRoute: jest.fn(),
    };
    it('should render dialog', () => {
        render(<AccountPromptDialog {...props} />);

        expect(screen.getByText('Dialog')).toBeInTheDocument();
    });
});
