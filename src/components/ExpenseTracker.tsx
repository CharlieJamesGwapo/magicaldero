'use client';

import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { Plus, Trash2, Download, TrendingUp, Edit2, Save, X, FileText } from 'lucide-react';

interface ExpenseRecord {
  id: string;
  date: string;
  capital: number;
  factoryExpenses: number;
  personalExpenses: number;
  loans: number;
  rejects: number;
  production: number;
  netIncome: number;
  totalCapitalRemaining: number;
}

export default function ExpenseTracker() {
  const [records, setRecords] = useState<ExpenseRecord[]>([]);
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    capital: 0,
    factoryExpenses: 0,
    personalExpenses: 0,
    loans: 0,
    rejects: 0,
    production: 0,
  });

  const calculateNetIncome = (
    production: number,
    factoryExpenses: number,
    personalExpenses: number,
    loans: number,
    rejects: number
  ) => {
    return production - (factoryExpenses + personalExpenses + loans + rejects);
  };

  const calculateTotalCapitalRemaining = (capital: number, production: number, totalExpenses: number) => {
    return capital + production - totalExpenses;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: field === 'date' ? value : parseFloat(value) || 0,
    });
  };

  const handleAddRecord = () => {
    const totalExpenses = formData.factoryExpenses + formData.personalExpenses + formData.loans + formData.rejects;
    
    const netIncome = calculateNetIncome(
      formData.production,
      formData.factoryExpenses,
      formData.personalExpenses,
      formData.loans,
      formData.rejects
    );

    const totalCapitalRemaining = calculateTotalCapitalRemaining(
      formData.capital,
      formData.production,
      totalExpenses
    );

    if (editingId) {
      setRecords(
        records.map((r) =>
          r.id === editingId
            ? {
                ...formData,
                id: editingId,
                netIncome,
                totalCapitalRemaining,
              }
            : r
        )
      );
      setEditingId(null);
    } else {
      const newRecord: ExpenseRecord = {
        id: Date.now().toString(),
        ...formData,
        netIncome,
        totalCapitalRemaining,
      };

      setRecords([...records, newRecord]);
    }

    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      capital: 0,
      factoryExpenses: 0,
      personalExpenses: 0,
      loans: 0,
      rejects: 0,
      production: 0,
    });
  };

  const handleEditRecord = (record: ExpenseRecord) => {
    setFormData({
      date: record.date,
      capital: record.capital,
      factoryExpenses: record.factoryExpenses,
      personalExpenses: record.personalExpenses,
      loans: record.loans,
      rejects: record.rejects,
      production: record.production,
    });
    setEditingId(record.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      capital: 0,
      factoryExpenses: 0,
      personalExpenses: 0,
      loans: 0,
      rejects: 0,
      production: 0,
    });
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter(record => record.id !== id));
    setDeleteConfirm(null);
  };

  const downloadCSV = () => {
    const headers = ['Date', 'Capital', 'Factory Expenses', 'Personal Expenses', 'Loans', 'Rejects', 'Production', 'Net Income', 'Total Capital Remaining'];
    const rows = records.map(r => [
      r.date,
      r.capital,
      r.factoryExpenses,
      r.personalExpenses,
      r.loans,
      r.rejects,
      r.production,
      r.netIncome,
      r.totalCapitalRemaining,
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MAGICALDERO_ExpenseTracker_${format(new Date(), 'yyyy-MM-dd_HHmmss')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadExcel = () => {
    const html = `
      <html xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h2 { color: #C41E3A; margin-top: 20px; }
            h3 { color: #333; margin-top: 15px; margin-bottom: 10px; }
            p { margin: 5px 0; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
            th, td { border: 1px solid #999; padding: 10px; text-align: left; }
            th { background-color: #C41E3A; color: white; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .total { background-color: #fff2cc; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1 style="color: #C41E3A;">MAGICALDERO</h1>
          <p><strong>Expense & Income Tracker</strong></p>
          <p>Generated: ${format(new Date(), 'MMMM dd, yyyy HH:mm:ss')}</p>
          <p>Owner: <strong>BILL JOHN BUENAFLOR</strong></p>
          <p>Contact: Magicaldero888@gmail.com | 0922-892-2458 | Purok 5 brgy. Tawan-Tawan Mlang, North Cotabato</p>
          
          <h3>Detailed Records</h3>
          <table>
            <tr>
              <th>Date</th>
              <th>Capital</th>
              <th>Factory Exp</th>
              <th>Personal Exp</th>
              <th>Loans</th>
              <th>Rejects</th>
              <th>Production</th>
              <th>Net Income</th>
              <th>Capital Remaining</th>
            </tr>
            ${records.map(r => `
              <tr>
                <td>${r.date}</td>
                <td>₱${r.capital.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                <td>₱${r.factoryExpenses.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                <td>₱${r.personalExpenses.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                <td>₱${r.loans.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                <td>₱${r.rejects.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                <td>₱${r.production.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                <td style="color: green; font-weight: bold;">₱${r.netIncome.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                <td style="color: #C41E3A; font-weight: bold;">₱${r.totalCapitalRemaining.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
              </tr>
            `).join('')}
          </table>
          
          <h3>Summary</h3>
          <table>
            <tr class="total">
              <td><strong>Total Capital</strong></td>
              <td><strong>₱${totals.totalCapital.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</strong></td>
            </tr>
            <tr class="total">
              <td><strong>Total Production (Gross)</strong></td>
              <td><strong>₱${totals.totalProduction.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</strong></td>
            </tr>
            <tr class="total">
              <td><strong>Total Expenses</strong></td>
              <td><strong>₱${(totals.totalFactoryExpenses + totals.totalPersonalExpenses + totals.totalLoans + totals.totalRejects).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</strong></td>
            </tr>
            <tr class="total">
              <td><strong>Total Net Income</strong></td>
              <td><strong>₱${totals.totalNetIncome.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</strong></td>
            </tr>
            <tr style="background-color: #e2efda;">
              <td><strong>Final Capital Remaining</strong></td>
              <td><strong style="color: #C41E3A;">₱${totals.totalCapitalRemaining.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</strong></td>
            </tr>
          </table>
        </body>
      </html>
    `;
    
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MAGICALDERO_ExpenseTracker_${format(new Date(), 'yyyy-MM-dd_HHmmss')}.xls`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const summaryData = useMemo(() => {
    if (records.length === 0) return [];

    if (viewMode === 'daily') {
      const grouped = records.reduce((acc, record) => {
        const existing = acc.find(item => item.date === record.date);
        if (existing) {
          existing.netIncome += record.netIncome;
          existing.totalCapitalRemaining = record.totalCapitalRemaining;
          existing.production += record.production;
          existing.totalExpenses =
            (existing.totalExpenses || 0) +
            record.factoryExpenses +
            record.personalExpenses +
            record.loans +
            record.rejects;
        } else {
          acc.push({
            date: record.date,
            netIncome: record.netIncome,
            totalCapitalRemaining: record.totalCapitalRemaining,
            production: record.production,
            totalExpenses:
              record.factoryExpenses +
              record.personalExpenses +
              record.loans +
              record.rejects,
          });
        }
        return acc;
      }, [] as any[]);
      return grouped.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else {
      const grouped = records.reduce((acc, record) => {
        const monthKey = format(new Date(record.date), 'yyyy-MM');
        const existing = acc.find(item => item.month === monthKey);
        if (existing) {
          existing.netIncome += record.netIncome;
          existing.totalCapitalRemaining = record.totalCapitalRemaining;
          existing.production += record.production;
          existing.totalExpenses =
            (existing.totalExpenses || 0) +
            record.factoryExpenses +
            record.personalExpenses +
            record.loans +
            record.rejects;
        } else {
          acc.push({
            month: monthKey,
            date: monthKey,
            netIncome: record.netIncome,
            totalCapitalRemaining: record.totalCapitalRemaining,
            production: record.production,
            totalExpenses:
              record.factoryExpenses +
              record.personalExpenses +
              record.loans +
              record.rejects,
          });
        }
        return acc;
      }, [] as any[]);
      return grouped.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
  }, [records, viewMode]);

  const totals = useMemo(() => {
    return {
      totalCapital: records.reduce((sum, r) => sum + r.capital, 0),
      totalFactoryExpenses: records.reduce((sum, r) => sum + r.factoryExpenses, 0),
      totalPersonalExpenses: records.reduce((sum, r) => sum + r.personalExpenses, 0),
      totalLoans: records.reduce((sum, r) => sum + r.loans, 0),
      totalRejects: records.reduce((sum, r) => sum + r.rejects, 0),
      totalProduction: records.reduce((sum, r) => sum + r.production, 0),
      totalNetIncome: records.reduce((sum, r) => sum + r.netIncome, 0),
      totalCapitalRemaining: records.length > 0 ? records[records.length - 1].totalCapitalRemaining : 0,
    };
  }, [records]);

  const expenseBreakdown = [
    { name: 'Factory Expenses', value: totals.totalFactoryExpenses, fill: '#ef4444' },
    { name: 'Personal Expenses', value: totals.totalPersonalExpenses, fill: '#f59e0b' },
    { name: 'Loans', value: totals.totalLoans, fill: '#8b5cf6' },
    { name: 'Rejects', value: totals.totalRejects, fill: '#6366f1' },
  ];

  const COLORS = ['#ef4444', '#f59e0b', '#8b5cf6', '#6366f1'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-red-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full blur-lg opacity-50"></div>
                <div className="relative w-24 h-24 bg-white rounded-full p-2 flex-shrink-0 shadow-2xl ring-4 ring-yellow-300 hover:ring-yellow-200 transition-all duration-300 transform hover:scale-105">
                  <img 
                    src="/cal.jpg" 
                    alt="Magicaldero Logo" 
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent drop-shadow-lg">MAGICALDERO</h1>
                <p className="text-red-100 text-sm md:text-base font-semibold tracking-wide">Premium Expense & Income Tracker</p>
                <p className="text-red-100 text-xs md:text-sm opacity-90">Professional Business Finance Management</p>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="text-yellow-300 opacity-80 animate-bounce">
                <TrendingUp size={56} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 py-8 flex-grow">
        {/* Input Form */}
        <div className={`bg-white rounded-xl shadow-xl p-6 md:p-8 mb-8 border-2 transition-all ${editingId ? 'border-yellow-400 ring-2 ring-yellow-200' : 'border-red-100'}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
              {editingId ? (
                <>
                  <Edit2 size={28} className="text-yellow-500" />
                  Edit Record
                </>
              ) : (
                <>
                  <Plus size={28} className="text-red-600" />
                  Add New Record
                </>
              )}
            </h2>
            {editingId && (
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-red-600 transition p-2 rounded-lg hover:bg-red-50"
                title="Cancel edit"
              >
                <X size={24} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date <span className="text-red-600">*</span></label>
              <input type="date" value={formData.date} onChange={(e) => handleInputChange('date', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition hover:border-red-300" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Capital <span className="text-red-600">*</span></label>
              <input type="number" value={formData.capital || ''} onChange={(e) => handleInputChange('capital', e.target.value)} placeholder="0.00" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition hover:border-red-300" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Production <span className="text-red-600">*</span></label>
              <input type="number" value={formData.production || ''} onChange={(e) => handleInputChange('production', e.target.value)} placeholder="0.00" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition hover:border-red-300" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Factory Expenses <span className="text-red-600">*</span></label>
              <input type="number" value={formData.factoryExpenses || ''} onChange={(e) => handleInputChange('factoryExpenses', e.target.value)} placeholder="0.00" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition hover:border-red-300" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Personal Expenses <span className="text-red-600">*</span></label>
              <input type="number" value={formData.personalExpenses || ''} onChange={(e) => handleInputChange('personalExpenses', e.target.value)} placeholder="0.00" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition hover:border-red-300" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Loans <span className="text-red-600">*</span></label>
              <input type="number" value={formData.loans || ''} onChange={(e) => handleInputChange('loans', e.target.value)} placeholder="0.00" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition hover:border-red-300" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Rejects <span className="text-red-600">*</span></label>
              <input type="number" value={formData.rejects || ''} onChange={(e) => handleInputChange('rejects', e.target.value)} placeholder="0.00" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition hover:border-red-300" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <button onClick={handleAddRecord} className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 rounded-lg transition transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
              {editingId ? (<><Save size={20} />Update Record</>) : (<><Plus size={20} />Add Record</>)}
            </button>
            {editingId && (
              <button onClick={handleCancelEdit} className="w-full bg-gray-400 hover:bg-gray-500 text-white font-bold py-4 rounded-lg transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                <X size={20} />Cancel Edit
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        {records.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <p className="text-blue-600 text-sm font-bold uppercase tracking-wide">Total Capital</p>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
              <p className="text-3xl md:text-4xl font-black text-blue-700">₱{totals.totalCapital.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
              <p className="text-blue-500 text-xs mt-3 font-semibold">Starting Capital</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 via-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <p className="text-green-600 text-sm font-bold uppercase tracking-wide">Total Production</p>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
              </div>
              <p className="text-3xl md:text-4xl font-black text-green-700">₱{totals.totalProduction.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
              <p className="text-green-500 text-xs mt-3 font-semibold">Gross Income</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 via-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <p className="text-red-600 text-sm font-bold uppercase tracking-wide">Total Expenses</p>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💸</span>
                </div>
              </div>
              <p className="text-3xl md:text-4xl font-black text-red-700">₱{(totals.totalFactoryExpenses + totals.totalPersonalExpenses + totals.totalLoans + totals.totalRejects).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
              <p className="text-red-500 text-xs mt-3 font-semibold">All Deductions</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 border-2 border-orange-300 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <p className="text-orange-600 text-sm font-bold uppercase tracking-wide">Capital Remaining</p>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
              </div>
              <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">₱{totals.totalCapitalRemaining.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
              <p className="text-orange-500 text-xs mt-3 font-semibold">Actual Cash on Hand</p>
            </div>
          </div>
        )}

        {/* Charts Section */}
        {records.length > 0 && (
          <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 mb-8 border border-red-100">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-red-100 to-red-50 rounded-lg">
                    <TrendingUp className="text-red-600" size={28} />
                  </div>
                  Analytics & Insights
                </h2>
                <p className="text-gray-500 text-sm md:text-base mt-2">Visual representation of your financial data</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <select value={viewMode} onChange={(e) => setViewMode(e.target.value as 'daily' | 'monthly')} className="px-4 py-2 border-2 border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 hover:border-red-300 transition font-medium">
                  <option value="daily">📅 Daily View</option>
                  <option value="monthly">📆 Monthly View</option>
                </select>
                <select value={chartType} onChange={(e) => setChartType(e.target.value as 'line' | 'bar' | 'pie')} className="px-4 py-2 border-2 border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 hover:border-red-300 transition font-medium">
                  <option value="line">📈 Line Chart</option>
                  <option value="bar">📊 Bar Chart</option>
                  <option value="pie">🥧 Pie Chart</option>
                </select>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 w-full h-96 md:h-[550px]">
              {chartType === 'line' && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={summaryData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      formatter={(value) => `₱${(value as number).toLocaleString('en-PH')}`}
                      contentStyle={{ backgroundColor: '#fff', border: '2px solid #dc2626', borderRadius: '8px' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Line type="monotone" dataKey="production" stroke="#22c55e" strokeWidth={3} dot={{ fill: '#22c55e', r: 4 }} activeDot={{ r: 6 }} name="Production (Gross)" />
                    <Line type="monotone" dataKey="totalExpenses" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', r: 4 }} activeDot={{ r: 6 }} name="Total Expenses" />
                    <Line type="monotone" dataKey="netIncome" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} name="Net Income" />
                  </LineChart>
                </ResponsiveContainer>
              )}
              {chartType === 'bar' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summaryData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="barProduction" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e"/>
                        <stop offset="100%" stopColor="#16a34a"/>
                      </linearGradient>
                      <linearGradient id="barExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444"/>
                        <stop offset="100%" stopColor="#dc2626"/>
                      </linearGradient>
                      <linearGradient id="barIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6"/>
                        <stop offset="100%" stopColor="#1d4ed8"/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      formatter={(value) => `₱${(value as number).toLocaleString('en-PH')}`}
                      contentStyle={{ backgroundColor: '#fff', border: '2px solid #dc2626', borderRadius: '8px' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="production" fill="url(#barProduction)" name="Production (Gross)" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="totalExpenses" fill="url(#barExpenses)" name="Total Expenses" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="netIncome" fill="url(#barIncome)" name="Net Income" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
              {chartType === 'pie' && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={expenseBreakdown.filter(item => item.value > 0)} 
                      cx="50%" 
                      cy="50%" 
                      labelLine={true} 
                      label={({ name, value }) => `${name}: ₱${(value as number).toLocaleString('en-PH')}`} 
                      outerRadius={140}
                      innerRadius={60}
                      fill="#8884d8" 
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={800}
                    >
                      {expenseBreakdown.map((_, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                    </Pie>
                    <Tooltip formatter={(value) => `₱${(value as number).toLocaleString('en-PH')}`} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}

        {/* Data Table */}
        {records.length > 0 && (
          <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 border border-red-100">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">📋 Detailed Records</h2>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button onClick={downloadCSV} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition hover:shadow-lg">
                  <Download size={18} />CSV
                </button>
                <button onClick={downloadExcel} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition hover:shadow-lg">
                  <FileText size={18} />Excel
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <thead className="bg-gradient-to-r from-red-50 to-red-100 border-b-2 border-red-200 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Capital</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Production</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Factory Exp</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Personal Exp</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Loans</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Rejects</th>
                    <th className="px-4 py-3 text-right font-semibold text-green-600">Net Income</th>
                    <th className="px-4 py-3 text-right font-semibold text-orange-600">Capital Remaining</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <tr key={record.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-red-50 transition border-b border-gray-200`}>
                      <td className="px-4 py-3 text-gray-800 font-medium">{record.date}</td>
                      <td className="px-4 py-3 text-right text-gray-800">₱{record.capital.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3 text-right text-gray-800">₱{record.production.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3 text-right text-gray-800">₱{record.factoryExpenses.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3 text-right text-gray-800">₱{record.personalExpenses.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3 text-right text-gray-800">₱{record.loans.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3 text-right text-gray-800">₱{record.rejects.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3 text-right text-green-600 font-bold">₱{record.netIncome.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3 text-right text-orange-600 font-bold">₱{record.totalCapitalRemaining.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleEditRecord(record)} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition hover:shadow-lg" title="Edit"><Edit2 size={16} /></button>
                          <button onClick={() => setDeleteConfirm(record.id)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition hover:shadow-lg" title="Delete"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {records.length === 0 && (
          <div className="bg-white rounded-xl shadow-xl p-12 text-center border border-red-100">
            <TrendingUp size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl md:text-3xl font-bold text-gray-400 mb-2">No Records Yet</h3>
            <p className="text-gray-400 text-lg">Add your first expense record to get started tracking your finances!</p>
          </div>
        )}

        {/* Formula Reference */}
        <div className="bg-red-50 border-l-4 border-red-600 rounded-lg p-6 md:p-8 mt-8 mb-8 shadow-lg">
          <h3 className="text-lg md:text-xl font-bold text-red-900 mb-4">📐 Formula Reference</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="font-semibold text-red-900 mb-2">Net Income Formula:</p>
              <code className="bg-white px-4 py-3 rounded border border-red-200 block text-sm font-mono text-gray-800 break-words">Production - (Factory Exp + Personal Exp + Loans + Rejects)</code>
            </div>
            <div>
              <p className="font-semibold text-red-900 mb-2">Capital Remaining Formula:</p>
              <code className="bg-white px-4 py-3 rounded border border-red-200 block text-sm font-mono text-gray-800 break-words">Capital + Production - Expenses</code>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🗑️ Delete Record?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this record? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDeleteRecord(deleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-red-800 via-red-700 to-red-900 text-white mt-16 border-t-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-white rounded-lg p-2 shadow-lg">
                  <img src="/cal.jpg" alt="Logo" className="w-full h-full object-contain rounded" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-yellow-300">MAGICALDERO</h3>
                  <p className="text-red-100 text-sm">Professional Finance Tracking</p>
                </div>
              </div>
              <p className="text-red-100 leading-relaxed">Empowering businesses with accurate, automated financial management and real-time insights.</p>
            </div>

            {/* Owner Info */}
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-yellow-300 flex items-center gap-2">
                <div className="w-1 h-6 bg-yellow-400 rounded-full"></div>
                Owner & CEO
              </h4>
              <div className="space-y-3 text-red-50">
                <div className="flex items-center gap-3 hover:text-yellow-300 transition">
                  <span className="text-xl">👤</span>
                  <div>
                    <p className="font-semibold">Bill John Buenaflor</p>
                    <p className="text-xs text-red-200">MAGICALDERO Founder</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 hover:text-yellow-300 transition">
                  <span className="text-xl">📧</span>
                  <a href="mailto:Magicaldero888@gmail.com" className="hover:underline">Magicaldero888@gmail.com</a>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-yellow-300 flex items-center gap-2">
                <div className="w-1 h-6 bg-yellow-400 rounded-full"></div>
                Contact Info
              </h4>
              <div className="space-y-3 text-red-50">
                <div className="flex items-start gap-3 hover:text-yellow-300 transition">
                  <span className="text-xl">📍</span>
                  <p className="text-sm">Purok 5 brgy. Tawan-Tawan Mlang, North Cotabato, Philippines</p>
                </div>
                <div className="flex items-center gap-3 hover:text-yellow-300 transition">
                  <span className="text-xl">📱</span>
                  <div className="flex flex-col gap-1">
                    <a href="tel:09228922458" className="hover:underline">0922-892-2458</a>
                    <a href="tel:09209318456" className="hover:underline">0920-931-8456</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-red-600/50 my-8"></div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-yellow-300 font-semibold mb-2">Quality • Trust • Excellence</p>
              <p className="text-red-100 text-sm">© 2024 MAGICALDERO | Quality Products & Professional Service</p>
              <p className="text-red-100/70 text-xs mt-1">Automated Expense & Income Tracking | Accurate Calculations</p>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-red-400/20 hover:border-red-400/50 transition">
                <p className="text-yellow-300 font-bold text-lg">⭐ Premium Service Provider</p>
                <p className="text-red-100 text-xs mt-1">Trusted by Business Owners & Entrepreneurs</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
