import classNames from 'classnames';
import React from 'react';
import { isMobile } from '@deriv/shared';
import DesktopWrapper from '../desktop-wrapper';
import MobileWrapper from '../mobile-wrapper';
import ButtonLink from '../button-link/button-link';
import Text from '../text/text';

type TMessageObject = { message: string; has_html?: boolean };

type TPageErrorProps = {
    buttonOnClick?: () => void;
    buttonSize?: 'small' | 'medium' | 'large';
    classNameImage?: string;
    header: React.ReactNode;
    image_url?: string;
    messages: Array<TMessageObject | React.ReactNode>;
    redirect_labels: string[];
    redirect_urls?: string[];
    setError?: (has_error: boolean, error: React.ReactNode) => void;
    should_clear_error_on_click?: boolean;
    has_malta_account?: boolean;
};

const PageError = ({
    buttonOnClick,
    buttonSize = 'large',
    classNameImage,
    has_malta_account,
    header,
    image_url,
    messages,
    redirect_labels,
    redirect_urls,
    should_clear_error_on_click,
    setError,
}: TPageErrorProps) => {
    const onClickHandler = () => {
        if (should_clear_error_on_click) {
            setError?.(false, null);
        } else {
            buttonOnClick?.();
        }
    };

    return (
        // if image_url is passed we should split the page to two columns and left-align messages
        <div className='dc-page-error__container'>
            {!!image_url && (
                <>
                    <DesktopWrapper>
                        <img
                            className={classNameImage}
                            src={image_url}
                            alt={'404'}
                            loading='lazy'
                            width='607px' // width and height should be specified so it doesn't jump to the right after image loads
                            height='366px'
                        />
                    </DesktopWrapper>
                    <MobileWrapper>
                        <img
                            className={classNameImage}
                            src={image_url}
                            alt={'404'}
                            loading='lazy'
                            width='328px'
                            height='200px'
                        />
                    </MobileWrapper>
                </>
            )}
            <div
                className={classNames('dc-page-error__box', {
                    'dc-page-error__box--left': !!image_url,
                    'dc-page-error__box--malta': has_malta_account,
                })}
            >
                <Text as='h3' size='l' align='center' weight='bold' line_height='s' color='prominent'>
                    {header}
                </Text>
                <div
                    className={classNames('dc-page-error__message-wrapper', {
                        'dc-page-error__message-wrapper--left': !!image_url,
                    })}
                >
                    <Text
                        color='prominent'
                        className={classNames('dc-page-error__message', {
                            'dc-page-error__message--left': !!image_url,
                        })}
                    >
                        {messages.map((message, index) =>
                            (message as TMessageObject)?.has_html ? (
                                <Text
                                    as='p'
                                    size='s'
                                    align={isMobile() ? 'center' : 'left'}
                                    line_height='x'
                                    key={index}
                                    className='dc-page-error__message-paragraph'
                                    dangerouslySetInnerHTML={{ __html: (message as TMessageObject)?.message }}
                                />
                            ) : (
                                <Text
                                    as='p'
                                    size='s'
                                    align={isMobile() ? 'center' : 'left'}
                                    line_height='x'
                                    key={index}
                                    className='dc-page-error__message-paragraph'
                                >
                                    {message as React.ReactNode}
                                </Text>
                            )
                        )}
                    </Text>
                </div>
                <div className='dc-page-error__btn-wrapper'>
                    {redirect_urls?.map?.((url, index) => {
                        return (
                            <ButtonLink
                                className='dc-page-error__btn'
                                to={url}
                                onClick={onClickHandler}
                                size={buttonSize}
                                key={index}
                            >
                                <Text weight='bold' className='dc-page-error__btn-text dc-btn__text'>
                                    {redirect_labels[index]}
                                </Text>
                            </ButtonLink>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PageError;
