import React from 'react';
import { render } from '@testing-library/react';
import ResultMobile from '../result-mobile';

describe('ResultMobile', () => {
    it('should ResultMobile be in the DOM', () => {
        const wrapper = render(<ResultMobile is_visible={true} />);
        expect(wrapper.getByTestId('result_mobile')).toBeInTheDocument();
    });

    it('should ResultMobile render LOST if result is won ', () => {
        const wrapper = render(<ResultMobile is_visible={true} result='won' />);
        expect(wrapper.getByText('Won')).toBeInTheDocument(true);
    });

    it('should ResultMobile render LOST if result is not won ', () => {
        const wrapper = render(<ResultMobile is_visible={true} result='lost' />);
        expect(wrapper.getByText('Lost')).toBeInTheDocument(true);
    });
});
