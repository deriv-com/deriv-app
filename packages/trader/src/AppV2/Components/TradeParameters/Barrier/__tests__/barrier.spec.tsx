import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Barrier from '../barrier';
import TraderProviders from '../../../../../trader-providers';
import ModulesProvider from 'Stores/Providers/modules-providers';
import { mockStore } from '@deriv/stores';

jest.mock('AppV2/Components/TradeParameters/Barrier/barrier-input', () => jest.fn(() => <div>Barrier Input</div>));
jest.mock('AppV2/Components/TradeParameters/Barrier/barrier-description', () =>
    jest.fn(() => <div>Barrier Description</div>)
);

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
                <ModulesProvider store={default_mock_store}>
                    <Barrier is_minimized />
                </ModulesProvider>
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
        expect(screen.getByText('Barrier Description')).toBeInTheDocument();
    });

    it('closes ActionSheet on pressing primary action when on first page', async () => {
        mockBarriers();
        userEvent.click(screen.getByRole('textbox'));
        expect(screen.getByText('Barrier Input')).toBeInTheDocument();
        await userEvent.click(screen.getByText(/Save/));
        await waitFor(() => expect(screen.queryByText('Barrier Input')).not.toBeInTheDocument());
    });

    it('moves to first page when "Got it" is clicked while on second page', async () => {
        mockBarriers();
        userEvent.click(screen.getByRole('textbox'));
        await userEvent.click(screen.getByText('LabelPairedCircleInfoMdRegularIcon'));
        expect(screen.getByText(/Got it/)).toBeInTheDocument();
        await userEvent.click(screen.getByText(/Got it/));
        expect(screen.getByText('Barrier Input')).toBeInTheDocument();
    });
});
