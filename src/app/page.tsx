import React from 'react';
import ExpenseTracker from '@/components/ExpenseTracker';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <ExpenseTracker />
    </main>
  );
}
