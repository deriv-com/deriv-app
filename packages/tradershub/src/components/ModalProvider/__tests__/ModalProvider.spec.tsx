import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import ModalProvider, { useModal } from '../ModalProvider';

jest.mock('@deriv/quill-design', () => ({
    useBreakpoint: () => ({ isLg: true }),
}));

describe('ModalProvider', () => {
    let modalContext: ReturnType<typeof useModal>;

    const TestComponent = () => {
        modalContext = useModal();
        return null;
    };

    beforeEach(() => {
        render(
            <ModalProvider>
                <TestComponent />
            </ModalProvider>
        );
    });

    it('provides modal context', () => {
        expect(modalContext).toHaveProperty('getModalState');
        expect(modalContext).toHaveProperty('hide');
        expect(modalContext).toHaveProperty('isOpen');
        expect(modalContext).toHaveProperty('modalState');
        expect(modalContext).toHaveProperty('setModalOptions');
        expect(modalContext).toHaveProperty('setModalState');
        expect(modalContext).toHaveProperty('show');
    });

    it('shows and hides modal', async () => {
        act(() => {
            modalContext.show(<div>Test</div>);
        });

        await waitFor(() => expect(modalContext.isOpen).toBe(true));

        act(() => {
            modalContext.hide();
        });

        await waitFor(() => expect(modalContext.isOpen).toBe(false));
    });

    it('should update modal state', async () => {
        act(() => {
            modalContext.setModalState('platform', 'mt5');
        });

        await waitFor(() => expect(modalContext.getModalState('platform')).toBe('mt5'));
    });

    it('closes modal on outside click', async () => {
        act(() => {
            modalContext.show(<div data-testid='modal'>Test</div>);
        });

        render(
            <div>
                <ModalProvider>
                    <TestComponent />
                </ModalProvider>
                <div data-testid='outside' />
            </div>
        );

        fireEvent.click(screen.getByTestId('outside'));

        await waitFor(() => {
            expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
        });
    });

    it('should throw error when useModal is used outside of ModalProvider', () => {
        const TestComponent = () => {
            expect(useModal).toThrow('useModal() must be called within a component wrapped in ModalProvider.');
            return null;
        };

        render(<TestComponent />);
    });
});
