import { PreviewManager } from '@/components/menu/PreviewManager';

export default function MenuSlugLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <PreviewManager />
            {children}
        </>
    );
}
