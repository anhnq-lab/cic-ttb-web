import React from 'react';

export interface Column {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
    width?: string;
}

interface DataTableProps {
    title: string;
    columns: Column[];
    data: any[];
    onAdd: () => void;
    onEdit: (item: any) => void;
    onDelete: (id: string | number) => void;
    loading?: boolean;
    searchable?: boolean;
    onSearch?: (query: string) => void;
}

const DataTable: React.FC<DataTableProps> = ({
    title,
    columns,
    data,
    onAdd,
    onEdit,
    onDelete,
    loading = false,
    searchable = false,
    onSearch
}) => {
    const [searchQuery, setSearchQuery] = React.useState('');

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (onSearch) {
            onSearch(query);
        }
    };

    const filteredData = searchable && searchQuery && !onSearch
        ? data.filter(row =>
            columns.some(col => {
                const value = row[col.key];
                return value && String(value).toLowerCase().includes(searchQuery.toLowerCase());
            })
        )
        : data;

    return (
        <div className="bg-white rounded-lg shadow-sm">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                <div className="flex gap-2">
                    {searchable && (
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    )}
                    <button
                        onClick={onAdd}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        + Thêm mới
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Đang tải...</div>
                ) : filteredData.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">Không có dữ liệu</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                {columns.map((col) => (
                                    <th
                                        key={col.key}
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                                        style={{ width: col.width }}
                                    >
                                        {col.label}
                                    </th>
                                ))}
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider w-32">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredData.map((row, idx) => (
                                <tr key={row.id || idx} className="hover:bg-gray-50">
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                            {col.render
                                                ? col.render(row[col.key], row)
                                                : row[col.key] || '-'}
                                        </td>
                                    ))}
                                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(row)}
                                                className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                                                title="Sửa"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Bạn có chắc muốn xóa?')) {
                                                        onDelete(row.id);
                                                    }
                                                }}
                                                className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                                                title="Xóa"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Footer */}
            {filteredData.length > 0 && (
                <div className="p-4 border-t border-gray-200 text-sm text-gray-600">
                    Tổng: {filteredData.length} {filteredData.length === 1 ? 'mục' : 'mục'}
                </div>
            )}
        </div>
    );
};

export default DataTable;
