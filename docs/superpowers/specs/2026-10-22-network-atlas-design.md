# Network Atlas

React ve Tailwind ile, roadmap.sh Network Engineer yolundan ilham alan Türkçe bir öğrenme alanı. Apple yaklaşımına uygun sistem tipografisi, bol boşluk, işlevsel mavi vurgu, düşük kontrastlı ayırıcılar ve kademeli ayrıntı kullanılır.

## Yaklaşım

Seçim: statik React uygulaması; backend veya hesap gerektirmeyen kişisel öğrenme. Diyagram ağırlıklı tuval yerine okunabilir aşama kartları ve konu ayrıntı paneli tercih edilir. Kaynak kütüphanesi ve kaydedilenler aynı veriyi kullanır. Ağ erişimi mevcut olmadığından canlı senkronizasyon yapılmaz.

## Davranış

- Ana başlıklar ve konular aşamalara ayrılır; her konu açıklama, çalışma hedefleri ve dış kaynaklar içerir.
- Konular Türkçe karakterlere duyarlı arama ve aşama/durum filtreleriyle bulunur.
- Konu durumu: başlanmadı, öğreniliyor, tamamlandı. İlerleme ve kaydedilenler localStorage içinde sürümlü ve doğrulanan bir şemada saklanır.
- Ayrıntılar erişilebilir dialog içinde açılır; Escape, odak geri dönüşü ve klavye gezintisi desteklenir.
- Mobilde gezinme menüye dönüşür. Azaltılmış hareket tercihi desteklenir.
- Kaynaklar resmi dokümantasyon ve açık eğitim kaynaklarıdır. Birebir doğrulanamayan roadmap içeriği doğrulanmış gibi sunulmaz.

## Sınırlar

Hesap, bulut senkronizasyonu ve sunucu eklenmez. İlk kullanıcıya sahte ilerleme gösterilmez. Kaynak sağlayıcıların ücret veya dil durumu hakkında doğrulanmayan iddialar yapılmaz. GitHub reposu kullanıcının açık talebidir; uzaktaki oluşturma ağ ve oturum erişimine bağlıdır.
