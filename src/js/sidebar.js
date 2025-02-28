document.addEventListener('DOMContentLoaded', () => {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const content = document.querySelector('main');
    const menuTexts = document.querySelectorAll('.menu-text');
    const menuIcons = document.querySelectorAll('.menu-icon');
    const logoFull = document.querySelector('.logo-full');
    const logoMini = document.querySelector('.logo-mini');
    let isSidebarOpen = true;

    function toggleSidebar() {
        isSidebarOpen = !isSidebarOpen;
        
        if (isSidebarOpen) {
            sidebar.classList.remove('w-16');
            sidebar.classList.add('w-64');
            sidebar.classList.remove('-translate-x-full');
            sidebar.classList.add('translate-x-0');
            content.classList.remove('ml-0');
            content.classList.add('md:ml-64');
            menuTexts.forEach(text => {
                text.style.position = 'static';
                text.style.transform = 'none';
                text.style.opacity = '1';
            });
            logoFull.classList.remove('hidden');
            logoMini.classList.add('hidden');
            sidebarToggle.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            sidebar.classList.remove('w-64');
            sidebar.classList.add('w-16');
            menuTexts.forEach(text => {
                text.style.position = 'absolute';
                text.style.opacity = '0';
            });
            content.classList.remove('md:ml-64');
            content.classList.add('ml-16');
            logoFull.classList.add('hidden');
            logoMini.classList.remove('hidden');
            sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }

    // Toggle butonu tıklama olayı
    sidebarToggle.addEventListener('click', toggleSidebar);

    // Sayfa yüklendiğinde sidebar'ı açık başlat
    if (isSidebarOpen) {
        sidebar.classList.remove('-translate-x-full');
        sidebar.classList.add('translate-x-0', 'w-64');
        content.classList.add('md:ml-64');
        menuTexts.forEach(text => {
            text.style.position = 'static';
            text.style.transform = 'none';
            text.style.opacity = '1';
        });
        logoFull.classList.remove('hidden');
        logoMini.classList.add('hidden');
    }
}); 