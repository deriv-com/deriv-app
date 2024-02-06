import React from 'react';
import { Button, Modal, StaticUrl, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

type TUrlUnavailableModalProps = React.PropsWithChildren<{
    isMobile?: boolean;
    isVisible: boolean;
    onConfirm: () => void;
}>;

const UrlUnavailableModal = ({ isMobile, isVisible, onConfirm }: TUrlUnavailableModalProps) => (
    <Modal
        small
        has_close_icon={false}
        is_open={isVisible}
        title={<Localize i18n_default_text='The URL you requested isn&rsquo;t available' />}
        toggleModal={onConfirm}
        className='url-unavailable-modal'
        width={isMobile ? 'calc(100vw - 3.2rem)' : 'auto'}
    >
        <Modal.Body>
            <Localize i18n_default_text='This could be because:' />
            <ul>
                <Localize
                    i18n_default_text='<0>You&rsquo;re not logged in, or</0><0>Our services are unavailable in your country.</0>'
                    components={[
                        <Text as='li' line_height={isMobile ? 'l' : 'xl'} size={isMobile ? 'xxs' : 'xs'} key={0} />,
                    ]}
                />
            </ul>
            <Localize
                i18n_default_text='<0>Explore our website</0> to see what&rsquo;s available.'
                components={[<StaticUrl key={0} className='link' href='/' />]}
            />
        </Modal.Body>
        <Modal.Footer>
            <Button has_effect onClick={onConfirm} primary large>
                <Localize i18n_default_text='OK' />
            </Button>
        </Modal.Footer>
    </Modal>
);

export default UrlUnavailableModal;
