import React from 'react';
import { render, screen } from '@testing-library/react';
import ContractTypeGlossary from '../ContractTypeInfo/contract-type-glossary';

describe('<ContractTypeGlossary />', () => {
    it('Ensure accumulator glossary is rendered properly', () => {
        render(<ContractTypeGlossary category='accumulator' />);

        expect(
            screen.getByText(/You can choose a growth rate with values of 1%, 2%, 3%, 4%, and 5%./i)
        ).toBeInTheDocument();
    });
    it('Ensure vanilla glossary is rendered properly', () => {
        render(<ContractTypeGlossary category='vanilla' />);

        expect(
            screen.getByText(/Contracts will expire at exactly 23:59:59 GMT on your selected expiry date./i)
        ).toBeInTheDocument();
    });
    it('Ensure placeholder text is rendered if category does not exist', () => {
        const { container } = render(<ContractTypeGlossary category='test' />);

        expect(container).toBeEmptyDOMElement();
    });
});
