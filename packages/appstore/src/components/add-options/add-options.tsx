import React from 'react';
import { Text, Icon, DesktopWrapper, MobileWrapper } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { useStores } from 'Stores';

type TAddOptionsProps = {
    number_of_accounts: number;
    title: string;
    description: string;
    is_mf: boolean;
};

const AddOptions = ({ number_of_accounts, title, description, is_mf }: TAddOptionsProps) => {
    const { ui } = useStores();
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
    const onClickHandler = () => {
        return ui.openRealAccountSignup('manage');
    };
    return (
        <React.Fragment>
            <DesktopWrapper>
                {number_of_accounts < 4 ? (
                    <div className={'add-options--desktop'} onClick={onClickHandler}>
                        <div className='add-options--desktop_title'>
                            {!is_mf && (
                                <Icon
                                    icon='IcAppstoreAdd'
                                    width={getHeightWidthOfIcon().width}
                                    height={getHeightWidthOfIcon().height}
                                />
                            )}
                            <Text weight='bold' size='xs' line_height='l'>
                                <Localize i18n_default_text={title} />
                            </Text>
                        </div>
                        {!is_mf && (
                            <div className='add-options--desktop_description'>
                                <Text size='xxs' line_height='l' weight='lighter'>
                                    <Localize i18n_default_text={description} />
                                </Text>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className='add-options--mobile' onClick={onClickHandler}>
                        <Icon
                            icon='IcAppstoreAdd'
                            width={getHeightWidthOfIcon().width}
                            height={getHeightWidthOfIcon().height}
                        />
                    </div>
                )}
            </DesktopWrapper>
            <MobileWrapper>
                <div className='add-options--mobile' onClick={onClickHandler}>
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
