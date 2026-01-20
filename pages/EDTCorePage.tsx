
import React, { useEffect } from 'react';
import Hero from '../components/EDTCore/Hero';
import USPSection from '../components/EDTCore/USPSection';
import LegalBasisSection from '../components/EDTCore/LegalBasisSection';
import ArchitectureSection from '../components/EDTCore/ArchitectureSection';
import NetworkEffectSection from '../components/EDTCore/NetworkEffectSection';
import RoiSection from '../components/EDTCore/RoiSection';
import RoadmapSection from '../components/EDTCore/RoadmapSection';
import CustomerSegments from '../components/EDTCore/CustomerSegments';
import SEO from '../components/SEO';

interface EDTCorePageProps {
    onOpenContact?: (service?: string) => void;
}

const EDTCorePage: React.FC<EDTCorePageProps> = ({ onOpenContact }) => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleContact = () => {
        if (onOpenContact) {
            onOpenContact("Tư vấn CIC Platform");
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <SEO
                title="CIC Platform - Hệ điều hành số ngành Xây dựng"
                description="Nền tảng quản trị tiêu chuẩn (Standard Platform) kết nối CĐT - PMU - Tư vấn - Nhà thầu. Giải pháp chuyển đổi số toàn diện cho ngành xây dựng Việt Nam."
            />

            <Hero />

            {/* USP Section: Value Proposition (Hybrid Power & Tailor-made Philosophy) */}
            <USPSection />

            {/* Legal Basis & Strategy */}
            <LegalBasisSection />

            {/* Customer Segments: Pain Points & Solutions */}
            <CustomerSegments onContact={handleContact} />

            {/* Product Strategy: 6 Pillars & 4 Modules */}
            <ArchitectureSection />

            {/* CDE Network Effect: Data Interoperability & Single Source of Truth */}
            <NetworkEffectSection />

            {/* Financials: ROI & P&L Forecast */}
            <RoiSection />

            {/* Timeline & Risk Management */}
            <RoadmapSection />

            <div className="py-24 bg-brand-darkBlue text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-darkBlue via-brand-blue/50 to-brand-darkBlue opacity-50"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Sẵn sàng chuyển đổi số cùng <span className="text-brand-orange">CIC Platform</span>?</h2>
                    <p className="text-gray-300 mb-12 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                        Hãy để chúng tôi đồng hành cùng bạn trên hành trình kiến tạo tương lai số ngành xây dựng Việt Nam.
                    </p>
                    <button
                        onClick={handleContact}
                        className="bg-brand-orange text-white px-12 py-5 rounded-2xl font-black shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all uppercase tracking-[0.2em] text-sm"
                    >
                        Đăng ký tư vấn ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EDTCorePage;
