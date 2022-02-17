import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import PageReturn from '../page-return.jsx';

describe('<PageReturn />', () => {
    it('Component should be rendered', () => {
        render(<PageReturn />);

        const el_component_container = screen.getByTestId('component_container');
        expect(el_component_container).toHaveClass('page-return');
    });

    it('Should render proper className passed from props', () => {
        render(<PageReturn className={'test'} />);

        const el_component_container = screen.getByTestId('component_container');
        expect(el_component_container).toHaveClass('page-return test');
    });

    it('function passed from props should be called', () => {
        const mockFunc = jest.fn();
        render(<PageReturn onClick={mockFunc} />);

        const el_icon_container = screen.getByTestId('icon_container');
        fireEvent.click(el_icon_container);

        expect(mockFunc).toHaveBeenCalledTimes(1);
    });

    it('Should show proper text passed from props', () => {
        render(<PageReturn page_title={'test_title'} />);

        const el_test_title = screen.getByText('test_title');
        expect(el_test_title).toBeInTheDocument();
    });
});
