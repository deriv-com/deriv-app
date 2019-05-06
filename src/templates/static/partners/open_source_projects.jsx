import React from 'react';
import { List } from '../../_common/components/elements.jsx';

const TextBlock = ({ text, children }) => (
    <div className='gr-8 gr-12-m'>
        <p>{text}</p>
        {children}
    </div>
);

const ImageBlock = ({ order_first, image_padding, image }) => {
    const order = order_first ? 'gr-order-first-m' : '';
    const image_class = image_padding ? `${image_padding}` : 'gr-8';
    return (
        <div className={`gr-4 gr-parent ${order}`}>
            <div className={image_class}>
                <img className='responsive' src={it.url_for(`images/pages/open-source-projects/open-source-projects-${image}`)} />
            </div>
        </div>
    );
};

const Section = ({
    id,
    header,
    header_2,
    order_first,
    image_padding,
    image,
    text,
    children,
}) => (
    <div className='section'>
        <a id={id} />
        <h1>{header}</h1>
        <div className='gr-padding-10'>{header_2}</div>
        <div className='gr-row'>
            {order_first ?
                <React.Fragment>
                    <TextBlock text={text}>{children}</TextBlock>
                    <ImageBlock order_first image={image} image_padding={image_padding} />
                </React.Fragment> :
                <React.Fragment>
                    <ImageBlock image={image} image_padding={image_padding} />
                    <TextBlock text={text}>{children}</TextBlock>
                </React.Fragment>
            }
        </div>
    </div>
);

const OpenSourceProjects = () => (
    <div className='container'>
        <div className='open-source-projects static_full gr-row'>
            <div className='gr-3 gr-hide-m sidebar-container'>
                <div className='sidebar'>
                    <List
                        id='sidebar-nav'
                        items={[
                            { id: 'sidebar-link-section-1', href: '#open-source-projects-section', text: it.L('Open-source projects'), className: 'selected' },
                            { id: 'sidebar-link-section-2', href: '#static-content',               text: it.L('Static content') },
                            { id: 'sidebar-link-section-3', href: '#perl-modules',                 text: it.L('Perl modules') },
                            { id: 'sidebar-link-section-4', href: '#translations',                 text: it.L('Translations') },
                        ]}
                    />
                    <div className='sidebar-button'><a href={it.url_for('contact')}>{it.L('Contact us')}</a></div>
                </div>
            </div>
            <div className='gr-9 gr-12-m gr-parent'>
                <Section
                    id='open-source-projects-section'
                    image='1.svg'
                    order_first
                    header={it.L('[_1] open-source projects', it.website_name)}
                    text={it.L('[_1] is an active proponent of the open-source movement and is in the process of open-sourcing a number of components of its codebase.', it.website_name)}
                />

                <Section
                    id='static-content'
                    image_padding='gr-11 gr-padding-20'
                    image='3.png'
                    header={it.L('Static content')}
                    header_2={it.L('Improve [_1]\'s front-end content', it.website_name)}
                    text={it.L('The [_1] website\'s static content (CSS, Javascript) is available as the [_2]binary-static[_3] open-source project on github. Would you like to re-skin the [_1] website, or improve browser compatibility, site rendering speed, or Javascript performance? Please fork the project and submit pull-requests of your suggested code changes.', it.website_name, '<a target=\'_blank\' href=\'https://github.com/binary-com/binary-static\' rel=\'noopener noreferrer\'>', '</a>') }
                />

                <Section
                    id='perl-modules'
                    image='4.svg'
                    order_first
                    header={it.L('Perl modules')}
                    header_2={it.L('[_1]\'s CPAN contributions', it.website_name)}
                    text={it.L('[_1] is an active member of the Perl community and is in the process of uploading a number of its internal utility modules to [_2]CPAN[_3]. If you are a Perl enthusiast, contribute by reviewing these modules, and submitting pull-requests on [_4]github[_3].', it.website_name, '<a target=\'_blank\' href=\'http://search.cpan.org/~binary/\' rel=\'noopener noreferrer\'>', '</a>', '<a target=\'_blank\' href=\'https://github.com/binary-com\' rel=\'noopener noreferrer\'>')}
                />

                <Section
                    id='translations'
                    image='5.png'
                    header={it.L('Translations')}
                    text={it.L('Do you want to see [_1] in other languages, or can you suggest improvements to our current translations?', it.website_name)}
                >
                    <div className='gr-padding-20'>
                        <a className='button' href={it.url_for('contact')}><span>{it.L('Contact us')}</span></a>
                    </div>
                </Section>
            </div>
        </div>
    </div>
);

export default OpenSourceProjects;
