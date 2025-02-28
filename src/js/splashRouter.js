// Splash screen ve giriş işlemleri için router
document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splashScreen');
    const loginForm = document.getElementById('loginForm');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const mainContent = document.getElementById('mainContent');
    const progressBar = document.getElementById('progressBar');
    const loadingText = document.getElementById('loadingText');

    // Firebase fonksiyonlarını al
    const { doc, getDoc } = window.firestore;
    const db = window.db;

    // Giriş formunu göster
    setTimeout(() => {
        loginForm.style.opacity = '1';
    }, 1000);

    // Giriş işlemi
    document.getElementById('loginBtn').addEventListener('click', async () => {
        const passwordInput = document.getElementById('password');
        const password = passwordInput.value;

        try {
            const docRef = doc(db, 'settings', 'security');
            const docSnap = await getDoc(docRef);
            
            if (!docSnap.exists()) {
                if (password === '123456') {
                    loginSuccess();
                } else {
                    showNotification('Hatalı şifre!', 'error');
                    handleLoginError(passwordInput);
                }
            } else {
                if (password === docSnap.data().password) {
                    loginSuccess();
                } else {
                    showNotification('Hatalı şifre!', 'error');
                    handleLoginError(passwordInput);
                }
            }
        } catch (error) {
            console.error('Giriş yapılırken hata:', error);
            showNotification('Giriş yapılırken bir hata oluştu!', 'error');
            handleLoginError(passwordInput);
        }
    });

    // Enter tuşu ile giriş
    document.getElementById('password').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('loginBtn').click();
        }
    });

    // Başarılı giriş
    function loginSuccess() {
        loginForm.style.opacity = '0';
        setTimeout(() => {
            loginForm.style.display = 'none';
            loadingIndicator.classList.remove('hidden');
            startLoading();
        }, 500);
    }

    // Hatalı giriş
    function handleLoginError(passwordInput) {
        passwordInput.value = '';
        passwordInput.focus();
        
        passwordInput.classList.add('shake-animation');
        setTimeout(() => {
            passwordInput.classList.remove('shake-animation');
        }, 500);
    }

    // Bildirim mesajı gösterme fonksiyonu
    function showNotification(message, type = 'success') {
        // Varsa eski bildirimi kaldır
        const existingNotification = document.querySelector('.notification-message');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Yeni bildirim oluştur
        const notificationDiv = document.createElement('div');
        notificationDiv.className = `notification-message ${type}-message`;
        
        // İkon seç
        const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
        
        notificationDiv.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;

        // Sayfaya ekle
        document.body.appendChild(notificationDiv);

        // Animasyonu başlat
        setTimeout(() => {
            notificationDiv.classList.add('show');
        }, 100);

        // Belirli süre sonra kaldır
        setTimeout(() => {
            notificationDiv.classList.remove('show');
            setTimeout(() => {
                notificationDiv.remove();
            }, 300);
        }, 3000);
    }

    // Yükleme işlemi
    async function startLoading() {
        const loadingSteps = [
            { text: 'Veritabanı bağlantısı kuruluyor...', progress: 20 },
            { text: 'Kategoriler yükleniyor...', progress: 40 },
            { text: 'Ürünler yükleniyor...', progress: 60 },
            { text: 'Müşteri verileri yükleniyor...', progress: 80 },
            { text: 'Uygulama başlatılıyor...', progress: 100 }
        ];

        for (const step of loadingSteps) {
            await simulateLoading(step.text, step.progress);
        }

        setTimeout(() => {
            splashScreen.style.opacity = '0';
            mainContent.classList.remove('hidden');
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 500);
        }, 1000);
    }

    // Yükleme simülasyonu
    function simulateLoading(text, progress) {
        return new Promise(resolve => {
            setTimeout(() => {
                loadingText.textContent = text;
                progressBar.style.width = `${progress}%`;
                resolve();
            }, 800);
        });
    }
}); 