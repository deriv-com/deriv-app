import React from 'react';
import MT5MigrationModalContent from '../mt5-migration-modal-content';
import { useMT5MigrationModalContext } from '../mt5-migration-modal-context';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { CFDStoreProvider } from 'Stores/Modules/CFD/Helpers/useCfdStores';

jest.mock('../mt5-migration-modal-context', () => ({
    ...jest.requireActual('../mt5-migration-modal-context'),
    useMT5MigrationModalContext: jest.fn(),
}));

jest.mock('../mt5-migration-front-side-content', () => {
    const MockMT5FrontsideContent = () => <div>MT5FrontsideContent</div>;
    return MockMT5FrontsideContent;
});

const mockUseMT5MigrationModalContext = useMT5MigrationModalContext as jest.MockedFunction<
    typeof useMT5MigrationModalContext
>;

describe('MT5MigrationModalContent', () => {
    let response: ReturnType<typeof useMT5MigrationModalContext>;

    const renderComponent = () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockStore({})}>
                <CFDStoreProvider>{children}</CFDStoreProvider>
            </StoreProvider>
        );
        mockUseMT5MigrationModalContext.mockReturnValue(response);
        render(<MT5MigrationModalContent />, { wrapper });
    };

    beforeEach(() => {
        response = {
            show_modal_front_side: true,
            setShowModalFrontSide: () => null,
        };
    });

    it('should render MT5MigrationModalContent by showing frontside of the modal', () => {
        renderComponent();
        expect(screen.getByText('MT5FrontsideContent')).toBeInTheDocument();
    });
});
