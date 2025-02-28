export const dashboardTemplate = `
    <!-- Ana Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <!-- Müşteri Kartı -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <i class="fas fa-users text-blue-600 dark:text-blue-400 text-xl"></i>
                </div>
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Müşteriler</span>
            </div>
            <div>
                <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-1" id="totalCustomers">0</h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">Toplam Müşteri</p>
            </div>
        </div>

        <!-- Tedarikçi Kartı -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                    <i class="fas fa-building text-violet-600 dark:text-violet-400 text-xl"></i>
                </div>
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Tedarikçiler</span>
            </div>
            <div>
                <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-1" id="totalSuppliers">0</h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">Toplam Tedarikçi</p>
            </div>
        </div>

        <!-- Gelir Kartı -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <i class="fas fa-arrow-trend-up text-emerald-600 dark:text-emerald-400 text-xl"></i>
                </div>
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Gelir</span>
            </div>
            <div>
                <h3 class="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1" id="totalIncome">0 TL</h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">Toplam Gelir</p>
            </div>
        </div>

        <!-- Gider Kartı -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                    <i class="fas fa-arrow-trend-down text-rose-600 dark:text-rose-400 text-xl"></i>
                </div>
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Gider</span>
            </div>
            <div>
                <h3 class="text-2xl font-bold text-rose-600 dark:text-rose-400 mb-1" id="totalExpense">0 TL</h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">Toplam Gider</p>
            </div>
        </div>
    </div>

    <!-- Alt Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Sol Taraf - Finans Kartları -->
        <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Son 30 Gün Kartı -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Son 30 Gün</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Finansal Özet</p>
                    </div>
                    <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <i class="fas fa-calendar text-blue-600 dark:text-blue-400 text-xl"></i>
                    </div>
                </div>
                <div class="space-y-4">
                    <div class="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Gelir</p>
                            <p class="text-xl font-bold text-emerald-600 dark:text-emerald-400" id="periodIncome">0 TL</p>
                        </div>
                        <div class="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                            <i class="fas fa-arrow-up text-emerald-600 dark:text-emerald-400"></i>
                        </div>
                    </div>
                    <div class="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Gider</p>
                            <p class="text-xl font-bold text-rose-600 dark:text-rose-400" id="periodExpense">0 TL</p>
                        </div>
                        <div class="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                            <i class="fas fa-arrow-down text-rose-600 dark:text-rose-400"></i>
                        </div>
                    </div>
                    <div class="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Net Kazanç</p>
                            <p class="text-xl font-bold text-blue-600 dark:text-blue-400" id="periodBalance">0 TL</p>
                        </div>
                        <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <i class="fas fa-chart-line text-blue-600 dark:text-blue-400"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Genel Durum Kartı -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Genel Durum</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Toplam Özet</p>
                    </div>
                    <div class="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                        <i class="fas fa-chart-pie text-violet-600 dark:text-violet-400 text-xl"></i>
                    </div>
                </div>
                <div class="space-y-4">
                    <div class="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Toplam Gelir</p>
                            <p class="text-xl font-bold text-emerald-600 dark:text-emerald-400" id="totalIncomeCard">0 TL</p>
                        </div>
                        <div class="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                            <i class="fas fa-arrow-trend-up text-emerald-600 dark:text-emerald-400"></i>
                        </div>
                    </div>
                    <div class="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Toplam Gider</p>
                            <p class="text-xl font-bold text-rose-600 dark:text-rose-400" id="totalExpenseCard">0 TL</p>
                        </div>
                        <div class="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                            <i class="fas fa-arrow-trend-down text-rose-600 dark:text-rose-400"></i>
                        </div>
                    </div>
                    <div class="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Net Durum</p>
                            <p class="text-xl font-bold text-violet-600 dark:text-violet-400" id="totalBalanceCard">0 TL</p>
                        </div>
                        <div class="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                            <i class="fas fa-scale-balanced text-violet-600 dark:text-violet-400"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sağ Taraf - Son İşlemler -->
        <div>
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Son İşlemler</h2>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Son 5 işlem</div>
                </div>
                <ul id="recentTransactions" class="space-y-4">
                    <!-- İşlemler buraya yüklenecek -->
                </ul>
            </div>
        </div>
    </div>
`; 