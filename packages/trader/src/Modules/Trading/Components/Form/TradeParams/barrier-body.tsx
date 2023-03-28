import React from 'react';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { Text, ThemedScrollbars } from '@deriv/components';

type TBarrierBody = {
    subheader?: string;
    className: string;
    barriers_list: Array<React.ReactNode>;
};

const BarrierBody = ({ subheader, barriers_list, className }: TBarrierBody) => {
    return (
        <React.Fragment>
            {subheader && (
                <Text
                    size={isMobile() ? 's' : 'xxs'}
                    color='disabled'
                    line_height='l'
                    as='p'
                    className='trade-container__barriers-table__text'
                >
                    {localize('{{subheader}}', { subheader })}
                </Text>
            )}
            <ThemedScrollbars autohide={false}>
                <ul className={className}>{barriers_list}</ul>
            </ThemedScrollbars>
        </React.Fragment>
    );
};

export default React.memo(BarrierBody);
