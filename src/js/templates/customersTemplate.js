export const customersTemplate = `
    <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-6">
            <div>
                <h2 class="text-2xl font-bold">Müşteriler</h2>
                <p class="text-gray-600 text-sm">Müşteri listesi ve detaylı bilgiler</p>
            </div>
            <button id="addCustomerBtn" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200">
                <i class="fas fa-plus mr-2"></i>Yeni Müşteri Ekle
            </button>
        </div>

        <!-- Arama ve Filtreleme -->
        <div class="mb-6 bg-gray-50 p-4 rounded-lg">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="relative">
                    <input type="text" id="customerSearch" placeholder="Müşteri Ara..." 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                    <i class="fas fa-search absolute right-3 top-3 text-gray-400"></i>
                </div>
                <div>
                    <select id="customerTypeFilter" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">Tüm Müşteri Tipleri</option>
                        <option value="bireysel">Bireysel</option>
                        <option value="kurumsal">Kurumsal</option>
                    </select>
                </div>
                <div>
                    <select id="customerStatusFilter" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">Tüm Durumlar</option>
                        <option value="aktif">Aktif</option>
                        <option value="pasif">Pasif</option>
                    </select>
                </div>
                <div>
                    <button id="resetFilters" class="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-200">
                        <i class="fas fa-undo mr-2"></i>Filtreleri Sıfırla
                    </button>
                </div>
            </div>
        </div>

        <!-- Müşteri Ekleme Modalı -->
        <div id="customerModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden">
            <div class="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
                <div class="flex flex-col space-y-4">
                    <div class="flex justify-between items-center border-b pb-3">
                        <h3 class="text-xl font-semibold text-gray-900">Yeni Müşteri Ekle</h3>
                        <button id="closeCustomerModal" class="text-gray-400 hover:text-gray-500">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Müşteri Tipi</label>
                            <select id="customerType" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                <option value="bireysel">Bireysel</option>
                                <option value="kurumsal">Kurumsal</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                            <select id="customerStatus" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                <option value="aktif">Aktif</option>
                                <option value="pasif">Pasif</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Ad Soyad / Firma Adı</label>
                            <input type="text" id="customerName" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Vergi No / TC No</label>
                            <input type="text" id="customerTaxId" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                            <input type="tel" id="customerPhone" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                            <input type="email" id="customerEmail" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                        </div>
                        <div class="col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                            <textarea id="customerAddress" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"></textarea>
                        </div>
                    </div>

                    <div class="flex justify-end space-x-3 pt-3">
                        <button id="cancelCustomerBtn" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200">
                            İptal
                        </button>
                        <button id="saveCustomerBtn" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200">
                            Kaydet
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Müşteri Silme Onay Modalı -->
        <div id="deleteCustomerModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
            <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div class="flex flex-col space-y-4">
                    <div class="flex justify-between items-center border-b pb-3">
                        <h3 class="text-xl font-semibold text-gray-900">Müşteri Sil</h3>
                        <button id="closeDeleteCustomerModal" class="text-gray-400 hover:text-gray-500">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="py-4">
                        <p id="deleteCustomerMessage" class="text-gray-600">Bu müşteriyi silmek istediğinizden emin misiniz?</p>
                        <p class="text-gray-500 text-sm mt-2">Bu işlem geri alınamaz.</p>
                    </div>

                    <div class="flex justify-end space-x-3 pt-3">
                        <button id="cancelDeleteCustomerBtn" 
                            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200">
                            İptal
                        </button>
                        <button id="confirmDeleteCustomerBtn" 
                            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200">
                            Sil
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Müşteriler Tablosu -->
        <div class="overflow-x-auto">
            <table class="min-w-full table-auto">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="px-6 py-3 text-left">Müşteri Adı</th>
                        <th class="px-6 py-3 text-left">Tip</th>
                        <th class="px-6 py-3 text-left">Telefon</th>
                        <th class="px-6 py-3 text-left">E-posta</th>
                        <th class="px-6 py-3 text-left">Durum</th>
                        <th class="px-6 py-3 text-left">İşlemler</th>
                    </tr>
                </thead>
                <tbody id="customerList">
                    <!-- Müşteriler buraya dinamik olarak eklenecek -->
                </tbody>
            </table>
        </div>
    </div>
`; 