"use client";

import React from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen bg-[#f6f2ee] flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} className="text-red-400" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Something went wrong</h2>
            <p className="text-sm text-slate-500 mb-5 leading-relaxed">
              An unexpected error occurred. Try refreshing the page.
            </p>
            <Link href="/home"
              className="px-5 py-2 bg-[#050505] text-white text-sm font-bold rounded-xl hover:bg-neutral-800 transition-colors inline-block">
              Back to Home
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
