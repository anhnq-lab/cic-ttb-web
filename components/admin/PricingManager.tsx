import React from 'react';
import type { PricingPackage, PricingForm } from '../../types/admin';

interface PricingManagerProps {
    pricing: PricingPackage[];
    pricingForm: PricingForm;
    setPricingForm: (f: PricingForm) => void;
    editingId: string | number | null;
    setEditingId: (id: string | number | null) => void;
    onSubmit: (e: React.FormEvent) => void;
}

const PricingManager: React.FC<PricingManagerProps> = ({ pricing, pricingForm, setPricingForm, editingId, setEditingId, onSubmit }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Quản lý Gói dịch vụ & Bảng giá</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pricing.map(item => (
                    <div key={item.id} className={`bg-white rounded-xl shadow border p-6 transition-all ${editingId === item.id ? 'ring-2 ring-blue-500 border-transparent' : 'border-gray-200 hover:shadow-lg'}`}>
                        {editingId === item.id ? (
                            <form onSubmit={onSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-500">Tên gói</label>
                                    <input className="w-full font-bold text-lg border-b border-gray-300 focus:border-blue-500 outline-none py-1" value={pricingForm.name} onChange={e => setPricingForm({ ...pricingForm, name: e.target.value })} placeholder="Tên gói" />
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-1/2">
                                        <label className="text-xs text-gray-500">Giá</label>
                                        <input className="w-full font-bold text-blue-600 border-b border-gray-300 focus:border-blue-500 outline-none py-1" value={pricingForm.price} onChange={e => setPricingForm({ ...pricingForm, price: e.target.value })} placeholder="Giá" />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="text-xs text-gray-500">Kỳ hạn</label>
                                        <input className="w-full text-gray-600 border-b border-gray-300 focus:border-blue-500 outline-none py-1" value={pricingForm.period} onChange={e => setPricingForm({ ...pricingForm, period: e.target.value })} placeholder="/ tháng" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Tính năng (mỗi dòng 1 ý)</label>
                                    <textarea className="w-full text-sm border p-2 rounded bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none h-32 resize-none" value={pricingForm.features} onChange={e => setPricingForm({ ...pricingForm, features: e.target.value })} />
                                </div>
                                <div className="flex justify-end gap-2 mt-4 pt-2 border-t">
                                    <button type="button" onClick={() => setEditingId(null)} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded">Hủy</button>
                                    <button type="submit" className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded font-medium hover:bg-blue-700">Lưu thay đổi</button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-lg text-gray-900">{item.name}</h4>
                                        <div className="text-blue-600 font-bold text-2xl mt-1">{item.price} <span className="text-sm text-gray-500 font-normal">{item.period}</span></div>
                                    </div>
                                    <button onClick={() => {
                                        setPricingForm({
                                            name: item.name, price: item.price, period: item.period || '', description: item.description,
                                            features: Array.isArray(item.features) ? item.features.join('\n') : item.features, ctaText: item.ctaText || '',
                                            type: item.type, isPopular: item.isPopular
                                        });
                                        setEditingId(item.id);
                                    }} className="text-gray-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500 mb-4 h-10 overflow-hidden">{item.description}</p>
                                <ul className="text-sm space-y-2 mb-6 h-40 overflow-y-auto custom-scrollbar pr-2">
                                    {(Array.isArray(item.features) ? item.features : []).map((f: string, i: number) => (
                                        <li key={i} className="flex items-start text-gray-700">
                                            <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PricingManager;
