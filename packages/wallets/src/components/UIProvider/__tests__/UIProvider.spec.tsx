import React, { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import UIProvider, { useUI, useUpdateUI } from '../UIProvider';

const MockComponent = () => {
    const { uiState } = useUI();
    const updateRegion = useUpdateUI('region', 'EU');

    useEffect(() => {
        updateRegion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div>{uiState.region}</div>;
};

describe('UIProvider', () => {
    it('provides UI state and updater function', async () => {
        render(
            <UIProvider>
                <MockComponent />
            </UIProvider>
        );

        await screen.findByText('EU');
    });

    it('does not update UI state when useUpdateUI is not called', async () => {
        const MockComponent = () => {
            const { uiState } = useUI();
            return <div>{uiState.region}</div>;
        };

        render(
            <UIProvider>
                <MockComponent />
            </UIProvider>
        );

        await screen.findByText('Non-EU');
    });

    it('throws an error when useUI is called outside of UIProvider', () => {
        const MockComponent = () => {
            useUI();
            return <div />;
        };

        const spy = jest.spyOn(console, 'error');
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        spy.mockImplementation(() => {}); // Mock console.error

        expect(() => render(<MockComponent />)).toThrowError();

        spy.mockRestore(); // Restore console.error
    });

    it('throws an error when useUpdateUI is called outside of UIProvider', () => {
        const MockComponent = () => {
            useUpdateUI('region', 'EU');
            return <div />;
        };

        const spy = jest.spyOn(console, 'error');
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        spy.mockImplementation(() => {}); // Mock console.error

        expect(() => render(<MockComponent />)).toThrowError();

        spy.mockRestore(); // Restore console.error
    });
});
