import React from 'react';

const NewVersionNotification = ({ onUpdate }) => {
    React.useEffect(() => {
        const removeUpdateListener = () => {
            document.removeEventListener('UpdateAvailable', onUpdate);
        };

        const addUpdateListener = () => {
            document.addEventListener('UpdateAvailable', onUpdate);
        };

        document.addEventListener('IgnorePWAUpdate', removeUpdateListener);
        document.addEventListener('ListenPWAUpdate', addUpdateListener);

        return () => {
            document.removeEventListener('IgnorePWAUpdate', removeUpdateListener);
            document.removeEventListener('ListenPWAUpdate', addUpdateListener);
        };
    });

    React.useEffect(() => {
        document.addEventListener('UpdateAvailable', onUpdate);

        return () => {
            document.removeEventListener('UpdateAvailable', onUpdate);
        };
    });

    return null;
};

export default NewVersionNotification;
