# Yargı AI - Hukuki Belge Arama Motoru

Bu proje, `yargi-mcp` adlı güçlü bir yerel arama motorunu, Google Gemini AI'ın yetenekleriyle birleştiren modern bir web arayüzüdür. Kullanıcıların doğal dil sorguları kullanarak karmaşık hukuki belgeler, mahkeme kararları ve makaleler arasında arama yapmasını ve bulunan metinleri yapay zeka ile özetlemesini sağlar.

## Projenin Mimarisi

Bu uygulama iki ana bileşenden oluşur:

1.  **Frontend (Bu Arayüz):** Sizin şu anda kullandığınız, React ile geliştirilmiş web uygulamasıdır. Kullanıcının arama yaptığı, sonuçları gördüğü ve yapay zeka özetlerini okuduğu "gösterge panelidir".
2.  **Backend (MCP Motoru):** `yargi-mcp` projesi, sizin bilgisayarınızda yerel olarak çalışan "motordur". Tüm arama ve belge getirme işlemleri bu sunucu tarafından gerçekleştirilir.

Arayüzün çalışabilmesi için **arka plandaki MCP motorunun sizin bilgisayarınızda çalışıyor olması zorunludur.** Aşağıdaki talimatlar, bu motoru nasıl kurup çalıştıracağınızı adım adım göstermektedir.

---

## Kurulum ve Çalıştırma Talimatları (Windows)

Bu talimatlar, Yargı AI uygulamasını kendi bilgisayarınızda çalıştırmak için gereken tüm adımları içerir. İşlemler iki ayrı terminal penceresinde yapılacaktır.

### 1. Adım: Ön Gereksinimlerin Kurulumu

Bu adımlar **sadece ilk kurulumda** bir kez yapılır. Eğer bu araçlar sisteminizde zaten yüklüyse bir sonraki adıma geçebilirsiniz.

-   **Git:** Proje dosyalarını indirmek için gereklidir.
    -   [Buradan Git'i İndirin](https://git-scm.com/downloads/) ve kurulumu tamamlayın.
-   **Python 3.8+:** MCP motorunu çalıştırmak için gereklidir.
    -   [Buradan Python'ı İndirin](https://www.python.org/downloads/).
    -   **ÇOK ÖNEMLİ:** Kurulumu başlatırken alttaki **"Add Python to PATH"** kutucuğunu mutlaka işaretleyin.
-   **Microsoft C++ Araçları:** Python paketlerinin kurulumu için gereklidir.
    -   [Buradan "Visual Studio Build Tools"u İndirin](https://visualstudio.microsoft.com/tr/visual-cpp-build-tools/).
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
    Terminalde sunucunun `http://127.0.0.1:8000` adresinde çalıştığını belirten mesajlar göreceksiniz. **Bu terminal penceresini, arayüzü kullandığınız sürece kapatmayın.** Bu pencere sizin yerel arama motorunuzdur.

### 3. Adım: Frontend (Arayüz) Bağlantısı

1.  MCP Motoru yukarıdaki adımla çalışır durumdayken, bu web uygulamasının (arayüzün) açık olduğundan emin olun.
2.  Sağ üst köşedeki **"MCP Durumu"** göstergesine tıklayarak kurulum sihirbazını açın.
3.  Sihirbazdaki son adıma gelip **"Tüm Adımları Tamamladım, Test Et"** butonuna tıklayın.
4.  Bağlantı başarılı olduğunda durum göstergesi yeşile dönecektir.

Artık hukuki belgeler arasında arama yapmaya hazırsınız!

---

## Nasıl Kullanılır?

1.  **Arama Yapın:** Ana ekrandaki arama çubuğuna bulmak istediğiniz konuyla ilgili bir sorgu yazın (örn: "kira sözleşmesinin feshi") ve "Ara" butonuna tıklayın.
2.  **Sonuçları İnceleyin:** Arama sonuçları mahkemeye göre gruplandırılmış olarak listelenir.
3.  **Detayları Görüntüleyin:** İlgilendiğiniz bir kararın üzerine tıklayarak tam metnini ve diğer detaylarını içeren pencereyi açın.
4.  **AI ile Özetleyin:** Açılan penceredeki **"AI ile Özetle"** butonuna tıklayarak Google Gemini'nin uzun belgeyi sizin için özetlemesini sağlayın.

## Kullanılan Teknolojiler

-   **Frontend:** React, TypeScript, Tailwind CSS, Google Gemini API
-   **Backend:** Python, FastMCP, FastAPI (`yargi-mcp` projesi)
