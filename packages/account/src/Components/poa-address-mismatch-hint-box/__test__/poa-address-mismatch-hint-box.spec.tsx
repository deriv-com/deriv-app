import React from 'react';
import { screen, render } from '@testing-library/react';
import POAAddressMismatchHintBox from '../poa-address-mismatch-hint-box';

describe('POAAddressMismatchHintBox', () => {
    it('should render POAAddressMismatchHintBox', () => {
        render(<POAAddressMismatchHintBox />);
        expect(
            screen.getByText(
                `It appears that the address in your document doesn’t match the address in your Deriv profile. Please update your personal details now with the correct address.`
            )
        ).toBeInTheDocument();
    });
});
