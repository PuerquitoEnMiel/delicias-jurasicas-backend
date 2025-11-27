import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { cashBoxApi } from '@/api/cash-box';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { format } from 'date-fns';
import { Archive } from 'lucide-react';

export default function CashBox() {
    const [openingAmount, setOpeningAmount] = useState('');
    const [boxNumber, setBoxNumber] = useState('CAJA-01');
    const [closingAmount, setClosingAmount] = useState('');
    const [transactionType, setTransactionType] = useState('DEPOSIT');
    const [transactionAmount, setTransactionAmount] = useState('');
    const [transactionDesc, setTransactionDesc] = useState('');

    const { data: activeBox, isLoading: loadingActive, refetch: refetchActive } = useQuery({
        queryKey: ['active-cash-box'],
        queryFn: cashBoxApi.getActive,
    });

    const { data: history, isLoading: loadingHistory, refetch: refetchHistory } = useQuery({
        queryKey: ['cash-box-history'],
        queryFn: cashBoxApi.getHistory,
    });

    const openMutation = useMutation({
        mutationFn: cashBoxApi.open,
        onSuccess: () => {
            alert('Caja abierta exitosamente');
            refetchActive();
        },
        onError: (err: any) => alert(err.response?.data?.message || 'Error al abrir caja'),
    });

    const closeMutation = useMutation({
        mutationFn: cashBoxApi.close,
        onSuccess: () => {
            alert('Caja cerrada exitosamente');
            refetchActive();
            refetchHistory();
        },
        onError: (err: any) => alert(err.response?.data?.message || 'Error al cerrar caja'),
    });

    const transactionMutation = useMutation({
        mutationFn: cashBoxApi.addTransaction,
        onSuccess: () => {
            alert('Movimiento registrado');
            refetchActive();
            setTransactionAmount('');
            setTransactionDesc('');
        },
    });

    if (loadingActive || loadingHistory) return <LoadingSpinner />;

    const calculateTotals = () => {
        if (!activeBox) return { expected: 0, sales: 0, transactions: 0 };
        const sales = activeBox.orders?.reduce((sum: number, o: any) => sum + o.total, 0) || 0;
        const transactions = activeBox.transactions?.reduce((sum: number, t: any) => {
            return t.type === 'DEPOSIT' ? sum + t.amount : sum - t.amount;
        }, 0) || 0;
        return {
            sales,
            transactions,
            expected: activeBox.openingAmount + sales + transactions
        };
    };

    const totals = calculateTotals();

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Control de Caja</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Cash Box / Open Form */}
                <div className="card">
                    <h2 className="text-xl font-semibold mb-4">
                        {activeBox ? `Caja Abierta: ${activeBox.boxNumber}` : 'Abrir Nueva Caja'}
                    </h2>

                    {!activeBox ? (
                        <div className="space-y-4">
                            {/* Suggested Amount from last closing */}
                            {history && history.length > 0 && history[0].finalAmount > 0 && (
                                <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-verde-50 border-l-4 border-verde-500 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 mb-1">💡 Monto Sugerido</p>
                                            <p className="text-sm text-gray-600 mb-2">
                                                La caja <span className="font-mono font-bold">{history[0].boxNumber}</span> cerró con:
                                            </p>
                                            <p className="text-2xl font-bold text-verde-600">
                                                ${history[0].finalAmount.toFixed(2)}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => setOpeningAmount(history[0].finalAmount.toString())}
                                                className="mt-2 text-sm text-verde-700 hover:text-verde-900 underline font-medium"
                                            >
                                                → Usar este monto
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="form-label">Monto Inicial</label>
                                <input
                                    type="number"
                                    className="form-input focus:ring-2 focus:ring-verde-500 focus:border-verde-500 transition-all"
                                    value={openingAmount}
                                    onChange={(e) => setOpeningAmount(e.target.value)}
                                    placeholder={history && history.length > 0 ? `Ej: ${history[0].finalAmount.toFixed(2)}` : "0.00"}
                                    step="0.01"
                                />
                            </div>
                            <div>
                                <label className="form-label">Número de Caja</label>
                                <input
                                    type="text"
                                    className="form-input focus:ring-2 focus:ring-verde-500 focus:border-verde-500 transition-all"
                                    value={boxNumber}
                                    onChange={(e) => setBoxNumber(e.target.value)}
                                />
                            </div>
                            <button
                                className="btn btn-primary w-full"
                                onClick={() => openMutation.mutate({ openingAmount: +openingAmount, boxNumber })}
                                disabled={!openingAmount}
                            >
                                Abrir Caja
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-600">Fondo Inicial</p>
                                    <p className="text-xl font-bold text-blue-900">${activeBox.openingAmount.toFixed(2)}</p>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <p className="text-sm text-green-600">Ventas (POS/Online)</p>
                                    <p className="text-xl font-bold text-green-900">${totals.sales.toFixed(2)}</p>
                                </div>
                                <div className="p-3 bg-purple-50 rounded-lg">
                                    <p className="text-sm text-purple-600">Movimientos</p>
                                    <p className="text-xl font-bold text-purple-900">${totals.transactions.toFixed(2)}</p>
                                </div>
                                <div className="p-3 bg-gray-100 rounded-lg">
                                    <p className="text-sm text-gray-600">Total Esperado</p>
                                    <p className="text-xl font-bold text-gray-900">${totals.expected.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-3">Registrar Movimiento</h3>
                                <div className="flex gap-2 mb-2">
                                    <select
                                        className="form-select w-1/3"
                                        value={transactionType}
                                        onChange={(e) => setTransactionType(e.target.value)}
                                    >
                                        <option value="DEPOSIT">Entrada</option>
                                        <option value="WITHDRAWAL">Salida</option>
                                    </select>
                                    <input
                                        type="number"
                                        className="form-input w-1/3"
                                        placeholder="Monto"
                                        value={transactionAmount}
                                        onChange={(e) => setTransactionAmount(e.target.value)}
                                    />
                                    <button
                                        className="btn btn-secondary w-1/3"
                                        onClick={() => transactionMutation.mutate({
                                            cashBoxId: activeBox.id,
                                            type: transactionType,
                                            amount: +transactionAmount,
                                            description: transactionDesc || 'Movimiento manual'
                                        })}
                                        disabled={!transactionAmount}
                                    >
                                        Registrar
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    className="form-input w-full"
                                    placeholder="Descripción (opcional)"
                                    value={transactionDesc}
                                    onChange={(e) => setTransactionDesc(e.target.value)}
                                />
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-3 text-red-600">Cerrar Caja</h3>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label className="text-xs text-gray-500">Monto Real en Caja</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            placeholder="0.00"
                                            value={closingAmount}
                                            onChange={(e) => setClosingAmount(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        className="btn btn-danger self-end"
                                        onClick={() => closeMutation.mutate({ cashBoxId: activeBox.id, actualAmount: +closingAmount })}
                                        disabled={!closingAmount}
                                    >
                                        Cerrar Turno
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* History */}
                <div className="card">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Archive className="w-5 h-5" />
                        Historial de Cierres
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="table w-full text-sm">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Caja</th>
                                    <th>Esperado</th>
                                    <th>Real</th>
                                    <th>Dif.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history?.map((box: any) => (
                                    <tr key={box.id}>
                                        <td>{format(new Date(box.closedAt), 'dd/MM HH:mm')}</td>
                                        <td>{box.boxNumber}</td>
                                        <td>${box.expectedAmount?.toFixed(2)}</td>
                                        <td>${box.actualAmount?.toFixed(2)}</td>
                                        <td className={box.difference < 0 ? 'text-red-500 font-bold' : 'text-green-500 font-bold'}>
                                            {box.difference?.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                {(!history || history.length === 0) && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4 text-gray-500">
                                            No hay historial
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
