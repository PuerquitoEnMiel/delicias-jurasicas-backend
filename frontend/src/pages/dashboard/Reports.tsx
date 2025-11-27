import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '@/api/reports';
import { BarChart3, Package, TrendingUp, DollarSign, Calendar, FileSpreadsheet, FileText } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { format, subDays } from 'date-fns';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Reports() {
    const [activeTab, setActiveTab] = useState<'sales' | 'inventory'>('sales');
    const [dateRange, setDateRange] = useState({
        start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
        end: format(new Date(), 'yyyy-MM-dd'),
    });

    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: reportsApi.getDashboardStats,
    });

    const { data: salesReport, isLoading: salesLoading } = useQuery({
        queryKey: ['sales-report', dateRange],
        queryFn: () => reportsApi.getSalesReport(dateRange.start, dateRange.end),
        enabled: activeTab === 'sales',
    });

    const { data: inventoryReport, isLoading: inventoryLoading } = useQuery({
        queryKey: ['inventory-report'],
        queryFn: reportsApi.getInventoryReport,
        enabled: activeTab === 'inventory',
    });

    // Export to Excel - Sales
    const exportSalesToExcel = () => {
        if (!salesReport) return;
        const wb = XLSX.utils.book_new();
        const salesByDay = salesReport.salesByDay.map(item => ({ Fecha: item.date, Total: item.total }));
        const ws1 = XLSX.utils.json_to_sheet(salesByDay);
        XLSX.utils.book_append_sheet(wb, ws1, "Ventas por Día");
        const salesByProduct = salesReport.salesByProduct.map(item => ({ Producto: item.name, Cantidad: item.quantity }));
        const ws2 = XLSX.utils.json_to_sheet(salesByProduct);
        XLSX.utils.book_append_sheet(wb, ws2, "Productos");
        XLSX.writeFile(wb, `Reporte_Ventas_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    };

    // Export to PDF - Sales
    const exportSalesToPDF = () => {
        if (!salesReport) return;
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Reporte de Ventas', 14, 22);
        doc.setFontSize(10);
        doc.text(`Período: ${dateRange.start} a ${dateRange.end}`, 14, 30);
        doc.text(`Generado: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 36);
        autoTable(doc, {
            startY: 45,
            head: [['Fecha', 'Total']],
            body: salesReport.salesByDay.map(item => [item.date, `$${item.total.toFixed(2)}`]),
            theme: 'grid',
            headStyles: { fillColor: [172, 235, 141] }
        });
        const yPos = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(12);
        doc.text('Productos Más Vendidos', 14, yPos);
        autoTable(doc, {
            startY: yPos + 5,
            head: [['Producto', 'Cantidad']],
            body: salesReport.salesByProduct.map(item => [item.name, item.quantity.toString()]),
            theme: 'grid',
            headStyles: { fillColor: [172, 235, 141] }
        });
        doc.save(`Reporte_Ventas_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    };

    // Export to Excel - Inventory
    const exportInventoryToExcel = () => {
        if (!inventoryReport) return;
        const wb = XLSX.utils.book_new();
        const stockByCategory = inventoryReport.stockByCategory.map(item => ({ Categoría: item.name, Stock: item.count }));
        const ws1 = XLSX.utils.json_to_sheet(stockByCategory);
        XLSX.utils.book_append_sheet(wb, ws1, "Por Categoría");
        const lowStock = inventoryReport.lowStockItems.map(item => ({ Producto: item.name, Stock: item.stock, Mínimo: item.minStock }));
        const ws2 = XLSX.utils.json_to_sheet(lowStock);
        XLSX.utils.book_append_sheet(wb, ws2, "Stock Bajo");
        XLSX.writeFile(wb, `Reporte_Inventario_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    };

    // Export to PDF - Inventory  
    const exportInventoryToPDF = () => {
        if (!inventoryReport) return;
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Reporte de Inventario', 14, 22);
        doc.setFontSize(10);
        doc.text(`Generado: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 30);
        doc.setFontSize(12);
        doc.text(`Valor Total: $${inventoryReport.totalValue.toFixed(2)}`, 14, 40);
        autoTable(doc, {
            startY: 50,
            head: [['Categoría', 'Stock']],
            body: inventoryReport.stockByCategory.map(item => [item.name, item.count.toString()]),
            theme: 'grid',
            headStyles: { fillColor: [172, 235, 141] }
        });
        const yPos = (doc as any).lastAutoTable.finalY + 15;
        doc.setTextColor(220, 38, 38);
        doc.text('Productos con Stock Bajo', 14, yPos);
        doc.setTextColor(0, 0, 0);
        autoTable(doc, {
            startY: yPos + 5,
            head: [['Producto', 'Stock', 'Mínimo']],
            body: inventoryReport.lowStockItems.map(item => [item.name, item.stock.toString(), item.minStock.toString()]),
            theme: 'grid',
            headStyles: { fillColor: [254, 202, 202] }
        });
        doc.save(`Reporte_Inventario_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    };

    if (statsLoading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-8 h-8 text-primary" />
                Reportes y Estadísticas
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Ventas Hoy</p>
                            <p className="text-2xl font-bold text-gray-900">${stats?.todaySales.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Pedidos Hoy</p>
                            <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Productos Activos</p>
                            <p className="text-2xl font-bold text-gray-900">{stats?.activeProducts}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Stock Bajo</p>
                            <p className="text-2xl font-bold text-gray-900">{stats?.lowStockCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex gap-6">
                    <button
                        onClick={() => setActiveTab('sales')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'sales'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Reporte de Ventas
                    </button>
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'inventory'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Reporte de Inventario
                    </button>
                </nav>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {activeTab === 'sales' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <input
                                    type="date"
                                    className="input py-1 focus:ring-2 focus:ring-verde-500 focus:border-verde-500 transition-all"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                />
                                <span className="text-gray-400">a</span>
                                <input
                                    type="date"
                                    className="input py-1 focus:ring-2 focus:ring-verde-500 focus:border-verde-500 transition-all"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={exportSalesToExcel}
                                    className="btn btn-secondary flex items-center gap-2"
                                    disabled={!salesReport || salesLoading}
                                >
                                    <FileSpreadsheet className="w-4 h-4" />
                                    Excel
                                </button>
                                <button
                                    onClick={exportSalesToPDF}
                                    className="btn btn-secondary flex items-center gap-2"
                                    disabled={!salesReport || salesLoading}
                                >
                                    <FileText className="w-4 h-4" />
                                    PDF
                                </button>
                            </div>
                        </div>

                        {salesLoading ? <LoadingSpinner /> : (
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-bold mb-4">Ventas por Día</h3>
                                    <div className="overflow-x-auto">
                                        <table className="table w-full">
                                            <thead>
                                                <tr>
                                                    <th className="text-left">Fecha</th>
                                                    <th className="text-right">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {salesReport?.salesByDay.map((item) => (
                                                    <tr key={item.date}>
                                                        <td>{item.date}</td>
                                                        <td className="text-right font-mono">${item.total.toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                                {salesReport?.salesByDay.length === 0 && (
                                                    <tr><td colSpan={2} className="text-center py-4 text-gray-500">No hay datos</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-4">Top Productos Vendidos</h3>
                                    <div className="overflow-x-auto">
                                        <table className="table w-full">
                                            <thead>
                                                <tr>
                                                    <th className="text-left">Producto</th>
                                                    <th className="text-right">Cantidad</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {salesReport?.salesByProduct.map((item) => (
                                                    <tr key={item.name}>
                                                        <td>{item.name}</td>
                                                        <td className="text-right font-mono">{item.quantity}</td>
                                                    </tr>
                                                ))}
                                                {salesReport?.salesByProduct.length === 0 && (
                                                    <tr><td colSpan={2} className="text-center py-4 text-gray-500">No hay datos</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'inventory' && (
                    <div className="space-y-6">
                        <div className="flex justify-end gap-2 mb-6">
                            <button
                                onClick={exportInventoryToExcel}
                                className="btn btn-secondary flex items-center gap-2"
                                disabled={!inventoryReport || inventoryLoading}
                            >
                                <FileSpreadsheet className="w-4 h-4" />
                                Excel
                            </button>
                            <button
                                onClick={exportInventoryToPDF}
                                className="btn btn-secondary flex items-center gap-2"
                                disabled={!inventoryReport || inventoryLoading}
                            >
                                <FileText className="w-4 h-4" />
                                PDF
                            </button>
                        </div>
                        {inventoryLoading ? <LoadingSpinner /> : (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-500">Valor Total Inventario</p>
                                        <p className="text-2xl font-bold text-gray-900">${inventoryReport?.totalValue.toFixed(2)}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-500">Total Productos</p>
                                        <p className="text-2xl font-bold text-gray-900">{inventoryReport?.totalProducts}</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-lg font-bold mb-4">Stock por Categoría</h3>
                                        <table className="table w-full">
                                            <thead>
                                                <tr>
                                                    <th className="text-left">Categoría</th>
                                                    <th className="text-right">Stock Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {inventoryReport?.stockByCategory.map((item) => (
                                                    <tr key={item.name}>
                                                        <td>{item.name}</td>
                                                        <td className="text-right font-mono">{item.count}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-4 text-red-600">Productos con Stock Bajo</h3>
                                        <table className="table w-full">
                                            <thead>
                                                <tr>
                                                    <th className="text-left">Producto</th>
                                                    <th className="text-right">Stock</th>
                                                    <th className="text-right">Mínimo</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {inventoryReport?.lowStockItems.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>{item.name}</td>
                                                        <td className="text-right font-mono font-bold text-red-600">{item.stock}</td>
                                                        <td className="text-right font-mono text-gray-500">{item.minStock}</td>
                                                    </tr>
                                                ))}
                                                {inventoryReport?.lowStockItems.length === 0 && (
                                                    <tr><td colSpan={3} className="text-center py-4 text-gray-500">Todo en orden</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
