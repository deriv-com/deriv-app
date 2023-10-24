import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import POAAddressMismatchHintBox from '../poa-address-mismatch-hint-box';

describe('<POAAddressMismatchHintBox/>', () => {
    const msg =
        'It appears that the address in your document doesn’t match the address in your Deriv profile. Please update your personal details now with the correct address.';

    it('should render POAAddressMismatchHintBox component', async () => {
        window.HTMLElement.prototype.scrollIntoView = jest.fn();

        render(<POAAddressMismatchHintBox />);
        await waitFor(() => {
            expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
        });
        expect(screen.getByText(msg)).toBeVisible();
    });
});
