import React from 'react';
import { render, screen } from '@testing-library/react';
import { isMobile, isDesktop, PlatformContext } from '@deriv/shared';
import FileUploaderContainer from '../file-uploader-container';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(props => props.icon),
    };
});
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
    isMobile: jest.fn(() => false),
    WS: {
        getSocket: jest.fn(),
    },
}));

describe('<FileUploaderContainer />', () => {
    const props = {
        getSocket: jest.fn(),
        onFileDrop: jest.fn(),
        onRef: jest.fn(),
    };

    it('should render FileUploaderContainer component', () => {
        render(<FileUploaderContainer {...props} />);
        expect(screen.getByTestId('file_uploader_container')).toBeInTheDocument();
    });

    it('should render FileUploaderContainer when is_appstore is true in desktop', () => {
        render(
            <PlatformContext.Provider value={{ is_appstore: true }}>
                <FileUploaderContainer {...props} />
            </PlatformContext.Provider>
        );
        expect(screen.queryByTestId('file_uploader_container')).not.toBeInTheDocument();
    });

    it('should show icons and description when is_appstore is true in desktop', () => {
        const tree = render(
            <PlatformContext.Provider value={{ is_appstore: true }}>
                <FileUploaderContainer {...props} />
            </PlatformContext.Provider>
        );
        expect(tree).toMatchSnapshot();
    });

    it('should show icons and description when is_appstore false in desktop', () => {
        const tree = render(
            <PlatformContext.Provider value={{ is_appstore: false }}>
                <FileUploaderContainer {...props} />
            </PlatformContext.Provider>
        );
        expect(tree).toMatchSnapshot();
    });

    it('should show icons and description when is_appstore true in mobile', () => {
        isMobile.mockReturnValue(true);
        isDesktop.mockReturnValue(false);
        const tree = render(
            <PlatformContext.Provider value={{ is_appstore: true }}>
                <FileUploaderContainer {...props} />
            </PlatformContext.Provider>
        );

        expect(tree).toMatchSnapshot();
    });

    it('should not show description is is_description_enabled is false)', () => {
        isMobile.mockReturnValue(true);
        isDesktop.mockReturnValue(false);
        const tree = render(
            <PlatformContext.Provider value={{ is_appstore: true }}>
                <FileUploaderContainer is_description_enabled={false} {...props} />
            </PlatformContext.Provider>
        );
        expect(tree).toMatchSnapshot();
    });

    it('should call ref function on rendering the component', () => {
        isMobile.mockReturnValue(false);
        isDesktop.mockReturnValue(true);

        render(
            <PlatformContext.Provider value={{ is_appstore: true }}>
                <FileUploaderContainer onRef={props.onRef} />
            </PlatformContext.Provider>
        );

        expect(props.onRef).toHaveBeenCalled();
    });
});
