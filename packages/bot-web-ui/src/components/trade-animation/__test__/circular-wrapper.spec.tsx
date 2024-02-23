import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import ContractWrapper from '../circular-wrapper';

describe('ContractWrapper', () => {
    it('should render <ContractWrapper />', () => {
        const { container } = render(<ContractWrapper />);
        expect(container).toBeInTheDocument();
    });
});
