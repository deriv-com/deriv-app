import * as React from 'react';
import { Text, Icon } from '@deriv/components';
import Divider from 'Components/elements/divider';
import { TStringTranslation } from 'Types';

const Description: React.FC<TDescription> = ({ description, advantages = [] }) => {
    return (
        <React.Fragment>
            <section className='dw-description'>
                <Text className='dw-description__text'>{description}</Text>
                <div className='dw-description__item-wrapper'>
                    {advantages.map((advantage, idx) => (
                        <div key={idx} className='dw-description__item'>
                            <Icon className='dw-description__item-icon' icon={advantage.icon} width='32' height='32' />
                            <Text>{advantage.title}</Text>
                        </div>
                    ))}
                </div>
            </section>
            <Divider className='dw-description__divider' horizontal />
        </React.Fragment>
    );
};

type DescriptionItem = {
    icon: string;
    title: TStringTranslation;
};

type TDescription = {
    description: TStringTranslation;
    advantages: DescriptionItem[];
};

export default Description;
