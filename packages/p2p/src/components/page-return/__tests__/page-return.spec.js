import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PageReturn from '../page-return';

describe('<PageReturn />', () => {
    it('Component should be rendered', () => {
        const { container } = render(<PageReturn />);

        expect(container.querySelector('.page-return')).toBeInTheDocument();
    });

    it('Should render proper className passed from props', async () => {
        const { container } = render(<PageReturn className={'test'}/>);

        await waitFor(() => {
            expect(container.firstChild).toHaveClass('page-return test');
        });
    });

    it('function passed from props should be called', () => {
        const mockFunc = jest.fn();

        const { container } = render(<PageReturn onClick={mockFunc}/>);

        const btn = container.querySelector('.page-return__button');
        fireEvent.click(btn);

        expect(mockFunc).toHaveBeenCalledTimes(1);
    });

    it('Should show proper text passed from props', () => {
        render(<PageReturn page_title={'testTitle'}/>);

        expect(screen.getByText('testTitle')).toBeInTheDocument();
    });
});