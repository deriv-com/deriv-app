import React from 'react';
import { observer } from 'mobx-react-lite';
import { Icon, Checklist, Text } from '@deriv/components';
import { isDesktop, isMobile, routes } from '@deriv/shared';
import Dp2pBlocked from 'Components/dp2p-blocked';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import NicknameForm from 'Components/nickname-form';
import { useStores } from 'Stores/index';

const Verification = () => {
    const { general_store } = useStores();
    const { showModal } = useModalManagerContext();

    if (!general_store.is_advertiser && general_store.poi_status === 'verified' && general_store.nickname) {
        return <Dp2pBlocked />;
    }

    if (isMobile() && general_store.should_show_popup) {
        return <NicknameForm />;
    }

    const checklist_items = [
        {
            content: general_store.nickname || <Localize i18n_default_text='Choose your nickname' />,
            status: general_store.nickname ? 'done' : 'action',
            onClick: general_store.nickname
                ? () => {
                      //do nothing
                  }
                : () => {
                      if (isDesktop()) showModal({ key: 'NicknameModal' });
                      general_store.toggleNicknamePopup();
                  },
        },
        {
            content: general_store.poiStatusText(general_store.poi_status),
            is_disabled: general_store.poi_status !== 'verified' && !general_store.nickname,
            status: general_store.poi_status === 'verified' ? 'done' : 'action',
            onClick:
                general_store.poi_status === 'verified'
                    ? () => {
                          //do nothing
                      }
                    : () => {
                          const search = window.location.search;
                          let updated_url = `${routes.proof_of_identity}?ext_platform_url=${routes.cashier_p2p}`;
                          if (search) {
                              const url_params = new URLSearchParams(search);
                              const updated_url_params = new URLSearchParams(updated_url);
                              url_params.forEach((value, key) => updated_url_params.append(key, value));
                              updated_url = `${updated_url}&${url_params.toString()}`;
                          }
                          window.location.href = updated_url;
                      },
        },
    ];

    if (general_store.should_show_popup) return <></>;

    return (
        <div className='verification' data-testid='dt_verification_container'>
            <Icon icon='IcCashierSendEmail' className='verification__icon' size={102} />
            <div className='verification__text'>
                <Text className='verification__text-title' weight='bold' align='center'>
                    <Localize i18n_default_text='Please register with us!' />
                </Text>
                <div className='verification__text-description'>
                    <Text as='p' size='xs' line_height='s' align='center'>
                        <Localize i18n_default_text='To use Deriv P2P, you need to choose a display name (a nickname) and verify your identity.' />
                    </Text>
                </div>
            </div>
            <Checklist className='verification__checklist' items={checklist_items} />
        </div>
    );
};

export default observer(Verification);
