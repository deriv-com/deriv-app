import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@deriv-com/ui/dist/components/Button';
import { Text } from '@deriv-com/ui/dist/components/Text';
import IcPOAVerified from '../../../../assets/poa/ic-poa-verified.svg';
import { isNavigationFromDerivGO, isNavigationFromP2P } from '../../../../utils/platform';
import POAStatus from '../POAStatus';

type TPOANeedsReview = {
    needsPOI: boolean;
    redirectButton?: React.ReactNode;
};

export const NeedsReview = ({ needsPOI = true, redirectButton }: TPOANeedsReview) => {
    const history = useHistory();
    const isRedirectedFromPlatform = isNavigationFromP2P() || isNavigationFromDerivGO();

    let actionButton = null;

    if (needsPOI) {
        actionButton = (
            <Button
                onClick={() => {
                    history.push('/account/proof-of-identity');
                }}
            >
                Proof of identity
            </Button>
        );
    } else if (redirectButton) {
        actionButton = redirectButton;
    } else if (!isRedirectedFromPlatform) {
        actionButton = (
            <Button
                onClick={() => {
                    history.push('/');
                }}
            >
                Continue trading
            </Button>
        );
    }

    return (
        <POAStatus
            actionButton={actionButton}
            icon={<IcPOAVerified width={128} />}
            title='Your proof of address was submitted successfully'
        >
            <Text align='center' size='sm'>
                Your document is being reviewed, please check back in 1-3 days.
            </Text>
            {needsPOI ? (
                <Text align='center' size='sm'>
                    You must also submit a proof of identity.
                </Text>
            ) : null}
        </POAStatus>
        // <div className='grid justify-center w-full justify-items-center mt-4000 gap-1000'>
        //     <IcPOAVerified width={128} />
        //     <div className='grid justify-center gap-200'>
        //         <Text align='center' size='md' weight='bold'>
        //             Your proof of address was submitted successfully
        //         </Text>
        //         <div className='grid gap-200'>
        //             <Text align='center' size='sm'>
        //                 Your document is being reviewed, please check back in 1-3 days.
        //             </Text>
        //             {needsPOI ? (
        //                 <Text align='center' size='sm'>
        //                     You must also submit a proof of identity.
        //                 </Text>
        //             ) : null}
        //         </div>
        //     </div>
        //     <div className='mt-500'>{actionButton}</div>
        // </div>
    );

    // if (!needs_poi) {
    //     return (
    //         <IconMessageContent
    //             message={message}
    //             text={'Your document is being reviewed, please check back in 1-3 days.'}
    //             icon={<Icon icon='IcPoaVerified' size={128} />}
    //         >
    //             {redirect_button || (!isRedirectedFromPlatform && <ContinueTradingButton />)}
    //         </IconMessageContent>
    //     );
    // }
    // return (
    //     <IconMessageContent message={message} icon={<Icon icon='IcPoaVerified' size={128} />}>
    //         <div className='account-management__text-container'>
    //             <Text align='center' size='xs'>
    //                 Your document is being reviewed, please check back in 1-3 days.
    //             </Text>
    //             <Text align='center' size='xs'>
    //                 You must also submit a proof of identity.
    //             </Text>
    //         </div>
    //         <PoiButton />
    //     </IconMessageContent>
    // );
};
