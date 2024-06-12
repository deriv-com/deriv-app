import React from 'react';
import { screen, render } from '@testing-library/react';
import POIManualUploadFailed from '../poi-manual-upload-failed';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(() => <div>Mocked Icon</div>),
    };
});

describe('<POIManualUploadFailed />', () => {
    const error = 'MockAPIError';
    it('should render <POIManualUploadFailed /> component with its default content', () => {
        render(<POIManualUploadFailed error={error} />);
        expect(screen.getByText('Proof of identity documents upload failed')).toBeInTheDocument();
        expect(screen.getByText('MockAPIError')).toBeInTheDocument();
        expect(screen.getByText('Mocked Icon')).toBeInTheDocument();
    });

    it('should render <POIManualUploadFailed /> component with content from props', () => {
        render(<POIManualUploadFailed message='message' error={error} />);
        expect(screen.getByText('message')).toBeInTheDocument();
        expect(screen.getByText('Mocked Icon')).toBeInTheDocument();
    });
});
