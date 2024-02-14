import React from 'react';
import ReactModal from 'react-modal';
import { ButtonGroup } from '@/components';
import { CUSTOM_STYLES } from '@/helpers';
import { Button, Text } from '@deriv-com/ui';
import { useSignupWizardContext } from '../../providers/SignupWizardProvider';

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
    const { setIsWizardOpen } = useSignupWizardContext();

    return (
        <ReactModal ariaHideApp={false} isOpen={isOpen} shouldCloseOnOverlayClick={false} style={CUSTOM_STYLES}>
            <div className='w-[calc(100vw-24px)] md:w-[440px] bg-system-light-primary-background p-1200 rounded-400 flex justify-between flex-col gap-1200'>
                <Text weight='bold'>You&apos;ll need a Deriv account</Text>
                <Text size='sm'>A Deriv account will allow you to fund (and withdraw from) your CFDs account(s).</Text>
                <ButtonGroup className='justify-end '>
                    <Button onClick={onClose} variant='outlined'>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            onClose();
                            setIsWizardOpen(true);
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
