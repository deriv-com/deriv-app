import React from 'react';
import { Dropdown, Icon } from '@deriv/components';
import PropTypes from 'prop-types';
import { localize } from 'Components/i18next';
import './advertiser-page.scss';

const AdvertiserPageDropdown = ({ is_dropdown_visible, onViewBlockModal, onViewDropdown }) => {
    return (
        <div className='advertiser-page__menu-dots-toggle'>
            <Icon className='advertiser-page__menu-dots-icon' icon='IcMenuDots' onClick={onViewDropdown} size={16} />
            {is_dropdown_visible && (
                <div className='advertiser-page__dropdown' onClick={onViewBlockModal}>
                    <Dropdown
                        className='advertiser-page__dropdown-container'
                        is_align_text_right
                        list={['Block']}
                        name={'block_user_dropdown'}
                        placeholder={localize('Block')}
                    />
                </div>
            )}
        </div>
    );
};

AdvertiserPageDropdown.propTypes = {
    is_dropdown_visible: PropTypes.bool.isRequired,
    onViewBlockModal: PropTypes.func.isRequired,
    onViewDropdown: PropTypes.func.isRequired,
};

export default AdvertiserPageDropdown;
