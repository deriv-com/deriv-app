import React, { HTMLAttributes } from 'react';
import { Text } from '@deriv/ui';
import classNames from 'classnames';
import { Icon, DesktopWrapper, MobileWrapper } from '@deriv/components';
import { isMobile } from '@deriv/shared';

export interface TAddOptionsProps extends HTMLAttributes<HTMLDivElement> {
    onClickHandler: () => void;
    class_names?: string;
    title: string;
    description: string;
}

const AddOptions = ({ title, description, onClickHandler, class_names }: TAddOptionsProps) => {
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

    return (
        <React.Fragment>
            <DesktopWrapper>
                <div className={classNames('add-options--desktop', class_names)} onClick={onClickHandler}>
                    <div className='add-options--desktop_title'>
                        <Icon
                            icon='icAppstoreAdd'
                            width={getHeightWidthOfIcon().width}
                            height={getHeightWidthOfIcon().height}
                        />
                        <Text type='paragraph-2' bold>
                            {title}
                        </Text>
                    </div>
                    <div className='add-options--desktop_description'>
                        <Text type='paragraph-2'>{description}</Text>
                    </div>
                </div>
            </DesktopWrapper>
            <MobileWrapper>
                <div className={classNames('add-options--mobile', class_names)} onClick={onClickHandler}>
                    <Icon
                        icon='icAppstoreAdd'
                        width={getHeightWidthOfIcon().width}
                        height={getHeightWidthOfIcon().height}
                    />
                </div>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default AddOptions;
