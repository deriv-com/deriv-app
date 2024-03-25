import React from 'react';
import { render } from '@testing-library/react';
import CircularWrapper from '../circular-wrapper';

describe('CircularWrapper', () => {
    it('should render <CircularWrapper />', () => {
        const { container } = render(<CircularWrapper />);
        expect(container).toBeInTheDocument();
    });
});
