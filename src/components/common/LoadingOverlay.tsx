'use client';

import Image from 'next/image';
import styles from './LoadingOverlay.module.css';

interface LoadingOverlayProps {
    fullScreen?: boolean;
}

export default function LoadingOverlay({ fullScreen = true }: LoadingOverlayProps) {
    return (
        <div className={`${styles.overlay} ${fullScreen ? styles.fullScreen : styles.relative}`}>
            <div className={styles.container}>
                <div className={styles.logoWrapper}>
                    <Image 
                        src="/logo_solomenu.png" 
                        alt="SoloMenu Logo" 
                        width={120} 
                        height={120} 
                        className={styles.logo}
                        priority
                    />
                    <div className={styles.glow}></div>
                </div>
            </div>
        </div>
    );
}
