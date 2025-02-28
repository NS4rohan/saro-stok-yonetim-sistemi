# 🌟 Saro Stok Yönetim Sistemi

## 📖 Proje Hakkında
Saro Stok Yönetim Sistemi, stok takibi ve yönetimi için geliştirilmiş bir uygulamadır. Kullanıcıların ürünlerini kolayca yönetmelerine olanak tanır.

## 🚀 Özellikler
- **Gerçek Zamanlı Veri:** Firebase kullanarak gerçek zamanlı veri güncellemeleri. 📊
- **Grafiksel Analiz:** Chart.js ile grafiksel veri analizi. 📈
- **Modern Tasarım:** Tailwind CSS ile modern ve kullanıcı dostu arayüz. 🎨
- **Gelişmiş Yönlendirme:** Kullanıcıların farklı sayfalara geçiş yapmasını sağlayan bir yönlendirme sistemi. 🚦
- **Dashboard:** Kullanıcıların genel bir bakış elde ettiği ana sayfa. 📊
- **Ürün Yönetimi:** Ürün ekleme, güncelleme ve silme işlemleri. 🛒
- **Müşteri Yönetimi:** Müşteri bilgilerini ekleme ve güncelleme. 👥
- **Tedarikçi Yönetimi:** Tedarikçi bilgilerini yönetme. 🏢
- **Finans Yönetimi:** Gelir ve gider takibi için finans modülü. 💰
- **Teklif Yönetimi:** Ürünler için teklif oluşturma ve yönetme. 📝
- **PDF Raporlama:** Gelir ve gider raporlarını PDF formatında oluşturma. ��
- **Ayarlar:** Uygulama ayarlarını değiştirme ve kişiselleştirme. ⚙️  Varsayılan şifre: **123456**. Şifre değiştirildiğinde, yeni şifre Firebase'e kaydedilir ve bir sonraki girişte bu şifre ile oturum açılması gerekmektedir.
- **Firma Bilgileri:** Ayarlar sayfasında girilen firma bilgileri, PDF raporlarında da yer alacaktır.
- **Güvenlik:** Firebase ile entegre güvenlik kuralları. 🔒

## 📦 Kurulum
1. Projeyi klonlayın:
   ```bash
   git clone https://github.com/NS4rohan/saro-stok-yonetim-sistemi.git
   cd saro-stok-yonetim-sistemi
   ```
2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
3. Uygulamayı başlatın:
   ```bash
   npm start
   ```

## 🛠️ Geliştirme
- Geliştirme modunda çalıştırmak için:
   ```bash
   npm run dev
   ```
- CSS dosyalarını oluşturmak için:
   ```bash
   npm run build:css
   ```

## 📦 Yapım
Uygulamayı paketlemek için:
```bash
npm run build
```



## 🔥 Firebase Kurulumu ve Kullanımı

### 🔧 Firebase Projesi Oluşturma
1. [Firebase Console](https://console.firebase.google.com/) adresine gidin.
2. Yeni bir proje oluşturun ve gerekli bilgileri doldurun.
3. Proje ayarlarından `Web Uygulaması` ekleyin ve yapılandırma bilgilerini alın.

### 🔗 Firebase Bağlantısı
Projenizde Firebase'i kullanmak için aşağıdaki adımları izleyin:

1. Firebase'i projeye ekleyin:
   ```bash
   npm install firebase
   ```

2. Firebase yapılandırma ayarlarını `firebase.js` dosyasına ekleyin:
   ```javascript
   // Firebase yapılandırması
   const firebaseConfig = {
       apiKey: "your-api-key",
       authDomain: "your-auth-domain",
       projectId: "your-project-id",
       storageBucket: "your-storage-bucket",
       messagingSenderId: "your-messaging-sender-id",
       appId: "your-app-id"
   };
   
   // Firebase'i başlat
   const app = initializeApp(firebaseConfig);
   const db = getFirestore(app);
   const auth = getAuth(app);
   ```

### 🔍 Kullanılan İndeksler
Firebase Console'da aşağıdaki indeksler eklenmiştir:

![İndeksler](https://github.com/NS4rohan/saro-stok-yonetim-sistemi/blob/main/screenshot/10.png)

### 🔒 Güvenlik Kuralları
Firebase Firestore için güvenlik kurallarını ayarlamak için:
1. Firebase Console'da `Firestore Database` sekmesine gidin.
2. `Kurallar` sekmesine tıklayın ve aşağıdaki örnek kuralları ekleyin:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

### 📤 Uygulama Çıktısı Alma
Uygulamanızı paketlemek ve çalıştırmak için:
1. Uygulamayı geliştirme modunda çalıştırmak için:
   ```bash
   npm run dev
   ```
2. Uygulamayı paketlemek için:
   ```bash
   npm run build
   ```
3. Oluşan `dist` klasöründeki dosyaları kullanarak uygulamanızı dağıtabilirsiniz.

## 📸 Uygulama Ekran Görüntüleri

Aşağıda uygulamanın farklı bölümlerine ait ekran görüntüleri bulunmaktadır:

### Giriş Ekranı
![Giriş Ekranı](https://github.com/NS4rohan/saro-stok-yonetim-sistemi/blob/main/screenshot/1.png)

### Dashboard Ekranı
![Giriş Ekranı](https://github.com/NS4rohan/saro-stok-yonetim-sistemi/blob/main/screenshot/2.png)

### Kategoriler Ekranı
![Kategoriler Ekranı](https://github.com/NS4rohan/saro-stok-yonetim-sistemi/blob/main/screenshot/3.gif)

### Ürünler Ekranı
![Ürünler Ekranı](https://github.com/NS4rohan/saro-stok-yonetim-sistemi/blob/main/screenshot/4.gif)

### Müşteriler Ekranı
![Müşteriler Ekranı](https://github.com/NS4rohan/saro-stok-yonetim-sistemi/blob/main/screenshot/5.gif)

### Tedarikçi Ekranı
![Tedarikçi Ekranı](https://github.com/NS4rohan/saro-stok-yonetim-sistemi/blob/main/screenshot/6.gif)

### Teklifler Ekranı
![Teklifler Ekranı](https://github.com/NS4rohan/saro-stok-yonetim-sistemi/blob/main/screenshot/7.gif)

### Gelir/Gifer Ekranı
![Gelir/Gider Ekranı](https://github.com/NS4rohan/saro-stok-yonetim-sistemi/blob/main/screenshot/8.gif)

### Ayarlar Ekranı
![Gelir/Gider Ekranı](https://github.com/NS4rohan/saro-stok-yonetim-sistemi/blob/main/screenshot/9.gif)



## 📜 Lisans
Bu proje MIT lisansı altında lisanslanmıştır.

MIT Lisansı

Copyright (c) [2025] [NS4rohan]

İzin verilir, ücretsiz olarak, herhangi bir kişi veya kuruluşun, bu yazılımı ve ilgili belgeleri (bundan sonra "Yazılım" olarak anılacaktır) kopyalaması, kullanması, değiştirmesi, birleştirmesi, yayımlaması, dağıtması ve satması için, aşağıdaki koşullara tabi olarak, bu yazılımın kopyalarını elde etmesine izin verilir:

YAZILIM, "OLDUĞU GİBİ" SUNULMAKTADIR, AÇIK VEYA ZIMNİ HERHANGİ BİR GARANTİ YOKTUR, TİCARETİ YAPILABİLİR, BELİRLİ BİR AMACA UYGUNLUK VEYA İHLAL ETMEME GARANTİSİ DAHİL OLMAK ÜZERE. YAZILIMIN KULLANIMINDAN VEYA KULLANILAMAMASINDAN KAYNAKLANAN HERHANGİ BİR ZARAR İÇİN YAZARLAR VEYA TELİF HAKKI SAHİPLERİ SORUMLU TUTULAMAZ.
