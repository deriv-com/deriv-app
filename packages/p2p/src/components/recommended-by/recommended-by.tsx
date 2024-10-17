import React from 'react';
import { Icon, Popover, Text } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { getTextSize } from 'Utils/responsive';

type TRecommendedByProps = {
    recommended_average?: number;
    recommended_count?: number;
};

const RecommendedBy = ({ recommended_average, recommended_count }: TRecommendedByProps) => {
    const { isDesktop, isMobile } = useDevice();
    const { showModal } = useModalManagerContext();

    const getRecommendedMessage = (): string => {
        if (recommended_count) {
            if (recommended_count === 1) {
                return localize('Recommended by {{recommended_count}} trader', {
                    recommended_count,
                });
            }
            return localize('Recommended by {{recommended_count}} traders', {
                recommended_count,
            });
        }
        return localize('No one has recommended this trader yet');
    };

    return (
        <React.Fragment>
            <Popover
                alignment='top'
                className='recommended-by__container'
                message={getRecommendedMessage()}
                onClick={
                    isDesktop
                        ? () => {
                              // do nothing
                          }
                        : () =>
                              showModal({
                                  key: 'RecommendedModal',
                                  props: {
                                      message: getRecommendedMessage(),
                                  },
                              })
                }
            >
                <Icon
                    className='recommended-by__icon'
                    custom_color='var(--status-success)'
                    icon='IcThumbsUp'
                    size={14}
                />
                <Text color='less-prominent' line_height='s' size={getTextSize('xxxs', 'xs', isMobile)}>
                    {`${recommended_average ?? 0}%`}
                </Text>
            </Popover>
        </React.Fragment>
    );
};

export default RecommendedBy;
