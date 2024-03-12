import React from 'react';
import { Button, useDevice } from '@deriv-com/ui';

type TBuySellFormFooterProps = {
    isDisabled: boolean;
    onClickCancel: () => void;
    onSubmit?: () => void;
};
const BuySellFormFooter = ({ isDisabled, onClickCancel, onSubmit }: TBuySellFormFooterProps) => {
    const { isMobile } = useDevice();
    return (
        <div className='flex justify-end gap-[1rem]'>
            <Button onClick={onClickCancel} size='lg' textSize={isMobile ? 'md' : 'sm'} variant='outlined'>
                Cancel
            </Button>
            <Button
                disabled={isDisabled}
                onClick={() => onSubmit?.()}
                size='lg'
                textSize={isMobile ? 'md' : 'sm'}
                type='submit'
            >
                Confirm
            </Button>
        </div>
    );
};

export default BuySellFormFooter;
