import React from 'react';

export const useCopyToClipboard = () => {
    const [is_copied, setIsCopied] = React.useState(false);

    const copyToClipboard = async text => {
        if (!navigator?.clipboard) {
            return false;
        }

        await navigator.clipboard.writeText(text);
        setIsCopied(true);

        return true;
    };

    return [is_copied, copyToClipboard, setIsCopied];
};
