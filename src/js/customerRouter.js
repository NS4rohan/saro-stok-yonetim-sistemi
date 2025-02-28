import { 
    collection, 
    getDocs, 
    query, 
    orderBy, 
    addDoc, 
    doc, 
    deleteDoc, 
    getDoc, 
    updateDoc 
} from './firebase.js';
import { db } from './firebase.js';
import { 
    clearForm, 
    closeModal, 
    openModal, 
    replaceEventListener,
    showNotification 
} from './utils/helpers.js';

// Müşteri silme fonksiyonunu dışa aktar
export async function deleteCustomer(customerId) {
    const deleteModal = document.getElementById('deleteCustomerModal');
    const closeBtn = document.getElementById('closeDeleteCustomerModal');
    const cancelBtn = document.getElementById('cancelDeleteCustomerBtn');
    const confirmBtn = document.getElementById('confirmDeleteCustomerBtn');
    const messageEl = document.getElementById('deleteCustomerMessage');

    // Müşteri bilgilerini al ve mesajı güncelle
    try {
        const customerDoc = await getDoc(doc(db, 'customers', customerId));
        if (customerDoc.exists()) {
            const customer = customerDoc.data();
            messageEl.textContent = `"${customer.name}" müşterisini silmek istediğinizden emin misiniz?`;
        }
    } catch (error) {
        console.error('Müşteri bilgileri alınırken hata:', error);
    }

    // Modalı göster
    deleteModal.classList.remove('hidden');

    // Modal kapatma işlemleri
    const closeModal = () => {
        deleteModal.classList.add('hidden');
        // Event listener'ları temizle
        closeBtn.removeEventListener('click', closeModal);
        cancelBtn.removeEventListener('click', closeModal);
        confirmBtn.removeEventListener('click', handleDelete);
        deleteModal.removeEventListener('click', handleOutsideClick);
    };

    // Dışarı tıklanınca modalı kapat
    const handleOutsideClick = (e) => {
        if (e.target === deleteModal) {
            closeModal();
        }
    };

    // Silme işlemi
    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, 'customers', customerId));
            showNotification('Müşteri başarıyla silindi.', 'success');
            await loadCustomers();
        } catch (error) {
            console.error('Müşteri silinirken hata:', error);
            showNotification('Müşteri silinirken bir hata oluştu!', 'error');
        } finally {
            closeModal();
        }
    };

    // Event listener'ları ekle
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    confirmBtn.addEventListener('click', handleDelete);
    deleteModal.addEventListener('click', handleOutsideClick);
}

// Müşteri düzenleme fonksiyonunu dışa aktar
export async function editCustomer(id) {
    const modal = document.getElementById('customerModal');
    const typeSelect = document.getElementById('customerType');
    const statusSelect = document.getElementById('customerStatus');
    const nameInput = document.getElementById('customerName');
    const taxIdInput = document.getElementById('customerTaxId');
    const phoneInput = document.getElementById('customerPhone');
    const emailInput = document.getElementById('customerEmail');
    const addressInput = document.getElementById('customerAddress');
    let saveBtn = document.getElementById('saveCustomerBtn');

    try {
        const docSnap = await getDoc(doc(db, 'customers', id));
        
        if (docSnap.exists()) {
            const customer = docSnap.data();
            
            // Form alanlarını doldur
            typeSelect.value = customer.type;
            statusSelect.value = customer.status;
            nameInput.value = customer.name;
            taxIdInput.value = customer.taxId || '';
            phoneInput.value = customer.phone;
            emailInput.value = customer.email || '';
            addressInput.value = customer.address || '';
            
            modal.classList.remove('hidden');
            nameInput.focus();

            // Yeni kaydetme işleyicisi
            const saveHandler = async () => {
                if (!nameInput.value || !phoneInput.value) {
                    showNotification('Ad ve telefon alanları zorunludur!', 'error');
                    return;
                }

                try {
                    await updateDoc(doc(db, 'customers', id), {
                        type: typeSelect.value,
                        status: statusSelect.value,
                        name: nameInput.value,
                        taxId: taxIdInput.value,
                        phone: phoneInput.value,
                        email: emailInput.value,
                        address: addressInput.value,
                        updatedAt: new Date()
                    });

                    modal.classList.add('hidden');
                    loadCustomers();
                    showNotification('Müşteri başarıyla güncellendi!', 'success');
                } catch (error) {
                    console.error('Müşteri güncellenirken hata:', error);
                    showNotification('Müşteri güncellenirken bir hata oluştu!', 'error');
                }
            };

            // Event listener'ı güvenli bir şekilde değiştir
            saveBtn = replaceEventListener(saveBtn, 'click', saveHandler);
        }
    } catch (error) {
        console.error('Müşteri yüklenirken hata:', error);
        showNotification('Müşteri yüklenirken bir hata oluştu!', 'error');
    }
}

// Müşterileri yükleme fonksiyonu
async function loadCustomers(searchTerm = '', type = '', status = '') {
    const customerList = document.getElementById('customerList');
    if (!customerList) return;

    try {
        let q = query(collection(db, 'customers'), orderBy('createdAt', 'desc'));

        const querySnapshot = await getDocs(q);
        customerList.innerHTML = '';

        querySnapshot.forEach((doc) => {
            const customer = doc.data();

            // Filtreleme
            if (searchTerm && !customer.name.toLowerCase().includes(searchTerm)) return;
            if (type && customer.type !== type) return;
            if (status && customer.status !== status) return;

            customerList.innerHTML += `
                <tr class="border-b hover:bg-gray-50">
                    <td class="px-6 py-4">${customer.name}</td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 rounded-full text-xs ${customer.type === 'kurumsal' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}">
                            ${customer.type === 'kurumsal' ? 'Kurumsal' : 'Bireysel'}
                        </span>
                    </td>
                    <td class="px-6 py-4">${customer.phone}</td>
                    <td class="px-6 py-4">${customer.email || '-'}</td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 rounded-full text-xs ${customer.status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                            ${customer.status === 'aktif' ? 'Aktif' : 'Pasif'}
                        </span>
                    </td>
                    <td class="px-6 py-4">
                        <button class="text-blue-600 hover:text-blue-800 mr-3" onclick="editCustomer('${doc.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="text-red-600 hover:text-red-800" onclick="deleteCustomer('${doc.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Müşteriler yüklenirken hata:', error);
        customerList.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-red-600">Müşteriler yüklenirken bir hata oluştu!</td></tr>';
    }
}

// Form temizleme
function clearCustomerForm() {
    document.getElementById('customerType').value = 'bireysel';
    document.getElementById('customerStatus').value = 'aktif';
    document.getElementById('customerName').value = '';
    document.getElementById('customerTaxId').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('customerEmail').value = '';
    document.getElementById('customerAddress').value = '';
}

// Müşteriler sayfası için init fonksiyonu
export function initCustomerPage() {
    const modal = document.getElementById('customerModal');
    const addBtn = document.getElementById('addCustomerBtn');
    const closeBtn = document.getElementById('closeCustomerModal');
    const cancelBtn = document.getElementById('cancelCustomerBtn');
    let saveBtn = document.getElementById('saveCustomerBtn');
    const searchInput = document.getElementById('customerSearch');
    const typeFilter = document.getElementById('customerTypeFilter');
    const statusFilter = document.getElementById('customerStatusFilter');
    const resetBtn = document.getElementById('resetFilters');

    // Modal işlemleri
    function handleCloseModal() {
        closeModal('customerModal');
        clearCustomerForm();
    }

    addBtn.addEventListener('click', () => {
        openModal('customerModal');
        document.getElementById('customerName').focus();
    });

    closeBtn.addEventListener('click', handleCloseModal);
    cancelBtn.addEventListener('click', handleCloseModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) handleCloseModal();
    });

    // Filtreleme işlemleri
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedType = typeFilter.value;
        const selectedStatus = statusFilter.value;

        loadCustomers(searchTerm, selectedType, selectedStatus);
    }

    searchInput.addEventListener('input', applyFilters);
    typeFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        typeFilter.value = '';
        statusFilter.value = '';
        loadCustomers();
    });

    // Yeni müşteri ekleme
    const addHandler = async () => {
        const customerData = {
            type: document.getElementById('customerType').value,
            status: document.getElementById('customerStatus').value,
            name: document.getElementById('customerName').value,
            taxId: document.getElementById('customerTaxId').value,
            phone: document.getElementById('customerPhone').value,
            email: document.getElementById('customerEmail').value,
            address: document.getElementById('customerAddress').value,
            createdAt: new Date()
        };

        if (!customerData.name || !customerData.phone) {
            showNotification('Ad ve telefon alanları zorunludur!', 'error');
            return;
        }

        try {
            await addDoc(collection(db, 'customers'), customerData);
            showNotification('Müşteri başarıyla eklendi!', 'success');
            clearCustomerForm();
            closeModal('customerModal');
            await loadCustomers();
        } catch (error) {
            console.error('Müşteri eklenirken hata:', error);
            showNotification('Müşteri eklenirken bir hata oluştu!', 'error');
        }
    };

    // Event listener'ı güvenli bir şekilde ekle
    saveBtn = replaceEventListener(saveBtn, 'click', addHandler);

    // Global fonksiyonları tanımla
    window.deleteCustomer = deleteCustomer;
    window.editCustomer = editCustomer;

    // Sayfa yüklendiğinde müşterileri yükle
    loadCustomers();
} 