// __mocks__/@deriv-com/ui.js
import React, { useEffect, useState } from 'react';

const ActionScreen = props => (
    <div data-testid={props['data-testid']}>
        {props.title && <div>{props.title}</div>}
        {props.description && <div>{props.description}</div>}
        {props.icon && <div>{props.icon}</div>}
        {props.actionButtons && <div>{props.actionButtons}</div>}
    </div>
);

const Badge = ({
    children,
    className = '',
    color = 'general',
    isBold = false,
    leftIcon = null,
    rightIcon = null,
    ...rest
}) => (
    <div className={`deriv-badge ${className} deriv-badge__color--${color} deriv-badge__variant--contained`} {...rest}>
        {leftIcon && <span className='badge-left-icon'>{leftIcon}</span>}
        <span className={`badge-text ${isBold ? 'bold' : ''}`}>{children}</span>
        {rightIcon && <span className='badge-right-icon'>{rightIcon}</span>}
    </div>
);

const Button = ({
    color = 'primary',
    icon,
    isLoading = false,
    rounded = 'sm',
    size = 'md',
    textSize,
    variant = 'contained',
    children,
    className,
    ...rest
}) => {
    return (
        <button
            className={`mocked-button ${variant} ${color} ${size} ${rounded} ${className}`}
            disabled={isLoading || rest.disabled}
            {...rest}
        >
            {isLoading ? (
                <div className='mocked-button-loader'>
                    <Loader />
                </div>
            ) : (
                <>
                    {icon && <div className='mocked-button-icon'>{icon}</div>}
                    {children && <Text className={`mocked-button-text ${textSize ?? size}`}>{children}</Text>}
                </>
            )}
        </button>
    );
};

const Breadcrumbs = ({ className = '', items, handleOnClick, separator = '>', textSize = 'sm' }) => {
    return (
        <ul className={`mock-breadcrumbs ${className}`}>
            {items.map((item, idx) => {
                const isLastItem = idx === items.length - 1;

                return (
                    <li key={item.value ?? idx} className='mock-breadcrumb-item'>
                        <span
                            className={`mock-breadcrumb-text mock-breadcrumb-text--${textSize}`}
                            onClick={() => handleOnClick(item)}
                        >
                            {item.text}
                        </span>
                        {!isLastItem && <span className='mock-breadcrumb-separator'>{separator}</span>}
                    </li>
                );
            })}
        </ul>
    );
};

const Checkbox = ({
    checked = false,
    disabled = false,
    label,
    error = false,
    labelClassName = '',
    wrapperClassName = '',
    name,
    ...rest
}) => (
    <div className={`deriv-checkbox ${wrapperClassName}`}>
        <div className='deriv-checkbox__wrapper'>
            <input type='checkbox' checked={checked} disabled={disabled} name={name} {...rest} id={rest.id || name} />
        </div>
        <label
            className={`deriv-checkbox__label ${error ? 'deriv-checkbox__label--error' : ''} ${labelClassName}`}
            htmlFor={rest.id || name}
        >
            {label}
        </label>
    </div>
);

const Divider = ({ className, style }) => <div className={className} style={style} role='separator' />;

const Dropdown = ({ list, onSelect, value, onClick, variant, ...rest }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    return (
        <div
            data-testid={rest['data-testid']}
            onClick={() => {
                setIsOpen(true);
            }}
        >
            <input type='text' value={inputValue} readOnly role={variant.toLowerCase()} />
            {isOpen && (
                <ul>
                    {list.map(item => (
                        <li
                            key={item.value}
                            onClick={() => {
                                setInputValue(item.text);
                                onSelect(item.value);
                            }}
                            className={value === item.value ? 'active' : ''}
                        >
                            {item.text}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const Tab = ({ children }) => <div data-testid='mock-tab'>{children}</div>;

const TabTitle = ({ icon, title, isActive, onChange }) => (
    <button data-testid='mock-tab-title' data-active={isActive} onClick={() => onChange?.()}>
        {icon}
        <span>{title}</span>
    </button>
);

const Tabs = ({ children, activeTab, wrapperClassName, className, variant = 'primary', onChange, TitleFontSize }) => {
    const [selectedTab, setSelectedTab] = useState(activeTab || (children[0]?.props.title ?? ''));

    useEffect(() => {
        if (activeTab) {
            setSelectedTab(activeTab);
        }
    }, [activeTab]);

    return (
        <div data-testid='mock-tabs' className={wrapperClassName}>
            <div className={className}>
                {children.map((child, index) => (
                    <TabTitle
                        key={child.props.title}
                        title={child.props.title}
                        icon={child.props.icon}
                        isActive={child.props.title === selectedTab}
                        activeTab={selectedTab}
                        setSelectedTab={setSelectedTab}
                        variant={variant}
                        className={child.props.className}
                        TitleFontSize={TitleFontSize}
                        onChange={() => onChange?.(index)}
                    />
                ))}
            </div>
            {children.find(child => child.props.title === selectedTab)}
        </div>
    );
};

const Tooltip = ({
    as = 'div',
    tooltipContent,
    hideTooltip = false,
    variant = 'general',
    children,
    className,
    ...rest
}) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const handleMouseEnter = () => {
        if (!hideTooltip) {
            setShowTooltip(true);
        }
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    const Tag = as;

    return (
        <div>
            <Tag
                {...rest}
                className={`deriv-tooltip__trigger ${className}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {children}
            </Tag>
            {showTooltip && <div className={`deriv-tooltip deriv-tooltip--${variant}`}>{tooltipContent}</div>}
        </div>
    );
};

const Text = ({
    align = 'left',
    as = 'span',
    children,
    color = 'general',
    fontStyle = 'normal',
    lineHeight,
    size = 'md',
    weight = 'normal',
    className,
    ...rest
}) => {
    const textClassNames = [
        'deriv-text',
        `derivs-text__size--${size}`,
        `derivs-text__weight--${weight}`,
        `derivs-text__align--${align}`,
        `derivs-text__color--${color}`,
        lineHeight && `derivs-text__line-height--${lineHeight}`,
        fontStyle && `derivs-text__font-style--${fontStyle}`,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const Tag = as;

    return (
        <Tag className={textClassNames} {...rest}>
            {children}
        </Tag>
    );
};

const useDevice = jest.fn(() => ({ isDesktop: true }));

const InlineMessage = ({ children, icon, ...props }) => (
    <div>
        {icon && <div data-testid={props['data-testid']}>{icon}</div>}
        <div>{children}</div>
    </div>
);

const Loader = ({ color, isFullScreen, className, ...props }) => (
    <div
        className={`derivs-loader ${isFullScreen ? 'derivs-loader--fullscreen' : ''} ${className}`}
        data-testid={props['data-testid'] || 'dt_derivs-loader'}
    >
        <span className='derivs-loader__element' style={{ backgroundColor: color }} />
        <span className='derivs-loader__element' style={{ backgroundColor: color }} />
        <span className='derivs-loader__element' style={{ backgroundColor: color }} />
        <span className='derivs-loader__element' style={{ backgroundColor: color }} />
        <span className='derivs-loader__element' style={{ backgroundColor: color }} />
    </div>
);

const SectionMessage = ({ children, className, ctaSection, icon, title, variant = 'general' }) => {
    const VariantIcons = {
        error: 'MockErrorIcon',
        info: 'MockInfoIcon',
        success: 'MockSuccessIcon',
        warning: 'MockWarningIcon',
    };
    const IconComponent = variant !== 'general' ? VariantIcons[variant] : null;

    return (
        <div className={`mocked-section-message ${variant} ${className}`}>
            {(icon || IconComponent) && <div className='mocked-section-message__icon'>{icon || IconComponent}</div>}
            <div className='mocked-section-message__content'>
                {title && <Text className='mocked-section-message__title'>{title}</Text>}
                <div className='mocked-section-message__description'>{children}</div>
                {ctaSection && <div className='mocked-section-message__cta-section'>{ctaSection}</div>}
            </div>
        </div>
    );
};

const Notifications = ({ componentConfig, notifications = [], clearNotificationsCallback = jest.fn() }) => {
    return (
        <div data-testid='announcement-container'>
            {/* Clear all notifications button */}
            <button data-testid='clear-notifications-button' onClick={clearNotificationsCallback}>
                {componentConfig?.clearButtonText || 'Mark all as read'}
            </button>

            {/* Notifications list */}
            <div data-testid='notifications-list'>
                {notifications.map((notification, index) => (
                    <div key={index} data-testid={`notification-${index}`} className='notification'>
                        <div className='notification__container'>
                            <div className='notification__icon'>{notification.icon}</div>
                            <div className='notification__text'>
                                <div className='notification__title'>{notification.title}</div>
                                <div className='notification__message'>
                                    <p>{notification.message}</p>
                                </div>
                            </div>
                        </div>
                        {notification.buttonAction && notification.actionText && (
                            <div className='notification__button-container'>
                                <button className='notification__button' onClick={notification.buttonAction}>
                                    {notification.actionText}
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const LinearProgressBar = ({
    danger_limit = 30,
    is_loading = false,
    label = '',
    percentage = 0,
    warning_limit = 50,
    ...rest
}) => {
    return (
        <div data-testid='linear-progress-bar' {...rest}>
            <div data-testid='progress-label'>{label}</div>
            {is_loading || percentage < 1 ? (
                <div data-testid='loading-indicator'>Loading...</div>
            ) : (
                <div
                    data-testid='progress-track'
                    data-percentage={percentage}
                    data-status={
                        // eslint-disable-next-line no-nested-ternary -- This is a mock component!
                        percentage >= warning_limit
                            ? 'green'
                            : percentage < warning_limit && percentage >= danger_limit
                              ? 'yellow'
                              : 'red'
                    }
                >
                    Progress Track
                </div>
            )}
        </div>
    );
};

export {
    ActionScreen,
    Badge,
    Button,
    Breadcrumbs,
    Checkbox,
    Divider,
    Dropdown,
    useDevice,
    Tab,
    Tabs,
    Text,
    Tooltip,
    InlineMessage,
    Loader,
    SectionMessage,
    Notifications,
    LinearProgressBar,
};
