// Template'i import et
import { dashboardTemplate } from './templates/dashboardTemplate.js';
import { productsTemplate } from './templates/productsTemplate.js';
import { categoriesTemplate } from './templates/categoriesTemplate.js';
import { customersTemplate } from './templates/customersTemplate.js';
import { suppliersTemplate } from './templates/suppliersTemplate.js';
import { financeTemplate } from './templates/financeTemplate.js';
import { quotesTemplate } from './templates/quotesTemplate.js';
import { settingsTemplate } from './templates/settingsTemplate.js';

// Firebase fonksiyonlarını al
import { 
    collection,
    getDocs,
    query,
    orderBy,
    addDoc,
    doc,
    deleteDoc,
    where,
    getDoc,
    updateDoc,
    setDoc,
    db
} from './services/firebaseService.js';

// Helper fonksiyonlarını import et
import { 
    clearForm, 
    closeModal, 
    openModal, 
    replaceEventListener,
    formatCurrency,
    formatDate,
    validateInput,
    showError,
    showSuccess,
    showNotification 
} from './utils/helpers.js';

import { DashboardRouter } from './dashboardRouter.js';
import { initFinancePage, deleteTransaction } from './financeRouter.js';
import { initCustomerPage, deleteCustomer, editCustomer } from './customerRouter.js';
import { SettingsRouter } from './settingsRouter.js';
import { CategoryRouter } from './categoryRouter.js';
import { ProductRouter } from './productRouter.js';

document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const links = document.querySelectorAll('[data-page]');

    const pages = {
        dashboard: dashboardTemplate,
        products: productsTemplate,
        categories: categoriesTemplate,
        customers: customersTemplate,
        suppliers: suppliersTemplate,
        quotes: quotesTemplate,
        finance: financeTemplate, 
        settings: settingsTemplate,
    };

    // Sayfa yükleme fonksiyonu
    function loadPage(page) {
        content.innerHTML = pages[page];
        
        // Sayfa özel işlemleri
        switch(page) {
            case 'dashboard':
                new DashboardRouter();
                break;
            case 'products':
                new ProductRouter(); // Yeni router'ı kullan
                break;
            case 'categories':
                new CategoryRouter();
                break;
            case 'customers':
                initCustomerPage();
                break;
            case 'suppliers':
                initSupplierPage();
                break;
            case 'quotes':
                initQuotePage();
                break;
            case 'finance':
                initFinancePage();
                break;
            case 'settings':
                new SettingsRouter();
                break;
        }
    }

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.closest('[data-page]').dataset.page;
            loadPage(page);
        });
    });



// Tedarikçiler sayfası için init fonksiyonu
function initSupplierPage() {
    const modal = document.getElementById('supplierModal');
    const addBtn = document.getElementById('addSupplierBtn');
    const closeBtn = document.getElementById('closeSupplierModal');
    const cancelBtn = document.getElementById('cancelSupplierBtn');
    let saveBtn = document.getElementById('saveSupplierBtn');

    // Sekme değiştirme işlemleri
    const suppliersTab = document.getElementById('suppliersTab');
    const ordersTab = document.getElementById('ordersTab');
    const suppliersContent = document.getElementById('suppliersContent');
    const ordersContent = document.getElementById('ordersContent');

    suppliersTab?.addEventListener('click', () => {
        suppliersTab.classList.add('border-indigo-500', 'text-indigo-600');
        ordersTab.classList.remove('border-indigo-500', 'text-indigo-600');
        ordersTab.classList.add('border-transparent', 'text-gray-500');
        suppliersContent.classList.remove('hidden');
        ordersContent.classList.add('hidden');
        loadSuppliers();
    });

    ordersTab?.addEventListener('click', () => {
        ordersTab.classList.add('border-indigo-500', 'text-indigo-600');
        suppliersTab.classList.remove('border-indigo-500', 'text-indigo-600');
        suppliersTab.classList.add('border-transparent', 'text-gray-500');
        ordersContent.classList.remove('hidden');
        suppliersContent.classList.add('hidden');
        loadOrders();
    });

    // Modal işlemleri
    function handleCloseModal() {
        modal.classList.add('hidden');
        // Form elementlerini temizle
        document.getElementById('supplierCompany').value = '';
        document.getElementById('supplierContact').value = '';
        document.getElementById('supplierPhone').value = '';
        document.getElementById('supplierEmail').value = '';
        document.getElementById('supplierTaxId').value = '';
        document.getElementById('supplierStatus').value = 'aktif';
        document.getElementById('supplierAddress').value = '';
    }

    function handleOpenModal() {
        modal.classList.remove('hidden');
        // Form elementlerini temizle
        document.getElementById('supplierCompany').value = '';
        document.getElementById('supplierContact').value = '';
        document.getElementById('supplierPhone').value = '';
        document.getElementById('supplierEmail').value = '';
        document.getElementById('supplierTaxId').value = '';
        document.getElementById('supplierStatus').value = 'aktif';
        document.getElementById('supplierAddress').value = '';
        document.getElementById('supplierCompany').focus();
    }

    // Event listeners
    addBtn?.addEventListener('click', handleOpenModal);
    closeBtn?.addEventListener('click', handleCloseModal);
    cancelBtn?.addEventListener('click', handleCloseModal);
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) handleCloseModal();
    });

    // Yeni tedarikçi ekleme işlemi
    const addHandler = async () => {
        const companyInput = document.getElementById('supplierCompany');
        const contactInput = document.getElementById('supplierContact');
        const phoneInput = document.getElementById('supplierPhone');
        const emailInput = document.getElementById('supplierEmail');
        const taxIdInput = document.getElementById('supplierTaxId');
        const statusSelect = document.getElementById('supplierStatus');
        const addressInput = document.getElementById('supplierAddress');

        if (!companyInput.value || !phoneInput.value) {
            showNotification('Firma adı ve telefon alanları zorunludur!', 'error');
            return;
        }

        try {
            await addDoc(collection(db, 'suppliers'), {
                company: companyInput.value,
                contact: contactInput.value,
                phone: phoneInput.value,
                email: emailInput.value,
                taxId: taxIdInput.value,
                status: statusSelect.value,
                address: addressInput.value,
                createdAt: new Date()
            });

            handleCloseModal();
            await loadSuppliers();
            showNotification('Tedarikçi başarıyla eklendi!', 'success');
        } catch (error) {
            console.error('Tedarikçi eklenirken hata:', error);
            showNotification('Tedarikçi eklenirken bir hata oluştu!', 'error');
        }
    };

    // Event listener'ı güvenli bir şekilde ekle
    saveBtn = replaceEventListener(saveBtn, 'click', addHandler);

    // Sipariş filtreleme
    const orderStatusFilter = document.getElementById('orderStatusFilter');
    const orderDateFilter = document.getElementById('orderDateFilter');
    orderStatusFilter?.addEventListener('change', loadOrders);
    orderDateFilter?.addEventListener('change', loadOrders);

    // Yeni sipariş butonu
    const addOrderBtn = document.getElementById('addOrderBtn');
    addOrderBtn?.addEventListener('click', () => {
        showOrderModal();
    });

    // Tedarikçileri yükle
    loadSuppliers();
}

// Tedarikçileri yükleme fonksiyonu
window.loadSuppliers = async function() {
    const suppliersList = document.getElementById('suppliersList');
    if (!suppliersList) return;

    try {
        const querySnapshot = await getDocs(query(collection(db, 'suppliers'), orderBy('createdAt', 'desc')));
        
        suppliersList.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const supplier = doc.data();
            suppliersList.innerHTML += `
                <tr class="border-b hover:bg-gray-50">
                    <td class="px-6 py-4">
                        <button onclick="showSupplierDetails('${doc.id}')" class="text-indigo-600 hover:text-indigo-800 font-medium">
                            ${supplier.company}
                        </button>
                    </td>
                    <td class="px-6 py-4">${supplier.contact || '-'}</td>
                    <td class="px-6 py-4">${supplier.phone}</td>
                    <td class="px-6 py-4">${supplier.email || '-'}</td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 rounded-full text-xs ${supplier.status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                            ${supplier.status === 'aktif' ? 'Aktif' : 'Pasif'}
                        </span>
                    </td>
                    <td class="px-6 py-4">
                        <button class="text-blue-600 hover:text-blue-800 mr-3" onclick="editSupplier('${doc.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="text-red-600 hover:text-red-800" onclick="deleteSupplier('${doc.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        if (querySnapshot.empty) {
            suppliersList.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                        Henüz tedarikçi bulunmamaktadır.
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Tedarikçiler yüklenirken hata:', error);
        suppliersList.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-4 text-center text-red-600">
                    Tedarikçiler yüklenirken bir hata oluştu!
                </td>
            </tr>
        `;
    }
};

// Tedarikçi detay modalının HTML'ini güncelle
`
<!-- Tedarikçi Detay Modalı -->
<div id="supplierDetailModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
    <div class="relative mx-auto p-4 sm:p-5 w-full max-w-[95%] md:max-w-[80%] lg:max-w-[800px] my-6">
        <div class="bg-white rounded-lg shadow-lg">
            <div class="flex flex-col space-y-4 p-4 sm:p-5">
                <div class="flex justify-between items-center border-b pb-3">
                    <h3 class="text-lg sm:text-xl font-semibold text-gray-900">Tedarikçi Detayları</h3>
                    <button id="closeSupplierDetailModal" class="text-gray-400 hover:text-gray-500">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <!-- Tedarikçi Bilgileri -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Firma Adı</label>
                        <p id="detailCompany" class="mt-1 break-words"></p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Yetkili Kişi</label>
                        <p id="detailContact" class="mt-1 break-words"></p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Telefon</label>
                        <p id="detailPhone" class="mt-1"></p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">E-posta</label>
                        <p id="detailEmail" class="mt-1 break-words"></p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Vergi No</label>
                        <p id="detailTaxId" class="mt-1"></p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Durum</label>
                        <p id="detailStatus" class="mt-1"></p>
                    </div>
                    <div class="col-span-1 sm:col-span-2">
                        <label class="block text-sm font-medium text-gray-700">Adres</label>
                        <p id="detailAddress" class="mt-1 break-words"></p>
                    </div>
                </div>

                <!-- Siparişler -->
                <div class="mt-6">
                    <h4 class="text-lg font-medium mb-4">Siparişler</h4>
                    <div class="overflow-x-auto">
                        <div class="inline-block min-w-full align-middle">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr class="bg-gray-100">
                                        <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sipariş No</th>
                                        <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                                        <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                                        <th scope="col" class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Toplam Tutar</th>
                                        <th scope="col" class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody id="supplierOrders" class="divide-y divide-gray-200">
                                    <!-- Siparişler buraya dinamik olarak eklenecek -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end pt-3">
                    <button id="closeSupplierDetailBtn" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200">
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
`

// Tedarikçi detaylarını gösterme fonksiyonunu ekleyelim
window.showSupplierDetails = async (id) => {
    try {
    const modal = document.getElementById('supplierDetailModal');
        if (!modal) {
            showNotification('Modal elementi bulunamadı!', 'error');
            return;
        }

    const closeBtn = document.getElementById('closeSupplierDetailModal');
        const closeDetailBtn = document.getElementById('closeSupplierDetailBtn'); // ID'yi düzelttim

        // Modal kapatma fonksiyonu
        const closeModal = () => {
            modal.classList.add('hidden');
        };

        // Kapatma butonlarına event listener ekle
        if (closeBtn) closeBtn.onclick = closeModal;
        if (closeDetailBtn) closeDetailBtn.onclick = closeModal;
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };

        const elements = {
            detailCompany: document.getElementById('detailCompany'),
            detailContact: document.getElementById('detailContact'),
            detailPhone: document.getElementById('detailPhone'),
            detailEmail: document.getElementById('detailEmail'),
            detailTaxId: document.getElementById('detailTaxId'),
            detailStatus: document.getElementById('detailStatus'),
            detailAddress: document.getElementById('detailAddress'),
            supplierOrders: document.getElementById('supplierOrders')
        };

        // Elementlerin varlığını kontrol et
        for (const [key, element] of Object.entries(elements)) {
            if (!element) {
                showNotification(`${key} elementi bulunamadı!`, 'error');
                return;
            }
        }

        // Tedarikçi bilgilerini al
        const docSnap = await getDoc(doc(db, 'suppliers', id));
        if (!docSnap.exists()) {
            showNotification('Tedarikçi bulunamadı!', 'error');
            return;
        }
        
            const supplier = docSnap.data();
            
            // Tedarikçi bilgilerini doldur
        elements.detailCompany.textContent = supplier.company || '-';
        elements.detailContact.textContent = supplier.contact || '-';
        elements.detailPhone.textContent = supplier.phone || '-';
        elements.detailEmail.textContent = supplier.email || '-';
        elements.detailTaxId.textContent = supplier.taxId || '-';
        elements.detailStatus.innerHTML = `
                <span class="px-2 py-1 rounded-full text-xs ${supplier.status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                    ${supplier.status === 'aktif' ? 'Aktif' : 'Pasif'}
                </span>
            `;
        elements.detailAddress.textContent = supplier.address || '-';

        // Tedarikçinin siparişlerini al
        const ordersQuery = query(
                    collection(db, 'supplier_orders'),
                    where('supplierId', '==', id),
                    orderBy('createdAt', 'desc')
                );
                
        const ordersSnapshot = await getDocs(ordersQuery);
        
        // Siparişleri listele
        let ordersHTML = `
            <table class="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr class="bg-gray-50">
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sipariş No</th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                        <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Toplam Tutar</th>
                        <th class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Durum</th>
                        <th class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
        `;

        if (ordersSnapshot.empty) {
            ordersHTML += `
                <tr>
                    <td colspan="5" class="px-4 py-4 text-center text-sm text-gray-500">
                        Bu tedarikçiye ait sipariş bulunmamaktadır.
                    </td>
                </tr>
            `;
        } else {
            ordersSnapshot.forEach(orderDoc => {
                    const order = orderDoc.data();
                const orderDate = order.createdAt ? new Date(order.createdAt.toDate()).toLocaleDateString('tr-TR') : '-';
                const total = order.totalAmount ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.totalAmount) : '0,00 ₺';
                
                ordersHTML += `
                    <tr class="hover:bg-gray-50">
                        <td class="px-4 py-2 text-sm text-gray-900">${orderDoc.id}</td>
                        <td class="px-4 py-2 text-sm text-gray-900">${orderDate}</td>
                        <td class="px-4 py-2 text-sm text-gray-900 text-right">${total}</td>
                        <td class="px-4 py-2 text-sm text-center">
                                <span class="px-2 py-1 rounded-full text-xs ${getOrderStatusClass(order.status)}">
                                ${order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : '-'}
                                </span>
                            </td>
                        <td class="px-4 py-2 text-sm text-center">
                            <button onclick="viewOrder('${orderDoc.id}')" class="text-blue-600 hover:text-blue-800 mx-1">
                                    <i class="fas fa-eye"></i>
                                </button>
                            <button onclick="generateOrderPDF('${orderDoc.id}')" class="text-green-600 hover:text-green-800 mx-1">
                                <i class="fas fa-file-pdf"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                });
        }

        ordersHTML += `
                </tbody>
            </table>
        `;

        elements.supplierOrders.innerHTML = ordersHTML;

            // Modalı göster
            modal.classList.remove('hidden');

    } catch (error) {
        console.error('Tedarikçi detayları yüklenirken hata:', error);
        showNotification('Tedarikçi detayları yüklenirken bir hata oluştu!', 'error');
    }
};

// Sipariş detaylarını gösterme fonksiyonu
window.showOrderDetails = async (orderId) => {
    const modal = document.getElementById('orderPreviewModal');
    const closeBtn = document.getElementById('closeOrderPreviewModal');
    const closeDetailBtn = document.getElementById('closePreviewBtn');

    try {
        const docSnap = await getDoc(doc(db, 'supplier_orders', orderId));
        
        if (docSnap.exists()) {
            const order = docSnap.data();
            
            // Sipariş detaylarını doldur
            document.getElementById('previewOrderId').textContent = `#${orderId.slice(-6).toUpperCase()}`;
            document.getElementById('previewOrderDate').textContent = new Date(order.createdAt.toDate()).toLocaleString('tr-TR');
            document.getElementById('previewOrderStatus').innerHTML = `
                <span class="px-2 py-1 rounded-full text-xs ${getOrderStatusClass(order.status)}">
                    ${getOrderStatusText(order.status)}
                </span>
            `;

            // Ürünleri listele
            const itemsContainer = document.getElementById('previewOrderItems');
            itemsContainer.innerHTML = '';
            order.items.forEach(item => {
                itemsContainer.innerHTML += `
                    <tr class="border-b">
                        <td class="px-4 py-2">${item.description}</td>
                        <td class="px-4 py-2 text-right">${item.quantity}</td>
                        <td class="px-4 py-2 text-right">${formatCurrency(item.price)}</td>
                        <td class="px-4 py-2 text-right">${formatCurrency(item.subtotal)}</td>
                    </tr>
                `;
            });

            // Toplam tutarı göster
            document.getElementById('previewOrderTotal').textContent = formatCurrency(order.totalAmount);

            // Modalı göster
            modal.classList.remove('hidden');

            // Kapatma işlemleri
            const closeModal = () => modal.classList.add('hidden');
            closeBtn.onclick = closeModal;
            closeDetailBtn.onclick = closeModal;
            modal.onclick = (e) => {
                if (e.target === modal) closeModal();
            };
        }
    } catch (error) {
        console.error('Sipariş detayları yüklenirken hata:', error);
        alert('Sipariş detayları yüklenirken bir hata oluştu!');
    }
};

    // Sipariş modalını gösterme fonksiyonu
    function showOrderModal() {
        const modal = document.getElementById('orderModal');
        const supplierSelect = document.getElementById('orderSupplier');
        const orderItems = document.getElementById('orderItems');
        let saveBtn = document.getElementById('saveOrderBtn');

        // Tedarikçileri yükle
        loadSupplierOptions();

        // Başlangıç ürün satırını ekle
        addOrderItemRow();

        modal.classList.remove('hidden');

        // Modal kapatma işlemleri
        function closeModal() {
            modal.classList.add('hidden');
            orderItems.innerHTML = '';
            document.getElementById('orderTotal').textContent = '0.00 ₺';
        }

        document.getElementById('closeOrderModal').addEventListener('click', closeModal);
        document.getElementById('cancelOrderBtn').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Ürün ekleme butonu
        document.getElementById('addOrderItemBtn').addEventListener('click', addOrderItemRow);

        // Kaydetme işlemi
        const saveHandler = async () => {
            const supplierSelect = document.getElementById('orderSupplier');
            const statusSelect = document.getElementById('orderStatus');
            const items = [];
            let totalAmount = 0;

            if (!supplierSelect || !supplierSelect.value) {
                showNotification('Lütfen tedarikçi seçin!', 'error');
                return;
            }

            // Ürün satırlarını topla
            const itemRows = document.querySelectorAll('.order-item-row');
            if (itemRows.length === 0) {
                showNotification('Lütfen en az bir ürün ekleyin!', 'error');
                return;
            }

            itemRows.forEach(row => {
                const searchInput = row.querySelector('.item-search');
                const quantityInput = row.querySelector('.item-quantity');
                const priceInput = row.querySelector('.item-price');

                if (!searchInput || !quantityInput || !priceInput) {
                    console.error('Form elemanları bulunamadı');
                    return;
                }

                const description = searchInput.value;
                const quantity = parseFloat(quantityInput.value);
                const price = parseFloat(priceInput.value);

                if (description && !isNaN(quantity) && !isNaN(price)) {
                    const subtotal = quantity * price;
                    totalAmount += subtotal;
                    items.push({ 
                        description, 
                        quantity, 
                        price, 
                        subtotal 
                    });
                }
            });

            if (items.length === 0) {
                showNotification('Lütfen en az bir ürün ekleyin ve tüm alanları doldurun!', 'error');
                return;
            }

            try {
                await addDoc(collection(db, 'supplier_orders'), {
                    supplierId: supplierSelect.value,
                    status: statusSelect ? statusSelect.value : 'beklemede',
                    items,
                    totalAmount,
                    createdAt: new Date()
                });

                modal.classList.add('hidden');
                loadOrders();
                showNotification('Sipariş başarıyla oluşturuldu!', 'success');
            } catch (error) {
                console.error('Sipariş eklenirken hata:', error);
                showNotification('Sipariş eklenirken bir hata oluştu!', 'error');
            }
        };

        // Event listener'ı güvenli bir şekilde ekle
        saveBtn = replaceEventListener(saveBtn, 'click', saveHandler);
    }

    // Tedarikçi seçeneklerini yükleme
    async function loadSupplierOptions() {
        const select = document.getElementById('orderSupplier');
        try {
            const querySnapshot = await getDocs(query(collection(db, 'suppliers'), orderBy('company')));
            select.innerHTML = '<option value="">Tedarikçi Seçin</option>';
            querySnapshot.forEach((doc) => {
                const supplier = doc.data();
                if (supplier.status === 'aktif') {
                    select.innerHTML += `
                        <option value="${doc.id}">${supplier.company}</option>
                    `;
                }
            });
        } catch (error) {
            console.error('Tedarikçiler yüklenirken hata:', error);
            alert('Tedarikçiler yüklenirken bir hata oluştu!');
        }
    }

    // Ürün satırı ekleme fonksiyonunu güncelle
    function addOrderItemRow() {
        const container = document.getElementById('orderItems');
        const row = document.createElement('tr');
        row.className = 'order-item-row';
        row.innerHTML = `
            <td class="px-4 py-2">
                <select class="item-category w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                    <option value="">Kategori Seçin</option>
                </select>
            </td>
            <td class="px-4 py-2 relative">
                <input type="text" class="item-search w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Ürün Ara...">
                <div class="product-list absolute w-full mt-1 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg hidden z-50">
                </div>
            </td>
            <td class="px-4 py-2">
                <input type="number" class="item-quantity w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-right" min="1" value="1">
            </td>
            <td class="px-4 py-2">
                <input type="number" class="item-price w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-right" step="0.01" min="0">
            </td>
            <td class="px-4 py-2 text-center">
                <button class="delete-item text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        // Kategorileri yükle
        const categorySelect = row.querySelector('.item-category');
        loadProductCategories(categorySelect);

        // Event listener'ları ekle
        const searchInput = row.querySelector('.item-search');
        const productList = row.querySelector('.product-list');
        const quantityInput = row.querySelector('.item-quantity');
        const priceInput = row.querySelector('.item-price');
        const deleteBtn = row.querySelector('.delete-item');

        setupRowEventListeners(row, categorySelect, searchInput, productList, quantityInput, priceInput, deleteBtn);

        container.appendChild(row);
    }

    // Kategorileri yükleme fonksiyonu
    async function loadProductCategories(select) {
        try {
            const querySnapshot = await getDocs(query(collection(db, 'categories'), orderBy('name')));
            select.innerHTML = '<option value="">Tüm Kategoriler</option>';
            querySnapshot.forEach((doc) => {
                const category = doc.data();
                select.innerHTML += `
                    <option value="${doc.id}">${category.name}</option>
                `;
            });
        } catch (error) {
            console.error('Kategoriler yüklenirken hata:', error);
        }
    }

    // Ürünleri yükleme ve filtreleme fonksiyonu
    async function loadProductList(container, categoryId, searchText) {
        try {
            let q = collection(db, 'products');
            
            if (categoryId) {
                q = query(q, where('categoryId', '==', categoryId));
            }
            
            const querySnapshot = await getDocs(q);
            const products = [];
            
            querySnapshot.forEach((doc) => {
                const product = doc.data();
                if (!searchText || product.name.toLowerCase().includes(searchText)) {
                    products.push({
                        id: doc.id,
                        ...product
                    });
                }
            });

            container.innerHTML = products.length > 0 ? '' : '<div class="p-2 text-gray-500">Ürün bulunamadı</div>';
            
            products.forEach(product => {
                const div = document.createElement('div');
                div.className = 'p-2 hover:bg-gray-100 cursor-pointer';
                div.innerHTML = `${product.name} - ${formatCurrency(product.price)}`;
                
                div.addEventListener('click', () => {
                    const row = container.closest('.order-item-row');
                    const searchInput = row.querySelector('.item-search');
                    const priceInput = row.querySelector('.item-price');
                    
                    searchInput.value = product.name;
                    priceInput.value = product.price;
                    container.classList.add('hidden');
                    updateOrderTotal();
                });
                
                container.appendChild(div);
            });
            
            container.classList.remove('hidden');
        } catch (error) {
            console.error('Ürünler yüklenirken hata:', error);
            container.innerHTML = '<div class="p-2 text-red-500">Ürünler yüklenirken bir hata oluştu!</div>';
        }
    }

    // Sipariş toplamını güncelleme
    function updateOrderTotal() {
        const rows = document.querySelectorAll('.order-item-row');
        let total = 0;

        rows.forEach(row => {
            const quantity = parseInt(row.querySelector('.item-quantity').value) || 0;
            const price = parseFloat(row.querySelector('.item-price').value) || 0;
            total += quantity * price;
        });

        document.getElementById('orderTotal').textContent = formatCurrency(total);
    }

    // Global fonksiyonları ekleyelim
    window.deleteOrder = async (id) => {
        const modal = document.getElementById('deleteOrderModal');
        const cancelBtn = document.getElementById('cancelDeleteOrder');
        const confirmBtn = document.getElementById('confirmDeleteOrder');

        // Modalı göster
        modal.classList.remove('hidden');

        // Modal kapatma fonksiyonu
        const closeModal = () => {
            modal.classList.add('hidden');
        };

        // İptal butonu işlemi
        cancelBtn.onclick = closeModal;

        // Modal dışına tıklama
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };

        // Silme onayı
        confirmBtn.onclick = async () => {
            try {
                await deleteDoc(doc(db, 'supplier_orders', id));
                closeModal();
                loadOrders();
                showNotification('Sipariş başarıyla silindi!', 'success');
            } catch (error) {
                console.error('Sipariş silinirken hata:', error);
                showNotification('Sipariş silinirken bir hata oluştu!', 'error');
        }
        };
    };

    // viewOrder fonksiyonunu güncelleyelim
    window.viewOrder = async (id) => {
        const modal = document.getElementById('orderDetailModal');
        if (!modal) {
            showNotification('Modal elementi bulunamadı!', 'error');
            return;
        }

        try {
            const docSnap = await getDoc(doc(db, 'supplier_orders', id));
            
            if (docSnap.exists()) {
                const order = docSnap.data();
                
                // Tedarikçi bilgisini al
                const supplierSnap = await getDoc(doc(db, 'suppliers', order.supplierId));
                const supplier = supplierSnap.exists() ? supplierSnap.data() : { company: 'Tedarikçi Silinmiş' };

                // Detayları doldur
                const elements = {
                    orderDetailId: document.getElementById('orderDetailId'),
                    orderDetailSupplier: document.getElementById('orderDetailSupplier'),
                    orderDetailDate: document.getElementById('orderDetailDate'),
                    orderDetailStatus: document.getElementById('orderDetailStatus'),
                    orderDetailItems: document.getElementById('orderDetailItems'),
                    orderDetailTotal: document.getElementById('orderDetailTotal'),
                    updateOrderStatusBtn: document.getElementById('updateOrderStatusBtn'),
                    closeOrderDetailModal: document.getElementById('closeOrderDetailModal'),
                    closeDetailBtn: document.getElementById('closeDetailBtn')
                };

                // Tüm elementlerin varlığını kontrol et
                for (const [key, element] of Object.entries(elements)) {
                    if (!element) {
                        showNotification(`${key} elementi bulunamadı! Lütfen sayfayı yenileyin.`, 'error');
                        return;
                    }
                }

                // Bilgileri doldur
                elements.orderDetailId.textContent = `#${id.slice(-6).toUpperCase()}`;
                elements.orderDetailSupplier.textContent = supplier.company;
                elements.orderDetailDate.textContent = new Date(order.createdAt.toDate()).toLocaleString('tr-TR');
                elements.orderDetailStatus.innerHTML = `
                    <span class="px-2 py-1 rounded-full text-xs ${getOrderStatusClass(order.status)}">
                        ${getOrderStatusText(order.status)}
                    </span>
                `;

                // Ürünleri listele
                elements.orderDetailItems.innerHTML = '';
                order.items.forEach(item => {
                    elements.orderDetailItems.innerHTML += `
                        <tr class="border-b">
                            <td class="px-4 py-2">${item.description}</td>
                            <td class="px-4 py-2 text-right">${item.quantity}</td>
                            <td class="px-4 py-2 text-right">${formatCurrency(item.price)}</td>
                            <td class="px-4 py-2 text-right">${formatCurrency(item.subtotal)}</td>
                        </tr>
                    `;
                });

                // Toplam tutarı göster
                elements.orderDetailTotal.textContent = formatCurrency(order.totalAmount);

                // Durum güncelleme butonu
                elements.updateOrderStatusBtn.onclick = () => {
                    const statusModal = document.getElementById('orderStatusModal');
                    const newStatusSelect = document.getElementById('newOrderStatus');
                    const confirmBtn = document.getElementById('confirmStatusUpdate');
                    const cancelBtn = document.getElementById('cancelStatusUpdate');
                    const closeBtn = document.getElementById('closeStatusModal');

                    if (!statusModal || !newStatusSelect || !confirmBtn || !cancelBtn || !closeBtn) {
                        showNotification('Durum güncelleme modalı elementleri bulunamadı!', 'error');
                        return;
                    }

                    // Mevcut durumu seç
                    newStatusSelect.value = order.status;
                    
                    // Modalı göster
                    statusModal.classList.remove('hidden');

                    // Güncelleme işlemi
                    const updateStatus = async () => {
                        try {
                            await updateDoc(doc(db, 'supplier_orders', id), {
                                status: newStatusSelect.value,
                                updatedAt: new Date()
                            });
                            statusModal.classList.add('hidden');
                            modal.classList.add('hidden');
                            loadOrders();
                            showNotification('Sipariş durumu başarıyla güncellendi!', 'success');
                        } catch (error) {
                            console.error('Sipariş durumu güncellenirken hata:', error);
                            showNotification('Sipariş durumu güncellenirken bir hata oluştu!', 'error');
                        }
                    };

                    // Event listener'ları ekle
                    confirmBtn.onclick = updateStatus;
                    cancelBtn.onclick = () => statusModal.classList.add('hidden');
                    closeBtn.onclick = () => statusModal.classList.add('hidden');
                    statusModal.onclick = (e) => {
                        if (e.target === statusModal) statusModal.classList.add('hidden');
                    };
                };

                // Modalı göster
                modal.classList.remove('hidden');

                // PDF indirme butonu
                const generatePdfBtn = document.getElementById('generateOrderPdfBtn');
                if (generatePdfBtn) {
                    generatePdfBtn.onclick = () => generateOrderPDF(id);
                }

                // Kapatma işlemleri
                const closeModal = () => modal.classList.add('hidden');
                elements.closeOrderDetailModal.onclick = closeModal;
                elements.closeDetailBtn.onclick = closeModal;
                modal.onclick = (e) => {
                    if (e.target === modal) closeModal();
                };
            }
        } catch (error) {
            console.error('Sipariş detayları yüklenirken hata:', error);
            showNotification('Sipariş detayları yüklenirken bir hata oluştu!', 'error');
        }
    };

    // Sipariş durumu için yardımcı fonksiyonlar
    window.getOrderStatusText = function(status) {
        const texts = {
            'beklemede': 'Beklemede',
            'onaylandı': 'Onaylandı',
            'tamamlandı': 'Tamamlandı',
            'iptal': 'İptal Edildi'
        };
        return texts[status] || status;
    }

    function getOrderStatusClass(status) {
        const classes = {
            'beklemede': 'bg-yellow-100 text-yellow-800',
            'onaylandı': 'bg-blue-100 text-blue-800',
            'tamamlandı': 'bg-green-100 text-green-800',
            'iptal': 'bg-red-100 text-red-800'
        };
        return classes[status] || 'bg-gray-100 text-gray-800';
    }

    // Başlangıç sayfasını yükle
    loadPage('dashboard');

    // Siparişleri yükleme fonksiyonu
    async function loadOrders() {
        const ordersList = document.getElementById('ordersList');
        const statusFilter = document.getElementById('orderStatusFilter').value;
        const dateFilter = document.getElementById('orderDateFilter').value;
        
        if (!ordersList) return;

        try {
            let q = query(collection(db, 'supplier_orders'), orderBy('createdAt', 'desc'));

            if (statusFilter) {
                q = query(q, where('status', '==', statusFilter));
            }

            if (dateFilter) {
                const selectedDate = new Date(dateFilter);
                const nextDate = new Date(dateFilter);
                nextDate.setDate(nextDate.getDate() + 1);
                
                q = query(q, 
                    where('createdAt', '>=', selectedDate),
                    where('createdAt', '<', nextDate)
                );
            }

            const querySnapshot = await getDocs(q);
            const suppliers = {};
            
            // Tedarikçi bilgilerini al
            const supplierSnapshot = await getDocs(collection(db, 'suppliers'));
            supplierSnapshot.forEach((doc) => {
                suppliers[doc.id] = doc.data().company;
            });

            ordersList.innerHTML = '';
            querySnapshot.forEach((doc) => {
                const order = doc.data();
                ordersList.innerHTML += `
                    <tr class="border-b hover:bg-gray-50">
                        <td class="px-6 py-4">#${doc.id.slice(-6).toUpperCase()}</td>
                        <td class="px-6 py-4">${suppliers[order.supplierId] || 'Tedarikçi Silinmiş'}</td>
                        <td class="px-6 py-4">${new Date(order.createdAt.toDate()).toLocaleDateString('tr-TR')}</td>
                        <td class="px-6 py-4">${formatCurrency(order.totalAmount)}</td>
                        <td class="px-6 py-4">
                            <span class="px-2 py-1 rounded-full text-xs ${getOrderStatusClass(order.status)}">
                                ${getOrderStatusText(order.status)}
                            </span>
                        </td>
                        <td class="px-6 py-4">
                            <button class="text-blue-600 hover:text-blue-800 mr-3" onclick="viewOrder('${doc.id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="text-indigo-600 hover:text-indigo-800 mr-3" onclick="editOrder('${doc.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="text-red-600 hover:text-red-800" onclick="deleteOrder('${doc.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
        } catch (error) {
            console.error('Siparişler yüklenirken hata:', error);
            ordersList.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-red-600">Siparişler yüklenirken bir hata oluştu!</td></tr>';
        }
    }

    // Sipariş düzenleme fonksiyonu
    window.editOrder = async function(id) {
        const elements = {
            modal: document.getElementById('orderModal'),
            supplierSelect: document.getElementById('orderSupplier'),
            statusSelect: document.getElementById('orderStatus'),
            orderItems: document.getElementById('orderItems'),
            saveBtn: document.getElementById('saveOrderBtn'),
            closeBtn: document.getElementById('closeOrderModal'),
            cancelBtn: document.getElementById('cancelOrderBtn'),
            addItemBtn: document.getElementById('addOrderItemBtn')
        };

        // Gerekli elementlerin varlığını kontrol et
        for (const [key, element] of Object.entries(elements)) {
            if (!element) {
                showNotification(`${key} elementi bulunamadı! Lütfen sayfayı yenileyin.`, 'error');
                return;
            }
        }

        try {
            const docSnap = await getDoc(doc(db, 'supplier_orders', id));
            
            if (docSnap.exists()) {
                const order = docSnap.data();

                // Modal kapatma fonksiyonu
                const closeModal = () => {
                    elements.modal.classList.add('hidden');
                    elements.orderItems.innerHTML = '';
                    document.getElementById('orderTotal').textContent = '0,00 ₺';
                };

                // Kapatma event listener'larını ekle
                elements.closeBtn.onclick = closeModal;
                elements.cancelBtn.onclick = closeModal;
                elements.modal.onclick = (e) => {
                    if (e.target === elements.modal) closeModal();
                };

        // Tedarikçileri yükle
        await loadSupplierOptions();
                elements.supplierSelect.value = order.supplierId;
                
                // Sipariş durumunu ayarla
                if (elements.statusSelect) {
                    elements.statusSelect.value = order.status || 'beklemede';
                }

                // Ürün satırlarını temizle ve yeniden oluştur
                elements.orderItems.innerHTML = '';
                order.items.forEach(item => {
                    const rowDiv = document.createElement('tr');
                    rowDiv.className = 'order-item-row';
            rowDiv.innerHTML = `
                        <td class="px-4 py-2">
                    <select class="item-category w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                <option value="">Kategori Seçin</option>
                    </select>
                        </td>
                        <td class="px-4 py-2 relative">
                    <input type="text" class="item-search w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                        value="${item.description}" placeholder="Ürün Ara...">
                            <div class="product-list absolute w-full mt-1 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg hidden z-50">
                    </div>
                        </td>
                        <td class="px-4 py-2">
                    <input type="number" class="item-quantity w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                                value="${item.quantity}" min="1">
                        </td>
                        <td class="px-4 py-2">
                    <input type="number" class="item-price w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                                value="${item.price}" step="0.01" min="0">
                        </td>
                        <td class="px-4 py-2 text-center">
                    <button class="delete-item text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i>
                    </button>
                        </td>
            `;

            // Event listener'ları ekle
            const categorySelect = rowDiv.querySelector('.item-category');
            const searchInput = rowDiv.querySelector('.item-search');
            const productList = rowDiv.querySelector('.product-list');
            const quantityInput = rowDiv.querySelector('.item-quantity');
            const priceInput = rowDiv.querySelector('.item-price');
            const deleteBtn = rowDiv.querySelector('.delete-item');

            // Kategorileri yükle
            loadProductCategories(categorySelect);

            // Event listener'ları ekle
            setupRowEventListeners(rowDiv, categorySelect, searchInput, productList, quantityInput, priceInput, deleteBtn);

                    elements.orderItems.appendChild(rowDiv);
                });

                // Yeni ürün ekleme butonu için event listener'ı güvenli bir şekilde ekle
                elements.addItemBtn = replaceEventListener(elements.addItemBtn, 'click', () => {
                    addOrderItemRow();
                    updateOrderTotal();
        });

        // Kaydetme işlemi
        const saveHandler = async () => {
            const items = [];
            let totalAmount = 0;

            // Ürün satırlarını topla
                    const itemRows = document.querySelectorAll('.order-item-row');
            itemRows.forEach(row => {
                const quantity = parseInt(row.querySelector('.item-quantity').value);
                const price = parseFloat(row.querySelector('.item-price').value);
                const description = row.querySelector('.item-search').value;

                if (description && !isNaN(quantity) && !isNaN(price)) {
                    const subtotal = quantity * price;
                    totalAmount += subtotal;
                    items.push({ description, quantity, price, subtotal });
                }
            });

            if (items.length === 0) {
                        showNotification('Lütfen en az bir ürün ekleyin!', 'error');
                return;
            }

            try {
                await updateDoc(doc(db, 'supplier_orders', id), {
                            supplierId: elements.supplierSelect.value,
                            status: elements.statusSelect.value,
                    items,
                    totalAmount,
                    updatedAt: new Date()
                });

                        elements.modal.classList.add('hidden');
                loadOrders();
                        showNotification('Sipariş başarıyla güncellendi!', 'success');
            } catch (error) {
                console.error('Sipariş güncellenirken hata:', error);
                        showNotification('Sipariş güncellenirken bir hata oluştu!', 'error');
            }
        };

        // Event listener'ı güvenli bir şekilde ekle
                elements.saveBtn = replaceEventListener(elements.saveBtn, 'click', saveHandler);

        // Modalı göster
                elements.modal.classList.remove('hidden');
        updateOrderTotal();
    }
        } catch (error) {
            console.error('Sipariş yüklenirken hata:', error);
            showNotification('Sipariş yüklenirken bir hata oluştu!', 'error');
        }
    };

    // Satır event listener'larını ayarlama
    function setupRowEventListeners(rowDiv, categorySelect, searchInput, productList, quantityInput, priceInput, deleteBtn) {
        let searchTimeout;

        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const categoryId = categorySelect.value;
                const searchText = searchInput.value.toLowerCase();
                loadProductList(productList, categoryId, searchText);
            }, 300);
        });

        categorySelect.addEventListener('change', () => {
            const searchText = searchInput.value.toLowerCase();
            loadProductList(productList, categorySelect.value, searchText);
        });

        searchInput.addEventListener('focus', () => {
            const searchText = searchInput.value.toLowerCase();
            loadProductList(productList, categorySelect.value, searchText);
            productList.classList.remove('hidden');
        });

        deleteBtn.addEventListener('click', () => {
            rowDiv.remove();
            updateOrderTotal();
        });

        quantityInput.addEventListener('input', updateOrderTotal);
        priceInput.addEventListener('input', updateOrderTotal);
    }
});

// Kategori düzenleme fonksiyonu
window.editCategory = async (id) => {
    const modal = document.getElementById('categoryModal');
    const nameInput = document.getElementById('categoryName');
    const descInput = document.getElementById('categoryDescription');
    let saveBtn = document.getElementById('saveCategoryBtn');

    try {
        const docSnap = await getDoc(doc(db, 'categories', id));
        
        if (docSnap.exists()) {
            const category = docSnap.data();
            nameInput.value = category.name;
            descInput.value = category.description || '';
            
            openModal('categoryModal');
            nameInput.focus();

            // Yeni kaydetme işleyicisi
            const saveHandler = async () => {
                if (!nameInput.value) {
                    showNotification('Kategori adı zorunludur!', 'error');
                    return;
                }

                try {
                    await updateDoc(doc(db, 'categories', id), {
                        name: nameInput.value,
                        description: descInput.value,
                        updatedAt: new Date()
                    });

                    closeModal('categoryModal');
                    clearCategoryForm();
                    await window.loadCategories();
                    showNotification('Kategori başarıyla güncellendi!', 'success');
                    // Event listener'ı kaldır
                    saveBtn.removeEventListener('click', saveHandler);
                } catch (error) {
                    console.error('Kategori güncellenirken hata:', error);
                    showNotification('Kategori güncellenirken bir hata oluştu!', 'error');
                }
            };

            // Event listener'ı güvenli bir şekilde değiştir
            saveBtn = replaceEventListener(saveBtn, 'click', saveHandler);
        }
    } catch (error) {
        console.error('Kategori yüklenirken hata:', error);
        showNotification('Kategori yüklenirken bir hata oluştu!', 'error');
    }
};

// Tedarikçi form temizleme fonksiyonu
function clearSupplierForm() {
    const form = document.getElementById('supplierForm');
    if (form) {
        form.reset();
    }
}

// Tedarikçi silme fonksiyonu
window.deleteSupplier = async (id) => {
    const modal = document.getElementById('deleteSupplierModal');
    const cancelBtn = document.getElementById('cancelDeleteSupplier');
    const confirmBtn = document.getElementById('confirmDeleteSupplier');

    // Modalı göster
    modal.classList.remove('hidden');

    // Modal kapatma fonksiyonu
    const closeModal = () => {
        modal.classList.add('hidden');
    };

    // İptal butonu işlemi
    cancelBtn.onclick = closeModal;

    // Modal dışına tıklama
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };

    // Silme onayı
    confirmBtn.onclick = async () => {
        try {
            await deleteDoc(doc(db, 'suppliers', id));
            closeModal();
            loadSuppliers();
            showNotification('Tedarikçi başarıyla silindi!', 'success');
        } catch (error) {
            console.error('Tedarikçi silinirken hata:', error);
            showNotification('Tedarikçi silinirken bir hata oluştu!', 'error');
    }
    };
};

// Tedarikçi düzenleme fonksiyonu
window.editSupplier = async (id) => {
    const modal = document.getElementById('supplierModal');
    const companyInput = document.getElementById('supplierCompany');
    const contactInput = document.getElementById('supplierContact');
    const phoneInput = document.getElementById('supplierPhone');
    const emailInput = document.getElementById('supplierEmail');
    const taxIdInput = document.getElementById('supplierTaxId');
    const statusSelect = document.getElementById('supplierStatus');
    const addressInput = document.getElementById('supplierAddress');
    let saveBtn = document.getElementById('saveSupplierBtn');

    try {
        const docSnap = await getDoc(doc(db, 'suppliers', id));
        
        if (docSnap.exists()) {
            const supplier = docSnap.data();
            
            companyInput.value = supplier.company;
            contactInput.value = supplier.contact || '';
            phoneInput.value = supplier.phone;
            emailInput.value = supplier.email || '';
            taxIdInput.value = supplier.taxId || '';
            statusSelect.value = supplier.status;
            addressInput.value = supplier.address || '';
            
            modal.classList.remove('hidden');
            companyInput.focus();

            const saveHandler = async () => {
                if (!companyInput.value || !phoneInput.value) {
                    showNotification('Firma adı ve telefon alanları zorunludur!', 'error');
                    return;
                }

                try {
                    await updateDoc(doc(db, 'suppliers', id), {
                        company: companyInput.value,
                        contact: contactInput.value,
                        phone: phoneInput.value,
                        email: emailInput.value,
                        taxId: taxIdInput.value,
                        status: statusSelect.value,
                        address: addressInput.value,
                        updatedAt: new Date()
                    });

                    modal.classList.add('hidden');
                    loadSuppliers();
                    showNotification('Tedarikçi başarıyla güncellendi!', 'success');
                } catch (error) {
                    console.error('Tedarikçi güncellenirken hata:', error);
                    showNotification('Tedarikçi güncellenirken bir hata oluştu!', 'error');
                }
            };

            saveBtn = replaceEventListener(saveBtn, 'click', saveHandler);
        } else {
            showNotification('Tedarikçi bulunamadı!', 'error');
        }
    } catch (error) {
        console.error('Tedarikçi yüklenirken hata:', error);
        showNotification('Tedarikçi yüklenirken bir hata oluştu!', 'error');
    }
};

// Fiyat teklifleri sayfası fonksiyonları
function initQuotePage() {
    const modal = document.getElementById('quoteModal');
    const addBtn = document.getElementById('addQuoteBtn');
    const closeBtn = document.getElementById('closeQuoteModal');
    const cancelBtn = document.getElementById('cancelQuoteBtn');
    let saveBtn = document.getElementById('saveQuoteBtn');
    const customerSelect = document.getElementById('quoteCustomer');
    const addItemBtn = document.getElementById('addQuoteItemBtn');

    // Müşteri seçildiğinde bilgileri doldur
    customerSelect?.addEventListener('change', async () => {
        const customerId = customerSelect.value;
        const inputs = {
            customerTaxId: document.getElementById('customerTaxId'),
            customerPhone: document.getElementById('customerPhone'),
            customerEmail: document.getElementById('customerEmail'),
            customerAddress: document.getElementById('customerAddress')
        };

        // Input elementlerinin varlığını kontrol et
        for (const [key, element] of Object.entries(inputs)) {
            if (!element) {
                showNotification(`${key} elementi bulunamadı!`, 'error');
                return;
            }
        }

        if (!customerId) {
            // Müşteri seçili değilse alanları temizle
            Object.values(inputs).forEach(input => input.value = '');
            return;
        }

        try {
            const customerDoc = await getDoc(doc(db, 'customers', customerId));
            if (customerDoc.exists()) {
                const customer = customerDoc.data();
                // Bilgileri doldur
                inputs.customerTaxId.value = customer.taxId || '';
                inputs.customerPhone.value = customer.phone || '';
                inputs.customerEmail.value = customer.email || '';
                inputs.customerAddress.value = customer.address || '';

                // Input alanlarını düzenlenebilir yap
                Object.values(inputs).forEach(input => {
                    input.readOnly = false;
                    input.classList.remove('bg-gray-100');
                });

                showNotification('Müşteri bilgileri başarıyla yüklendi.', 'success');
            }
        } catch (error) {
            console.error('Müşteri bilgileri yüklenirken hata:', error);
            showNotification('Müşteri bilgileri yüklenirken bir hata oluştu!', 'error');
        }
    });

    // Modal işlemleri
    function handleCloseModal() {
        closeModal('quoteModal');
        clearQuoteForm();
    }

    addBtn.addEventListener('click', () => {
        loadCustomers();
        openModal('quoteModal');
        document.getElementById('quoteCustomer').focus();
    });

    closeBtn.addEventListener('click', handleCloseModal);
    cancelBtn.addEventListener('click', handleCloseModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) handleCloseModal();
    });

    // Yeni ürün satırı ekleme
    addItemBtn.addEventListener('click', addQuoteItem);

    // Kaydetme işlemi için event listener ekle
    const saveHandler = async () => {
        const customerSelect = document.getElementById('quoteCustomer');
        const validUntilInput = document.getElementById('validUntil');
        const customerTaxId = document.getElementById('customerTaxId').value;
        const customerPhone = document.getElementById('customerPhone').value;
        const customerEmail = document.getElementById('customerEmail').value;
        const customerAddress = document.getElementById('customerAddress').value;
        const items = [];
        let totalAmount = 0;

        // Validasyonlar
        if (!customerSelect.value) {
            showNotification('Lütfen müşteri seçin!', 'error');
            return;
        }

        if (!validUntilInput.value) {
            showNotification('Lütfen geçerlilik tarihi seçin!', 'error');
            return;
        }

        // Ürünleri topla
        const itemRows = document.querySelectorAll('#quoteItems tr');
        itemRows.forEach(row => {
            const description = row.querySelector('.item-description')?.value;
            const quantity = parseFloat(row.querySelector('.item-quantity')?.value);
            const price = parseFloat(row.querySelector('.item-price')?.value);

            if (description && !isNaN(quantity) && !isNaN(price)) {
                const subtotal = quantity * price;
                totalAmount += subtotal;
                items.push({
                    description,
                    quantity,
                    price,
                    subtotal
                });
            }
        });

        if (items.length === 0) {
            showNotification('Lütfen en az bir ürün/hizmet ekleyin!', 'error');
            return;
        }

        try {
            // Müşteri bilgisini al
            const customerSnap = await getDoc(doc(db, 'customers', customerSelect.value));
            const customer = customerSnap.data();

            const quoteData = {
                customerId: customerSelect.value,
                customerName: customer.name,
                customerTaxId,
                customerPhone,
                customerEmail,
                customerAddress,
                validUntil: new Date(validUntilInput.value),
                items,
                totalAmount,
                status: 'beklemede',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            await addDoc(collection(db, 'quotes'), quoteData);
            showNotification('Teklif başarıyla kaydedildi!', 'success');
            closeModal('quoteModal');
            loadQuotes();
        } catch (error) {
            console.error('Teklif kaydedilirken hata:', error);
            showNotification('Teklif kaydedilirken bir hata oluştu!', 'error');
        }
    };

    // Event listener'ı güvenli bir şekilde ekle
    saveBtn = replaceEventListener(saveBtn, 'click', saveHandler);

    // Teklifleri yükle
    loadQuotes();
}

// Teklifleri yükleme fonksiyonu
async function loadQuotes() {
    const quotesList = document.getElementById('quotesList');
    if (!quotesList) return;

    try {
        const querySnapshot = await getDocs(
            query(collection(db, 'quotes'), orderBy('createdAt', 'desc'))
        );

        quotesList.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const quote = doc.data();
            quotesList.innerHTML += `
                <tr class="hover:bg-gray-50 border-b border-gray-200">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #${doc.id.slice(-6).toUpperCase()}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${quote.customerName}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${new Date(quote.createdAt.toDate()).toLocaleDateString('tr-TR')}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getQuoteStatusClass(quote.status)}">
                            ${getQuoteStatusText(quote.status)}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        ${formatCurrency(quote.totalAmount)}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        <button class="text-blue-600 hover:text-blue-800 mr-3" onclick="viewQuote('${doc.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="text-indigo-600 hover:text-indigo-800 mr-3" onclick="editQuote('${doc.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="text-red-600 hover:text-red-800" onclick="deleteQuote('${doc.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        if (querySnapshot.empty) {
            quotesList.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                        Henüz fiyat teklifi bulunmamaktadır.
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Teklifler yüklenirken hata:', error);
        quotesList.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-4 text-center text-red-500">
                    Teklifler yüklenirken bir hata oluştu!
                </td>
            </tr>
        `;
    }
}

// Teklif durumu için yardımcı fonksiyonlar
function getQuoteStatusClass(status) {
    const classes = {
        'beklemede': 'bg-yellow-100 text-yellow-800',
        'onaylandı': 'bg-green-100 text-green-800',
        'reddedildi': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
}

function getQuoteStatusText(status) {
    const texts = {
        'beklemede': 'Beklemede',
        'onaylandı': 'Onaylandı',
        'reddedildi': 'Reddedildi'
    };
    return texts[status] || status;
}

// Teklif form temizleme
function clearQuoteForm() {
    clearForm('quoteForm');
}

// Teklif için ürün satırı ekleme fonksiyonu
function addQuoteItemRow() {
    const container = document.getElementById('quoteItems');
    const rowDiv = document.createElement('div');
    rowDiv.className = 'quote-item-row grid grid-cols-12 gap-2 items-center mb-3';
    rowDiv.innerHTML = `
        <div class="col-span-3">
            <select class="item-category w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option value="">Kategori Seçin</option>
            </select>
        </div>
        <div class="col-span-4 relative">
            <input type="text" class="item-search w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Ürün Ara...">
            <div class="product-list absolute w-full mt-1 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg hidden z-50">
                <!-- Ürünler buraya dinamik olarak eklenecek -->
            </div>
        </div>
        <div class="col-span-2">
            <input type="number" class="item-quantity w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Miktar" min="1" value="1">
        </div>
        <div class="col-span-2">
            <input type="number" class="item-price w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Birim Fiyat" step="0.01" min="0" readonly>
        </div>
        <div class="col-span-1 text-right">
            <button class="delete-item text-red-600 hover:text-red-800">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    // Kategorileri yükle
    const categorySelect = rowDiv.querySelector('.item-category');
    loadProductCategories(categorySelect);

    // Event listener'ları ekle
    const searchInput = rowDiv.querySelector('.item-search');
    const productList = rowDiv.querySelector('.product-list');
    const quantityInput = rowDiv.querySelector('.item-quantity');
    const priceInput = rowDiv.querySelector('.item-price');
    const deleteBtn = rowDiv.querySelector('.delete-item');

    // Kategori değiştiğinde
    categorySelect.addEventListener('change', () => {
        const searchText = searchInput.value.toLowerCase();
        loadProductList(productList, categorySelect.value, searchText);
    });

    // Ürün arama
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const categoryId = categorySelect.value;
            const searchText = searchInput.value.toLowerCase();
            loadProductList(productList, categoryId, searchText);
        }, 300);
    });

    // Ürün listesini göster/gizle
    searchInput.addEventListener('focus', () => {
        const searchText = searchInput.value.toLowerCase();
        loadProductList(productList, categorySelect.value, searchText);
        productList.classList.remove('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !productList.contains(e.target)) {
            productList.classList.add('hidden');
        }
    });

    // Miktar değiştiğinde toplam tutarı güncelle
    quantityInput.addEventListener('input', updateQuoteTotal);

    // Satırı silme
    deleteBtn.addEventListener('click', () => {
        rowDiv.remove();
        updateQuoteTotal();
    });

    container.appendChild(rowDiv);
}

// Kategorileri yükleme fonksiyonu
async function loadProductCategories(selectElement) {
    try {
        const querySnapshot = await getDocs(query(collection(db, 'categories'), orderBy('name')));
        selectElement.innerHTML = '<option value="">Kategori Seçin</option>';
        querySnapshot.forEach((doc) => {
            const category = doc.data();
            selectElement.innerHTML += `
                <option value="${doc.id}">${category.name}</option>
            `;
        });
    } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error);
        selectElement.innerHTML = '<option value="">Hata oluştu</option>';
    }
}

// Ürünleri yükleme ve filtreleme fonksiyonu
async function loadProductList(container, categoryId, searchText) {
    try {
        let q = collection(db, 'products');
        
        if (categoryId) {
            q = query(q, where('categoryId', '==', categoryId));
        }
        
        const querySnapshot = await getDocs(q);
        const products = [];
        
        querySnapshot.forEach((doc) => {
            const product = doc.data();
            if (!searchText || product.name.toLowerCase().includes(searchText)) {
                products.push({
                    id: doc.id,
                    ...product
                });
            }
        });

        container.innerHTML = products.length > 0 ? '' : '<div class="p-2 text-gray-500">Ürün bulunamadı</div>';
        
        products.forEach(product => {
            const div = document.createElement('div');
            div.className = 'p-2 hover:bg-gray-100 cursor-pointer';
            div.innerHTML = `${product.name} - ${formatCurrency(product.price)}`;
            
            div.addEventListener('click', () => {
                const row = container.closest('.quote-item-row');
                const searchInput = row.querySelector('.item-search');
                const priceInput = row.querySelector('.item-price');
                
                searchInput.value = product.name;
                searchInput.dataset.productId = product.id;
                priceInput.value = product.price;
                container.classList.add('hidden');
                updateQuoteTotal();
            });
            
            container.appendChild(div);
        });
        
        container.classList.remove('hidden');
    } catch (error) {
        console.error('Ürünler yüklenirken hata:', error);
        container.innerHTML = '<div class="p-2 text-red-500">Ürünler yüklenirken bir hata oluştu!</div>';
    }
}

// Toplam tutarı güncelleme
function updateQuoteTotal() {
    const itemRows = document.querySelectorAll('#quoteItems tr');
    let subtotal = 0;

    itemRows.forEach(row => {
        const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        const subtotalCell = row.querySelector('.item-subtotal');
        const rowTotal = quantity * price;
        
        subtotalCell.textContent = formatCurrency(rowTotal);
        subtotal += rowTotal;
    });

    // Toplamları güncelle
    document.getElementById('quoteSubtotal').textContent = formatCurrency(subtotal);
    document.getElementById('quoteTotal').textContent = formatCurrency(subtotal);
}

// Global fonksiyonlar
window.deleteQuote = async (id) => {
    const modal = document.getElementById('deleteQuoteModal');
    const cancelBtn = document.getElementById('cancelDeleteQuote');
    const confirmBtn = document.getElementById('confirmDeleteQuote');

    // Modalı göster
    modal.classList.remove('hidden');

    // Modal kapatma fonksiyonu
    const closeModal = () => {
        modal.classList.add('hidden');
    };

    // İptal butonu işlemi
    cancelBtn.onclick = closeModal;

    // Modal dışına tıklama
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };

    // Silme onayı
    confirmBtn.onclick = async () => {
        try {
            await deleteDoc(doc(db, 'quotes', id));
            closeModal();
            loadQuotes();
            showNotification('Teklif başarıyla silindi!', 'success');
        } catch (error) {
            console.error('Teklif silinirken hata:', error);
            showNotification('Teklif silinirken bir hata oluştu!', 'error');
    }
    };
};

window.viewQuote = async (id) => {
    try {
        const docSnap = await getDoc(doc(db, 'quotes', id));
        if (docSnap.exists()) {
            const quote = docSnap.data();
            
            // Modal elementini kontrol et
            const modal = document.getElementById('previewQuoteModal');
            if (!modal) {
                console.error('Modal elementi bulunamadı!');
                return;
            }

            // Modal içeriğini oluştur
            const modalContent = `
                <div class="relative mx-auto p-4 sm:p-5 w-full max-w-[95%] md:max-w-[80%] lg:max-w-[700px] my-6">
                    <div class="bg-white rounded-lg shadow-lg">
                        <div class="flex flex-col space-y-4 p-4">
                            <div class="flex justify-between items-center border-b pb-3">
                                <h3 class="text-xl font-semibold text-gray-900">Teklif Detayları</h3>
                                <button id="closeQuotePreviewModal" class="text-gray-400 hover:text-gray-500">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            
                            <!-- Teklif Bilgileri -->
                            <div class="grid grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Teklif No</label>
                                    <p class="mt-1">#${id.slice(-6).toUpperCase()}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Tarih</label>
                                    <p class="mt-1">${new Date(quote.createdAt.toDate()).toLocaleDateString('tr-TR')}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Müşteri</label>
                                    <p class="mt-1">${quote.customerName}</p>
                                </div>
                            </div>

                            <!-- Teklif Ürünleri -->
                            <div class="mt-4">
                                <table class="min-w-full">
                                    <thead>
                                        <tr class="bg-gray-50">
                                            <th class="px-4 py-2 text-left">Ürün/Hizmet</th>
                                            <th class="px-4 py-2 text-right">Miktar</th>
                                            <th class="px-4 py-2 text-right">Birim Fiyat</th>
                                            <th class="px-4 py-2 text-right">Toplam</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${quote.items.map(item => `
                                            <tr class="border-t">
                        <td class="px-4 py-2">${item.description}</td>
                        <td class="px-4 py-2 text-right">${item.quantity}</td>
                                                <td class="px-4 py-2 text-right">${formatCurrency(item.price)}</td>
                                                <td class="px-4 py-2 text-right">${formatCurrency(item.quantity * item.price)}</td>
                    </tr>
                                        `).join('')}
                                    </tbody>
                                    <tfoot>
                                        <tr class="border-t font-semibold">
                                            <td colspan="3" class="px-4 py-2 text-right">Genel Toplam:</td>
                                            <td class="px-4 py-2 text-right">${formatCurrency(quote.totalAmount)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            <div class="flex justify-end space-x-3 pt-3">
                                <button id="closePreviewBtn" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200">
                                    Kapat
                                </button>
                                <button id="generatePdfBtn" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200">
                                    <i class="fas fa-file-pdf mr-2"></i>PDF İndir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Modal içeriğini güncelle
            modal.innerHTML = modalContent;

            // Modalı göster
            modal.classList.remove('hidden');

            // Event listener'ları ekle
            const closeBtn = modal.querySelector('#closeQuotePreviewModal');
            const closePreviewBtn = modal.querySelector('#closePreviewBtn');
            const generatePdfBtn = modal.querySelector('#generatePdfBtn');

            if (closeBtn && closePreviewBtn && generatePdfBtn) {
            const closeModal = () => modal.classList.add('hidden');

            closeBtn.onclick = closeModal;
                closePreviewBtn.onclick = closeModal;
            modal.onclick = (e) => {
                if (e.target === modal) closeModal();
            };

                // PDF indirme butonu için event listener
                generatePdfBtn.onclick = () => generatePDF(id);
            } else {
                console.error('Modal butonları bulunamadı!');
            }
        }
    } catch (error) {
        console.error('Teklif detayları yüklenirken hata:', error);
        alert('Teklif detayları yüklenirken bir hata oluştu!');
    }
};

// Teklif kaydetme fonksiyonu
async function saveQuote(id = null) {
    const customerSelect = document.getElementById('quoteCustomer');
    const validUntilInput = document.getElementById('validUntil');
    const customerTaxId = document.getElementById('customerTaxId').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const customerAddress = document.getElementById('customerAddress').value;
    const items = [];
    let totalAmount = 0;

    // Validasyonlar
    if (!customerSelect.value) {
        showNotification('Lütfen müşteri seçin!', 'error');
        return;
    }

    if (!validUntilInput.value) {
        showNotification('Lütfen geçerlilik tarihi seçin!', 'error');
        return;
    }

    // Ürünleri topla
    const itemRows = document.querySelectorAll('.quote-item-row');
    itemRows.forEach(row => {
        const description = row.querySelector('.item-description').value;
        const quantity = parseFloat(row.querySelector('.item-quantity').value);
        const price = parseFloat(row.querySelector('.item-price').value);

        if (description && !isNaN(quantity) && !isNaN(price)) {
            const subtotal = quantity * price;
            totalAmount += subtotal;
            items.push({
                description,
                quantity,
                price,
                subtotal
            });
        }
    });

    if (items.length === 0) {
        showNotification('Lütfen en az bir ürün/hizmet ekleyin!', 'error');
        return;
    }

    try {
        // Müşteri bilgisini al
        const customerSnap = await getDoc(doc(db, 'customers', customerSelect.value));
        const customer = customerSnap.data();

        const quoteData = {
            customerId: customerSelect.value,
            customerName: customer.name,
            customerTaxId,
            customerPhone,
            customerEmail,
            customerAddress,
            validUntil: new Date(validUntilInput.value),
            items,
            totalAmount,
            status: 'beklemede',
            updatedAt: new Date()
        };

        if (!id) {
            // Yeni teklif
            quoteData.createdAt = new Date();
            await addDoc(collection(db, 'quotes'), quoteData);
            showNotification('Teklif başarıyla oluşturuldu!', 'success');
        } else {
            // Teklif güncelleme
            await updateDoc(doc(db, 'quotes', id), quoteData);
            showNotification('Teklif başarıyla güncellendi!', 'success');
        }

        closeModal('quoteModal');
        clearQuoteForm();
        loadQuotes();
    } catch (error) {
        console.error('Teklif kaydedilirken hata:', error);
        showNotification('Teklif kaydedilirken bir hata oluştu!', 'error');
    }
}

// Teklif düzenleme fonksiyonu
window.editQuote = async (quoteId) => {
    try {
    const modal = document.getElementById('quoteModal');
    const itemsContainer = document.getElementById('quoteItems');
        const customerSelect = document.getElementById('quoteCustomer');
        const customerTaxIdInput = document.getElementById('customerTaxId');
        const customerPhoneInput = document.getElementById('customerPhone');
        const customerEmailInput = document.getElementById('customerEmail');
        const customerAddressInput = document.getElementById('customerAddress');
        const validUntilInput = document.getElementById('validUntil');
        const statusSelect = document.getElementById('quoteStatus');
        const modalTitle = document.getElementById('quoteModalTitle');
        const saveButton = document.getElementById('saveQuoteBtn');

        // Elementlerin varlığını kontrol et
        if (!modal || !itemsContainer || !customerSelect || !customerTaxIdInput || 
            !customerPhoneInput || !customerEmailInput || !customerAddressInput || !validUntilInput || 
            !statusSelect || !modalTitle || !saveButton) {
            showNotification('Form elementleri bulunamadı!', 'error');
            return;
        }

        // Müşterileri yükle
        await loadCustomers();

        const quoteSnap = await getDoc(doc(db, 'quotes', quoteId));
        if (quoteSnap.exists()) {
            const quote = quoteSnap.data();
            
            // Form alanlarını doldur
            customerSelect.value = quote.customerId || '';
            customerTaxIdInput.value = quote.customerTaxId || '';
            customerPhoneInput.value = quote.customerPhone || '';
            customerEmailInput.value = quote.customerEmail || '';
            customerAddressInput.value = quote.customerAddress || '';
            validUntilInput.value = quote.validUntil.toDate().toISOString().split('T')[0];
            statusSelect.value = quote.status || 'beklemede';

            // Ürünleri tabloya ekle
            itemsContainer.innerHTML = '';
            quote.items.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-4 py-2">
                        <select class="w-full px-2 py-1 border border-gray-300 rounded-md item-category" onchange="filterProductsByCategory(this)">
                            <option value="">Kategori Seçin</option>
                        </select>
                    </td>
                    <td class="px-4 py-2 relative">
                        <input type="text" class="w-full px-2 py-1 border border-gray-300 rounded-md item-description" 
                            value="${item.description}" placeholder="Ürün/Hizmet Seçin" onfocus="showProductList(this)">
                        <div class="product-list absolute w-full mt-1 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg hidden z-50">
                        </div>
                    </td>
                    <td class="px-4 py-2">
                        <input type="number" class="w-full px-2 py-1 border border-gray-300 rounded-md text-center item-quantity" 
                            value="${item.quantity}" min="1">
                    </td>
                    <td class="px-4 py-2">
                        <input type="number" class="w-full px-2 py-1 border border-gray-300 rounded-md text-right item-price" 
                            value="${item.price}" step="0.01" min="0">
                    </td>
                    <td class="px-4 py-2 text-right item-subtotal">${formatCurrency(item.subtotal)}</td>
                    <td class="px-4 py-2 text-center">
                        <button onclick="removeQuoteItem(this)" class="text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;

                // Kategorileri yükle
                const categorySelect = row.querySelector('.item-category');
                loadProductCategories(categorySelect);

                // Event listener'ları ekle
                const quantityInput = row.querySelector('.item-quantity');
                const priceInput = row.querySelector('.item-price');
                
                quantityInput.addEventListener('input', updateQuoteTotal);
                priceInput.addEventListener('input', updateQuoteTotal);

                itemsContainer.appendChild(row);
            });

            // Modal başlığını güncelle
            modalTitle.textContent = 'Teklif Düzenle';

            // Kaydet butonunu güncelle
            saveButton.textContent = 'Güncelle';
            saveButton.onclick = async () => {
                try {
                    // Teklif verilerini topla
                    const items = [];
                    let totalAmount = 0;
                    
                    document.querySelectorAll('#quoteItems tr').forEach(row => {
                        const description = row.querySelector('.item-description').value;
                        const quantity = parseFloat(row.querySelector('.item-quantity').value);
                        const price = parseFloat(row.querySelector('.item-price').value);
                        const subtotal = quantity * price;
                        
                        items.push({
                            description,
                            quantity,
                            price,
                            subtotal
                        });
                        
                        totalAmount += subtotal;
                    });

                    // Güncellenen teklif verisi
                    const updatedQuote = {
                        customerId: customerSelect.value,
                        customerName: customerSelect.options[customerSelect.selectedIndex].text,
                        customerTaxId: customerTaxIdInput.value,
                        customerPhone: customerPhoneInput.value,
                        customerEmail: customerEmailInput.value,
                        customerAddress: customerAddressInput.value,
                        validUntil: new Date(validUntilInput.value),
                        status: statusSelect.value,
                        items,
                        totalAmount,
                        updatedAt: new Date()
                    };

                    // Teklifi güncelle
                    await updateDoc(doc(db, 'quotes', quoteId), updatedQuote);
                    
                    // Modal'ı kapat ve bildirimi göster
                    modal.classList.add('hidden');
                    showNotification('Teklif başarıyla güncellendi!', 'success');
                    
                    // Teklif listesini yenile
                    loadQuotes();
                } catch (error) {
                    console.error('Teklif güncellenirken hata:', error);
                    showNotification('Teklif güncellenirken bir hata oluştu!', 'error');
                }
            };

            // Modal'ı göster
            modal.classList.remove('hidden');

            // Toplam tutarı güncelle
            updateQuoteTotal();
        }
    } catch (error) {
        console.error('Teklif yüklenirken hata:', error);
        showNotification('Teklif yüklenirken bir hata oluştu!', 'error');
    }
};

// Teklif toplam tutarını güncelleme fonksiyonu
window.updateQuoteTotal = function() {
    const items = document.querySelectorAll('#quoteItems tr');
    let subtotal = 0;

    items.forEach(item => {
        const quantity = parseFloat(item.querySelector('.item-quantity')?.value) || 0;
        const price = parseFloat(item.querySelector('.item-price')?.value) || 0;
        const itemSubtotal = quantity * price;
        
        if (item.querySelector('.item-subtotal')) {
            item.querySelector('.item-subtotal').textContent = formatCurrency(itemSubtotal);
        }
        subtotal += itemSubtotal;
    });

    // Alt toplam
    const subtotalElement = document.getElementById('quoteSubtotal');
    if (subtotalElement) {
        subtotalElement.textContent = formatCurrency(subtotal);
    }

    // Genel toplam
    const totalElement = document.getElementById('quoteTotal');
    if (totalElement) {
        totalElement.textContent = formatCurrency(subtotal);
    }
};

// Filtreleme fonksiyonları
function initQuoteFilters() {
    const statusFilter = document.getElementById('filterStatus');
    const customerFilter = document.getElementById('filterCustomer');
    const startDateFilter = document.getElementById('filterStartDate');
    const endDateFilter = document.getElementById('filterEndDate');

    // Filtreleme işlemi
    async function applyFilters() {
        const status = statusFilter.value;
        const customerSearch = customerFilter.value.toLowerCase();
        const startDate = startDateFilter.value ? new Date(startDateFilter.value) : null;
        const endDate = endDateFilter.value ? new Date(endDateFilter.value + 'T23:59:59') : null;

        try {
            let q = query(collection(db, 'quotes'), orderBy('createdAt', 'desc'));

            const querySnapshot = await getDocs(q);
            const quotesList = document.getElementById('quotesList');
            quotesList.innerHTML = '';

            let hasResults = false;

            querySnapshot.forEach((doc) => {
                const quote = doc.data();
                const quoteDate = quote.createdAt.toDate();

                // Filtreleri uygula
                if (status && quote.status !== status) return;
                if (customerSearch && !quote.customerName.toLowerCase().includes(customerSearch)) return;
                if (startDate && quoteDate < startDate) return;
                if (endDate && quoteDate > endDate) return;

                hasResults = true;
                quotesList.innerHTML += `
                    <tr class="hover:bg-gray-50 border-b border-gray-200">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #${doc.id.slice(-6).toUpperCase()}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${quote.customerName}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${quoteDate.toLocaleDateString('tr-TR')}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getQuoteStatusClass(quote.status)}">
                                ${getQuoteStatusText(quote.status)}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            ${formatCurrency(quote.totalAmount)}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            <button class="text-blue-600 hover:text-blue-800 mr-3" onclick="viewQuote('${doc.id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="text-indigo-600 hover:text-indigo-800 mr-3" onclick="editQuote('${doc.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="text-red-600 hover:text-red-800" onclick="deleteQuote('${doc.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                            <button class="text-green-600 hover:text-green-800 ml-3" onclick="generatePDF('${doc.id}')">
                                <i class="fas fa-file-pdf"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });

            if (!hasResults) {
                quotesList.innerHTML = `
                    <tr>
                        <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                            Arama kriterlerine uygun teklif bulunamadı.
                        </td>
                    </tr>
                `;
            }
        } catch (error) {
            console.error('Teklifler filtrelenirken hata:', error);
            alert('Teklifler filtrelenirken bir hata oluştu!');
        }
    }

    // Event listener'ları ekle
    statusFilter.addEventListener('change', applyFilters);
    customerFilter.addEventListener('input', debounce(applyFilters, 300));
    startDateFilter.addEventListener('change', applyFilters);
    endDateFilter.addEventListener('change', applyFilters);

    // Filtreleri sıfırlama butonu
    document.getElementById('resetFilters').addEventListener('click', () => {
        statusFilter.value = '';
        customerFilter.value = '';
        startDateFilter.value = '';
        endDateFilter.value = '';
        applyFilters();
    });
}

// PDF oluşturma fonksiyonu
window.generatePDF = async (quoteId) => {
    try {
        showNotification('PDF oluşturuluyor, lütfen bekleyin...', 'info');
        
        // Teklif ve firma bilgilerini al
        const [quoteSnap, companySnap] = await Promise.all([
            getDoc(doc(db, 'quotes', quoteId)),
            getDoc(doc(db, 'settings', 'company'))
        ]);

        if (quoteSnap.exists()) {
            const quote = quoteSnap.data();
            const company = companySnap.exists() ? companySnap.data() : {};
            
            // PDF oluştur - A4 dikey format ve Türkçe font desteği
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'mm', 'a4');
            
            // Türkçe font ekle
            doc.setFont("helvetica");
            doc.setLanguage("tr");

            const pageWidth = doc.internal.pageSize.width;
            const margin = 20;

            // Firma Logosu ve Bilgileri (Sol Üst)
            doc.setFontSize(20);
            doc.setFont("helvetica", "bold");
            doc.text(company.name || 'SARO', margin, 20);

            // İletişim Bilgileri (Sol Üst)
            doc.setFontSize(8);
            const contactInfo = [
                company.address && `Adres: ${company.address.replace(/İ/g, 'I').replace(/ı/g, 'i')}`,
                company.phone && `Tel: ${company.phone}`,
                company.email && `E-posta: ${company.email}`,
                company.website && `Web: ${company.website}`,
                company.taxId && `Vergi No: ${company.taxId}`
            ].filter(Boolean);

            if (contactInfo.length === 0) {
                contactInfo.push(
                    'Adres: Istanbul/Turkiye',
                    'Tel: +90 (212) XXX XX XX',
                    'E-posta: info@sarostok.com',
                    'Web: www.sarostok.com'
                );
            }

            doc.text(contactInfo, margin, 35);

            // Belge Başlığı (Sağ Üst)
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text('FIYAT TEKLIFI', pageWidth - margin, 20, { align: 'right' });

            // Teklif Detayları (Sağ Üst)
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            const quoteDetails = [
                `Teklif No: #${quoteId.slice(-6).toUpperCase()}`,
                `Tarih: ${new Date(quote.createdAt.toDate()).toLocaleDateString('tr-TR')}`,
                `Gecerlilik: ${new Date(quote.validUntil.toDate()).toLocaleDateString('tr-TR')}`
            ];
            doc.text(quoteDetails, pageWidth - margin, 30, { align: 'right' });

            // Çizgi
            doc.setDrawColor(220, 220, 220);
            doc.line(margin, 55, pageWidth - margin, 55);

            // Müşteri Bilgileri (Sol)
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text('MUSTERI BILGILERI', margin, 65);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.text([
                quote.customerName,
                'Vergi No/TC: ' + (quote.customerTaxId || 'N/A'),
                'Tel: ' + (quote.customerPhone || 'N/A'),
                'E-posta: ' + (quote.customerEmail || 'N/A')
            ], margin, 72);

            // Ürün Tablosu - Türkçe karakter düzeltmeleri
            doc.autoTable({
                startY: 95,
                head: [[
                    { content: 'URUN/HIZMET', styles: { halign: 'left' } },
                    { content: 'MIKTAR', styles: { halign: 'right' } },
                    { content: 'BIRIM FIYAT', styles: { halign: 'right' } },
                    { content: 'TOPLAM', styles: { halign: 'right' } }
                ]],
                body: quote.items.map(item => [
                    item.description.replace(/İ/g, 'I').replace(/ı/g, 'i'),
                    { content: item.quantity.toString(), styles: { halign: 'right' } },
                    { content: formatCurrency(item.price), styles: { halign: 'right' } },
                    { content: formatCurrency(item.quantity * item.price), styles: { halign: 'right' } }
                ]),
                margin: { left: margin, right: margin },
                styles: {
                    fontSize: 9,
                    font: "helvetica",
                    lineWidth: 0.1,
                    cellPadding: 3
                },
                headStyles: {
                    fillColor: [240, 240, 240],
                    textColor: [0, 0, 0],
                    fontSize: 9,
                    font: "helvetica",
                    fontStyle: "bold",
                    cellPadding: 3
                },
                columnStyles: {
                    0: { cellWidth: 80 },
                    1: { cellWidth: 25 },
                    2: { cellWidth: 35 },
                    3: { cellWidth: 35 }
                },
                alternateRowStyles: {
                    fillColor: [249, 249, 249]
                },
                didParseCell: function(data) {
                    if (typeof data.cell.text === 'string') {
                        data.cell.text = data.cell.text.replace(/İ/g, 'I').replace(/ı/g, 'i');
                    }
                }
            });

            // Toplam Tutar Tablosu
            const finalY = doc.lastAutoTable.finalY + 5;
            doc.autoTable({
                startY: finalY,
                body: [[
                    { content: 'Genel Toplam:', styles: { font: "helvetica", fontStyle: "bold" } },
                    { content: formatCurrency(quote.totalAmount), styles: { halign: 'right' } }
                ]],
                margin: { left: pageWidth - margin - 80, right: margin },
                styles: {
                    fontSize: 9,
                    lineWidth: 0.1
                },
                columnStyles: {
                    0: { cellWidth: 40 },
                    1: { cellWidth: 40 }
                }
            });

            // Alt Bilgi
            const footerY = doc.internal.pageSize.height - 15;
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text('Bu belge elektronik olarak hazirlanmistir.', pageWidth/2, footerY, { align: 'center' });

            // PDF'i kaydet
            doc.save(`Teklif_${quoteId.slice(-6).toUpperCase()}.pdf`);
            showNotification('PDF başarıyla oluşturuldu!', 'success');
        } else {
            showNotification('Teklif bulunamadı!', 'error');
        }
    } catch (error) {
        console.error('PDF oluşturulurken hata:', error);
        showNotification('PDF oluşturulurken bir hata oluştu!', 'error');
    }
};

// Yardımcı fonksiyonlar
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Input değişikliklerini dinle
document.addEventListener('input', function(e) {
    if (e.target.matches('.item-quantity, .item-price')) {
        updateQuoteTotal();
    }
});

// Teklif kalemini silme fonksiyonu
window.removeQuoteItem = function(button) {
    try {
        // Satırı bul ve sil
        const row = button.closest('tr');
        if (row) {
            row.remove();
            // Toplam tutarı güncelle
            updateQuoteTotal();
            showNotification('Ürün başarıyla silindi.');
        }
    } catch (error) {
        console.error('Ürün silinirken hata:', error);
        showNotification('Ürün silinirken bir hata oluştu!', 'error');
    }
};

// Yeni ürün ekleme fonksiyonu
window.addQuoteItem = function() {
    try {
        const itemsContainer = document.getElementById('quoteItems');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-4 py-2">
                <select class="w-full px-2 py-1 border border-gray-300 rounded-md item-category" onchange="filterProductsByCategory(this)">
                    <option value="">Kategori Seçin</option>
                </select>
            </td>
            <td class="px-4 py-2 relative">
                <input type="text" class="w-full px-2 py-1 border border-gray-300 rounded-md item-description" 
                    placeholder="Ürün/Hizmet Seçin" onfocus="showProductList(this)">
                <div class="product-list absolute w-full mt-1 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg hidden z-50">
                </div>
            </td>
            <td class="px-4 py-2">
                <input type="number" class="w-full px-2 py-1 border border-gray-300 rounded-md text-center item-quantity" 
                    value="1" min="1">
            </td>
            <td class="px-4 py-2">
                <input type="number" class="w-full px-2 py-1 border border-gray-300 rounded-md text-right item-price" 
                    value="0" step="0.01" min="0">
            </td>
            <td class="px-4 py-2 text-right item-subtotal">0,00 ₺</td>
            <td class="px-4 py-2 text-center">
                <button onclick="removeQuoteItem(this)" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        // Kategorileri yükle
        const categorySelect = row.querySelector('.item-category');
        loadProductCategories(categorySelect);

        // Event listener'ları ekle
        const quantityInput = row.querySelector('.item-quantity');
        const priceInput = row.querySelector('.item-price');
        const descriptionInput = row.querySelector('.item-description');

        quantityInput.addEventListener('input', updateQuoteTotal);
        priceInput.addEventListener('input', updateQuoteTotal);

        itemsContainer.appendChild(row);
        updateQuoteTotal();
    } catch (error) {
        console.error('Yeni ürün eklenirken hata:', error);
        showNotification('Yeni ürün eklenirken bir hata oluştu!', 'error');
    }
};

// Kategoriye göre ürünleri filtreleme
window.filterProductsByCategory = async function(categorySelect) {
    const row = categorySelect.closest('tr');
    const productList = row.querySelector('.product-list');
    const searchInput = row.querySelector('.item-description');
    
    try {
        let q = collection(db, 'products');
        
        if (categorySelect.value) {
            q = query(q, where('categoryId', '==', categorySelect.value));
        }
        
        const querySnapshot = await getDocs(q);
        productList.innerHTML = '';
        
        if (querySnapshot.empty) {
            productList.innerHTML = '<div class="p-2 text-gray-500">Bu kategoride ürün bulunamadı</div>';
        } else {
            querySnapshot.forEach((doc) => {
                const product = doc.data();
                const div = document.createElement('div');
                div.className = 'p-2 hover:bg-gray-100 cursor-pointer';
                div.innerHTML = `${product.name} - ${formatCurrency(product.price)}`;
                
                div.addEventListener('click', () => {
                    searchInput.value = product.name;
                    row.querySelector('.item-price').value = product.price;
                    productList.classList.add('hidden');
                    updateQuoteTotal();
                });
                
                productList.appendChild(div);
            });
        }
    } catch (error) {
        console.error('Ürünler yüklenirken hata:', error);
        productList.innerHTML = '<div class="p-2 text-red-500">Ürünler yüklenirken bir hata oluştu!</div>';
    }
};

// Ürün listesini gösterme
window.showProductList = function(input) {
    const row = input.closest('tr');
    const productList = row.querySelector('.product-list');
    const categorySelect = row.querySelector('.item-category');
    
    filterProductsByCategory(categorySelect);
    productList.classList.remove('hidden');
    
    // Dışarı tıklandığında listeyi gizle
    document.addEventListener('click', function hideList(e) {
        if (!input.contains(e.target) && !productList.contains(e.target)) {
            productList.classList.add('hidden');
            document.removeEventListener('click', hideList);
        }
    });
};

// Müşterileri yükleme fonksiyonu
async function loadCustomers() {
    const customerSelect = document.getElementById('quoteCustomer');
    if (!customerSelect) return;

    try {
        const querySnapshot = await getDocs(query(collection(db, 'customers'), orderBy('name')));
        customerSelect.innerHTML = '<option value="">Müşteri Seçin</option>';
        
        querySnapshot.forEach((doc) => {
            const customer = doc.data();
            customerSelect.innerHTML += `
                <option value="${doc.id}">${customer.name}</option>
            `;
        });
    } catch (error) {
        console.error('Müşteriler yüklenirken hata:', error);
        showNotification('Müşteriler yüklenirken bir hata oluştu!', 'error');
    }
}

// Sipariş PDF'i oluşturma fonksiyonu
window.generateOrderPDF = async (orderId) => {
    try {
        // Türkçe karakter dönüşüm fonksiyonu
        const turkishToEnglish = (text) => {
            if (!text) return '';
            const charMap = {
                'İ': 'I',
                'I': 'I',
                'ı': 'i',
                'i': 'i',
                'Ş': 'S',
                'ş': 's',
                'Ğ': 'G',
                'ğ': 'g',
                'Ü': 'U',
                'ü': 'u',
                'Ö': 'O',
                'ö': 'o',
                'Ç': 'C',
                'ç': 'c'
            };
            return text.replace(/[İIıiŞşĞğÜüÖöÇç]/g, match => charMap[match] || match);
        };

        // Sipariş ve firma bilgilerini al
        const [orderDoc, companyDoc] = await Promise.all([
            getDoc(doc(db, 'supplier_orders', orderId)),
            getDoc(doc(db, 'settings', 'company'))
        ]);

        if (!orderDoc.exists()) {
            throw new Error('Sipariş bulunamadı!');
        }

        const orderData = orderDoc.data();
        const companyData = companyDoc.exists() ? companyDoc.data() : {};

        // PDF oluştur
        const { jsPDF } = window.jspdf;
        const pdfDoc = new jsPDF('p', 'mm', 'a4');
        pdfDoc.setLanguage("tr");
        pdfDoc.setFont("helvetica");

        const pageWidth = pdfDoc.internal.pageSize.width;
        const margin = 20;

        // Başlık (Ortada)
        pdfDoc.setFontSize(18);
        pdfDoc.setFont("helvetica", "bold");
        pdfDoc.text(turkishToEnglish('SİPARİŞ LİSTESİ'), pageWidth/2, 20, { align: 'center' });

        // Firma Adı (Solda)
        pdfDoc.setFontSize(12);
        pdfDoc.text(turkishToEnglish(companyData.name || 'SARO'), margin, 40);

        // Tarih (Sağda)
        pdfDoc.setFontSize(10);
        pdfDoc.text(turkishToEnglish(`Tarih: ${new Date(orderData.createdAt.toDate()).toLocaleDateString('tr-TR')}`), pageWidth - margin, 40, { align: 'right' });

        // Sipariş No
        pdfDoc.text(turkishToEnglish(`Sipariş No: ${orderId.slice(-6).toUpperCase()}`), pageWidth - margin, 45, { align: 'right' });

        // Çizgi
        pdfDoc.setDrawColor(200, 200, 200);
        pdfDoc.line(margin, 50, pageWidth - margin, 50);

        // Ürün Tablosu
        pdfDoc.autoTable({
            startY: 60,
            head: [[
                { content: turkishToEnglish('ÜRÜN'), styles: { halign: 'left' } },
                { content: turkishToEnglish('MİKTAR'), styles: { halign: 'center' } },
                { content: turkishToEnglish('BİRİM FİYAT'), styles: { halign: 'right' } },
                { content: turkishToEnglish('TOPLAM'), styles: { halign: 'right' } }
            ]],
            body: orderData.items.map(item => [
                turkishToEnglish(item.description),
                { content: item.quantity.toString(), styles: { halign: 'center' } },
                { content: formatCurrency(item.price), styles: { halign: 'right' } },
                { content: formatCurrency(item.quantity * item.price), styles: { halign: 'right' } }
            ]),
            margin: { left: margin, right: margin },
            styles: {
                fontSize: 10,
                font: "helvetica",
                lineWidth: 0.1
            },
            headStyles: {
                fillColor: [240, 240, 240],
                textColor: [0, 0, 0],
                fontStyle: "bold"
            },
            columnStyles: {
                0: { cellWidth: 80 },
                1: { cellWidth: 30 },
                2: { cellWidth: 35 },
                3: { cellWidth: 35 }
            },
            alternateRowStyles: {
                fillColor: [249, 249, 249]
            }
        });

        // Toplam tutar
        const finalY = pdfDoc.lastAutoTable.finalY || 120;
        pdfDoc.setFontSize(11);
        pdfDoc.setFont("helvetica", "bold");
        pdfDoc.text(turkishToEnglish(`Toplam: ${formatCurrency(orderData.totalAmount)}`), pageWidth - margin, finalY + 10, { align: 'right' });

        // Alt Bilgi
        const footerY = pdfDoc.internal.pageSize.height - 15;
        pdfDoc.setFontSize(8);
        pdfDoc.setFont("helvetica", "normal");
        pdfDoc.setTextColor(128, 128, 128);
        pdfDoc.text(turkishToEnglish('Bu belge elektronik ortamda olusturulmustur.'), pageWidth/2, footerY, { align: 'center' });

        // PDF'i kaydet
        pdfDoc.save(`Siparis_${orderId.slice(-6).toUpperCase()}.pdf`);
        
        showNotification('PDF başarıyla oluşturuldu!', 'success');
    } catch (error) {
        console.error('PDF oluşturulurken hata:', error);
        showNotification('PDF oluşturulurken bir hata oluştu!', 'error');
    }
};