export const quotesTemplate = `
    <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">Teklifler</h2>
            <button id="addQuoteBtn" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200">
                <i class="fas fa-plus mr-2"></i>Yeni Teklif Ekle
            </button>
        </div>

        <!-- Teklif Ekleme/Düzenleme Modalı -->
        <div id="quoteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
            <div class="relative top-20 mx-auto p-5 border w-[800px] shadow-lg rounded-md bg-white">
                <div class="flex flex-col space-y-4">
                    <div class="flex justify-between items-center border-b pb-3">
                        <h3 id="quoteModalTitle" class="text-xl font-semibold text-gray-900">Yeni Teklif Ekle</h3>
                        <button id="closeQuoteModal" class="text-gray-400 hover:text-gray-500">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="space-y-4">
                        <!-- Müşteri Bilgileri -->
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Müşteri Seçin</label>
                                <select id="quoteCustomer" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                    <option value="">Müşteri Seçin</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Vergi No</label>
                                <input type="text" id="customerTaxId" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                                <input type="tel" id="customerPhone" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                                <input type="email" id="customerEmail" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                                <textarea id="customerAddress" rows="2"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"></textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Geçerlilik Tarihi</label>
                                <input type="date" id="validUntil" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Teklif Durumu</label>
                                <select id="quoteStatus" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                    <option value="beklemede">Beklemede</option>
                                    <option value="onaylandı">Onaylandı</option>
                                    <option value="reddedildi">Reddedildi</option>
                                </select>
                            </div>
                        </div>

                        <!-- Ürün/Hizmet Listesi -->
                        <div class="mt-4">
                            <div class="flex justify-between items-center mb-2">
                                <h4 class="text-lg font-medium">Ürün/Hizmet Listesi</h4>
                                <button id="addQuoteItemBtn" class="text-indigo-600 hover:text-indigo-800">
                                    <i class="fas fa-plus mr-1"></i>Yeni Ürün Ekle
                                </button>
                            </div>
                            <table class="min-w-full">
                                <thead>
                                    <tr class="bg-gray-50">
                                        <th class="px-4 py-2 text-left">Kategori</th>
                                        <th class="px-4 py-2 text-left">Ürün/Hizmet</th>
                                        <th class="px-4 py-2 text-center w-24">Miktar</th>
                                        <th class="px-4 py-2 text-right w-32">Birim Fiyat</th>
                                        <th class="px-4 py-2 text-right w-32">Toplam</th>
                                        <th class="px-4 py-2 w-16"></th>
                                    </tr>
                                </thead>
                                <tbody id="quoteItems" class="divide-y divide-gray-200">
                                    <!-- Ürünler buraya dinamik olarak eklenecek -->
                                </tbody>
                                <tfoot>
                                    <tr class="border-t font-semibold">
                                        <td colspan="3" class="px-4 py-2 text-right">Ara Toplam:</td>
                                        <td id="quoteSubtotal" class="px-4 py-2 text-right w-32"></td>
                                        <td></td>
                                    </tr>
                                    <tr class="border-t-2 border-gray-300 font-bold">
                                        <td colspan="3" class="px-4 py-2 text-right">Genel Toplam:</td>
                                        <td id="quoteTotal" class="px-4 py-2 text-right w-32"></td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    <div class="flex justify-end space-x-3 pt-3">
                        <button id="cancelQuoteBtn" 
                            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200">
                            İptal
                        </button>
                        <button id="saveQuoteBtn" 
                            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200">
                            Kaydet
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Teklif Silme Modalı -->
        <div id="deleteQuoteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
            <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div class="mt-3 text-center">
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                        <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                    </div>
                    <h3 class="text-lg leading-6 font-medium text-gray-900 mt-4">Teklifi Sil</h3>
                    <div class="mt-2 px-7 py-3">
                        <p class="text-sm text-gray-500">
                            Bu teklifi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                        </p>
                    </div>
                    <div class="flex justify-center gap-4 mt-4">
                        <button id="cancelDeleteQuote" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200">
                            İptal
                        </button>
                        <button id="confirmDeleteQuote" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200">
                            Sil
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Teklifler Tablosu -->
        <div class="overflow-x-auto">
            <table class="min-w-full table-auto divide-y divide-gray-200">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="px-6 py-3 text-left border-b">Teklif No</th>
                        <th class="px-6 py-3 text-left border-b">Müşteri</th>
                        <th class="px-6 py-3 text-left border-b">Tarih</th>
                        <th class="px-6 py-3 text-left border-b">Durum</th>
                        <th class="px-6 py-3 text-left border-b">Toplam</th>
                        <th class="px-6 py-3 text-left border-b">İşlemler</th>
                    </tr>
                </thead>
                <tbody id="quotesList" class="bg-white divide-y divide-gray-200">
                    <!-- Teklifler buraya dinamik olarak eklenecek -->
                </tbody>
            </table>
        </div>
    </div>
`; 