import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy } from './firebase.js';
import { db } from './firebase.js';
import { formatCurrency } from './utils/helpers.js';
import { showNotification } from './utils/helpers.js';

// Global değişkenler
let distributionChart = null;

// Özet bilgileri güncelle
function updateSummary(totalIncome, totalExpense) {
    document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
    document.getElementById('totalExpense').textContent = formatCurrency(totalExpense);
    document.getElementById('netBalance').textContent = formatCurrency(totalIncome - totalExpense);
}

// Grafik güncelle
function updateChart(income, expense) {
    const ctx = document.getElementById('distributionChart')?.getContext('2d');
    if (!ctx) return;

    if (distributionChart) {
        distributionChart.destroy();
    }

    distributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Gelir', 'Gider'],
            datasets: [{
                data: [income, expense],
                backgroundColor: ['#059669', '#DC2626'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// İşlemleri yükleme fonksiyonu
async function loadTransactions() {
    try {
        const transactionsList = document.getElementById('transactionsList');
        const typeFilter = document.getElementById('typeFilter');
        const categoryFilter = document.getElementById('categoryFilter');
        const startDate = document.getElementById('startDate');
        const endDate = document.getElementById('endDate');

        if (!transactionsList || !typeFilter || !categoryFilter || !startDate || !endDate) {
            console.error('Gerekli elementler bulunamadı');
            return;
        }

        const type = typeFilter.value;
        const category = categoryFilter.value;
        const start = new Date(startDate.value);
        const end = new Date(endDate.value);
        end.setHours(23, 59, 59);

        let q = query(collection(db, 'transactions'), 
            where('date', '>=', start),
            where('date', '<=', end),
            orderBy('date', 'desc'));

        if (type) {
            q = query(q, where('type', '==', type));
        }
        if (category) {
            q = query(q, where('category', '==', category));
        }

        const querySnapshot = await getDocs(q);
        let totalIncome = 0;
        let totalExpense = 0;
        let html = '';

        querySnapshot.forEach((doc) => {
            const transaction = doc.data();
            const amount = transaction.amount;

            if (transaction.type === 'income') {
                totalIncome += amount;
            } else {
                totalExpense += amount;
            }

            html += `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${transaction.date.toDate().toLocaleDateString('tr-TR')}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${transaction.category}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">
                        ${transaction.description || '-'}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'} text-right font-medium">
                        ${transaction.type === 'income' ? '+' : '-'}${formatCurrency(amount)}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        <button onclick="deleteTransaction('${doc.id}')" class="text-red-600 hover:text-red-900">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        transactionsList.innerHTML = html;
        updateSummary(totalIncome, totalExpense);
        updateChart(totalIncome, totalExpense);
    } catch (error) {
        console.error('İşlemler yüklenirken hata:', error);
        showNotification('İşlemler yüklenirken bir hata oluştu!', 'error');
    }
}

// İşlem silme fonksiyonunu dışa aktar
export async function deleteTransaction(id) {
    try {
        // Modern onay modalı göster
        const result = await showConfirmModal('İşlemi Sil', 'Bu işlemi silmek istediğinizden emin misiniz?');
        
        if (result) {
            await deleteDoc(doc(db, 'transactions', id));
            await loadTransactions();
            showNotification('İşlem başarıyla silindi!', 'success');
        }
    } catch (error) {
        console.error('İşlem silinirken hata:', error);
        showNotification('İşlem silinirken bir hata oluştu!', 'error');
    }
}

// Gelir/Gider sayfası fonksiyonları
export async function initFinancePage() {
    // Gerekli elementleri seç
    const addIncomeBtn = document.getElementById('addIncomeBtn');
    const addExpenseBtn = document.getElementById('addExpenseBtn');
    const modal = document.getElementById('transactionModal');
    const closeBtn = document.getElementById('closeTransactionModal');
    const cancelBtn = document.getElementById('cancelTransactionBtn');
    const saveBtn = document.getElementById('saveTransactionBtn');
    const typeFilter = document.getElementById('typeFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');

    // Dağılım grafiği için canvas
    const ctx = document.getElementById('distributionChart').getContext('2d');

    // Varsayılan tarih aralığını ayarla (son 30 gün)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    startDate.value = thirtyDaysAgo.toISOString().split('T')[0];
    endDate.value = today.toISOString().split('T')[0];

    // Modal işlemleri
    function openModal(type) {
        const modalTitle = document.getElementById('modalTitle');
        const transactionType = document.getElementById('transactionType');
        
        modalTitle.textContent = type === 'income' ? 'Yeni Gelir Ekle' : 'Yeni Gider Ekle';
        transactionType.value = type;
        transactionDate.value = new Date().toISOString().split('T')[0];
        
        modal.classList.remove('hidden');
    }

    function closeModal() {
        modal.classList.add('hidden');
        clearForm();
    }

    function clearForm() {
        document.getElementById('transactionType').value = 'income';
        document.getElementById('transactionCategory').value = '';
        document.getElementById('transactionAmount').value = '';
        document.getElementById('transactionDate').value = '';
        document.getElementById('transactionDescription').value = '';
    }

    // Event Listeners
    addIncomeBtn.addEventListener('click', () => openModal('income'));
    addExpenseBtn.addEventListener('click', () => openModal('expense'));
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Filtreleme işlemleri
    [typeFilter, categoryFilter, startDate, endDate].forEach(filter => {
        filter.addEventListener('change', loadTransactions);
    });

    // İşlem kaydetme
    saveBtn.addEventListener('click', async () => {
        const type = document.getElementById('transactionType').value;
        const category = document.getElementById('transactionCategory').value;
        const amount = parseFloat(document.getElementById('transactionAmount').value);
        const date = document.getElementById('transactionDate').value;
        const description = document.getElementById('transactionDescription').value;

        if (!category || !amount || !date) {
            showNotification('Lütfen tüm zorunlu alanları doldurun!', 'error');
            return;
        }

        try {
            await addDoc(collection(db, 'transactions'), {
                type,
                category,
                amount,
                date: new Date(date),
                description,
                createdAt: new Date()
            });

            closeModal();
            await loadTransactions();
            showNotification('İşlem başarıyla kaydedildi!', 'success');
        } catch (error) {
            console.error('İşlem kaydedilirken hata:', error);
            showNotification('İşlem kaydedilirken bir hata oluştu!', 'error');
        }
    });

    // Kategorileri yükle
    async function loadCategories() {
        try {
            const querySnapshot = await getDocs(collection(db, 'categories'));
            const categorySelect = document.getElementById('transactionCategory');
            const filterSelect = document.getElementById('categoryFilter');
            
            let options = '<option value="">Kategori Seçin</option>';
            querySnapshot.forEach((doc) => {
                const category = doc.data();
                options += `<option value="${category.name}">${category.name}</option>`;
            });

            categorySelect.innerHTML = options;
            filterSelect.innerHTML = '<option value="">Tüm Kategoriler</option>' + options;
        } catch (error) {
            console.error('Kategoriler yüklenirken hata:', error);
        }
    }

    // İşlem silme fonksiyonunu ve diğer fonksiyonları global window objesine ekle
    window.deleteTransaction = deleteTransaction;
    window.loadTransactions = loadTransactions;
    window.updateSummary = updateSummary;
    window.updateChart = updateChart;

    // Sayfa yüklendiğinde verileri yükle
    loadCategories();
    loadTransactions();
}

// Modern onay modalı
function showConfirmModal(title, message) {
    return new Promise((resolve) => {
        // Mevcut modalı oluştur
        const modalHtml = `
            <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" id="confirmModal">
                <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                    <div class="mt-3 text-center">
                        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                        </div>
                        <h3 class="text-lg leading-6 font-medium text-gray-900">${title}</h3>
                        <div class="mt-2 px-7 py-3">
                            <p class="text-sm text-gray-500">${message}</p>
                        </div>
                        <div class="flex justify-center gap-4 mt-4">
                            <button id="confirmCancel" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200">
                                İptal
                            </button>
                            <button id="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200">
                                Sil
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Modalı DOM'a ekle
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modal = document.getElementById('confirmModal');
        const cancelBtn = document.getElementById('confirmCancel');
        const deleteBtn = document.getElementById('confirmDelete');

        // Event listener'ları ekle
        cancelBtn.addEventListener('click', () => {
            modal.remove();
            resolve(false);
        });

        deleteBtn.addEventListener('click', () => {
            modal.remove();
            resolve(true);
        });
    });
} 