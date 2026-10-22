# Network Atlas

Ağ mühendisliği için React + Tailwind ile hazırlanmış Türkçe öğrenme alanı. Sistem tipografisi, ferah yerleşim, sade yüzeyler ve kademeli ayrıntılarla Apple’ın tasarım yaklaşımından ilham alır.

## Çalıştırma

Node.js 22.12+ kullanın. Yeni bir bilgisayarda önce bağımlılıkları kurun:

```bash
npm ci
npm run dev
```

Terminalde görünen **Local** adresini açın (varsayılan: http://127.0.0.1:5173). Terminali açık tutun. Değişiklikler Vite ile otomatik yansır. Port doluysa Vite farklı bir port seçebilir; terminaldeki adresi esas alın.

Bu çalışma klasöründe bağımlılıklar kurulu olduğundan doğrudan çalıştırılabilir:

```bash
cd "/Users/eren/Desktop/Network Lessons/network-atlas"
npm run dev
```

## İçerik ve özellikler

- 10 öğrenme aşaması, 50 konu ve 46 ayrı dış kaynak.
- Türkçe karakterlerle uyumlu arama; aşama ve ilerleme filtreleri.
- Her konuda öğrenme hedefleri, dokümantasyon bağlantıları ve uygulama önerisi.
- Başlanmadı / öğreniliyor / tamamlandı durumları ve ilerleme özeti.
- Kaydedilen konular ve kişisel notlar.
- Açık/koyu tema, kart/liste görünümü ve mobil gezinme.
- Klavye ile açılan native konu diyaloğu, Escape ile kapatma, içerik atlama bağlantısı ve azaltılmış hareket desteği.

İlerleme, notlar ve tema yalnızca bulunduğunuz tarayıcının `localStorage` alanında saklanır. Sunucuya gönderilmez. Tarayıcı verilerini temizlemek bu kayıtları siler. Harici öğrenme kaynakları yeni sekmede açılır; içerikleri çoğunlukla İngilizcedir.

## İçerik kaynağı

Başlangıç referansı: [roadmap.sh Network Engineer](https://roadmap.sh/network-engineer?fl=1).

**Bu sürüm birebir roadmap.sh dışa aktarımı değildir.** Kaynak sitenin etkileşimli konu verileri bu ortamda alınamadığı için başlıklar ve öğrenme hedefleri bağımsız düzenlenmiş, resmi dokümantasyon bağlantılarıyla desteklenmiştir. Kaynak sitenin bütün başlıklarını veya kendi kaynak listesini eksiksiz içerdiği iddia edilmez. Ayrıntılar: [docs/SOURCES.md](docs/SOURCES.md).

## Kontrol ve üretim

```bash
npm test
npm run build
npm run preview
```

Üretim dosyaları `dist/` klasörüne yazılır. Herhangi bir statik hosting servisine yüklenebilir. Sunucu/veritabanı veya ortam değişkeni gerekmez.

Testler arama, filtrelerin birlikte çalışması, bozuk kayıt kurtarma, ilerleme hesaplama, devam edilecek konu seçimi, müfredat bağlantıları ve gerçek React bileşenlerinin sunucu üzerinde render edilmesini kapsar. Son doğrulamada 8 test ve üretim derlemesi geçti. Tarayıcıdaki etkileşim ve görsel kontroller, geliştirme ortamının port/tarayıcı kısıtı nedeniyle henüz doğrulanamadı.

## Proje yapısı

```text
src/
  App.jsx                     # Uygulama ve gezinme
  components/TopicDialog.jsx   # Konu, kaynak, durum ve notlar
  data/roadmap.js              # Aşamalar, konular ve kaynaklar
  lib/learning.js              # Arama, ilerleme ve kayıt doğrulama
  main.jsx                    # React giriş noktası
  styles.css                  # Tailwind ve görsel sistem
tests/                        # Node testleri ve React render kontrolleri
```

## GitHub

Yerel repo ve commit, bu görev kapsamında hazırlanır. Bu ortamda GitHub’a dış ağ erişimi engellendiğinden uzak repo oluşturma/push işlemi tamamlanamamıştır. Ağ erişimi olan bir terminalde, GitHub CLI oturumu açıkken şu komut özel repo oluşturup mevcut commit’i gönderir:

```bash
gh repo create network-atlas --private --source=. --remote=origin --push
```

Repo adı hesabınızda zaten kullanılıyorsa başka bir ad seçin. Oturum kapalıysa önce kendi terminalinizde `gh auth login` çalıştırın. Kimlik bilgilerini dosyalara eklemeyin.

## Lisans

Uygulama kodu MIT lisanslıdır. Bağlantı verilen içerikler kendi sahiplerine ve lisanslarına tabidir. Apple veya roadmap.sh ile resmi bir bağlantısı yoktur.
