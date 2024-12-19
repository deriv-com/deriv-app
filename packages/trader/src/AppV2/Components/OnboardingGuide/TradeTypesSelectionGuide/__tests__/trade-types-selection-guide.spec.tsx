import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TradeTypesSelectionGuide from '../trade-types-selection-guide';

const modal_text = 'Manage your preferred trade types for easy access on the trade page.';
const localStorage_key = 'guide_dtrader_v2';
const video = 'Video';

jest.mock('../../../StreamIframe', () => jest.fn(() => <div>{video}</div>));

describe('TradeTypesSelectionGuide', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should render Modal with correct content after 800ms after mounting', async () => {
        jest.useFakeTimers();
        render(<TradeTypesSelectionGuide />);

        await waitFor(() => jest.advanceTimersByTime(800));

        expect(screen.getByText(video)).toBeInTheDocument();
        expect(screen.getByText(modal_text)).toBeInTheDocument();

        jest.useRealTimers();
    });

    it('should not render Modal if there is a flag in the localStorage equal to true', async () => {
        const field = { trade_types_selection: true };
        localStorage.setItem(localStorage_key, JSON.stringify(field));

        jest.useFakeTimers();
        render(<TradeTypesSelectionGuide />);

        await waitFor(() => jest.advanceTimersByTime(800));

        expect(screen.queryByText(video)).not.toBeInTheDocument();
        expect(screen.queryByText(modal_text)).not.toBeInTheDocument();

        jest.useRealTimers();
    });

    it('should close the Modal and set flag to localStorage equal to true after user clicks on "Got it" button', async () => {
        const field = 'trade_types_selection';

        localStorage.setItem(
            localStorage_key,
            JSON.stringify({
                [field]: false,
            })
        );

        jest.useFakeTimers();
        render(<TradeTypesSelectionGuide />);

        await waitFor(() => jest.advanceTimersByTime(800));

        expect(screen.getByText(video)).toBeInTheDocument();
        expect(screen.getByText(modal_text)).toBeInTheDocument();

        const initialState = JSON.parse(localStorage.getItem(localStorage_key) || '{}');
        expect(initialState[field]).toBe(false);

        await userEvent.click(screen.getByRole('button'));
        await waitFor(() => jest.advanceTimersByTime(300));

        expect(screen.queryByText(video)).not.toBeInTheDocument();
        expect(screen.queryByText(modal_text)).not.toBeInTheDocument();

        const finalState = JSON.parse(localStorage.getItem(localStorage_key) || '{}');
        expect(finalState[field]).toBe(true);

        jest.useRealTimers();
    });
});
