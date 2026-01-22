import React from 'react';

interface SettingsManagerProps {
    settings: any;
    setSettings: (s: any) => void;
    onSubmit: (e: React.FormEvent) => void;
}

const SettingsManager: React.FC<SettingsManagerProps> = ({ settings, setSettings, onSubmit }) => {
    return (
        <div className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Cấu hình Hệ thống</h2>
            <div className="bg-white p-8 rounded-xl shadow border border-gray-200">
                <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Thông tin Chung</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên Công ty / Brand</label>
                            <input
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={settings.companyName || ''}
                                onChange={e => setSettings({ ...settings, companyName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                            <input
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={settings.address || ''}
                                onChange={e => setSettings({ ...settings, address: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hotline</label>
                            <input
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={settings.phone || ''}
                                onChange={e => setSettings({ ...settings, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={settings.email || ''}
                                onChange={e => setSettings({ ...settings, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Kết nối & SEO</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Fanpage</label>
                            <input
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={settings.facebook || ''}
                                onChange={e => setSettings({ ...settings, facebook: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                            <input
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={settings.linkedin || ''}
                                onChange={e => setSettings({ ...settings, linkedin: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả Footer (SEO)</label>
                            <textarea
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32"
                                value={settings.footerDescription || ''}
                                onChange={e => setSettings({ ...settings, footerDescription: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2 flex justify-end pt-4 border-t">
                        <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-shadow shadow-md">
                            Lưu Cấu Hình
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsManager;

