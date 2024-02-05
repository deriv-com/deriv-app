import React from 'react';
import { render, screen } from '@testing-library/react';
import FlyoutMenuList from '../FlyoutMenuList';

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    isValidElement: jest.fn().mockReturnValue((item: Record<string, string>) => !!item.key),
}));

describe('FlyoutMenuList', () => {
    it('should render objects as items ', () => {
        render(<FlyoutMenuList isOpen={true} listItems={[[<span key={0}>Item</span>]]} />);
        expect(screen.getByText('Item')).toBeInTheDocument();
    });
    it('should not render anything if isopen is not provided', () => {
        render(<FlyoutMenuList listItems={[[<span key={0}>Item</span>]]} />);
        expect(screen.queryByText('Item')).not.toBeInTheDocument();
    });
});
