import React from 'react';
import { render, screen } from '@testing-library/react';
import SymbolIconsMapper from '../symbol-icons-mapper';

jest.mock('@deriv/quill-icons', () => ({
    ...jest.requireActual('@deriv/quill-icons'),
    MarketForexAudcadIcon: jest.fn(() => <div>MockedForexAudcadIcon</div>),
}));

describe('<SymbolIconsMapper />', () => {
    it('should render the correct icon when the symbol exists in the iconMap', () => {
        render(<SymbolIconsMapper symbol='frxAUDCAD' />);
        expect(screen.getByText('MockedForexAudcadIcon')).toBeInTheDocument();
    });
    it('should return null when the symbol does not exist in the iconMap', () => {
        const { container } = render(<SymbolIconsMapper symbol='test' />);
        expect(container).toBeEmptyDOMElement();
    });
});
