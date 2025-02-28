import { collection, query, getDocs, where, orderBy, limit } from './services/firebaseService.js';
import { formatCurrency } from './utils/helpers.js';

export class DashboardRouter {
    constructor() {
        this.initialize();
    }

    async initialize() {
        await this.loadDashboardData();
    }

    async loadDashboardData() {
        await Promise.all([
            this.loadCustomerStats(),
            this.loadSupplierStats(),
            this.loadFinanceStats(),
            this.loadRecentTransactions()
        ]);
    }

    async loadCustomerStats() {
        try {
            const customersRef = collection(db, 'customers');
            const customersSnap = await getDocs(customersRef);
            document.getElementById('totalCustomers').textContent = customersSnap.size;
        } catch (error) {
            console.error('Müşteri istatistikleri yüklenirken hata:', error);
        }
    }

    async loadSupplierStats() {
        try {
            const suppliersRef = collection(db, 'suppliers');
            const suppliersSnap = await getDocs(suppliersRef);
            document.getElementById('totalSuppliers').textContent = suppliersSnap.size;
        } catch (error) {
            console.error('Tedarikçi istatistikleri yüklenirken hata:', error);
        }
    }

    async loadFinanceStats() {
        try {
            const transactionsRef = collection(db, 'transactions');
            
            // Tüm zamanlar için toplam gelir/gider
            const allTransactionsSnap = await getDocs(transactionsRef);
            let totalIncome = 0;
            let totalExpense = 0;

            allTransactionsSnap.forEach(doc => {
                const transaction = doc.data();
                if (transaction.type === 'income') {
                    totalIncome += transaction.amount;
                } else {
                    totalExpense += transaction.amount;
                }
            });

            // Toplam değerleri güncelle
            document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
            document.getElementById('totalExpense').textContent = formatCurrency(totalExpense);
            document.getElementById('totalIncomeCard').textContent = formatCurrency(totalIncome);
            document.getElementById('totalExpenseCard').textContent = formatCurrency(totalExpense);
            document.getElementById('totalBalanceCard').textContent = formatCurrency(totalIncome - totalExpense);

            // Son 30 gün için gelir/gider
            const today = new Date();
            const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));

            const q = query(
                transactionsRef,
                where('date', '>=', thirtyDaysAgo),
                orderBy('date', 'desc')
            );

            const periodTransactionsSnap = await getDocs(q);
            let periodIncome = 0;
            let periodExpense = 0;

            periodTransactionsSnap.forEach(doc => {
                const transaction = doc.data();
                if (transaction.type === 'income') {
                    periodIncome += transaction.amount;
                } else {
                    periodExpense += transaction.amount;
                }
            });

            // Dönemsel istatistikleri güncelle
            document.getElementById('periodIncome').textContent = formatCurrency(periodIncome);
            document.getElementById('periodExpense').textContent = formatCurrency(periodExpense);
            document.getElementById('periodBalance').textContent = formatCurrency(periodIncome - periodExpense);

        } catch (error) {
            console.error('Finans istatistikleri yüklenirken hata:', error);
        }
    }

    async loadRecentTransactions() {
        try {
            const transactionsRef = collection(db, 'transactions');
            const q = query(transactionsRef, orderBy('date', 'desc'), limit(5));
            const transactionsSnap = await getDocs(q);

            const transactionsList = document.getElementById('recentTransactions');
            transactionsList.innerHTML = '';

            transactionsSnap.forEach(doc => {
                const transaction = doc.data();
                const li = document.createElement('li');
                li.className = 'flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-all duration-300';
                li.innerHTML = `
                    <div class="flex items-center">
                        <div class="rounded-xl p-3 ${transaction.type === 'income' ? 'bg-emerald-100' : 'bg-rose-100'}">
                            <i class="fas ${transaction.type === 'income' ? 'fa-arrow-up text-emerald-600' : 'fa-arrow-down text-rose-600'}"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-900">${transaction.description}</p>
                            <p class="text-xs text-gray-500">${transaction.date.toDate().toLocaleDateString()}</p>
                        </div>
                    </div>
                    <span class="text-sm font-medium ${transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}">
                        ${formatCurrency(transaction.amount)}
                    </span>
                `;
                transactionsList.appendChild(li);
            });
        } catch (error) {
            console.error('Son işlemler yüklenirken hata:', error);
        }
    }
} 