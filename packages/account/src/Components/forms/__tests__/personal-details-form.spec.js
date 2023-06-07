import React from 'react';
import { render, screen } from '@testing-library/react';

const PersonalDetails = ({ open }) => (
    <>
        <p>test</p>
    </>
);

describe('PersonalDetails', () => {
    it('should render the PersonalDetails component', () => {
        render(<PersonalDetails />);
        expect(screen.getByText('test')).toBeInTheDocument();
    });
});
