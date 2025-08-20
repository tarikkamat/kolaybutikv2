import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ShepherdTourContext } from 'react-shepherd';

const TourContext = createContext();

export const useGlobalTour = () => {
    const context = useContext(TourContext);
    if (!context) {
        throw new Error('useGlobalTour must be used within a TourProvider');
    }
    return context;
};

export const TourProvider = ({ children }) => {
    const [currentTour, setCurrentTour] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const tourRef = useRef(null);
    const location = useLocation();
    const shepherdTour = useContext(ShepherdTourContext);

    console.log('TourProvider render - shepherdTour:', shepherdTour);

    // Tour configurations for different pages
    const tourConfigs = {
        '/store': {
            storageKey: 'storeTourCompleted',
            title: 'Mağaza Turu',
            steps: () => import('../../features/store/steps').then(module => module.default)
        },
        '/checkout': {
            storageKey: 'checkoutTourCompleted',
            title: 'Ödeme Sayfası Turu',
            steps: () => import('../../features/checkout/steps').then(module => module.default)
        },
        // Add more page configurations here
        // '/dashboard': {
        //     storageKey: 'dashboardTourCompleted',
        //     title: 'Dashboard Turu',
        //     steps: () => import('../../pages/Dashboard/steps').then(module => module.default)
        // }
    };

    const startTour = async () => {
        console.log('startTour called, tourRef.current:', tourRef.current, 'shepherdTour:', shepherdTour);
        const tour = tourRef.current || shepherdTour;
        
        if (!tour) {
            console.log('Tour bulunamadı');
            return;
        }
        
        setIsLoading(true);
        try {
            console.log('Tour başlatılıyor...');
            
            // Sayfa bazlı steps yükle
            const config = tourConfigs[location.pathname];
            if (config && config.steps) {
                const steps = await config.steps();
                tour.addSteps(steps);
            }
            
            // Kısa bir gecikme ekleyerek tour'un hazır olmasını bekleyelim
            setTimeout(() => {
                if (tour) {
                    tour.start();
                }
            }, 100);
        } catch (error) {
            console.error('Tour başlatılırken hata oluştu:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const autoStartTour = () => {
        const config = tourConfigs[location.pathname];
        console.log('autoStartTour called, config:', config, 'tourRef.current:', tourRef.current, 'shepherdTour:', shepherdTour);
        if (!config) return;
        
        const storageKey = config.storageKey;
        if (!sessionStorage.getItem(storageKey)) {
            startTour();
            sessionStorage.setItem(storageKey, 'true');
        }
    };

    // ShepherdTour context'inden tour instance'ını al
    useEffect(() => {
        if (shepherdTour && tourRef.current !== shepherdTour) {
            console.log('Tour ref güncelleniyor...');
            tourRef.current = shepherdTour;
        }
    }, [shepherdTour]);

    const hasTour = !!tourConfigs[location.pathname];

    const value = {
        tourRef,
        startTour,
        autoStartTour,
        hasTour,
        isLoading,
        currentTour: tourConfigs[location.pathname]
    };

    return (
        <TourContext.Provider value={value}>
            {children}
        </TourContext.Provider>
    );
}; 