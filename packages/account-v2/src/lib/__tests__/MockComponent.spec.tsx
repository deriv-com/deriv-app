import React from 'react';
import { APIProvider } from '@deriv/api';
import { render, screen } from '@testing-library/react';
import MockComponent from '../MockComponent';

describe('MockComponent', () => {
    it('should render', async () => {
        render(
            <APIProvider standalone>
                <MockComponent />
            </APIProvider>
        );
        await screen.findByText('MockComponent');
    });
});
