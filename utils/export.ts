// CSV/Excel Export Utilities
// Export data to CSV format with Vietnamese character support

/**
 * Export array of objects to CSV file
 * @param data Array of objects to export
 * @param filename Filename without extension
 * @param headers Optional custom headers (defaults to object keys)
 */
export const exportToCSV = (
    data: any[],
    filename: string,
    headers?: string[]
): void => {
    if (!data || data.length === 0) {
        alert('Không có dữ liệu để xuất');
        return;
    }

    try {
        // Get headers from first object if not provided
        const headerRow = headers || Object.keys(data[0]);

        // Convert data to CSV format
        const csvRows = [
            // Header row
            headerRow.map(h => `"${h}"`).join(','),
            // Data rows
            ...data.map(row =>
                headerRow.map(header => {
                    const value = row[header] ?? '';
                    // Escape quotes and wrap in quotes
                    return `"${String(value).replace(/"/g, '""')}"`;
                }).join(',')
            )
        ];

        const csvContent = csvRows.join('\n');

        // Add BOM for UTF-8 to support Vietnamese characters in Excel
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], {
            type: 'text/csv;charset=utf-8;'
        });

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}_${getDateString()}.csv`;

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Cleanup
        URL.revokeObjectURL(url);

        console.log(`✅ Exported ${data.length} rows to ${link.download}`);
    } catch (error) {
        console.error('Export error:', error);
        alert('Lỗi khi xuất file: ' + (error as Error).message);
    }
};

/**
 * Export with custom field mapping
 */
export const exportWithMapping = (
    data: any[],
    filename: string,
    fieldMap: Record<string, string> // { dbField: 'Display Name' }
): void => {
    if (!data || data.length === 0) {
        alert('Không có dữ liệu để xuất');
        return;
    }

    const mappedData = data.map(row => {
        const newRow: Record<string, any> = {};
        Object.entries(fieldMap).forEach(([dbField, displayName]) => {
            newRow[displayName] = row[dbField];
        });
        return newRow;
    });

    exportToCSV(mappedData, filename);
};

/**
 * Export contacts with proper Vietnamese headers
 */
export const exportContacts = (contacts: any[]): void => {
    const fieldMap = {
        name: 'Tên',
        email: 'Email',
        phone: 'Điện thoại',
        company: 'Công ty',
        service: 'Dịch vụ quan tâm',
        note: 'Ghi chú',
        status: 'Trạng thái',
        created_at: 'Ngày tạo'
    };

    exportWithMapping(contacts, 'contacts', fieldMap);
};

/**
 * Export training leads
 */
export const exportLeads = (leads: any[]): void => {
    const fieldMap = {
        name: 'Tên',
        email: 'Email',
        phone: 'Điện thoại',
        company: 'Công ty',
        course_title: 'Khóa học',
        note: 'Ghi chú',
        status: 'Trạng thái',
        created_at: 'Ngày đăng ký'
    };

    exportWithMapping(leads, 'training_leads', fieldMap);
};

/**
 * Export projects
 */
export const exportProjects = (projects: any[]): void => {
    const fieldMap = {
        title: 'Tên dự án',
        client: 'Khách hàng',
        location: 'Địa điểm',
        service_type: 'Loại dịch vụ',
        status: 'Trạng thái',
        completion_date: 'Ngày hoàn thành'
    };

    exportWithMapping(projects, 'projects', fieldMap);
};

/**
 * Get current date string for filename
 */
const getDateString = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
};

/**
 * Convert JSON data to Excel-compatible format (for future enhancement)
 * Note: For true .xlsx export, use library like 'xlsx' or 'exceljs'
 */
export const prepareForExcel = (data: any[]): string[][] => {
    if (data.length === 0) return [[]];

    const headers = Object.keys(data[0]);
    const rows = data.map(row =>
        headers.map(h => row[h] ?? '')
    );

    return [headers, ...rows];
};
