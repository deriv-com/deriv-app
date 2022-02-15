import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import PageReturn from '../page-return.jsx';

describe('<PageReturn />', () => {
    it('Component should be rendered', () => {
        render(<PageReturn />);

        expect(screen.getByTestId('parentContainer')).toHaveClass('page-return');
    });

    it('Should render proper className passed from props', async () => {
        render(<PageReturn className={'test'}/>);

        expect(await screen.findByTestId('parentContainer')).toHaveClass('page-return test');
    });

    it('function passed from props should be called', () => {
        const mockFunc = jest.fn();

        render(<PageReturn onClick={mockFunc}/>);

        const btn = screen.getByTestId('iconContainer');
        fireEvent.click(btn);

        expect(mockFunc).toHaveBeenCalledTimes(1);
    });

    it('Should show proper text passed from props', () => {
        render(<PageReturn page_title={'testTitle'}/>);

        expect(screen.getByText('testTitle')).toBeInTheDocument();
    });
});
