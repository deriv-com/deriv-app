import React from 'react';
import { Icon, Modal, Popover } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { deriv_urls, getLegalEntityName } from '@deriv/shared';

const MFRegulatoryInformation = () => (
    <div className='footer-regulatory-information'>
        <p>
            <Localize
                i18n_default_text='Financial products in the EU are offered by {{legal_entity_name}}, licensed as a Category 3 Investment Services provider by the Malta Financial Services Authority (<0>Licence no. IS/70156</0>).'
                components={[
                    <a
                        href={`https://${deriv_urls.DERIV_HOST_NAME}/regulatory/Deriv_Investments_(Europe)_Limited.pdf`}
                        target='_blank'
                        rel='nofollow noreferrer'
                        key={0}
                        className='footer-regulatory-information__link'
                    />,
                ]}
                values={{
                    legal_entity_name: getLegalEntityName('maltainvest'),
                }}
            />
        </p>
    </div>
);

export const RegulatoryInformation = ({ landing_company, is_eu, show_eu_related_content }) => {
    const [should_show_modal, showModal] = React.useState(false);
    if (!is_eu || (is_eu && !show_eu_related_content)) return null;
    const is_mf = landing_company === 'maltainvest';

    return (
        <div className='footer__link'>
            <Popover alignment='top' message={localize('Regulatory Information')} zIndex={9999}>
                <a onClick={() => showModal(true)}>
                    <Icon icon='IcRegulatoryInformation' className='footer__icon ic-deriv__icon' />
                </a>
            </Popover>
            <Modal
                is_open={should_show_modal}
                small
                has_close_icon
                toggleModal={() => showModal(false)}
                title={localize('Regulatory Information')}
            >
                {(is_mf || show_eu_related_content) && <MFRegulatoryInformation />}
            </Modal>
        </div>
    );
};
