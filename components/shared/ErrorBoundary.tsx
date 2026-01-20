// Error Boundary Component for Admin Dashboard
// Catches React errors and displays user-friendly fallback UI

import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    componentName?: string;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): Pick<ErrorBoundaryState, 'hasError' | 'error'> {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('[ErrorBoundary] Error caught:', {
            component: this.props.componentName,
            error,
            errorInfo
        });

        this.setState({
            errorInfo
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="p-8 min-h-[400px] flex items-center justify-center">
                    <div className="max-w-md w-full bg-red-50 rounded-xl border-2 border-red-200 p-6 text-center">
                        <div className="mb-4">
                            <svg
                                className="w-16 h-16 text-red-500 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>

                        <h2 className="text-xl font-bold text-red-700 mb-2">
                            Đã xảy ra lỗi
                        </h2>

                        <p className="text-sm text-gray-700 mb-4">
                            {this.state.error?.message || 'Lỗi không xác định'}
                        </p>

                        {this.props.componentName && (
                            <p className="text-xs text-gray-500 mb-4">
                                Component: {this.props.componentName}
                            </p>
                        )}

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                            >
                                Thử lại
                            </button>

                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium"
                            >
                                Tải lại trang
                            </button>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                            <details className="mt-4 text-left">
                                <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                                    Chi tiết lỗi (Dev only)
                                </summary>
                                <pre className="mt-2 p-2 bg-gray-900 text-green-400 text-xs rounded overflow-auto max-h-40">
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
