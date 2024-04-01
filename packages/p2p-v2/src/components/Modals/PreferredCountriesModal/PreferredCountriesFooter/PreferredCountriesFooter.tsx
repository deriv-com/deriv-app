import React from 'react';
import { Button, useDevice } from '@deriv-com/ui';

type TPreferredCountriesFooterProps = {
    isDisabled: boolean;
    onClickApply: () => void;
    onClickClear: () => void;
};

const PreferredCountriesFooter = ({ isDisabled, onClickApply, onClickClear }: TPreferredCountriesFooterProps) => {
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'md' : 'sm';
    return (
        <div className='flex gap-[0.8rem] w-full'>
            <Button
                color='black'
                disabled={isDisabled}
                isFullWidth
                onClick={onClickClear}
                size='lg'
                textSize={textSize}
                variant='outlined'
            >
                Clear
            </Button>
            <Button
                disabled={isDisabled}
                isFullWidth
                onClick={onClickApply}
                size='lg'
                textSize={textSize}
                variant='contained'
            >
                Apply
            </Button>
        </div>
    );
};

export default PreferredCountriesFooter;
