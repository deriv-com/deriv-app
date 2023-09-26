import React from 'react';
import { render, screen } from '@testing-library/react';
import SectionError from '../section-error';

describe('<SectionError/>', () => {
    it('should render default state of the component', () => {
        render(<SectionError message='Error message to be shown' />);
        expect(screen.getByText('Error message to be shown')).toBeInTheDocument();
    });
});
