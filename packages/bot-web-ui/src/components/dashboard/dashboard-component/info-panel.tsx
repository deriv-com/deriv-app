import React from 'react';
import { Icon, Text } from '@deriv/components';
import { sidebar_intro } from './constants';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';

type TInfoPanel = {
    setInfoPanelVisibility: (state: boolean) => void;
};

const InfoPanel = ({ setInfoPanelVisibility }: TInfoPanel) => {
    return (
        <div className='db-info-panel'>
            <div
                className='db-info-panel__close-action'
                onClick={() => {
                    setInfoPanelVisibility(false);
                }}
            >
                <Icon width='1rem' height='1rem' icon='IcCloseIconDbot' />
            </div>
            {sidebar_intro.map((sidebar_item, index) => {
                const { label, content } = sidebar_item;
                return (
                    <div className='db-info-panel__card' key={index}>
                        <Text color='prominent' line_height='xxl' size='sm' weight='bold' as='h1'>
                            {label}
                        </Text>
                        {content.map((text, key) => (
                            <Text
                                key={`info-panel-tour${key}`}
                                color='prominent'
                                line_height='xl'
                                size='m'
                                weight='bold'
                                as='p'
                            >
                                {text}
                            </Text>
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

export default connect(({ dashboard }: RootStore) => ({
    setInfoPanelVisibility: dashboard.setInfoPanelVisibility,
}))(InfoPanel);
