import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';

// Query Keys
export const queryKeys = {
    news: ['news'] as const,
    newsById: (id: string) => ['news', id] as const,
    library: ['library'] as const,
    tools: ['tools'] as const,
    projects: ['projects'] as const,
    pricing: ['pricing'] as const,
    training: ['training'] as const,
    trainingBySlug: (slug: string) => ['training', slug] as const,
};

// News Queries
export const useNews = () => {
    return useQuery({
        queryKey: queryKeys.news,
        queryFn: async () => {
            const response = await fetch('/api/news');
            if (!response.ok) throw new Error('Failed to fetch news');
            return response.json();
        },
    });
};

export const useNewsById = (id: string) => {
    return useQuery({
        queryKey: queryKeys.newsById(id),
        queryFn: async () => {
            const response = await fetch(`/api/news/${id}`);
            if (!response.ok) throw new Error('Failed to fetch news');
            return response.json();
        },
        enabled: !!id,
    });
};

// Library Query
export const useLibrary = () => {
    return useQuery({
        queryKey: queryKeys.library,
        queryFn: async () => {
            const response = await fetch('/api/library');
            if (!response.ok) throw new Error('Failed to fetch library');
            return response.json();
        },
    });
};

// Tools Query
export const useTools = () => {
    return useQuery({
        queryKey: queryKeys.tools,
        queryFn: async () => {
            const response = await fetch('/api/tools');
            if (!response.ok) throw new Error('Failed to fetch tools');
            return response.json();
        },
    });
};

// Projects Query
export const useProjects = () => {
    return useQuery({
        queryKey: queryKeys.projects,
        queryFn: async () => {
            const response = await fetch('/api/projects');
            if (!response.ok) throw new Error('Failed to fetch projects');
            return response.json();
        },
    });
};

// Training Queries
export const useTraining = () => {
    return useQuery({
        queryKey: queryKeys.training,
        queryFn: async () => {
            const response = await fetch('/api/training');
            if (!response.ok) throw new Error('Failed to fetch training');
            return response.json();
        },
    });
};

export const useTrainingBySlug = (slug: string) => {
    return useQuery({
        queryKey: queryKeys.trainingBySlug(slug),
        queryFn: async () => {
            const response = await fetch(`/api/training/${slug}`);
            if (!response.ok) throw new Error('Failed to fetch training');
            return response.json();
        },
        enabled: !!slug,
    });
};

// Contact Mutation
export const useCreateContact = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: any) => {
            const response = await fetch('/api/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to create contact');
            return response.json();
        },
        onSuccess: () => {
            // Optionally invalidate/refetch contacts list if needed
        },
    });
};

// Lead Mutation
export const useCreateLead = () => {
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to create lead');
            return response.json();
        },
    });
};
