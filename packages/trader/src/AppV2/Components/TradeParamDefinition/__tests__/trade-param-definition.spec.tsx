import React from 'react';
import { render, screen } from '@testing-library/react';
import TradeParamDefinition from '../trade-param-definition';

const mock_description = 'test description';

describe('TradeParamDefinition', () => {
    it('should not render if description is not passed', () => {
        const { container } = render(<TradeParamDefinition />);

        expect(container).toBeEmptyDOMElement();
    });

    it('should render description that is provided', () => {
        render(<TradeParamDefinition description={mock_description} />);

        expect(screen.getByText(mock_description)).toBeInTheDocument();
        expect(screen.getByText(mock_description)).toHaveClass('quill-typography');
    });

    it('should not wrap description with Quill Text component if is_custom_description === true', () => {
        render(<TradeParamDefinition description={mock_description} is_custom_description />);

        expect(screen.getByText(mock_description)).not.toHaveClass('quill-typography');
    });
});
