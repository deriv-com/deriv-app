import React, { HTMLAttributes } from 'react';
import { Text } from '@deriv/ui';
import classNames from 'classnames';
import { Icon, DesktopWrapper, MobileWrapper } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { Localize } from '@deriv/translations';

export interface TAddOptionsProps extends HTMLAttributes<HTMLDivElement> {
    onClickHandler: () => void;
    class_names?: string;
    numberofAccounts?: number;
}

const AddOptions = ({ numberofAccounts }) => {
    const getHeightWidthOfIcon = () => {
        return isMobile()
            ? {
                  width: 14.4,
                  height: 14.4,
              }
            : {
                  width: 16,
                  height: 16,
              };
    };
    const class_names = '';
    const onClickHandler = () => {
        return true;
    };
    return (
        <React.Fragment>
            <DesktopWrapper>
                {numberofAccounts < 4 ? (
                    <div className={classNames('add-options--desktop', class_names)} onClick={onClickHandler}>
                        <div className='add-options--desktop_title'>
                            <Icon
                                icon='IcAppstoreAdd'
                                width={getHeightWidthOfIcon().width}
                                height={getHeightWidthOfIcon().height}
                            />
                            <Text type='paragraph-2' bold>
                                <Localize i18n_default_text={'More Options accounts'} />
                            </Text>
                        </div>
                        <div className='add-options--desktop_description'>
                            <Text type='paragraph-2'>
                                <Localize i18n_default_text={'Including cryptocurrencies'} />
                            </Text>
                        </div>
                    </div>
                ) : (
                    <div className={classNames('add-options--mobile', class_names)} onClick={onClickHandler}>
                        <Icon
                            icon='IcAppstoreAdd'
                            width={getHeightWidthOfIcon().width}
                            height={getHeightWidthOfIcon().height}
                        />
                    </div>
                )}
            </DesktopWrapper>
            <MobileWrapper>
                <div className={classNames('add-options--mobile', class_names)} onClick={onClickHandler}>
                    <Icon
                        icon='IcAppstoreAdd'
                        width={getHeightWidthOfIcon().width}
                        height={getHeightWidthOfIcon().height}
                    />
                </div>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default AddOptions;
