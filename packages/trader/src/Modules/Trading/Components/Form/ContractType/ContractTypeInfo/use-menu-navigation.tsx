import React from 'react';

type TUseMenuNavigationProps = {
    selected_value?: string;
};

export const useMenuNavigation = ({ selected_value }: TUseMenuNavigationProps) => {
    const menuRef = React.useRef<HTMLDivElement>(null);
    const [showLeftNav, setShowLeftNav] = React.useState(false);
    const [showRightNav, setShowRightNav] = React.useState(false);

    const updateNavVisibility = React.useCallback(() => {
        if (menuRef.current) {
            // Show left nav only if we're not at the beginning
            setShowLeftNav(menuRef.current.scrollLeft > 0);

            // Show right nav only if we're not at the end
            const isAtEnd = menuRef.current.scrollLeft + menuRef.current.clientWidth >= menuRef.current.scrollWidth - 1;
            setShowRightNav(!isAtEnd);
        }
    }, []);

    const scrollChips = React.useCallback((direction: 'left' | 'right') => {
        if (menuRef.current) {
            const scrollAmount = 200; // Adjust scroll amount as needed
            const currentScroll = menuRef.current.scrollLeft;
            const maxScroll = menuRef.current.scrollWidth - menuRef.current.clientWidth;

            // If scrolling right and we're close to the end, scroll all the way to the end
            if (direction === 'right' && currentScroll + scrollAmount >= maxScroll - 100) {
                menuRef.current.scrollTo({
                    left: maxScroll,
                    behavior: 'smooth',
                });
            }
            // If scrolling left and we're close to the beginning, scroll all the way to the beginning
            else if (direction === 'left' && currentScroll - scrollAmount <= 50) {
                menuRef.current.scrollTo({
                    left: 0,
                    behavior: 'smooth',
                });
            } else {
                menuRef.current.scrollTo({
                    left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
                    behavior: 'smooth',
                });
            }
        }
    }, []);

    // Initialize nav visibility and update on resize
    React.useEffect(() => {
        updateNavVisibility();

        const handleResize = () => {
            updateNavVisibility();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [updateNavVisibility]);

    // Scroll to selected value when it changes
    const scrollToSelected = React.useCallback(
        (selected_contract_type: string) => {
            if (menuRef.current) {
                const selectedChip = menuRef.current.querySelector(`[data-value="${selected_contract_type}"]`);
                if (selectedChip) {
                    const containerRect = menuRef.current.getBoundingClientRect();
                    const chipRect = selectedChip.getBoundingClientRect();

                    const allChips = menuRef.current.querySelectorAll('[data-value]');
                    const isLastChip = allChips[allChips.length - 1] === selectedChip;

                    if (isLastChip) {
                        // Calculate the scroll position to center the selected chip
                        const scrollLeft =
                            chipRect.left - containerRect.left - containerRect.width / 2 + chipRect.width / 2;

                        menuRef.current.scrollTo({
                            left: scrollLeft + menuRef.current.scrollLeft,
                            behavior: 'smooth',
                        });

                        // Update navigation visibility after scrolling
                        setTimeout(updateNavVisibility, 300);

                        // Then, after a short delay, click the next icon
                        setTimeout(() => {
                            // Find the right navigation button in the DOM
                            const rightNavButton = document.querySelector('.guide__menu-nav--next');
                            if (rightNavButton) {
                                // Simulate a click on the right navigation button
                                (rightNavButton as HTMLElement).click();
                            }

                            // Update navigation visibility after all operations
                            updateNavVisibility();
                        }, 600); // S
                    } else {
                        // Calculate the scroll position to center the selected chip
                        const scrollLeft =
                            chipRect.left - containerRect.left - containerRect.width / 2 + chipRect.width / 2;

                        menuRef.current.scrollTo({
                            left: scrollLeft + menuRef.current.scrollLeft,
                            behavior: 'smooth',
                        });

                        // Update navigation visibility after scrolling
                        setTimeout(updateNavVisibility, 300);
                    }
                }
            }
        },
        [updateNavVisibility]
    );

    return {
        menuRef,
        showLeftNav,
        showRightNav,
        updateNavVisibility,
        scrollChips,
        scrollToSelected,
    };
};
