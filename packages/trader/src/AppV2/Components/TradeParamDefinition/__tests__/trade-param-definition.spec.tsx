import React from 'react';
import { render, screen } from '@testing-library/react';
import TradeParamDefinition from '../trade-param-definition';

describe('TradeParamDefinition', () => {
    it('should not render if description is not passed', () => {
        const { container } = render(<TradeParamDefinition />);

        expect(container).toBeEmptyDOMElement();
    });

    it('should render description that is provided', () => {
        render(<TradeParamDefinition description='test description' />);

        expect(screen.getByText('test description')).toBeInTheDocument();
    });
});
