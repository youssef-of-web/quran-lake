import PrayerTimesClient from '@/components/features/prayer-times/PrayerTimesClient';
import { Metadata } from 'next';
import { getMessages } from 'next-intl/server';

type PrayerTimesMessages = {
    title?: string;
    subtitle?: string;
};

export async function generateMetadata(): Promise<Metadata> {
    const messages = await getMessages();
    const t = messages.PrayerTimes as PrayerTimesMessages;

    return {
        title: t?.title || 'Prayer Times',
        description: t?.subtitle || 'Prayer times for your location',
    };
}

export default function PrayerTimesPage() {
    return <PrayerTimesClient />;
} 
