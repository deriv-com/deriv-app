import React from 'react';
import { screen, render } from '@testing-library/react';
import UploadFailed from 'Components/poi/poi-upload-failed';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(() => <div>Mocked Icon</div>),
    };
});

describe('<UploadFailed />', () => {
    const error = 'error';
    it('should render <UploadFailed /> component with its content', () => {
        render(<UploadFailed error={error} />);
        expect(screen.getByText('Proof of identity documents upload failed')).toBeInTheDocument();
        expect(screen.getByText('error')).toBeInTheDocument();
        expect(screen.getByText('Mocked Icon')).toBeInTheDocument();
    });
});
