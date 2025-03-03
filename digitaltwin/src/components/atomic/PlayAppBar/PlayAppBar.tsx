import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface MenuItem {
    label: string;
    icon: any;
    link: string;
    dropdown?: MenuItem[];
}

export interface PlayMenuBarProps {
    menuItems: MenuItem[];
    isMobile?: boolean;
    logoSrc: string; 
    title: string;
}

const PlayAppBar: React.FC<PlayMenuBarProps> = ({ menuItems, isMobile = false, logoSrc, title }) => {
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

    const handleClick = (index: number) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    return (
        <div className={`play-appbar ${isMobile ? 'play-appbar-mobile' : ''}`}>
            <div className="play-appbar-content">
                <div className="play-appbar-start-icon">
                    <img src={logoSrc} alt="" className='play-appbar-ascendion_icon'/>
                    <span><b>{title}</b></span>
                </div>
                <div className="play-appbar-menubar-root-list">
                    {menuItems.map((menuItem, index) => (
                        <div key={index} className="play-appbar-menu-item">
                            <div
                                className="play-appbar-menuitem"
                                onClick={() => handleClick(index)}
                            >
                                <div className="play-appbar-icon-label">
                                    <FontAwesomeIcon icon={menuItem.icon} />
                                    <span className='play-appbar-label'>{menuItem.label}</span>
                                </div>
                                
                                {activeDropdown === index && menuItem.dropdown && (
                                    <div className="play-appbar-dropdown-menu-container">
                                        <ul className="play-appbar-dropdown-menu">
                                            {menuItem.dropdown.map((dropdownItem, dropdownIndex) => (
                                                <li key={dropdownIndex} className="play-appbar-dropdown-menu-item">
                                                    <a href={dropdownItem.link}>
                                                        {dropdownItem.icon && <FontAwesomeIcon icon={dropdownItem.icon} className="play-appbar-dropdown-item-icon" />}
                                                        <span className='play-appbar-label'>{dropdownItem.label}</span> 
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PlayAppBar;
