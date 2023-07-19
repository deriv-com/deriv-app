import React from 'react';
import { render, screen } from '@testing-library/react';
import { isDesktop, isMobile, PlatformContext } from '@deriv/shared';
import PoincFileUploaderContainer, { TPoincFileUploaderContainer } from '../file-uploader-container';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Icon: jest.fn(() => 'mockedIcon'),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(),
    isMobile: jest.fn(),
    WS: {
        getSocket: jest.fn(),
    },
}));

describe('<PoincFileUploaderContainer />', () => {
    beforeEach(() => {
        (isDesktop as jest.Mock).mockReturnValue(true);
        (isMobile as jest.Mock).mockReturnValue(false);
        jest.clearAllMocks();
    });

    const props: TPoincFileUploaderContainer = {
        document_type: 'coi',
        getSocket: jest.fn(),
        onFileDrop: jest.fn(),
        onRef: jest.fn(),
    };

    const file_size_msg = /less than 8mb/i;
    const file_type_msg = /jpeg jpg png pdf/i;
    const file_time_msg = /1 - 6 months old/i;
    const file_address = /issued under your name with your current address/i;

    const runCommonTests = () => {
        expect(screen.getAllByText('mockedIcon')).toHaveLength(6);
        expect(screen.getByText(file_size_msg)).toBeInTheDocument();
        expect(screen.getByText(file_type_msg)).toBeInTheDocument();
        expect(screen.getByText(file_time_msg)).toBeInTheDocument();
        expect(screen.getByText(file_address)).toBeInTheDocument();
    };
    it('should render PoincFileUploaderContainer component', () => {
        render(<PoincFileUploaderContainer {...props} />);
        expect(screen.getByTestId('dt_file_uploader_container')).toBeInTheDocument();
    });

    it('should render PoincFileUploaderContainer component if getSocket is not passed as prop', () => {
        delete props.getSocket;
        render(<PoincFileUploaderContainer {...props} />);
        expect(screen.getByTestId('dt_file_uploader_container')).toBeInTheDocument();
    });

    it('should not show description if is_description_enabled is false)', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        (isDesktop as jest.Mock).mockReturnValue(false);

        render(
            <PlatformContext.Provider value={{ is_appstore: true }}>
                <PoincFileUploaderContainer {...props} is_description_enabled={false} />
            </PlatformContext.Provider>
        );

        expect(screen.getByText('mockedIcon')).toBeInTheDocument();
        expect(screen.queryByText(file_size_msg)).not.toBeInTheDocument();
        expect(screen.queryByText(file_type_msg)).not.toBeInTheDocument();
        expect(screen.queryByText(file_time_msg)).not.toBeInTheDocument();
        expect(screen.queryByText(file_address)).not.toBeInTheDocument();
    });

    it('should call ref function on rendering the component', () => {
        render(
            <PlatformContext.Provider value={{ is_appstore: true }}>
                <PoincFileUploaderContainer {...props} />
            </PlatformContext.Provider>
        );

        expect(props.onRef).toHaveBeenCalled();
    });
});
