type TCustomStyles = {
    overlay: ReactModal.Styles['overlay'];
};

export const customStyles: TCustomStyles = {
    overlay: {
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 9999,
    },
};
