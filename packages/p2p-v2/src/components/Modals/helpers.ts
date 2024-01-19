type TCustomStyles = {
    content: ReactModal.Styles['content'];
    overlay: ReactModal.Styles['overlay'];
};

export const customStyles: TCustomStyles = {
    content: {
        borderRadius: '8px',
        bottom: 'auto',
        left: '50%',
        marginRight: '-50%',
        right: 'auto',
        top: '50%',
        transform: 'translate(-50%, -50%)',
    },
    overlay: {
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 9999,
    },
};
