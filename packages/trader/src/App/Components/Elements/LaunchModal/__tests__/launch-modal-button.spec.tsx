import React from 'react';
import { render, screen } from '@testing-library/react';
import LaunchModalButton from '../launch-modal-button';

describe('<LaunchModalButton />', () => {
    it('should render LaunchModalButton ', () => {
        render(<LaunchModalButton handleOpen={jest.fn()} setShowDescription={jest.fn()} />);

        expect(screen.getByText('Try Turbos')).toBeInTheDocument();
    });
});
