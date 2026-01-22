// Type Definitions for Admin Dashboard
// Centralizes all interfaces for type safety

// ===== PROJECTS =====
export interface Project {
    id: string | number;
    title: string;
    client: string;
    location: string;
    service_type: 'Scan-to-BIM' | '3D Modeling' | 'BIM Modeling' | 'BIM Coordination' | 'Clash Detection' | 'Digital Twin' | 'Training' | 'Consulting' | 'Other';
    description: string;
    challenge?: string;
    solution?: string;
    result?: string;
    images: string[];
    completion_date?: string;
    content?: string;
    scope_of_work?: string;
    status: 'draft' | 'published' | 'archived' | 'pending' | 'active'; // Added 'pending' and 'active'
    created_at?: string;
}

export interface ProjectForm extends Omit<Project, 'id' | 'created_at'> { }

// ===== NEWS =====
export interface News {
    id: number;
    category: string;
    title: string;
    date: string;
    imageUrl?: string;
    excerpt: string;
    content: string;
    author?: string;
    videoUrl?: string;
    audioUrl?: string;
    attachments?: Attachment[];
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    created_at?: string;
}

export interface NewsForm extends Omit<News, 'id' | 'created_at'> { }

export interface Attachment {
    name: string;
    url: string;
    type: string;
}

// ===== LIBRARY =====
export interface LibraryItem {
    id: number;
    title: string;
    description: string;
    type: 'technical' | 'legal' | 'guide' | 'standard' | 'other' | 'featured' | 'infographic' | 'resource';
    image_url?: string;
    tag?: string;
    link?: string;
    created_at?: string;
}

export interface LibraryForm extends Omit<LibraryItem, 'id' | 'created_at'> { }

// ===== TOOLS =====
export interface Tool {
    id: number;
    title: string;
    description: string;
    icon?: string;
    link: string;
    created_at?: string;
}

export interface ToolForm extends Omit<Tool, 'id' | 'created_at'> { }

// ===== CONTACTS =====
export interface Contact {
    id: number;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    service?: string;
    note?: string;
    status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
    created_at?: string;
}

export interface ContactForm extends Omit<Contact, 'id' | 'created_at' | 'status'> { }

// ===== PRICING =====
export interface PricingPackage {
    id: string | number;
    name: string;
    price: string;
    period?: string;
    description: string;
    features: string[] | string;
    ctaText?: string;
    isPopular?: boolean;
    type: 'software' | 'service';
    created_at?: string;
}

export interface PricingForm extends Omit<PricingPackage, 'id' | 'created_at'> { }

// ===== SETTINGS =====
export interface Settings {
    companyName: string;
    address: string;
    phone: string;
    email: string;
    facebook?: string;
    linkedin?: string;
    footerDescription: string;
    footerCategories: string; // JSON string
    footerAudiences: string;  // JSON string
}

// ===== TRAINING =====
export interface TrainingCourse {
    id: string | number;
    title: string;
    description: string;
    duration: string;
    price: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    image_url?: string;
    schedule?: string;
    instructor?: string;
    status: 'active' | 'inactive';
    created_at?: string;
}

export interface TrainingForm extends Omit<TrainingCourse, 'id' | 'created_at'> { }

export interface TrainingLead {
    id: string | number;
    course_id: string | number;
    name: string;
    email: string;
    phone: string;
    company?: string;
    note?: string;
    status: 'pending' | 'contacted' | 'registered' | 'cancelled';
    created_at?: string;
}

// ===== ANALYTICS =====
export interface AnalyticsStats {
    views: number;
    contacts: number;
    news: number;
    library: number;
    projects?: number;
}

// ===== COMPONENT PROPS =====
export interface BaseManagerProps<T, F> {
    items: T[];
    form: F;
    setForm: (form: F) => void;
    editingId: string | number | null;
    setEditingId: (id: string | number | null) => void;
    onSubmit: (e: React.FormEvent) => void;
    onEdit: (item: T) => void;
    onDelete: (id: string | number) => void;
}
