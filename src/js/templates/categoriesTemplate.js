export const categoriesTemplate = `
    <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">Kategoriler</h2>
            <button id="addCategoryBtn" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200">
                <i class="fas fa-plus mr-2"></i>Yeni Kategori Ekle
            </button>
        </div>

        <!-- Kategoriler Tablosu -->
        <div class="overflow-x-auto">
            <table class="min-w-full table-auto">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="px-6 py-3 text-left">Kategori Adı</th>
                        <th class="px-6 py-3 text-left">Açıklama</th>
                        <th class="px-6 py-3 text-left">Ürün Sayısı</th>
                        <th class="px-6 py-3 text-left">İşlemler</th>
                    </tr>
                </thead>
                <tbody id="categoriesList">
                    <!-- Kategoriler buraya dinamik olarak eklenecek -->
                </tbody>
            </table>
        </div>

        <!-- Kategori Ekleme/Düzenleme Modalı -->
        <div id="categoryModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
            <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div class="flex flex-col space-y-4">
                    <div class="flex justify-between items-center border-b pb-3">
                        <h3 id="categoryModalTitle" class="text-xl font-semibold text-gray-900">Yeni Kategori Ekle</h3>
                        <button id="closeCategoryModal" class="text-gray-400 hover:text-gray-500">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Kategori Adı</label>
                            <input type="text" id="categoryName" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                            <textarea id="categoryDescription" rows="3"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"></textarea>
                        </div>
                    </div>

                    <div class="flex justify-end space-x-3 pt-3">
                        <button id="cancelCategoryBtn" 
                            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200">
                            İptal
                        </button>
                        <button id="saveCategoryBtn" 
                            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200">
                            Kaydet
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Kategori Silme Onay Modalı -->
        <div id="deleteCategoryModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
            <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div class="flex flex-col space-y-4">
                    <div class="flex justify-between items-center border-b pb-3">
                        <h3 class="text-xl font-semibold text-gray-900">Kategori Sil</h3>
                        <button id="closeDeleteCategoryModal" class="text-gray-400 hover:text-gray-500">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="py-4">
                        <p class="text-gray-600">Bu kategoriyi silmek istediğinizden emin misiniz?</p>
                        <p class="text-gray-500 text-sm mt-2">Bu işlem geri alınamaz.</p>
                    </div>

                    <div class="flex justify-end space-x-3 pt-3">
                        <button id="cancelDeleteCategoryBtn" 
                            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200">
                            İptal
                        </button>
                        <button id="confirmDeleteCategoryBtn" 
                            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200">
                            Sil
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
`; 