import React, { KeyboardEvent } from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { FORM_TABS } from '../config';
import { TDescriptionItem } from '../types';

type TFormTabs = {
    active_tab: string;
    onChange: (tab: string) => void;
    description?: TDescriptionItem[] | string;
};

const FormTabs: React.FC<TFormTabs> = observer(({ active_tab, onChange, description }) => (
    <div className='qs__body__content__head'>
        <div className='qs__body__content__head__tabs'>
            {FORM_TABS.map((tab, index) => {
                const active = tab.value === active_tab;
                const cs = 'qs__body__content__head__tabs__tab';
                return (
                    <span
                        tabIndex={index}
                        className={classNames(cs, {
                            active,
                            disabled: !description ? tab?.disabled : false,
                        })}
                        key={tab.value}
                        onClick={() => onChange(tab.value)}
                        onKeyDown={(e: KeyboardEvent) => {
                            if (e.key === 'Enter') {
                                onChange(tab.value);
                            }
                        }}
                    >
                        <Text size='xs' weight={active ? 'bold' : 'lighter'}>
                            {tab.label}
                        </Text>
                    </span>
                );
            })}
        </div>
    </div>
));

export default FormTabs;
