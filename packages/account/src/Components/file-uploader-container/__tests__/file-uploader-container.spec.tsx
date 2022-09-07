import React from 'react';
import { render, screen } from '@testing-library/react';
import { isDesktop, isMobile, PlatformContext } from '@deriv/shared';
import FileUploaderContainer, { TFileUploaderContainer } from '../file-uploader-container';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(() => 'mockedIcon'),
    };
});
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(),
    isMobile: jest.fn(),
    WS: {
        getSocket: jest.fn(),
    },
}));

describe('<FileUploaderContainer />', () => {
    beforeEach(() => {
        isDesktop.mockReturnValue(true);
        isMobile.mockReturnValue(false);
        jest.clearAllMocks();
    });

    const props: TFileUploaderContainer = {
        getSocket: jest.fn(),
        onFileDrop: jest.fn(),
        onRef: jest.fn(),
    };

    const file_size_msg = /less than 8mb/i;
    const file_type_msg = /jpeg jpg png pdf gif/i;
    const file_time_msg = /1 \- 6 months old/i;
    const file_clear_msg = /a clear colour photo or scanned image/i;
    const file_address = /issued under your name with your current address/i;

    const runCommonTests = () => {
        expect(screen.getAllByText('mockedIcon')).toHaveLength(6);
        expect(screen.getByText(file_size_msg)).toBeInTheDocument();
        expect(screen.getByText(file_type_msg)).toBeInTheDocument();
        expect(screen.getByText(file_time_msg)).toBeInTheDocument();
        expect(screen.getByText(file_clear_msg)).toBeInTheDocument();
        expect(screen.getByText(file_address)).toBeInTheDocument();
    };
    it('should render FileUploaderContainer component', () => {
        render(<FileUploaderContainer {...props} />);
        expect(screen.getByTestId('dt_file_uploader_container')).toBeInTheDocument();
    });

    it('should render FileUploaderContainer component if getSocket is not passed as prop', () => {
        render(<FileUploaderContainer {...props} />);
        expect(screen.getByTestId('dt_file_uploader_container')).toBeInTheDocument();
    });

    it('should not render FileUploaderContainer when is_appstore is true in desktop', () => {
        render(
            <PlatformContext.Provider value={{ is_appstore: true }}>
                <FileUploaderContainer {...props} />
            </PlatformContext.Provider>
        );
        expect(screen.queryByTestId('dt_file_uploader_container')).not.toBeInTheDocument();
    });

    it('should show icons and description when is_appstore is true in desktop', () => {
        render(
            <PlatformContext.Provider value={{ is_appstore: true }}>
                <FileUploaderContainer {...props} />
            </PlatformContext.Provider>
        );
        runCommonTests();
    });

    it('should show description when is_appstore false in desktop', () => {
        render(
            <PlatformContext.Provider value={{ is_appstore: false }}>
                <FileUploaderContainer {...props} />
            </PlatformContext.Provider>
        );
        runCommonTests();
    });

    it('should show description when is_appstore true in mobile', () => {
        isMobile.mockReturnValue(true);
        isDesktop.mockReturnValue(false);

        render(
            <PlatformContext.Provider value={{ is_appstore: true }}>
                <FileUploaderContainer {...props} />
            </PlatformContext.Provider>
        );
        runCommonTests();
    });

    it('should not show description if is_description_enabled is false)', () => {
        isMobile.mockReturnValue(true);
        isDesktop.mockReturnValue(false);

        render(
            <PlatformContext.Provider value={{ is_appstore: true }}>
                <FileUploaderContainer {...props} is_description_enabled={false} />
            </PlatformContext.Provider>
        );

        expect(screen.getByText('mockedIcon')).toBeInTheDocument();
        expect(screen.queryByText(file_size_msg)).not.toBeInTheDocument();
        expect(screen.queryByText(file_type_msg)).not.toBeInTheDocument();
        expect(screen.queryByText(file_time_msg)).not.toBeInTheDocument();
        expect(screen.queryByText(file_clear_msg)).not.toBeInTheDocument();
        expect(screen.queryByText(file_address)).not.toBeInTheDocument();
    });

    it('should call ref function on rendering the component', () => {
        render(
            <PlatformContext.Provider value={{ is_appstore: true }}>
                <FileUploaderContainer {...props} />
            </PlatformContext.Provider>
        );

        expect(props.onRef).toHaveBeenCalled();
    });
});
