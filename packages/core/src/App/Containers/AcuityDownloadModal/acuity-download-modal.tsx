import React from 'react';
import RootStore from 'Stores/index';
import { Button, Modal, Text, Icon } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { getUrlBase } from '@deriv/shared';
import { connect } from 'Stores/connect';
import 'Sass/app/modules/acuity-download.scss';

type TAcuityDownloadModal = {
    is_acuity_modal_open: boolean;
    is_eu: boolean;
    current_language: string;
    setIsAcuityModalOpen: (value: boolean) => void;
};

const AcuityDownloadModal = ({
    is_acuity_modal_open,
    is_eu,
    current_language,
    setIsAcuityModalOpen,
}: TAcuityDownloadModal) => {
    const closeModal = () => setIsAcuityModalOpen(false);

    const openDownloadLink = () => {
        window.open(
            is_eu ? 'https://deriv.link/3hgxv2m' : 'https://deriv.link/3WhYxq1',
            '_blank',
            'noopener,noreferrer'
        );
        closeModal();
    };

    const openGuide = () => {
        window.open(getLink(current_language), '_blank');
        closeModal();
    };

    const getLink = (language: string): string => {
        if (language === 'PT') {
            return getUrlBase('/public/pdf/Acuity_tool_user_guide_Portuguese.pdf');
        } else if (language === 'ES') {
            return getUrlBase('/public/pdf/Acuity_tool_user_guide_Spanish.pdf');
        }
        if (is_eu) {
            return getUrlBase('/public/pdf/Acuity_tool_user_guide_EU.pdf');
        }
        return getUrlBase('/public/pdf/Acuity_tool_user_guide_ROW.pdf');
    };

    return (
        <Modal
            is_open={is_acuity_modal_open}
            title=' '
            has_close_icon
            className='acuity-download-modal'
            width='44rem'
            toggleModal={closeModal}
        >
            <div className='acuity-download-modal__body'>
                <div className='acuity-download-modal__body--image'>
                    <img src={getUrlBase('/public/images/common/acuity_modal.png')} />
                </div>
                <Text as='p' weight='bold' align='center'>
                    <Localize i18n_default_text='Power up your trades with cool new tools' />
                </Text>
                <div className='acuity-download-modal__body--description'>
                    <Text as='p' size='xs' line_height='m' align='center'>
                        <Localize
                            i18n_default_text="We've partnered with Acuity to give you a suite of intuitive trading tools for MT5 so you can keep track of market events and trends, free of charge!<0/><0/>"
                            components={[<br key={0} />]}
                        />
                        <Localize
                            i18n_default_text='Download the Acuity suite and take advantage of the <1>Macroeconomic Calendar, Market Alerts, Research Terminal,</1> and <1>Signal Centre Trade Ideas</1> without leaving your MT5 terminal.<0/><0/>'
                            components={[<br key={0} />, <Text key={1} size='xs' weight='bold' />]}
                        />
                        <Localize i18n_default_text='This suite is only available for Windows, and is most recommended for financial assets.' />
                    </Text>
                </div>
                <div className='acuity-download-modal__body--guide'>
                    <Text as='p' size='xs' align='center' weight='bold'>
                        <Localize i18n_default_text='Need help using Acuity?' />
                    </Text>
                    <Text as='p' size='xxs' align='center'>
                        <Localize
                            i18n_default_text='Check out this <0>user guide</0>.'
                            components={[
                                <Text
                                    key={0}
                                    className='acuity-download-modal__body--guide__link'
                                    as='a'
                                    size='xxs'
                                    color='red'
                                    weight='bold'
                                    onClick={openGuide}
                                />,
                            ]}
                        />
                    </Text>
                </div>
                <div className='acuity-download-modal__body--info'>
                    <Icon icon='ic-info-blue' />
                    <Text as='p' size='xxxs' line_height='s'>
                        <Localize i18n_default_text='Disclaimer: The trading services and information provided by Acuity should not be construed as a solicitation to invest and/or trade. Deriv does not offer investment advice. The past is not a guide to future performance, and strategies that have worked in the past may not work in the future.' />
                    </Text>
                </div>
                <div className='acuity-download-modal__body--button'>
                    <Button type='button' text={localize('Download Acuity')} primary large onClick={openDownloadLink} />
                </div>
            </div>
        </Modal>
    );
};

export default connect(({ client, ui, common }: RootStore) => ({
    is_acuity_modal_open: ui.is_acuity_modal_open,
    is_eu: client.is_eu,
    current_language: common.current_language,
    setIsAcuityModalOpen: ui.setIsAcuityModalOpen,
}))(AcuityDownloadModal);
