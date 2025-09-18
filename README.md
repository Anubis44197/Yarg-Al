# Yargı AI - Hukuki Belge Arama Motoru

Bu proje, `yargi-mcp` adlı güçlü bir yerel arama motorunu, Google Gemini AI'ın yetenekleriyle birleştiren modern bir web arayüzüdür. Kullanıcıların doğal dil sorguları kullanarak karmaşık hukuki belgeler, mahkeme kararları ve makaleler arasında arama yapmasını ve bulunan metinleri yapay zeka ile özetlemesini sağlar.

## Projenin Mimarisi

Bu uygulama iki ana bileşenden oluşur:

1.  **Backend (MCP Motoru):** `yargi-mcp` projesi, sizin bilgisayarınızda yerel olarak çalışan "motordur". Tüm arama ve belge getirme işlemleri bu sunucu tarafından gerçekleştirilir. **Bu sunucu çalışmadan arayüz işlev görmez.**
2.  **Frontend (Bu Arayüz):** Sizin şu anda kullandığınız, React ile geliştirilmiş web uygulamasıdır. Kullanıcının arama yaptığı, sonuçları gördüğü ve yapay zeka özetlerini okuduğu "gösterge panelidir".

---

## Kurulum ve Çalıştırma Talimatları (Windows)

Uygulamayı çalıştırmak için **iki ayrı terminal penceresine** ihtiyacınız olacak: biri Backend, diğeri Frontend için.

### 1. Adım: Ön Gereksinimlerin Kurulumu

Bu adımlar **sadece ilk kurulumda** bir kez yapılır. Eğer bu araçlar sisteminizde zaten yüklüyse bir sonraki adıma geçebilirsiniz.

-   **Git:** Proje dosyalarını indirmek için gereklidir.
    -   [Buradan Git'i İndirin](https://git-scm.com/downloads/) ve kurulumu tamamlayın.
-   **Python 3.8+:** MCP motorunu çalıştırmak için gereklidir.
    -   [Buradan Python'ı İndirin](https://www.python.org/downloads/).
    -   **ÇOK ÖNEMLİ:** Kurulumu başlatırken alttaki **"Add Python to PATH"** kutucuğunu mutlaka işaretleyin.
-   **Microsoft C++ Araçları:** Python paketlerinin kurulumu için gereklidir.
    -   [Buradan "Microsoft C++ Build Tools"u İndirin](https://visualstudio.microsoft.com/tr/visual-cpp-build-tools/).
    -   İndirilen dosyayı çalıştırın ve açılan pencerede **"C++ ile masaüstü geliştirme"** seçeneğini işaretleyip sağ alttan **"Yükle"** butonuna basın.

### 2. Adım: Backend (MCP Motoru) Kurulumu ve Çalıştırılması

Bu adımlar arama motorunu kurup başlatacaktır.

1.  **Terminal 1'i Açın:** Windows'ta Başlat menüsüne `cmd` yazarak "Komut İstemi"ni açın.
2.  **Projeyi Bilgisayarınıza İndirin:** Aşağıdaki komutu kopyalayıp terminale yapıştırın ve Enter'a basın.
    ```bash
    git clone https://github.com/saidsurucu/yargi-mcp.git
    ```
3.  **Proje Klasörüne Girin:**
    ```bash
    cd yargi-mcp
    ```
4.  **Gerekli Paketleri Yükleyin:** Bu komut, motorun çalışması için gereken tüm kütüphaneleri yükleyecektir. İnternet hızınıza bağlı olarak bir-iki dakika sürebilir.
    ```bash
    pip install -e ".[asgi]"
    ```
5.  **Motoru Başlatın:** Artık arama motorunu çalıştırabilirsiniz.
    ```bash
    python run_asgi.py
    ```
    Terminalde sunucunun `http://127.0.0.1:8000` adresinde çalıştığını belirten mesajlar göreceksiniz. **Bu terminal penceresini, arayüzü kullandığınız sürece kapatmayın.**

### 3. Adım: Frontend (Arayüz) Çalıştırılması

Backend sunucusu çalışırken, şimdi arayüzü başlatacağız.

1.  **Terminal 2'yi Açın:** **Yeni bir "Komut İstemi"** penceresi daha açın.
2.  **Proje Klasörüne Gidin:** Backend için girdiğiniz klasöre tekrar girin.
    ```bash
    cd yargi-mcp
    ```
3.  **Arayüz Sunucusunu Başlatın:** Bu proje bir `npm` kurulumu gerektirmez. Python'un dahili sunucusunu kullanarak arayüzü kolayca çalıştırabiliriz. Aşağıdaki komutu çalıştırın:
    ```bash
    python -m http.server 3000
    ```
4.  **Uygulamayı Açın:** Şimdi web tarayıcınızı açın ve adres çubuğuna şunu yazın:
    > **http://localhost:3000**

Uygulama arayüzü tarayıcınızda açılacaktır. Sağ üst köşedeki durum göstergesinden MCP bağlantısını test edebilir ve aramaya başlayabilirsiniz.

---

## Sorun Giderme (Troubleshooting)

### Hata: `nvm is not compatible with the "NPM_CONFIG_PREFIX" environment variable...`

`npm install` veya `npm run dev` gibi komutları çalıştırırken bu hatayı alıyorsanız, sisteminizde `nvm` ile çakışan bir ortam değişkeni ayarlanmış demektir.

**Çözüm:** `NPM_CONFIG_PREFIX` ortam değişkenini sisteminizden kalıcı olarak kaldırmanız gerekir.

1.  Windows'ta **Başlat** menüsüne "ortam değişkenlerini düzenle" yazın ve **"Sistem ortam değişkenlerini düzenleyin"** sonucunu açın.
2.  Açılan "Sistem Özellikleri" penceresinde **"Ortam Değişkenleri..."** butonuna tıklayın.
3.  Açılan yeni pencerede, hem üstteki "**Kullanıcı... için kullanıcı değişkenleri**" listesini hem de alttaki "**Sistem değişkenleri**" listesini kontrol edin.
4.  Bu listelerden birinde `NPM_CONFIG_PREFIX` adında bir değişken bulursanız, **onu seçin ve "Sil" butonuna basın.**
5.  Tüm pencereleri **"Tamam"** diyerek kapatın.
6.  **ÖNEMLİ:** Değişikliğin etkili olması için **açık olan tüm terminal (cmd) pencerelerini kapatıp yeniden açın.**

Bu adımlardan sonra `npm` komutlarınız düzgün çalışmalıdır. Ancak unutmayın, bu projenin arayüzünü çalıştırmak için `npm` komutlarına ihtiyacınız yoktur, yukarıdaki "Frontend Çalıştırılması" adımlarını izlemeniz yeterlidir.