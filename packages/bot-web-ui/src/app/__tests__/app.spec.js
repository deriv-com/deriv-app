import React from 'react';
import { render } from '@testing-library/react';
import Bot from '../app';

jest.mock('@deriv/components', () => ({
    Loading: () => <div>Loading...</div>,
}));

describe('Bot component', () => {
    it('renders app-main using makeLazyLoader', async () => {
        const { container } = await render(<Bot />);
        expect(container).toBeInTheDocument();
    });
});
