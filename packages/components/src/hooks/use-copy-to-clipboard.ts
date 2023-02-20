import React from 'react';

type IsCopied = boolean;
type CopyFn = (text: string) => Promise<boolean>;
type IsCopyFn = (flag: boolean) => void;

export const useCopyToClipboard = (): [IsCopied, CopyFn, IsCopyFn] => {
    const [is_copied, setIsCopied] = React.useState(false);

    const copyToClipboard = async (text: string) => {
        if (!navigator?.clipboard) {
            return false;
        }

        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            return true;
        } catch (error) {
            setIsCopied(false);
            return false;
        }
    };

    return [is_copied, copyToClipboard, setIsCopied];
};
