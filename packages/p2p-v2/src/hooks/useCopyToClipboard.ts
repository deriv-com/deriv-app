import { useState } from 'react';
import { useCopyToClipboard as useCopyToClipboardHook } from 'usehooks-ts';

type copyFn = (text: string) => Promise<boolean>;
type setterFn = (flag: boolean) => void;

const useCopyToClipboard = (): [boolean, copyFn, setterFn] => {
    const [isCopied, setIsCopied] = useState(false);
    const [, copy] = useCopyToClipboardHook();

    const copyToClipboard = async (text: string) => {
        try {
            copy(text);
            setIsCopied(true);
            return true;
        } catch (error) {
            setIsCopied(false);
            return false;
        }
    };

    return [isCopied, copyToClipboard, setIsCopied];
};

export default useCopyToClipboard;
