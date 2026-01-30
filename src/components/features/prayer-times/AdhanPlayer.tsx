'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { PrayerTimes } from '@/types/PrayerTimes';
import { getNextPrayer, getCurrentPrayer } from '@/helpers/prayerTimes';
import { useTranslations } from 'next-intl';
import { Bell, Volume2, VolumeX, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, parseISO, addMinutes } from 'date-fns';

interface AdhanPlayerProps {
    prayerTimes: PrayerTimes;
    locale: string;
}

export default function AdhanPlayer({ prayerTimes, locale }: AdhanPlayerProps) {
    const t = useTranslations('PrayerTimes');
    const [isMuted, setIsMuted] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [currentPrayerName, setCurrentPrayerName] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showPlayHint, setShowPlayHint] = useState(false);
    const [showFirstTimeAnimation, setShowFirstTimeAnimation] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const notificationRef = useRef<HTMLDivElement | null>(null);
    const isArabic = locale === 'ar';

    // Adhan audio URLs
    const adhanAudioUrls = useMemo(() => ({
        Fajr: '/adhan.mp3',
        Dhuhr: '/adhan.mp3',
        Asr: '/adhan.mp3',
        Maghrib: '/adhan.mp3',
        Isha: '/adhan.mp3',
    }), []);

    const playAdhan = useCallback((prayerName: string) => {
        const audioUrl = adhanAudioUrls[prayerName as keyof typeof adhanAudioUrls];
        if (audioUrl && audioRef.current) {
            audioRef.current.src = audioUrl;
            audioRef.current.volume = 0.8;
            audioRef.current.loop = false;
            setIsPlaying(true);

            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('Adhan started playing');
                    })
                    .catch((error) => {
                        console.error('Error playing adhan:', error);
                        setIsPlaying(false);
                    });
            }
        }
    }, [adhanAudioUrls]);

    useEffect(() => {
        const checkPrayerTime = () => {
            const currentPrayer = getCurrentPrayer(prayerTimes);
            const now = new Date();
            const today = format(now, 'yyyy-MM-dd');

            for (const prayer of ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']) {
                const prayerTime = parseISO(`${today}T${prayerTimes[prayer as keyof PrayerTimes]}`);

                const apiAdhanTimeKey = `${prayer}Adhan` as keyof PrayerTimes;
                const apiAdhanTime = prayerTimes[apiAdhanTimeKey] as string | undefined;

                let adhanTime: Date;
                if (apiAdhanTime) {
                    adhanTime = parseISO(`${today}T${apiAdhanTime}`);
                } else {
                    adhanTime = addMinutes(prayerTime, -5);
                }

                const timeDiff = Math.abs(now.getTime() - adhanTime.getTime());
                if (timeDiff <= 60000 && currentPrayerName !== `adhan_${prayer}`) {
                    setCurrentPrayerName(`adhan_${prayer}`);


                    if (!isMuted && adhanAudioUrls[prayer as keyof typeof adhanAudioUrls]) {
                        setShowNotification(true);
                        playAdhan(prayer);
                    }


                    setTimeout(() => {
                        setShowNotification(false);
                    }, 30000);
                    break;
                }
            }


            if (currentPrayer && currentPrayer !== currentPrayerName && !currentPrayerName?.startsWith('adhan_')) {
                setCurrentPrayerName(currentPrayer);
            }
        };

        const interval = setInterval(checkPrayerTime, 30000);

        checkPrayerTime();

        return () => clearInterval(interval);
    }, [prayerTimes, currentPrayerName, isMuted, adhanAudioUrls, playAdhan]);

    const playAdhanManually = () => {
        const nextPrayer = getNextPrayer(prayerTimes);
        playAdhan(nextPrayer);
        setShowPlayHint(false);
        setShowFirstTimeAnimation(false);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
        }
    };

    const closeNotification = () => {
        setShowNotification(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    };

    // Handle audio ended event
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const handleEnded = () => {
            setIsPlaying(false);
        };
        audio.addEventListener('ended', handleEnded);
        return () => {
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    // Show first time animation when component mounts
    useEffect(() => {
        const hasVisited = localStorage.getItem('prayerTimesVisited');
        if (!hasVisited) {
            setTimeout(() => {
                setShowFirstTimeAnimation(true);
                localStorage.setItem('prayerTimesVisited', 'true');
            }, 2000);
        }
    }, []);

    // Show play hint animation periodically (only after first time animation)
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPlaying && !showFirstTimeAnimation) {
                setShowPlayHint(true);
                setTimeout(() => setShowPlayHint(false), 3000);
            }
        }, 8000); // Show every 8 seconds

        return () => clearInterval(interval);
    }, [isPlaying, showFirstTimeAnimation]);

    return (
        <>
            {/* Hidden audio element */}
            <audio ref={audioRef} preload="auto" />

            {/* Adhan Control Buttons */}
            <div className="fixed bottom-4 right-4 z-50 flex gap-2">
                <motion.button
                    onClick={playAdhanManually}
                    disabled={isPlaying}
                    className={`p-3 rounded-full shadow-lg transition-all duration-300 ${isPlaying
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                        } text-white relative`}
                    aria-label="Play adhan"
                    animate={showFirstTimeAnimation ? {
                        scale: [1, 1.3, 1],
                        boxShadow: [
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            "0 25px 50px -12px rgba(59, 130, 246, 1)",
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                        ]
                    } : showPlayHint ? {
                        scale: [1, 1.2, 1],
                        rotate: [0, -5, 5, 0],
                        boxShadow: [
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            "0 20px 25px -5px rgba(59, 130, 246, 0.8)",
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                        ]
                    } : {}}
                    transition={{
                        duration: showFirstTimeAnimation ? 1.2 : 0.8,
                        repeat: (showFirstTimeAnimation || showPlayHint) ? Infinity : 0,
                        repeatType: "reverse"
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.div
                        animate={showPlayHint ? {
                            rotate: [0, 10, -10, 0]
                        } : {}}
                        transition={{ duration: 0.6, repeat: showPlayHint ? Infinity : 0 }}
                    >
                        <Play className="w-5 h-5" />
                    </motion.div>

                    {/* Bubble Ping Animation Rings */}
                    {showFirstTimeAnimation && (
                        <>
                            <motion.div
                                className="absolute inset-0 rounded-full border-2 border-blue-400"
                                initial={{ scale: 1, opacity: 0.8 }}
                                animate={{ scale: 2.5, opacity: 0 }}
                                transition={{ duration: 1.5, repeat: 3, ease: "easeOut" }}
                            />
                            <motion.div
                                className="absolute inset-0 rounded-full border-2 border-blue-300"
                                initial={{ scale: 1, opacity: 0.6 }}
                                animate={{ scale: 2, opacity: 0 }}
                                transition={{ duration: 1.5, repeat: 3, ease: "easeOut", delay: 0.3 }}
                            />
                            <motion.div
                                className="absolute inset-0 rounded-full border-2 border-blue-200"
                                initial={{ scale: 1, opacity: 0.4 }}
                                animate={{ scale: 1.5, opacity: 0 }}
                                transition={{ duration: 1.5, repeat: 3, ease: "easeOut", delay: 0.6 }}
                            />
                        </>
                    )}

                    {/* Animated hint text */}
                    {(showPlayHint || showFirstTimeAnimation) && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: .8 }}
                            className={`absolute -top-14 transform -translate-x-1/2 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg ${showFirstTimeAnimation ? 'bg-orange-500' : 'bg-blue-600'
                                }`}
                        >
                            <div className="flex items-center gap-1">
                                <Volume2 className="w-3 h-3" />
                                {(isArabic ? 'اضغط للاستماع للأذان' : 'Click to hear adhan')
                                }
                            </div>
                        </motion.div>
                    )}
                </motion.button>

                {/* Mute/Unmute Button */}
                <button
                    onClick={toggleMute}
                    className={`p-3 rounded-full shadow-lg transition-all duration-300 ${isMuted
                        ? 'bg-gray-500 hover:bg-gray-600'
                        : 'bg-green-500 hover:bg-green-600'
                        } text-white`}
                    aria-label={isMuted ? 'Unmute adhan' : 'Mute adhan'}
                >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
            </div>

            {/* Prayer Time Notification */}
            {showNotification && (
                <motion.div
                    ref={notificationRef}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    className="fixed top-4 left-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:max-w-sm sm:w-auto"
                >
                    <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <Bell className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div className={`text-left ${isArabic ? 'text-right' : 'text-left'}`}>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {t('prayerTime')}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {currentPrayerName ? t(`prayers.${currentPrayerName.toLowerCase()}`) : ''}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={closeNotification}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            aria-label="Close notification"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </motion.div>
            )}
        </>
    );
} 
