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
    db
} from './services/firebaseService.js';

import { 
    replaceEventListener,
    showNotification,
    clearForm,
    formatCurrency
} from './utils/helpers.js';

export class ProductRouter {
    constructor() {
        this.initProductPage();
        // Global fonksiyonları tanımla
        window.editProduct = this.editProduct.bind(this);
        window.deleteProduct = this.deleteProduct.bind(this);
    }

    async initProductPage() {
        const modal = document.getElementById('productModal');
        const addBtn = document.getElementById('addProductBtn');
        const closeBtn = document.getElementById('closeProductModal');
        const cancelBtn = document.getElementById('cancelProductBtn');
        let saveBtn = document.getElementById('saveProductBtn');
        const categorySelect = document.getElementById('productCategory');

        // Modal işlemleri
        const handleCloseModal = () => {
            this.closeModal('productModal');
            this.clearProductForm();
        };

        addBtn.addEventListener('click', () => {
            this.loadCategories();
            this.openModal('productModal');
            document.getElementById('productName').focus();
        });

        closeBtn.addEventListener('click', handleCloseModal);
        cancelBtn.addEventListener('click', handleCloseModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) handleCloseModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                this.closeModal('productModal');
            }
        });

        // Yeni ürün ekleme
        const addHandler = async () => {
            const name = document.getElementById('productName').value;
            const categoryId = document.getElementById('productCategory').value;
            const price = parseFloat(document.getElementById('productPrice').value);
            const stock = parseInt(document.getElementById('productStock').value);

            if (!name || !categoryId || isNaN(price) || isNaN(stock)) {
                showNotification('Lütfen tüm alanları doldurun!', 'error');
                return;
            }

            try {
                await addDoc(collection(db, 'products'), {
                    name,
                    categoryId,
                    price,
                    stock,
                    createdAt: new Date()
                });

                this.closeModal('productModal');
                this.clearProductForm();
                document.querySelector('[data-page="products"]').click();
                showNotification('Ürün başarıyla eklendi!', 'success');
            } catch (error) {
                console.error('Ürün eklenirken hata:', error);
                showNotification('Ürün eklenirken bir hata oluştu!', 'error');
            }
        };

        // Event listener'ı güvenli bir şekilde ekle
        saveBtn = replaceEventListener(saveBtn, 'click', addHandler);

        // Ürünleri yükle
        await this.loadProducts();
    }

    async loadCategories() {
        const categorySelect = document.getElementById('productCategory');
        try {
            const querySnapshot = await getDocs(query(collection(db, 'categories'), orderBy('name')));
            categorySelect.innerHTML = '<option value="">Kategori Seçin</option>';
            querySnapshot.forEach((doc) => {
                const category = doc.data();
                categorySelect.innerHTML += `
                    <option value="${doc.id}">${category.name}</option>
                `;
            });
        } catch (error) {
            console.error('Kategoriler yüklenirken hata:', error);
            showNotification('Kategoriler yüklenirken bir hata oluştu!', 'error');
        }
    }

    async loadProducts() {
        const productList = document.getElementById('productList');
        if (!productList) return;

        try {
            const querySnapshot = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')));
            const categories = {};
            
            // Önce kategorileri al
            const categorySnapshot = await getDocs(collection(db, 'categories'));
            categorySnapshot.forEach((doc) => {
                categories[doc.id] = doc.data().name;
            });

            productList.innerHTML = '';
            querySnapshot.forEach((doc) => {
                const product = doc.data();
                productList.innerHTML += `
                    <tr class="border-b hover:bg-gray-50">
                        <td class="px-6 py-4">${product.name}</td>
                        <td class="px-6 py-4">${categories[product.categoryId] || 'Kategori Silinmiş'}</td>
                        <td class="px-6 py-4">${formatCurrency(product.price)}</td>
                        <td class="px-6 py-4">${product.stock}</td>
                        <td class="px-6 py-4">
                            <button class="text-blue-600 hover:text-blue-800 mr-3" onclick="editProduct('${doc.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="text-red-600 hover:text-red-800" onclick="deleteProduct('${doc.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
        } catch (error) {
            console.error('Ürünler yüklenirken hata:', error);
            productList.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-red-600">Ürünler yüklenirken bir hata oluştu!</td></tr>';
        }
    }

    async editProduct(id) {
        const modal = document.getElementById('productModal');
        const nameInput = document.getElementById('productName');
        const categorySelect = document.getElementById('productCategory');
        const priceInput = document.getElementById('productPrice');
        const stockInput = document.getElementById('productStock');
        let saveBtn = document.getElementById('saveProductBtn');

        try {
            const docSnap = await getDoc(doc(db, 'products', id));
            
            if (docSnap.exists()) {
                const product = docSnap.data();
                
                // Kategorileri yükle
                await this.loadCategories();
                categorySelect.value = product.categoryId;

                nameInput.value = product.name;
                priceInput.value = product.price;
                stockInput.value = product.stock;
                
                this.openModal('productModal');
                nameInput.focus();

                // Yeni kaydetme işleyicisi
                const saveHandler = async () => {
                    const price = parseFloat(priceInput.value);
                    const stock = parseInt(stockInput.value);

                    if (!nameInput.value || !categorySelect.value || isNaN(price) || isNaN(stock)) {
                        showNotification('Lütfen tüm alanları doldurun!', 'error');
                        return;
                    }

                    try {
                        await updateDoc(doc(db, 'products', id), {
                            name: nameInput.value,
                            categoryId: categorySelect.value,
                            price: price,
                            stock: stock,
                            updatedAt: new Date()
                        });

                        this.closeModal('productModal');
                        this.clearProductForm();
                        document.querySelector('[data-page="products"]').click();
                        showNotification('Ürün başarıyla güncellendi!', 'success');
                    } catch (error) {
                        console.error('Ürün güncellenirken hata:', error);
                        showNotification('Ürün güncellenirken bir hata oluştu!', 'error');
                    }
                };

                saveBtn = replaceEventListener(saveBtn, 'click', saveHandler);
            }
        } catch (error) {
            console.error('Ürün yüklenirken hata:', error);
            showNotification('Ürün yüklenirken bir hata oluştu!', 'error');
        }
    }

    async deleteProduct(productId) {
        const deleteModal = document.getElementById('deleteProductModal');
        const closeBtn = document.getElementById('closeDeleteProductModal');
        const cancelBtn = document.getElementById('cancelDeleteProductBtn');
        const confirmBtn = document.getElementById('confirmDeleteProductBtn');
        const messageEl = document.getElementById('deleteProductMessage');

        // Ürün bilgilerini al ve mesajı güncelle
        try {
            const productDoc = await getDoc(doc(db, 'products', productId));
            if (productDoc.exists()) {
                const product = productDoc.data();
                messageEl.textContent = `"${product.name}" ürününü silmek istediğinizden emin misiniz?`;
            }
        } catch (error) {
            console.error('Ürün bilgileri alınırken hata:', error);
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
                await deleteDoc(doc(db, 'products', productId));
                showNotification('Ürün başarıyla silindi.', 'success');
                await this.loadProducts();
            } catch (error) {
                console.error('Ürün silinirken hata:', error);
                showNotification('Ürün silinirken bir hata oluştu!', 'error');
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

    clearProductForm() {
        clearForm('productForm');
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }
} 