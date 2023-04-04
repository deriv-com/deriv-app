import React from 'react';
import { render, screen } from '@testing-library/react';
import Drawer from '../drawer';

describe('Drawer', () => {
    it('should Drawer be in the document', () => {
        render(<Drawer is_open={false} />);
        expect(screen.getByTestId('drawer')).toBeInTheDocument();
    });

    it('should Drawer be open if is_open="true" ', () => {
        render(<Drawer is_open={true} />);
        expect(screen.getByTestId('drawer')).toHaveClass('dc-drawer--open');
    });

    it('should Drawer be open if is_open="false" ', () => {
        render(<Drawer is_open={false} />);
        expect(screen.getByTestId('drawer')).not.toHaveClass('dc-drawer--open');
    });
});
