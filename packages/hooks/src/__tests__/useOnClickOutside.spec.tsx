import React, { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import useOnClickOutside from '../useOnClickOutside';
import userEvent from '@testing-library/user-event';

describe('useOnClickOutside', () => {
    const clickOutSideText = 'Click outside to close';

    it('should call the callback when clicking outside the referenced element', async () => {
        const TestComponent = () => {
            const [isOpen, setIsOpen] = useState(true);
            const ref = useOnClickOutside(() => setIsOpen(false));

            return (
                <div>
                    {isOpen ? <div ref={ref}>{clickOutSideText}</div> : null}
                    <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
                </div>
            );
        };

        render(<TestComponent />);

        // Initial state: The element is visible.
        expect(screen.getByText(clickOutSideText)).toBeInTheDocument();

        // Click inside the element (no action should be taken).
        userEvent.click(screen.getByText(clickOutSideText));
        expect(screen.getByText(clickOutSideText)).toBeInTheDocument();

        // Click outside the element.
        userEvent.click(document.body);

        // After clicking outside, the element should be removed.
        await waitFor(() => {
            expect(screen.queryByText(clickOutSideText)).not.toBeInTheDocument();
        });
    });

    it('should not call the callback when clicking inside the referenced element', () => {
        const TestComponent = () => {
            const [isOpen, setIsOpen] = useState(true);
            const ref = useOnClickOutside(() => setIsOpen(false));

            return (
                <div>
                    {isOpen ? <div ref={ref}>Click outside to close</div> : null}
                    <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
                </div>
            );
        };

        render(<TestComponent />);

        // Initial state: The element is visible.
        expect(screen.getByText(clickOutSideText)).toBeInTheDocument();

        // Click inside the element (no action should be taken).
        userEvent.click(screen.getByText(clickOutSideText));
        expect(screen.getByText(clickOutSideText)).toBeInTheDocument();

        // After clicking inside the element, the element should remain.
        userEvent.click(screen.getByText(clickOutSideText));
        expect(screen.getByText(clickOutSideText)).toBeInTheDocument();
    });
});
