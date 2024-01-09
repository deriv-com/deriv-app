import React from 'react';
import { render, screen } from '@testing-library/react';
import PreviewSingle from '../preview-single';

describe('<PreviewSingle />', () => {
    const props = {
        dropzone_ref: React.createRef(),
        error_message: '',
        hover_message: '',
        onClickClose: jest.fn(),
        value: [] as File[],
    };

    it('should render the Text component if preview_single is false', () => {
        const file: File = new File(['hello'], 'hello.png', { type: 'image/png' });
        props.value = [file];

        render(<PreviewSingle {...props} />);

        expect(screen.getByText('hello.png')).toBeInTheDocument();
    });

    it('should render the Image component if preview_single is true', () => {
        const preview_single = <img data-testid='dt_image' src='hello.png' />;

        render(<PreviewSingle {...props} preview_single={preview_single} />);

        expect(screen.getByTestId('dt_image')).toBeInTheDocument();
    });
});
