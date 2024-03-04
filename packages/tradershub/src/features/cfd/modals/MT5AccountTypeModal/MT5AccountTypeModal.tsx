import React, { ComponentProps, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal } from '@/components';
import { useCFDContext } from '@/providers';
import { MT5AccountType } from '@cfd/screens';
import { Button } from '@deriv-com/ui';

type TMarketTypes = ComponentProps<typeof MT5AccountType>['selectedMarketType'];

const MT5AccountTypeModal = () => {
    const [selectedMarketType, setSelectedMarketType] = useState<TMarketTypes>(undefined);
    const { setCfdState } = useCFDContext();
    const history = useHistory();

    const queryParams = new URLSearchParams({
        modal: 'JurisdictionModal',
    });

    return (
        <>
            <Modal>
                <Modal.Header title='Select Deriv MT5’s account type' />
                <Modal.Content>
                    <MT5AccountType
                        onMarketTypeSelect={setSelectedMarketType}
                        selectedMarketType={selectedMarketType}
                    />
                </Modal.Content>
                <Modal.Footer>
                    <Button
                        className='rounded-xs'
                        disabled={!selectedMarketType}
                        onClick={() => {
                            setCfdState({
                                marketType: selectedMarketType,
                            });
                            history.push({
                                pathname: history.location.pathname,
                                search: queryParams.toString(),
                            });
                        }}
                    >
                        Next
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default MT5AccountTypeModal;
