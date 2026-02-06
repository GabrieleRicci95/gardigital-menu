'use client';

import React from 'react';
import styles from './bottom-nav.module.css';

interface BottomNavProps {
    activeTab: 'menu' | 'search' | 'info';
    onTabChange: (tab: 'menu' | 'search' | 'info') => void;
    themeColor: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, themeColor }) => {
    return (
        <nav className={styles.bottomNav} style={{ '--color-primary': themeColor } as React.CSSProperties}>
            <button
                className={`${styles.navItem} ${activeTab === 'menu' ? styles.navItemActive : ''}`}
                onClick={() => onTabChange('menu')}
            >
                <div className={styles.iconWrapper}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </div>
                <span className={styles.label}>Menu</span>
            </button>

            <button
                className={`${styles.navItem} ${activeTab === 'search' ? styles.navItemActive : ''}`}
                onClick={() => onTabChange('search')}
            >
                <div className={styles.iconWrapper}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>
                <span className={styles.label}>Cerca</span>
            </button>

            <button
                className={`${styles.navItem} ${activeTab === 'info' ? styles.navItemActive : ''}`}
                onClick={() => onTabChange('info')}
            >
                <div className={styles.iconWrapper}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                </div>
                <span className={styles.label}>Info</span>
            </button>
        </nav>
    );
};

export default BottomNav;
