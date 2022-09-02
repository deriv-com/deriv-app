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
        accounts_list: [
            {
                balance: '10000.00',
                currency: 'USD',
                is_crypto: false,
                is_dxtrade: false,
                is_mt: false,
                text: 'USD',
                value: 'CR90000195',
            },
        ],
        currency: 'USD',
        continueRoute: jest.fn(),
    };
    it('should render dialog', () => {
        render(<AccountPromptDialog {...props} />);

        expect(screen.getByText('Dialog')).toBeInTheDocument();
    });
});
