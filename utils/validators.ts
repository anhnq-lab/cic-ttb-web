// Validation Utilities for Admin Forms
// Provides input validation and sanitization

import DOMPurify from 'dompurify';
import type { Project, News, LibraryItem, Contact, Tool } from '../types/admin';

// ===== VALIDATION ERRORS =====
export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

// ===== BASIC VALIDATORS =====
export const validators = {
    required: (value: string | undefined | null, fieldName: string): void => {
        if (!value || value.trim().length === 0) {
            throw new ValidationError(`${fieldName} là bắt buộc`);
        }
    },

    minLength: (value: string, min: number, fieldName: string): void => {
        if (value.trim().length < min) {
            throw new ValidationError(`${fieldName} phải có ít nhất ${min} ký tự`);
        }
    },

    maxLength: (value: string, max: number, fieldName: string): void => {
        if (value.trim().length > max) {
            throw new ValidationError(`${fieldName} không được vượt quá ${max} ký tự`);
        }
    },

    email: (value: string): void => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            throw new ValidationError('Email không hợp lệ');
        }
    },

    phone: (value: string): void => {
        // Vietnamese phone format: 10 digits, starts with 0
        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(value.replace(/[\s-]/g, ''))) {
            throw new ValidationError('Số điện thoại không hợp lệ (phải có 10 số, bắt đầu bằng 0)');
        }
    },

    url: (value: string): void => {
        try {
            new URL(value);
        } catch {
            throw new ValidationError('URL không hợp lệ');
        }
    },

    sanitizeHTML: (html: string): string => {
        return DOMPurify.sanitize(html, {
            ALLOWED_TAGS: [
                'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre',
                'table', 'thead', 'tbody', 'tr', 'td', 'th'
            ],
            ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'target']
        });
    }
};

// ===== ENTITY VALIDATORS =====

export const validateProjectForm = (form: Partial<Project>): Partial<Project> => {
    // Required fields
    validators.required(form.title, 'Tiêu đề dự án');
    validators.minLength(form.title!, 3, 'Tiêu đề dự án');
    validators.required(form.client, 'Tên khách hàng');
    validators.required(form.location, 'Địa điểm');

    // Optional HTML content sanitization
    if (form.content) {
        form.content = validators.sanitizeHTML(form.content);
    }
    if (form.description) {
        form.description = validators.sanitizeHTML(form.description);
    }
    if (form.challenge) {
        form.challenge = validators.sanitizeHTML(form.challenge);
    }
    if (form.solution) {
        form.solution = validators.sanitizeHTML(form.solution);
    }
    if (form.result) {
        form.result = validators.sanitizeHTML(form.result);
    }

    return form;
};

export const validateNewsForm = (form: Partial<News>): Partial<News> => {
    // Required fields
    validators.required(form.title, 'Tiêu đề tin tức');
    validators.minLength(form.title!, 5, 'Tiêu đề tin tức');
    validators.required(form.excerpt, 'Tóm tắt');
    validators.minLength(form.excerpt!, 20, 'Tóm tắt');
    validators.required(form.content, 'Nội dung');

    // Sanitize HTML content
    if (form.content) {
        form.content = validators.sanitizeHTML(form.content);
    }
    if (form.excerpt) {
        form.excerpt = validators.sanitizeHTML(form.excerpt);
    }

    // Validate URLs if present
    if (form.imageUrl && form.imageUrl.trim()) {
        validators.url(form.imageUrl);
    }
    if (form.videoUrl && form.videoUrl.trim()) {
        validators.url(form.videoUrl);
    }
    if (form.audioUrl && form.audioUrl.trim()) {
        validators.url(form.audioUrl);
    }

    return form;
};

export const validateLibraryForm = (form: Partial<LibraryItem>): Partial<LibraryItem> => {
    // Required fields
    validators.required(form.title, 'Tiêu đề tài liệu');
    validators.minLength(form.title!, 3, 'Tiêu đề tài liệu');
    validators.required(form.description, 'Mô tả');
    validators.minLength(form.description!, 10, 'Mô tả');

    // Sanitize HTML
    if (form.description) {
        form.description = validators.sanitizeHTML(form.description);
    }

    // Validate URLs
    if (form.image_url && form.image_url.trim()) {
        validators.url(form.image_url);
    }
    if (form.link && form.link.trim()) {
        validators.url(form.link);
    }

    return form;
};

export const validateContactForm = (form: Partial<Contact>): Partial<Contact> => {
    // Required fields
    validators.required(form.name, 'Tên');
    validators.required(form.email, 'Email');
    validators.email(form.email!);

    // Optional phone validation
    if (form.phone && form.phone.trim()) {
        validators.phone(form.phone);
    }

    // Sanitize text fields (no HTML allowed in contacts)
    if (form.note) {
        form.note = form.note.replace(/<[^>]*>/g, ''); // Strip all HTML
    }

    return form;
};

export const validateToolForm = (form: Partial<Tool>): Partial<Tool> => {
    // Required fields
    validators.required(form.title, 'Tên công cụ');
    validators.minLength(form.title!, 3, 'Tên công cụ');
    validators.required(form.description, 'Mô tả');
    validators.required(form.link, 'Link');
    validators.url(form.link!);

    // Sanitize HTML
    if (form.description) {
        form.description = validators.sanitizeHTML(form.description);
    }

    return form;
};

// ===== HELPER FUNCTIONS =====

/**
 * Validate form and return sanitized data or throw ValidationError
 */
export const validateForm = <T>(
    formType: 'project' | 'news' | 'library' | 'contact' | 'tool',
    form: Partial<T>
): Partial<T> => {
    try {
        switch (formType) {
            case 'project':
                return validateProjectForm(form as any) as Partial<T>;
            case 'news':
                return validateNewsForm(form as any) as Partial<T>;
            case 'library':
                return validateLibraryForm(form as any) as Partial<T>;
            case 'contact':
                return validateContactForm(form as any) as Partial<T>;
            case 'tool':
                return validateToolForm(form as any) as Partial<T>;
            default:
                throw new Error('Unknown form type');
        }
    } catch (error) {
        if (error instanceof ValidationError) {
            throw error;
        }
        throw new ValidationError('Lỗi validation: ' + (error as Error).message);
    }
};

/**
 * Display user-friendly validation error
 */
export const handleValidationError = (error: unknown): void => {
    if (error instanceof ValidationError) {
        alert('❌ ' + error.message);
    } else {
        alert('❌ Lỗi không xác định: ' + (error as Error).message);
        console.error('Validation error:', error);
    }
};
