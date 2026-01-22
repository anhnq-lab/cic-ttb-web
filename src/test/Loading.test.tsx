import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoadingSpinner, PageSkeleton } from '../../components/shared/Loading';

describe('Loading Components', () => {
    describe('LoadingSpinner', () => {
        it('should render loading spinner with text', () => {
            render(<LoadingSpinner />);

            expect(screen.getByText('Đang tải...')).toBeInTheDocument();
        });

        it('should have spinner animation', () => {
            const { container } = render(<LoadingSpinner />);

            const spinner = container.querySelector('.animate-spin');
            expect(spinner).toBeInTheDocument();
        });
    });

    describe('PageSkeleton', () => {
        it('should render page skeleton', () => {
            const { container } = render(<PageSkeleton />);

            expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
        });

        it('should render multiple skeleton cards', () => {
            const { container } = render(<PageSkeleton />);

            const cards = container.querySelectorAll('.grid > div');
            expect(cards.length).toBe(3);
        });
    });
});
