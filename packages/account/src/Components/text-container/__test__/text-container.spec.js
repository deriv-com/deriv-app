import React from 'react';
import { render, screen } from '@testing-library/react';
import { TextContainer } from '../text-container';

describe('<TextContainer/>', () => {
    it('should contain "Lorem Ipsum" in the document', () => {
        render(<TextContainer>Lorem Ipsum</TextContainer>);

        expect(screen.getByText(/Lorem Ipsum/i)).toBeInTheDocument();
        expect(screen.getByTestId(/dt_text_container/i)).toBeInTheDocument();
    });

    it('should not contain "Lorem Ipsum" in the document but <TextContainer /> exist', () => {
        render(<TextContainer />);

        expect(screen.queryByText(/Lorem Ipsum/i)).not.toBeInTheDocument();
        expect(screen.getByTestId(/dt_text_container/i)).toBeInTheDocument();
    });
});
