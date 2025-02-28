// Form temizleme fonksiyonları
export function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.type === 'checkbox' || input.type === 'radio') {
                input.checked = false;
            } else {
                input.value = '';
            }
        });
    }
}

// Modal işlemleri için yardımcı fonksiyonlar
export function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

export function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
    }
}


// Para formatı
export function formatCurrency(amount) {
    const formattedNumber = new Intl.NumberFormat('tr-TR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
    
    return `${formattedNumber} TL`;
}

// Tarih formatı
export function formatDate(date) {
    return new Date(date).toLocaleDateString('tr-TR');
}

// Input validasyonu
export function validateInput(value, type = 'text') {
    switch(type) {
        case 'email':
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        case 'phone':
            return /^[0-9]{10}$/.test(value.replace(/[^0-9]/g, ''));
        case 'number':
            return !isNaN(value) && value !== '';
        case 'required':
            return value !== null && value.trim() !== '';
        default:
            return true;
    }
}

// Hata mesajı gösterme
export function showError(message, duration = 3000) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.remove();
    }, duration);
}

// Başarı mesajı gösterme
export function showSuccess(message, duration = 3000) {
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);

    setTimeout(() => {
        successDiv.remove();
    }, duration);
}

// Event listener'ı güvenli bir şekilde değiştirme
export function replaceEventListener(element, eventType, handler) {
    if (element) {
        const newElement = element.cloneNode(true);
        element.parentNode.replaceChild(newElement, element);
        newElement.addEventListener(eventType, handler);
        return newElement;
    }
    return null;
}

// Bildirim gösterme fonksiyonu
export function showNotification(message, type = 'success') {
    // Varolan bildirimleri temizle
    const existingNotifications = document.querySelectorAll('.notification-message');
    existingNotifications.forEach(notification => {
        notification.remove();
    });

    // Yeni bildirim oluştur
    const notification = document.createElement('div');
    notification.className = `notification-message ${type}-message`;
    
    // İkon seç
    let icon = '';
    if (type === 'success') {
        icon = '<i class="fas fa-check-circle"></i>';
    } else if (type === 'error') {
        icon = '<i class="fas fa-exclamation-circle"></i>';
    }

    // Bildirim içeriğini ayarla
    notification.innerHTML = `
        ${icon}
        <span>${message}</span>
    `;

    // Bildirimi DOM'a ekle
    document.body.appendChild(notification);

    // Animasyonu başlat
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Bildirimi kaldır
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Durum metni
export function getStatusText(status) {
    const statusMap = {
        'beklemede': 'Beklemede',
        'onaylandı': 'Onaylandı',
        'tamamlandı': 'Tamamlandı',
        'iptal': 'İptal Edildi',
        'reddedildi': 'Reddedildi'
    };
    return statusMap[status] || status;
}

// Durum renk sınıfı
export function getStatusClass(status) {
    const classMap = {
        'beklemede': 'bg-yellow-100 text-yellow-800',
        'onaylandı': 'bg-green-100 text-green-800',
        'tamamlandı': 'bg-blue-100 text-blue-800',
        'iptal': 'bg-red-100 text-red-800',
        'reddedildi': 'bg-red-100 text-red-800'
    };
    return classMap[status] || 'bg-gray-100 text-gray-800';
} 