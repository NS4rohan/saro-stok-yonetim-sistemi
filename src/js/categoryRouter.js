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

import { 
    replaceEventListener,
    showNotification
} from './utils/helpers.js';

export class CategoryRouter {
    constructor() {
        this.initCategoryPage();
        // Global fonksiyonları tanımla
        window.editCategory = this.editCategory.bind(this);
        window.deleteCategory = this.deleteCategory.bind(this);
    }

    async editCategory(categoryId) {
        try {
            const docRef = doc(db, 'categories', categoryId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const category = docSnap.data();
                
                // Form alanlarını doldur
                document.getElementById('categoryName').value = category.name;
                document.getElementById('categoryDescription').value = category.description || '';
                
                // Modal'ı aç
                this.openModal('categoryModal');
                
                // Kaydet butonunu güncelle
                let saveBtn = document.getElementById('saveCategoryBtn');
                const saveHandler = async () => {
                    try {
                        await updateDoc(docRef, {
                            name: document.getElementById('categoryName').value,
                            description: document.getElementById('categoryDescription').value
                        });
                        
                        this.closeModal('categoryModal');
                        this.clearCategoryForm();
                        await this.loadCategories();
                        showNotification('Kategori başarıyla güncellendi!', 'success');
                    } catch (error) {
                        console.error('Kategori güncellenirken hata:', error);
                        showNotification('Kategori güncellenirken bir hata oluştu!', 'error');
                    }
                };
                
                saveBtn = replaceEventListener(saveBtn, 'click', saveHandler);
            }
        } catch (error) {
            console.error('Kategori yüklenirken hata:', error);
            showNotification('Kategori yüklenirken bir hata oluştu!', 'error');
        }
    }

    async deleteCategory(categoryId) {
        const deleteModal = document.getElementById('deleteCategoryModal');
        const closeBtn = document.getElementById('closeDeleteCategoryModal');
        const cancelBtn = document.getElementById('cancelDeleteCategoryBtn');
        const confirmBtn = document.getElementById('confirmDeleteCategoryBtn');

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
                await deleteDoc(doc(db, 'categories', categoryId));
                showNotification('Kategori başarıyla silindi.', 'success');
                await this.loadCategories();
            } catch (error) {
                console.error('Kategori silinirken hata:', error);
                showNotification('Kategori silinirken bir hata oluştu!', 'error');
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

    async initCategoryPage() {
        const modal = document.getElementById('categoryModal');
        const addBtn = document.getElementById('addCategoryBtn');
        const closeBtn = document.getElementById('closeCategoryModal');
        const cancelBtn = document.getElementById('cancelCategoryBtn');
        let saveBtn = document.getElementById('saveCategoryBtn');
        const categoryList = document.getElementById('categoriesList');
    
        // Element kontrolü
        if (!modal || !addBtn || !closeBtn || !cancelBtn || !saveBtn || !categoryList) {
            console.error('Gerekli elementler bulunamadı!');
            return;
        }
    
        // Modal'ı aç
        addBtn.addEventListener('click', () => {
            this.openModal('categoryModal');
            document.getElementById('categoryName').focus();
        });
    
        // Modal'ı kapat
        const handleCloseModal = () => {
            this.closeModal('categoryModal');
            this.clearCategoryForm();
        };
    
        closeBtn.addEventListener('click', handleCloseModal);
        cancelBtn.addEventListener('click', handleCloseModal);
    
        // Modal dışına tıklandığında kapat
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                handleCloseModal();
            }
        });

        // ESC tuşu ile kapat
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                handleCloseModal();
            }
        });

        // Yeni kategori ekleme
        const addHandler = async () => {
            const name = document.getElementById('categoryName').value;
            const description = document.getElementById('categoryDescription').value;

            if (!name) {
                showNotification('Kategori adı zorunludur!', 'error');
                return;
            }

            try {
                await addDoc(collection(db, 'categories'), {
                    name,
                    description,
                    createdAt: new Date()
                });

                this.closeModal('categoryModal');
                this.clearCategoryForm();
                await this.loadCategories();
                showNotification('Kategori başarıyla eklendi!', 'success');
            } catch (error) {
                console.error('Kategori eklenirken hata:', error);
                showNotification('Kategori eklenirken bir hata oluştu!', 'error');
            }
        };

        saveBtn = replaceEventListener(saveBtn, 'click', addHandler);

        await this.loadCategories();
    }

    async loadCategories() {
        const categoryList = document.getElementById('categoriesList');
        if (!categoryList) {
            console.error('Kategori listesi elementi bulunamadı!');
            return;
        }

        try {
            const querySnapshot = await getDocs(query(collection(db, 'categories'), orderBy('createdAt', 'desc')));
            
            categoryList.innerHTML = '';
            querySnapshot.forEach((doc) => {
                const category = doc.data();
                categoryList.innerHTML += `
                    <tr class="border-b hover:bg-gray-50">
                        <td class="px-6 py-4">${category.name}</td>
                        <td class="px-6 py-4">${category.description || '-'}</td>
                        <td class="px-6 py-4">0</td>
                        <td class="px-6 py-4">
                            <button class="text-blue-600 hover:text-blue-800 mr-3" onclick="editCategory('${doc.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="text-red-600 hover:text-red-800" onclick="deleteCategory('${doc.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });

            if (querySnapshot.empty) {
                categoryList.innerHTML = `
                    <tr>
                        <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                            Henüz kategori bulunmamaktadır.
                        </td>
                    </tr>
                `;
            }
        } catch (error) {
            console.error('Kategoriler yüklenirken hata:', error);
            categoryList.innerHTML = `
                <tr>
                    <td colspan="4" class="px-6 py-4 text-center text-red-600">
                        Kategoriler yüklenirken bir hata oluştu!
                    </td>
                </tr>
            `;
        }
    }

    clearCategoryForm() {
        const nameInput = document.getElementById('categoryName');
        const descInput = document.getElementById('categoryDescription');
        
        if (nameInput) nameInput.value = '';
        if (descInput) descInput.value = '';
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