export const suppliersTemplate = `
    <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-6">
            <div>
                <h2 class="text-2xl font-bold">Tedarikçi Yönetimi</h2>
                <p class="text-gray-600 text-sm">Tedarikçiler ve siparişlerin yönetimi</p>
            </div>
        </div>

        <!-- Sekmeler -->
        <div class="border-b border-gray-200 mb-6">
            <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                <button id="suppliersTab" class="border-indigo-500 text-indigo-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                    <i class="fas fa-building mr-2"></i>Tedarikçiler
                </button>
                <button id="ordersTab" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                    <i class="fas fa-shopping-cart mr-2"></i>Siparişler
                </button>
            </nav>
        </div>

        <!-- Tedarikçiler Sekmesi İçeriği -->
        <div id="suppliersContent">
            <div class="flex justify-end mb-6">
                <button id="addSupplierBtn" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200">
                    <i class="fas fa-plus mr-2"></i>Yeni Tedarikçi Ekle
                </button>
            </div>

            <!-- Tedarikçiler Tablosu -->
            <div class="overflow-x-auto">
                <table class="min-w-full table-auto">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="px-6 py-3 text-left">Firma Adı</th>
                            <th class="px-6 py-3 text-left">Yetkili Kişi</th>
                            <th class="px-6 py-3 text-left">Telefon</th>
                            <th class="px-6 py-3 text-left">E-posta</th>
                            <th class="px-6 py-3 text-left">Durum</th>
                            <th class="px-6 py-3 text-left">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody id="suppliersList">
                        <!-- Tedarikçiler buraya dinamik olarak eklenecek -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Siparişler Sekmesi İçeriği -->
        <div id="ordersContent" class="hidden">
            <div class="flex justify-between items-center mb-6">
                <div class="flex space-x-4">
                    <select id="orderStatusFilter" class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                        <option value="">Tüm Durumlar</option>
                        <option value="beklemede">Beklemede</option>
                        <option value="onaylandı">Onaylandı</option>
                        <option value="tamamlandı">Tamamlandı</option>
                        <option value="iptal">İptal Edildi</option>
                    </select>
                    <input type="date" id="orderDateFilter" class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                </div>
                <button id="addOrderBtn" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200">
                    <i class="fas fa-plus mr-2"></i>Yeni Sipariş Oluştur
                </button>
            </div>

            <!-- Siparişler Tablosu -->
            <div class="overflow-x-auto">
                <table class="min-w-full table-auto">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="px-6 py-3 text-left">Sipariş No</th>
                            <th class="px-6 py-3 text-left">Tedarikçi</th>
                            <th class="px-6 py-3 text-left">Tarih</th>
                            <th class="px-6 py-3 text-left">Toplam Tutar</th>
                            <th class="px-6 py-3 text-left">Durum</th>
                            <th class="px-6 py-3 text-left">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody id="ordersList">
                        <!-- Siparişler buraya dinamik olarak eklenecek -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Tedarikçi Ekleme/Düzenleme Modalı -->
        <div id="supplierModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden">
            <div class="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
                <div class="flex flex-col space-y-4">
                    <div class="flex justify-between items-center border-b pb-3">
                        <h3 class="text-xl font-semibold text-gray-900" id="supplierModalTitle">Yeni Tedarikçi Ekle</h3>
                        <button id="closeSupplierModal" class="text-gray-400 hover:text-gray-500">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Firma Adı</label>
                            <input type="text" id="supplierCompany" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Yetkili Kişi</label>
                            <input type="text" id="supplierContact" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                            <input type="tel" id="supplierPhone" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                            <input type="email" id="supplierEmail" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Vergi No</label>
                            <input type="text" id="supplierTaxId" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                            <select id="supplierStatus" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                <option value="aktif">Aktif</option>
                                <option value="pasif">Pasif</option>
                            </select>
                        </div>
                        <div class="col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                            <textarea id="supplierAddress" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"></textarea>
                        </div>
                    </div>

                    <div class="flex justify-end space-x-3 pt-3">
                        <button id="cancelSupplierBtn" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200">
                            İptal
                        </button>
                        <button id="saveSupplierBtn" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200">
                            Kaydet
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sipariş Ekleme/Düzenleme Modalı -->
        <div id="orderModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden">
            <div class="relative top-20 mx-auto p-5 border w-[800px] shadow-lg rounded-md bg-white">
                <div class="flex flex-col space-y-4">
                    <div class="flex justify-between items-center border-b pb-3">
                        <h3 class="text-xl font-semibold text-gray-900" id="orderModalTitle">Yeni Sipariş Oluştur</h3>
                        <button id="closeOrderModal" class="text-gray-400 hover:text-gray-500">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Tedarikçi</label>
                            <select id="orderSupplier" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                <option value="">Tedarikçi Seçin</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Sipariş Durumu</label>
                            <select id="orderStatus" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                <option value="beklemede">Beklemede</option>
                                <option value="onaylandı">Onaylandı</option>
                                <option value="tamamlandı">Tamamlandı</option>
                                <option value="iptal">İptal Edildi</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Sipariş Tarihi</label>
                            <input type="date" id="orderDate" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                        </div>
                    </div>

                    <!-- Sipariş Kalemleri -->
                    <div class="mt-4">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr class="bg-gray-50">
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ürün</th>
                                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Miktar</th>
                                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Birim Fiyat</th>
                                    <th class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">İşlem</th>
                                </tr>
                            </thead>
                            <tbody id="orderItems" class="bg-white divide-y divide-gray-200">
                                <!-- Ürün satırları buraya dinamik olarak eklenecek -->
                            </tbody>
                        </table>
                    </div>
                    <div class="flex justify-between items-center mt-4">
                        <button id="addOrderItemBtn" type="button" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <i class="fas fa-plus mr-2"></i>
                            Ürün Ekle
                        </button>
                        <div class="text-right">
                            <span class="text-lg font-semibold">Toplam:</span>
                            <span id="orderTotal" class="text-lg font-bold ml-2">0,00 ₺</span>
                        </div>
                    </div>

                    <div class="flex justify-end space-x-3 pt-3">
                        <button id="cancelOrderBtn" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200">
                            İptal
                        </button>
                        <button id="saveOrderBtn" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200">
                            Kaydet
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sipariş Detay Modalı -->
        <div id="orderDetailModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
            <div class="relative mx-auto p-4 sm:p-5 w-full max-w-[95%] md:max-w-[80%] lg:max-w-[800px] my-6">
                <div class="bg-white rounded-lg shadow-lg">
                    <div class="flex flex-col space-y-4 p-4 sm:p-5">
                        <div class="flex justify-between items-center border-b pb-3">
                            <h3 class="text-lg sm:text-xl font-semibold text-gray-900">Sipariş Detayları</h3>
                            <button id="closeOrderDetailModal" class="text-gray-400 hover:text-gray-500">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <!-- Sipariş Bilgileri -->
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Sipariş No</label>
                                <p id="orderDetailId" class="mt-1"></p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Tedarikçi</label>
                                <p id="orderDetailSupplier" class="mt-1"></p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Tarih</label>
                                <p id="orderDetailDate" class="mt-1"></p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Durum</label>
                                <p id="orderDetailStatus" class="mt-1"></p>
                            </div>
                        </div>

                        <!-- Sipariş Ürünleri -->
                        <div class="mt-6">
                            <h4 class="text-lg font-medium mb-4">Sipariş Ürünleri</h4>
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr class="bg-gray-50">
                                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ürün/Hizmet</th>
                                            <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Miktar</th>
                                            <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Birim Fiyat</th>
                                            <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Toplam</th>
                                        </tr>
                                    </thead>
                                    <tbody id="orderDetailItems" class="divide-y divide-gray-200">
                                        <!-- Ürünler buraya dinamik olarak eklenecek -->
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="flex justify-between items-center pt-4 border-t">
                            <div class="flex space-x-3">
                                <button id="updateOrderStatusBtn" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
                                    Durumu Güncelle
                                </button>
                                <button id="generateOrderPdfBtn" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200">
                                    <i class="fas fa-file-pdf mr-2"></i>PDF İndir
                                </button>
                            </div>
                            <div>
                                <span class="text-lg font-semibold">Toplam:</span>
                                <span id="orderDetailTotal" class="text-lg font-bold ml-2">0,00 ₺</span>
                            </div>
                        </div>

                        <div class="flex justify-end pt-3">
                            <button id="closeDetailBtn" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200">
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Durum Güncelleme Modalı -->
        <div id="orderStatusModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
            <div class="relative mx-auto p-4 w-full max-w-md my-10">
                <div class="bg-white rounded-lg shadow-lg">
                    <div class="flex flex-col space-y-4 p-4">
                        <div class="flex justify-between items-center border-b pb-3">
                            <h3 class="text-lg font-semibold text-gray-900">Sipariş Durumunu Güncelle</h3>
                            <button id="closeStatusModal" class="text-gray-400 hover:text-gray-500">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Yeni Durum</label>
                            <select id="newOrderStatus" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                <option value="beklemede">Beklemede</option>
                                <option value="onaylandı">Onaylandı</option>
                                <option value="tamamlandı">Tamamlandı</option>
                                <option value="iptal">İptal Edildi</option>
                            </select>
                        </div>

                        <div class="flex justify-end space-x-3 pt-3">
                            <button id="cancelStatusUpdate" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200">
                                İptal
                            </button>
                            <button id="confirmStatusUpdate" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200">
                                Güncelle
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tedarikçi Detay Modalı -->
        <div id="supplierDetailModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-[70]">
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
                                <p id="detailCompany" class="mt-1"></p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Yetkili Kişi</label>
                                <p id="detailContact" class="mt-1"></p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Telefon</label>
                                <p id="detailPhone" class="mt-1"></p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">E-posta</label>
                                <p id="detailEmail" class="mt-1"></p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Vergi No</label>
                                <p id="detailTaxId" class="mt-1"></p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Durum</label>
                                <p id="detailStatus" class="mt-1"></p>
                            </div>
                            <div class="col-span-2">
                                <label class="block text-sm font-medium text-gray-700">Adres</label>
                                <p id="detailAddress" class="mt-1"></p>
                            </div>
                        </div>

                        <!-- Tedarikçi Siparişleri -->
                        <div class="mt-6">
                            <h4 class="text-lg font-medium mb-4">Siparişler</h4>
                            <div id="supplierOrders" class="overflow-x-auto">
                                <!-- Siparişler buraya dinamik olarak eklenecek -->
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

        <!-- Tedarikçi Silme Onay Modalı -->
        <div id="deleteSupplierModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-[70]">
            <div class="relative mx-auto p-4 w-full max-w-md my-10">
                <div class="bg-white rounded-lg shadow-lg">
                    <div class="flex flex-col space-y-4 p-6">
                        <div class="flex items-center justify-center text-red-600 mb-2">
                            <i class="fas fa-exclamation-triangle text-4xl"></i>
                        </div>
                        
                        <h3 class="text-lg font-medium text-gray-900 text-center">Tedarikçiyi Sil</h3>
                        
                        <p class="text-gray-500 text-center">
                            Bu tedarikçiyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                        </p>

                        <div class="flex justify-center space-x-4 pt-4">
                            <button id="cancelDeleteSupplier" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200">
                                İptal
                            </button>
                            <button id="confirmDeleteSupplier" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200">
                                Sil
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sipariş Silme Onay Modalı -->
        <div id="deleteOrderModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-[70]">
            <div class="relative mx-auto p-4 w-full max-w-md my-10">
                <div class="bg-white rounded-lg shadow-lg">
                    <div class="flex flex-col space-y-4 p-6">
                        <div class="flex items-center justify-center text-red-600 mb-2">
                            <i class="fas fa-exclamation-triangle text-4xl"></i>
                        </div>
                        
                        <h3 class="text-lg font-medium text-gray-900 text-center">Siparişi Sil</h3>
                        
                        <p class="text-gray-500 text-center">
                            Bu siparişi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                        </p>

                        <div class="flex justify-center space-x-4 pt-4">
                            <button id="cancelDeleteOrder" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200">
                                İptal
                            </button>
                            <button id="confirmDeleteOrder" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200">
                                Sil
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`; 