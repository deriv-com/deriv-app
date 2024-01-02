import React from 'react';
import { useEventListener } from 'usehooks-ts';
import { qtMerge } from '@deriv/quill-design';
import DialogAction from './DialogAction';
import DialogContent from './DialogContent';
import DialogHeader from './DialogHeader';
import { useModal } from '../../providers';

/**
 * Type for the Dialog children
 * @typedef TDialogChildren
 */
type TDialogChildren = React.ReactNode;

/**
 * Type for the Dialog component props
 * @typedef TDialog
 * @property {TDialogChildren | TDialogChildren[]} children - Children nodes
 * @property {string} [className] - Optional CSS class name
 * @property {boolean} [shouldPreventCloseOnEscape] - Optional flag to prevent closing the dialog on Escape key press
 */
type TDialog = {
    children: TDialogChildren | TDialogChildren[];
    className?: string;
    shouldPreventCloseOnEscape?: boolean;
};

/**
 * Dialog component
 * @param {TDialog} props - The properties that define the Dialog component.
 * @returns {JSX.Element} The Dialog component.
 *
 * @example
 * ```tsx
 * <Dialog>
 *   <Dialog.Header title='Dialog title'/>
 *   <Dialog.Content>Dialog content goes here</Dialog.Content>
 *   <Dialog.Action align='center'>
 *      <Button>Primary action</Button>
 *   </Dialog.Action>
 * </Dialog>
 * ```
 */
const Dialog = ({ children, className, shouldPreventCloseOnEscape = false }: TDialog) => {
    const { hide } = useModal();

    useEventListener('keydown', (event: KeyboardEvent) => {
        if (!shouldPreventCloseOnEscape && event.key === 'Escape') {
            hide();
        }
    });

    return (
        <div className={qtMerge('flex flex-col gap-1200 p-1200 bg-background-primary-base rounded-400', className)}>
            {children}
        </div>
    );
};

Dialog.Header = DialogHeader;
Dialog.Content = DialogContent;
Dialog.Action = DialogAction;

export default Dialog;
