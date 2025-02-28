import { 
    collection,
    getDocs,
    doc,
    getDoc,
    setDoc,
    db
} from './services/firebaseService.js';

import { showNotification } from './utils/helpers.js';

export class SettingsRouter {
    constructor() {
        this.initSettingsPage();
    }

    async initSettingsPage() {
        // Sekme değiştirme işlemleri
        this.initTabs();
        
        // Form işlemleri
        this.initInterfaceForm();
        this.initCompanyForm();
        this.initSecurityForm();
        
        // Sayfa yüklendiğinde verileri yükle
        await this.loadInterfaceSettings();
        await this.loadCompanySettings();
        await this.loadSecuritySettings();
    }

    initTabs() {
        const tabs = document.querySelectorAll('.settings-tab');
        const tabContents = document.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Aktif sekmeyi güncelle
                tabs.forEach(t => {
                    t.classList.remove('border-indigo-500', 'text-indigo-600');
                    t.classList.add('border-transparent', 'text-gray-500');
                });
                tab.classList.remove('border-transparent', 'text-gray-500');
                tab.classList.add('border-indigo-500', 'text-indigo-600');

                // İçeriği güncelle
                const tabId = tab.dataset.tab;
                tabContents.forEach(content => {
                    content.classList.add('hidden');
                });
                document.getElementById(`${tabId}Tab`).classList.remove('hidden');
            });
        });

        // Varsayılan sekmeyi göster
        document.querySelector('[data-tab="company"]').click();
    }

    applyInterfaceSettings(settings) {
        // Tema ayarı
        const root = document.documentElement;
        const body = document.body;

        // Önce tüm tema sınıflarını kaldır
        root.classList.remove('dark', 'dark-modern');
        body.classList.remove('bg-gray-900', 'bg-gray-100');

        if (settings.theme === 'dark') {
            root.classList.add('dark');
            body.classList.add('bg-gray-900');
        } else if (settings.theme === 'dark-modern') {
            root.classList.add('dark-modern');
            body.classList.add('bg-gray-900');
        } else if (settings.theme === 'light') {
            body.classList.add('bg-gray-100');
        } else if (settings.theme === 'system') {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                root.classList.add('dark');
                body.classList.add('bg-gray-900');
            } else {
                body.classList.add('bg-gray-100');
            }
        }

        // Yazı boyutu ayarı
        const fontSize = {
            'small': '14px',
            'medium': '16px',
            'large': '18px'
        }[settings.fontSize] || '16px';
        body.style.fontSize = fontSize;
    }

    async loadInterfaceSettings() {
        try {
            const docSnap = await getDoc(doc(db, 'settings', 'interface'));
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Form elemanlarını güncelle
                Object.keys(data).forEach(key => {
                    const input = document.getElementById(key);
                    if (input) {
                        if (input.type === 'checkbox') {
                            input.checked = data[key];
                        } else {
                            input.value = data[key];
                        }
                    }
                });
                // Ayarları uygula
                this.applyInterfaceSettings(data);
            }
        } catch (error) {
            console.error('Arayüz ayarları yüklenirken hata:', error);
            showNotification('Arayüz ayarları yüklenirken bir hata oluştu!', 'error');
        }
    }

    initInterfaceForm() {
        const form = document.getElementById('interfaceForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                try {
                    const formData = {
                        theme: document.getElementById('theme').value,
                        fontSize: document.getElementById('fontSize').value
                    };

                    await setDoc(doc(db, 'settings', 'interface'), formData);
                    this.applyInterfaceSettings(formData);
                    showNotification('Arayüz ayarları kaydedildi!');
                } catch (error) {
                    console.error('Arayüz ayarları kaydedilirken hata:', error);
                    showNotification('Arayüz ayarları kaydedilirken bir hata oluştu!', 'error');
                }
            });
        }
    }

    async loadCompanySettings() {
        try {
            const docSnap = await getDoc(doc(db, 'settings', 'company'));
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Form elemanlarını güncelle
                const inputs = {
                    companyName: document.getElementById('companyName'),
                    companyTaxId: document.getElementById('companyTaxId'),
                    companyPhone: document.getElementById('companyPhone'),
                    companyEmail: document.getElementById('companyEmail'),
                    companyAddress: document.getElementById('companyAddress'),
                    companyWebsite: document.getElementById('companyWebsite'),
                    companyBankInfo: document.getElementById('companyBankInfo')
                };

                // Her bir input için değeri ayarla
                Object.keys(inputs).forEach(key => {
                    if (inputs[key] && data[key.replace('company', '').toLowerCase()]) {
                        inputs[key].value = data[key.replace('company', '').toLowerCase()];
                    }
                });
            }
        } catch (error) {
            console.error('Firma bilgileri yüklenirken hata:', error);
            showNotification('Firma bilgileri yüklenirken bir hata oluştu!', 'error');
        }
    }

    initCompanyForm() {
        const form = document.getElementById('companyForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                try {
                    const formData = {
                        name: document.getElementById('companyName').value,
                        taxId: document.getElementById('companyTaxId').value,
                        phone: document.getElementById('companyPhone').value,
                        email: document.getElementById('companyEmail').value,
                        address: document.getElementById('companyAddress').value,
                        website: document.getElementById('companyWebsite').value,
                        bankInfo: document.getElementById('companyBankInfo').value,
                        updatedAt: new Date()
                    };

                    await setDoc(doc(db, 'settings', 'company'), formData);
                    showNotification('Firma bilgileri başarıyla kaydedildi!');
                } catch (error) {
                    console.error('Firma bilgileri kaydedilirken hata:', error);
                    showNotification('Firma bilgileri kaydedilirken bir hata oluştu!', 'error');
                }
            });
        }
    }

    async loadSecuritySettings() {
        try {
            const docSnap = await getDoc(doc(db, 'settings', 'security'));
            if (!docSnap.exists()) {
                // İlk kurulum için varsayılan şifreyi kaydet
                await setDoc(doc(db, 'settings', 'security'), {
                    password: '123456' // Varsayılan şifre
                });
            }
        } catch (error) {
            console.error('Güvenlik ayarları yüklenirken hata:', error);
        }
    }

    initSecurityForm() {
        const securityForm = document.getElementById('securityForm');
        if (securityForm) {
            securityForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const currentPassword = document.getElementById('currentPassword').value;
                const newPassword = document.getElementById('newPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;

                try {
                    // Mevcut şifreyi kontrol et
                    const docSnap = await getDoc(doc(db, 'settings', 'security'));
                    if (!docSnap.exists() || docSnap.data().password !== currentPassword) {
                        showNotification('Mevcut şifre hatalı!', 'error');
                        return;
                    }

                    // Yeni şifre kontrolü
                    if (newPassword.length < 6) {
                        showNotification('Yeni şifre en az 6 karakter olmalıdır!', 'error');
                        return;
                    }

                    if (newPassword !== confirmPassword) {
                        showNotification('Yeni şifreler eşleşmiyor!', 'error');
                        return;
                    }

                    // Şifreyi güncelle
                    await setDoc(doc(db, 'settings', 'security'), {
                        password: newPassword
                    });

                    // Formu temizle
                    e.target.reset();
                    showNotification('Şifre başarıyla güncellendi!');
                } catch (error) {
                    console.error('Şifre güncellenirken hata:', error);
                    showNotification('Şifre güncellenirken bir hata oluştu!', 'error');
                }
            });
        }
    }
} 