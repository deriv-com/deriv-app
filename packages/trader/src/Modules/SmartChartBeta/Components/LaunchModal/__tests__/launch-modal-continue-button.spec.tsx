import * as React from 'react';
import { render, screen } from '@testing-library/react';
import LaunchModalContinueButton from '../launch-modal-continue-button';

describe('Launch Modal Continue Button', () => {
    it('should Continue Button', () => {
        render(<LaunchModalContinueButton handleOpen={jest.fn()} />);
        expect(screen.getByText('Continue')).toBeInTheDocument();
    });
});
