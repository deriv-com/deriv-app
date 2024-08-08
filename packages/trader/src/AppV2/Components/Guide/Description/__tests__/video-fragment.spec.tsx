import React from 'react';
import { render, screen } from '@testing-library/react';
import { useDevice } from '@deriv-com/ui';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import VideoFragment from '../video-fragment';

const loader = 'dt_skeleton';
const video_fragment = 'DotLottieReact';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getUrlBase: jest.fn(() => 'video_src.mp4'),
}));

jest.mock('@lottiefiles/dotlottie-react', () => ({
    DotLottieReact: jest.fn(() => <div>{video_fragment}</div>),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: true })),
}));

describe('VideoFragment', () => {
    it('should render component with loader and video', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });
        render(<VideoFragment contract_type={CONTRACT_LIST.ACCUMULATORS} />);

        expect(screen.getByTestId(loader)).toBeInTheDocument();
        expect(screen.getByText(video_fragment)).toBeInTheDocument();
    });

    it('should render only video (without loader) when state is_loading is false', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        jest.spyOn(React, 'useState').mockImplementationOnce(() => [false, jest.fn()]);
        render(<VideoFragment contract_type={CONTRACT_LIST.EVEN_ODD} />);

        expect(screen.queryByTestId(loader)).not.toBeInTheDocument();
        expect(screen.getByText(video_fragment)).toBeInTheDocument();
    });
});
