export const financeTemplate = `
            <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- Üst Kartlar -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <!-- Toplam Gelir Kartı -->
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Toplam Gelir</p>
                                <h3 class="text-2xl font-bold text-green-600 mt-1" id="totalIncome">0,00 TL</h3>
                            </div>
                            <div class="p-3 bg-green-100 rounded-full">
                                <i class="fas fa-arrow-up text-green-600 text-xl"></i>
                            </div>
                        </div>
                        <p class="text-sm text-gray-500 mt-2">Son 30 gün</p>
                    </div>

                    <!-- Toplam Gider Kartı -->
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Toplam Gider</p>
                                <h3 class="text-2xl font-bold text-red-600 mt-1" id="totalExpense">0,00 TL</h3>
                            </div>
                            <div class="p-3 bg-red-100 rounded-full">
                                <i class="fas fa-arrow-down text-red-600 text-xl"></i>
                            </div>
                        </div>
                        <p class="text-sm text-gray-500 mt-2">Son 30 gün</p>
                    </div>

                    <!-- Net Durum Kartı -->
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Net Durum</p>
                                <h3 class="text-2xl font-bold text-blue-600 mt-1" id="netBalance">0,00 TL</h3>
                            </div>
                            <div class="p-3 bg-blue-100 rounded-full">
                                <i class="fas fa-chart-line text-blue-600 text-xl"></i>
                            </div>
                        </div>
                        <p class="text-sm text-gray-500 mt-2">Son 30 gün</p>
                    </div>
                </div>

                <!-- Ana İçerik -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Sol Taraf: İşlem Listesi -->
                    <div class="lg:col-span-2">
                        <div class="bg-white rounded-lg shadow">
                            <!-- Başlık ve Filtreler -->
                            <div class="p-6 border-b">
                                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <h2 class="text-xl font-semibold text-gray-900">İşlem Listesi</h2>
                                    <div class="mt-3 sm:mt-0 flex space-x-2">
                                        <button id="addIncomeBtn" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200">
                                            <i class="fas fa-plus mr-2"></i>Gelir Ekle
                                        </button>
                                        <button id="addExpenseBtn" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200">
                                            <i class="fas fa-minus mr-2"></i>Gider Ekle
                                        </button>
                                    </div>
                                </div>
                                
                                <!-- Filtreler -->
                                <div class="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
                                    <select id="typeFilter" class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                        <option value="">Tüm İşlemler</option>
                                        <option value="income">Gelirler</option>
                                        <option value="expense">Giderler</option>
                                    </select>
                                    <select id="categoryFilter" class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                        <option value="">Tüm Kategoriler</option>
                                    </select>
                                    <input type="date" id="startDate" class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                    <input type="date" id="endDate" class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                </div>
                            </div>

                            <!-- İşlem Tablosu -->
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Açıklama</th>
                                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                                </tr>
                            </thead>
                                    <tbody id="transactionsList" class="bg-white divide-y divide-gray-200">
                                        <!-- İşlemler buraya dinamik olarak eklenecek -->
                            </tbody>
                        </table>
                            </div>
                    </div>
                </div>

                    <!-- Sağ Taraf: Grafikler ve Özet -->
                    <div class="lg:col-span-1">
                        <!-- Dağılım Grafiği -->
                        <div class="bg-white rounded-lg shadow p-6 mb-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Gelir/Gider Dağılımı</h3>
                            <canvas id="distributionChart" class="w-full"></canvas>
                        </div>

                        <!-- Kategori Bazlı Özet -->
                        <div class="bg-white rounded-lg shadow p-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Kategori Bazlı Özet</h3>
                            <div id="categoryStats" class="space-y-4">
                                <!-- Kategori istatistikleri buraya dinamik olarak eklenecek -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- İşlem Ekleme/Düzenleme Modalı -->
                <div id="transactionModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
                    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div class="flex flex-col space-y-4">
                                <div class="flex justify-between items-center border-b pb-3">
                                <h3 class="text-xl font-semibold text-gray-900" id="modalTitle">Yeni İşlem</h3>
                                <button id="closeTransactionModal" class="text-gray-400 hover:text-gray-500">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>

                            <div class="space-y-4">
                                    <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">İşlem Tipi</label>
                                    <select id="transactionType" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                        <option value="income">Gelir</option>
                                        <option value="expense">Gider</option>
                                        </select>
                                    </div>

                                    <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                    <select id="transactionCategory" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                        <!-- Kategoriler dinamik olarak yüklenecek -->
                                    </select>
                                    </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Tutar</label>
                                    <input type="number" id="transactionAmount" step="0.01" min="0"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
                                    <input type="date" id="transactionDate"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                                    <textarea id="transactionDescription" rows="3"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"></textarea>
                                    </div>
                                </div>

                                <div class="flex justify-end space-x-3 pt-3">
                                <button id="cancelTransactionBtn" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200">
                                        İptal
                                    </button>
                                <button id="saveTransactionBtn" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200">
                                        Kaydet
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
`;