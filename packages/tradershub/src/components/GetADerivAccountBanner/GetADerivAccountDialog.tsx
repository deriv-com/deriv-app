import React from 'react';
import ReactModal from 'react-modal';
import { ButtonGroup } from '@/components';
import { CUSTOM_STYLES } from '@/helpers';
import { useQueryParams } from '@/hooks';
import { Button, Text } from '@deriv-com/ui';

type TGetADerivAccountDialog = {
    isOpen: boolean;
    onClose: () => void;
};

/**
 * `GetADerivAccountDialog`  is opened when user tried to create a CFD account without a Deriv account
 * It includes a button that leads the user to a modal where they can create a Deriv account.
 *
 * @returns {React.ReactElement} A `<Dialog>` component containing the dialog message and action button.
 */
const GetADerivAccountDialog = ({ isOpen, onClose }: TGetADerivAccountDialog) => {
    const { openModal } = useQueryParams();

    return (
        <ReactModal ariaHideApp={false} isOpen={isOpen} shouldCloseOnOverlayClick={false} style={CUSTOM_STYLES}>
            <div className='w-[440px] bg-system-light-primary-background rounded-default flex justify-between flex-col gap-24'>
                <Text weight='bold'>You&apos;ll need a Deriv account</Text>
                <Text size='sm'>A Deriv account will allow you to fund (and withdraw from) your CFDs account(s).</Text>
                <ButtonGroup className='justify-end '>
                    <Button color='black' onClick={onClose} variant='outlined'>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            onClose();
                            openModal('RealAccountCreation');
                        }}
                    >
                        Add a Deriv account
                    </Button>
                </ButtonGroup>
            </div>
        </ReactModal>
    );
};

export default GetADerivAccountDialog;
