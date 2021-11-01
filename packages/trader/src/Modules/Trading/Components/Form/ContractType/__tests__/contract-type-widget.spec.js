import React from 'react';
import { render } from '@testing-library/react';
import ContractTypeWidget from '../contract-type-widget';

describe('<ContractTypeWidget />', () => {
    it('should_render_successfully', () => {
        render(<ContractTypeWidget />);
        screen.getByText(/ /i);
    });
});
