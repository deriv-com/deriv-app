import React from 'react';
import { Icon, Checklist, Text } from '@deriv/components';
import { routes } from '@deriv/shared';
import { observer } from '@deriv/stores';
import Dp2pBlocked from 'Components/dp2p-blocked';
import { Localize } from 'Components/i18next';
import { document_status_codes, identity_status_codes } from 'Constants/account-status-codes';
import { useStores } from 'Stores/index';

const Verification = () => {
    const { general_store } = useStores();
    const { p2p_poa_required, poa_status, poi_status } = general_store;
    const getPoiAction = (status: string) => {
        switch (status) {
            case identity_status_codes.PENDING:
                return <Localize i18n_default_text='Your proof of identity is still under review.' />;
            case identity_status_codes.REJECTED:
                return <Localize i18n_default_text='Identity verification failed. Please try again.' />;
            case identity_status_codes.VERIFIED:
                return <Localize i18n_default_text='Your proof of identity is verified.' />;
            default:
                return <Localize i18n_default_text='Upload your documents to verify your identity.' />;
        }
    };
    const getPoaAction = (status: string) => {
        switch (status) {
            case document_status_codes.PENDING:
                return <Localize i18n_default_text='Your proof of address is still under review.' />;
            case document_status_codes.REJECTED:
                return <Localize i18n_default_text='Address verification failed. Please try again.' />;
            case document_status_codes.VERIFIED:
                return <Localize i18n_default_text='Your proof of address is verified.' />;
            default:
                return <Localize i18n_default_text='Upload your documents to verify your address.' />;
        }
    };
    const redirectToVerification = (route: string) => {
        const search = window.location.search;
        let updated_url = `${route}?ext_platform_url=${routes.cashier_p2p}`;
        if (search) {
            const url_params = new URLSearchParams(search);
            const updated_url_params = new URLSearchParams(updated_url);
            url_params.forEach((value, key) => updated_url_params.append(key, value));
            updated_url = `${updated_url}&${url_params.toString()}`;
        }
        window.location.href = updated_url;
    };
    const checklist_items = [
        {
            content: getPoiAction(poi_status),
            is_disabled: poi_status === identity_status_codes.PENDING,
            status: poi_status === identity_status_codes.VERIFIED ? 'done' : 'action',
            onClick:
                poi_status === identity_status_codes.VERIFIED
                    ? () => {
                          //do nothing
                      }
                    : () => {
                          redirectToVerification(routes.proof_of_identity);
                      },
        },
        ...(p2p_poa_required
            ? [
                  {
                      content: getPoaAction(poa_status),
                      is_disabled: poa_status === document_status_codes.PENDING,
                      status: poa_status === document_status_codes.VERIFIED ? 'done' : 'action',
                      onClick:
                          poa_status === document_status_codes.VERIFIED
                              ? () => {
                                    //do nothing
                                }
                              : () => {
                                    redirectToVerification(routes.proof_of_address);
                                },
                  },
              ]
            : []),
    ];

    if (
        !general_store.is_advertiser &&
        general_store.poi_status === identity_status_codes.VERIFIED &&
        general_store.nickname
    ) {
        return <Dp2pBlocked />;
    }

    return (
        <div className='verification' data-testid='dt_verification_container'>
            <Icon icon='IcCashierSendEmail' className='verification__icon' size={102} />
            <div className='verification__text'>
                <Text className='verification__text-title' weight='bold' align='center'>
                    <Localize i18n_default_text='Verify your P2P account!' />
                </Text>
                <div className='verification__text-description'>
                    <Text as='p' size='xs' line_height='s' align='center'>
                        <Localize i18n_default_text='To use P2P, you need to verify your identity, and your address.' />
                    </Text>
                </div>
            </div>
            <Checklist className='verification__checklist' items={checklist_items} />
        </div>
    );
};

export default observer(Verification);
