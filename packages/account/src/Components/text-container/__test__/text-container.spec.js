import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { TextContainer } from '../text-container';

describe('<TextContainer/>', () => {
    describe('renders the Text Container', () => {
        beforeEach(() => {
            <TextContainer />;
        });

        it('should show Text Container', () => {
            // expect(screen.getByTestId(/test_text_container/i)).not.toBeInTheDocument()
        });
    });
});
