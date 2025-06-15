import React from 'react';
import { X, Package, Calendar, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { GreenBean } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface BeanDetailsModalProps {
  bean: GreenBean;
  onClose: () => void;
}

const BeanDetailsModal: React.FC<BeanDetailsModalProps> = ({ bean, onClose }) => {
  const { state } = useAppContext();
  const { roastingSessions, sales } = state;

  // Calculate usage statistics
  const beanUsage = roastingSessions.filter(session => session.greenBeanId === bean.id);
  const totalUsed = beanUsage.reduce((sum, session) => sum + session.greenBeanQuantity, 0);
  const totalProduced = beanUsage.reduce((sum, session) => sum + session.roastedQuantity, 0);
  const averageYield = totalUsed > 0 ? (totalProduced / totalUsed) * 100 : 0;

  // Calculate sales from this bean
  const directSales = sales.filter(sale => sale.productId === bean.id && sale.productType === 'green');
  const totalSalesRevenue = directSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalSalesQuantity = directSales.reduce((sum, sale) => sum + sale.quantity, 0);

  // Calculate current value and metrics
  const currentValue = bean.quantity * bean.purchasePricePerKg;
  const originalQuantity = bean.quantity + totalUsed + totalSalesQuantity;
  const usageRate = originalQuantity > 0 ? ((totalUsed + totalSalesQuantity) / originalQuantity) * 100 : 0;

  // Days since entry
  const daysSinceEntry = Math.floor((new Date().getTime() - bean.entryDate.getTime()) / (1000 * 3600 * 24));

  // Determine stock status
  const getStockStatus = () => {
    if (bean.quantity <= bean.lowStockThreshold) {
      return { status: 'Kritis', color: 'text-red-600', bg: 'bg-red-100' };
    } else if (bean.quantity <= bean.lowStockThreshold * 2) {
      return { status: 'Perhatian', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    } else {
      return { status: 'Normal', color: 'text-green-600', bg: 'bg-green-100' };
    }
  };

  const stockStatus = getStockStatus();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{bean.variety}</h2>
              <p className="text-gray-600">{bean.origin}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Informasi Dasar
              </h3>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Batch Number:</span>
                  <span className="font-medium font-mono">{bean.batchNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Supplier:</span>
                  <span className="font-medium">{bean.supplierName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tanggal Masuk:</span>
                  <span className="font-medium">{bean.entryDate.toLocaleDateString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hari Sejak Masuk:</span>
                  <span className="font-medium">{daysSinceEntry} hari</span>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Informasi Keuangan
              </h3>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Harga Beli per kg:</span>
                  <span className="font-medium">Rp {bean.purchasePricePerKg.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stok Saat Ini:</span>
                  <span className="font-medium">{bean.quantity} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nilai Saat Ini:</span>
                  <span className="font-medium text-green-600">Rp {currentValue.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Batas Minimum:</span>
                  <span className="font-medium">{bean.lowStockThreshold} kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status and Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`${stockStatus.bg} p-4 rounded-lg border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Status Stok</p>
                  <p className={`text-lg font-bold ${stockStatus.color}`}>{stockStatus.status}</p>
                </div>
                <AlertTriangle className={`h-6 w-6 ${stockStatus.color}`} />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Total Digunakan</p>
                  <p className="text-lg font-bold text-blue-800">{totalUsed} kg</p>
                </div>
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Hasil Roasting</p>
                  <p className="text-lg font-bold text-green-800">{totalProduced} kg</p>
                </div>
                <div className="h-6 w-6 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">🔥</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600">Rata-rata Yield</p>
                  <p className="text-lg font-bold text-purple-800">{averageYield.toFixed(1)}%</p>
                </div>
                <div className="h-6 w-6 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Usage History */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Riwayat Penggunaan
            </h3>
            
            {beanUsage.length > 0 ? (
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch Roasting</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Digunakan</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hasil</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yield</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {beanUsage.slice(-5).map((session) => {
                        const yieldPercentage = (session.roastedQuantity / session.greenBeanQuantity) * 100;
                        return (
                          <tr key={session.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {session.roastDate.toLocaleDateString('id-ID')}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {session.batchNumber}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {session.greenBeanQuantity} kg
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {session.roastedQuantity} kg
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`font-medium ${yieldPercentage >= 80 ? 'text-green-600' : yieldPercentage >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {yieldPercentage.toFixed(1)}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {beanUsage.length > 5 && (
                  <div className="px-4 py-3 bg-gray-100 text-sm text-gray-600 text-center">
                    Menampilkan 5 sesi terakhir dari {beanUsage.length} total sesi
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-600">Belum ada riwayat penggunaan untuk biji kopi ini</p>
              </div>
            )}
          </div>

          {/* Direct Sales */}
          {directSales.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Penjualan Langsung
              </h3>
              
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-green-600">Total Terjual</p>
                    <p className="text-xl font-bold text-green-800">{totalSalesQuantity} kg</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-green-600">Total Pendapatan</p>
                    <p className="text-xl font-bold text-green-800">Rp {totalSalesRevenue.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-green-600">Rata-rata Harga</p>
                    <p className="text-xl font-bold text-green-800">
                      Rp {totalSalesQuantity > 0 ? (totalSalesRevenue / totalSalesQuantity).toLocaleString('id-ID') : '0'}/kg
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kuantitas</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga/kg</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pelanggan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {directSales.map((sale) => (
                        <tr key={sale.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {sale.saleDate.toLocaleDateString('id-ID')}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {sale.quantity} kg
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            Rp {sale.pricePerKg.toLocaleString('id-ID')}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            Rp {sale.totalAmount.toLocaleString('id-ID')}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {sale.customerName || 'Walk-in Customer'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Summary Statistics */}
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h4 className="font-medium text-amber-800 mb-3">Ringkasan Statistik</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-amber-700">Kuantitas Awal (estimasi):</span>
                  <span className="font-medium">{originalQuantity.toFixed(1)} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Total Digunakan:</span>
                  <span className="font-medium">{(totalUsed + totalSalesQuantity).toFixed(1)} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Tingkat Penggunaan:</span>
                  <span className="font-medium">{usageRate.toFixed(1)}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-amber-700">Sisa Stok:</span>
                  <span className="font-medium">{bean.quantity} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Nilai Investasi:</span>
                  <span className="font-medium">Rp {(originalQuantity * bean.purchasePricePerKg).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">ROI dari Penjualan:</span>
                  <span className="font-medium">
                    {totalSalesQuantity > 0 && bean.purchasePricePerKg > 0
                      ? `${(((totalSalesRevenue - (totalSalesQuantity * bean.purchasePricePerKg)) / (totalSalesQuantity * bean.purchasePricePerKg)) * 100).toFixed(1)}%`
                      : 'N/A'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeanDetailsModal;