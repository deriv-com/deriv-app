import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Drawer from '../drawer';

describe('Drawer', () => {
    it('should Drawer be in the document', () => {
        const wrapper = render(<Drawer />);
        expect(wrapper.getByTestId('drawer')).toBeInTheDocument();
    });

    it('should Drawer be open if is_open="true" ', () => {
        const wrapper = render(<Drawer is_open={true} />);
        wrapper.debug();
        expect(wrapper.getByTestId('drawer')).toHaveClass('dc-drawer--open');
    });

    it('should Drawer be open if is_open="false" ', () => {
        const wrapper = render(<Drawer is_open={false} />);
        wrapper.debug();
        expect(wrapper.getByTestId('drawer')).not.toHaveClass('dc-drawer--open');
    });
});
