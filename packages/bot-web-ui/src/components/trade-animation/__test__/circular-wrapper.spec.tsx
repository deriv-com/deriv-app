import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import CircularWrapper from '../circular-wrapper';

describe('CircularWrapper', () => {
    it('should render <CircularWrapper />', () => {
        const { container } = render(<CircularWrapper />);
        expect(container).toBeInTheDocument();
    });
});
