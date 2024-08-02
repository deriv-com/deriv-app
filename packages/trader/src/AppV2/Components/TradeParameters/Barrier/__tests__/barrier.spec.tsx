import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Barrier from '../barrier';
import TraderProviders from '../../../../../trader-providers';
import ModulesProvider from 'Stores/Providers/modules-providers';
import { mockStore } from '@deriv/stores';

jest.mock('AppV2/Components/TradeParameters/Barrier/barrier-input', () => jest.fn(() => <div>Barrier Input</div>));

jest.mock('@deriv/quill-icons', () => ({
    ...jest.requireActual('@deriv/quill-icons'),
    LabelPairedCircleInfoMdRegularIcon: () => <div>LabelPairedCircleInfoMdRegularIcon</div>,
}));

describe('Barrier Component', () => {
    let default_mock_store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        default_mock_store = mockStore({});
    });
    const mockBarriers = () => {
        render(
            <TraderProviders store={default_mock_store}>
                <Barrier is_minimized />
            </TraderProviders>
        );
    };
    it('renders the Barrier component with initial state', () => {
        mockBarriers();
        expect(screen.getByLabelText(/Barrier/i)).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('opens ActionSheet when clicking the TextField', () => {
        mockBarriers();
        userEvent.click(screen.getByRole('textbox'));
        expect(screen.getByText('Barrier Input')).toBeInTheDocument();
        expect(screen.getByText('LabelPairedCircleInfoMdRegularIcon')).toBeInTheDocument();
    });

    it('displays BarrierDescription on the second carousel page', async () => {
        mockBarriers();
        userEvent.click(screen.getByRole('textbox'));
        await userEvent.click(screen.getByText('LabelPairedCircleInfoMdRegularIcon'));
        expect(screen.getByText('Above spot:')).toBeInTheDocument();
    });

    it('closes ActionSheet on pressing primary action when on first page', async () => {
        mockBarriers();
        userEvent.click(screen.getByRole('textbox'));
        expect(screen.getByText('Barrier Input')).toBeInTheDocument();
        userEvent.click(screen.getByText(/Save/));
        await waitFor(() => expect(screen.queryByText('Barrier Input')).not.toBeInTheDocument());
    });
    it('detects clicking outside the ActionSheet and closes it', async () => {
        mockBarriers();
        userEvent.click(screen.getByRole('textbox'));
        expect(screen.getByText('Barrier Input')).toBeInTheDocument();
        userEvent.click(screen.getByTestId('dt-actionsheet-overlay'));
        await waitFor(() => expect(screen.queryByText('Barrier Input')).not.toBeInTheDocument());
    });
});
