type TCustomStyles = {
    content: ReactModal.Styles['content'];
    overlay: ReactModal.Styles['overlay'];
};

/**
 * Custom styles for the react-modal to override the default styles for content and overlay
 */
export const CUSTOM_STYLES: TCustomStyles = {
    content: {
        position: 'absolute',
        background: 'none',
        border: 'none',
        borderRadius: 0,
        bottom: 'auto',
        left: '50%',
        margin: 0,
        marginRight: '-50%',
        padding: 0,
        right: 'auto',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        transition: 'all 0.35s ease-in-out',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        zIndex: 9999,
    },
};

export const isCVMEnabled = (countryCode: string) => countryCode === 'br';
