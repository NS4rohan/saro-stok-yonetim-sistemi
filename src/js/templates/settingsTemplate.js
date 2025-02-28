export const settingsTemplate = `
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Sekmeler -->
        <div class="border-b border-gray-200">
            <nav class="flex space-x-8" aria-label="Tabs">
                <button class="settings-tab active-tab" data-tab="company">
                    <i class="fas fa-building mr-2"></i>
                    Firma Bilgileri
                </button>
                <button class="settings-tab" data-tab="interface">
                    <i class="fas fa-palette mr-2"></i>
                    Arayüz Ayarları
                </button>
                <button class="settings-tab" data-tab="security">
                    <i class="fas fa-shield-alt mr-2"></i>
                    Güvenlik
                </button>
                <button class="settings-tab" data-tab="about">
                    <i class="fas fa-info-circle mr-2"></i>
                    Hakkında
                </button>
            </nav>
        </div>
                                
        <!-- Sekme İçerikleri -->
        <div class="mt-8">
            <!-- Firma Bilgileri -->
            <div id="companyTab" class="tab-content active">
                <div class="bg-white rounded-lg shadow p-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-6">Firma Bilgileri</h2>
                    <form id="companyForm" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Firma Adı</label>
                                <input type="text" id="companyName" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Vergi Numarası</label>
                                <input type="text" id="companyTaxId" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                                <input type="tel" id="companyPhone" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                                <input type="email" id="companyEmail" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900">
                            </div>
                            <div class="col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                                <textarea id="companyAddress" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900"></textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Web Sitesi</label>
                                <input type="url" id="companyWebsite" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Banka Bilgileri</label>
                                <input type="text" id="companyBankInfo" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900">
                            </div>
                        </div>
                        <div class="flex justify-end">
                            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200">
                                <i class="fas fa-save mr-2"></i>Kaydet
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Arayüz Ayarları -->
            <div id="interfaceTab" class="tab-content hidden">
                <div class="bg-white rounded-lg shadow p-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-6">Arayüz Ayarları</h2>
                    <form id="interfaceForm" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Tema</label>
                                <select id="theme" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900">
                                    <option value="light">Açık Tema</option>
                                    <option value="dark">Koyu Tema</option>
                                    <option value="system">Sistem Teması</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Yazı Boyutu</label>
                                <select id="fontSize" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900">
                                    <option value="small">Küçük</option>
                                    <option value="medium">Orta</option>
                                    <option value="large">Büyük</option>
                                </select>
                            </div>
                        </div>
                        <div class="flex justify-end">
                            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200">
                                <i class="fas fa-save mr-2"></i>Kaydet
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Güvenlik -->
            <div id="securityTab" class="tab-content hidden">
                <div class="bg-white rounded-lg shadow p-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-6">Güvenlik Ayarları</h2>
                    <form id="securityForm" class="space-y-6">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Mevcut Şifre</label>
                                <input type="password" id="currentPassword" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre</label>
                                <input type="password" id="newPassword" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre (Tekrar)</label>
                                <input type="password" id="confirmPassword" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900">
                            </div>
                        </div>
                        <div class="flex justify-end">
                            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200">
                                <i class="fas fa-save mr-2"></i>Şifreyi Güncelle
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Hakkında -->
            <div id="aboutTab" class="tab-content hidden">
                <div class="bg-white rounded-lg shadow p-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-6">Uygulama Hakkında</h2>
                    <div class="space-y-6">
                        <div class="flex items-center justify-center mb-8">
                            <div class="text-center">
                                <i class="fas fa-boxes text-indigo-600 text-6xl mb-4"></i>
                                <h1 class="text-3xl font-bold text-gray-900">Saro Stok</h1>
                                <p class="text-gray-600">Stok Yönetim Sistemi</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 class="text-md font-medium text-gray-700 mb-2">Uygulama Bilgileri</h3>
                                <div class="space-y-2">
                                    <p class="text-gray-600"><span class="font-medium">Versiyon:</span> 1.0.0</p>
                                    <p class="text-gray-600"><span class="font-medium">Son Güncelleme:</span> ${new Date().toLocaleDateString('tr-TR')}</p>
                                    <p class="text-gray-600"><span class="font-medium">Lisans:</span> Bu uygulama MIT lisansı altında lisanslanmıştır.</p>
                                </div>
                            </div>
                            <div>
                                <h3 class="text-md font-medium text-gray-700 mb-2">Geliştirici Bilgileri</h3>
                                <div class="space-y-2">
                                    <p class="text-gray-600"><span class="font-medium">Geliştirici:</span> NS4rohan</p>
                                    <p class="text-gray-600"><span class="font-medium">GitHub:</span> <a href="https://github.com/NS4rohan" target="_blank">NS4rohan</a></p>
                                </div>
                            </div>
                        </div>

                        <div class="mt-8 border-t pt-6">
                            <h3 class="text-md font-medium text-gray-700 mb-4">Özellikler</h3>
                            <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <li class="flex items-center text-gray-600">
                                    <i class="fas fa-check text-green-500 mr-2"></i>
                                    Stok Takibi
                                </li>
                                <li class="flex items-center text-gray-600">
                                    <i class="fas fa-check text-green-500 mr-2"></i>
                                    Müşteri Yönetimi
                                </li>
                                <li class="flex items-center text-gray-600">
                                    <i class="fas fa-check text-green-500 mr-2"></i>
                                    Tedarikçi Yönetimi
                                </li>
                                <li class="flex items-center text-gray-600">
                                    <i class="fas fa-check text-green-500 mr-2"></i>
                                    Teklif Yönetimi
                                </li>
                                <li class="flex items-center text-gray-600">
                                    <i class="fas fa-check text-green-500 mr-2"></i>
                                    Gelir/Gider Takibi
                                </li>
                                <li class="flex items-center text-gray-600">
                                    <i class="fas fa-check text-green-500 mr-2"></i>
                                    PDF Raporlama
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`; 