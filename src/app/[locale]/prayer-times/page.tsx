import PrayerTimesClient from '@/components/features/prayer-times/PrayerTimesClient';
import { Metadata } from 'next';
import { getMessages } from 'next-intl/server';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
    const messages = await getMessages();
    const t = messages.PrayerTimes as any;

    return {
        title: t?.title || 'Prayer Times',
        description: t?.subtitle || 'Prayer times for your location',
    };
}

export default function PrayerTimesPage() {
    return <PrayerTimesClient />;
} 