import React from 'react';
import { render, screen } from '@testing-library/react';
import { ManualFormFooter } from '../ManualFormFooter';

describe('ManualFormFooter', () => {
    it('should render the correct footer items', () => {
        render(<ManualFormFooter />);
        const items = screen.getAllByRole('listitem');

        expect(items).toHaveLength(4);
    });
});
