import React from 'react';
import { Button } from '@deriv-com/ui/dist/components/Button';

type TAddNewButtonProps = {
    isMobile: boolean;
    onAdd: () => void;
};

const AddNewButton = ({ isMobile, onAdd }: TAddNewButtonProps) => {
    return (
        <Button isFullWidth={isMobile} onClick={onAdd} size='lg'>
            Add new {/*  TODO Remember to translate this*/}
        </Button>
    );
};

export default AddNewButton;
