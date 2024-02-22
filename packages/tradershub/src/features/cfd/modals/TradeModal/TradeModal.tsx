import React, { useEffect } from 'react';
import QRCode from 'qrcode.react';
import { Modal } from '@/components';
import { THooks, TMarketTypes, TPlatforms } from '@/types';
import { AppToIconMapper, CFDPlatforms, LinksMapper, PlatformDetails, TAppLinks } from '@cfd/constants';
import { TradeScreen } from '@cfd/screens';
import { Provider } from '@deriv/library';
import { Text, useDevice } from '@deriv-com/ui';

type TTradeModalProps = {
    account?: THooks.CtraderAccountsList | THooks.DxtradeAccountsList | THooks.MT5AccountsList;
    marketType?: TMarketTypes.All;
    platform: TPlatforms.All;
};

const TradeModal = ({ account, marketType, platform }: TTradeModalProps) => {
    const { isDesktop } = useDevice();
    const { setCfdState } = Provider.useCFDContext();

    useEffect(() => {
        setCfdState('marketType', marketType);
        setCfdState('platform', platform);
        if (platform === CFDPlatforms.MT5) setCfdState('accountId', (account as THooks.MT5AccountsList)?.loginid);
    }, [account, marketType, platform, setCfdState]);

    const appOrder = ['ios', 'android', 'huawei'];

    return (
        <Modal>
            <Modal.Header title='Trade' />
            <Modal.Content>
                <TradeScreen account={account} />
            </Modal.Content>
            <Modal.Footer align='center'>
                <div className='pt-0 min-h-[190px] flex justify-center items-center flex-col h-fit w-full gap-16'>
                    <Text align='center' size='xs' weight='bold'>
                        Download {PlatformDetails[platform].title} on your phone to trade with the{' '}
                        {PlatformDetails[platform].title} account
                    </Text>
                    <div className='flex gap-16'>
                        <div className='flex flex-col justify-center gap-8'>
                            {appOrder.map(app => {
                                const AppsLinkMapper = LinksMapper[platform][app as keyof TAppLinks];
                                if (AppsLinkMapper) {
                                    const AppIcon = AppToIconMapper[app];
                                    const appLink = AppsLinkMapper;
                                    return (
                                        <AppIcon
                                            className='w-[137px] h-[40px] cursor-pointer'
                                            key={app}
                                            onClick={() => window.open(appLink)}
                                        />
                                    );
                                }
                                return null;
                            })}
                        </div>
                        {isDesktop && (
                            <div className='border-1 border-solid border-system-light-hover-background rounded-xs flex flex-col justify-center items-center w-[150px] gap-[5px] p-8'>
                                <QRCode size={80} value={PlatformDetails[platform].link} />
                                <Text align='center' size='xs'>
                                    Scan the QR code to download {PlatformDetails[platform].title}
                                </Text>
                            </div>
                        )}
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default TradeModal;
