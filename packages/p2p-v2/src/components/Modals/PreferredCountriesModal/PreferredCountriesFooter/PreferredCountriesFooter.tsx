import React from 'react';
import { Button } from '@deriv-com/ui';

type TPreferredCountriesFooterProps = {
    isDisabled: boolean;
    onClickApply: () => void;
    onClickClear: () => void;
};

const PreferredCountriesFooter = ({ isDisabled, onClickApply, onClickClear }: TPreferredCountriesFooterProps) => {
    return (
        <div className='flex gap-[0.8rem] w-full'>
            <Button
                color='black'
                disabled={isDisabled}
                isFullWidth
                onClick={onClickClear}
                size='lg'
                textSize='sm'
                variant='outlined'
            >
                Clear
            </Button>
            <Button
                disabled={isDisabled}
                isFullWidth
                onClick={onClickApply}
                size='lg'
                textSize='sm'
                variant='contained'
            >
                Apply
            </Button>
        </div>
    );
};

export default PreferredCountriesFooter;
