import React from 'react';
import { render, screen } from '@testing-library/react';
import PoiConfirmWithExample from '../poi-confirm-with-example';

describe('<PoiConfirmWithExample/>', () => {
    const checkbox_text =
        'I confirm that the name and date of birth above match my chosen identity document (see below)';

    it('PoiConfirmWithExample should be rendered', () => {
        render(<PoiConfirmWithExample />);
        expect(screen.getByText(checkbox_text)).toBeInTheDocument();
    });
});
