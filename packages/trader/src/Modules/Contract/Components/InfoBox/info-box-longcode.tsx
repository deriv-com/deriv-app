import classNames from 'classnames';
import React from 'react';
import { Icon, Text, Modal, Button } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { TContractInfo } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';

type TInfoBoxLongcode = { contract_info: TContractInfo };

const InfoBoxLongcode = observer(({ contract_info }: TInfoBoxLongcode) => {
    const {
        ui: { is_mobile },
    } = useStore();
    const max_longcode_length = is_mobile ? 47 : 150;
    const [is_collapsed, setIsCollapsed] = React.useState(true);

    const handleToggle = () => {
        setIsCollapsed(!is_collapsed);
    };

    return (
        <div className='info-box-longcode'>
            <Icon icon='IcContractFlag' className='info-box-longcode-icon' size={24} />
            <div className='info-box-longcode-wrapper'>
                <Text
                    size='xs'
                    className={classNames('info-box-longcode-text', {
                        'info-box-longcode-text--collapsed': is_collapsed || is_mobile,
                    })}
                >
                    {contract_info.longcode}
                </Text>
                {` `}
                {contract_info?.longcode && contract_info.longcode.length > max_longcode_length && (
                    <Text as='a' href='#' size='xs' onClick={handleToggle} className='info-box-longcode-text'>
                        {is_collapsed || is_mobile ? (
                            <Localize i18n_default_text='View more' />
                        ) : (
                            <Localize i18n_default_text='View less' />
                        )}
                    </Text>
                )}
                <Modal
                    className='info-box-longcode--modal'
                    is_open={is_mobile && !is_collapsed}
                    title={<Localize i18n_default_text='Trade info' />}
                    has_close_icon={false}
                    should_close_on_click_outside
                    small
                    toggleModal={handleToggle}
                >
                    <Modal.Body>
                        <Text size='xs'>{contract_info.longcode}</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className='info-box-longcode--modal-button' primary large onClick={handleToggle}>
                            <Localize i18n_default_text='Ok' />
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
});

export default InfoBoxLongcode;
