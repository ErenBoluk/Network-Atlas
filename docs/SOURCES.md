# İçerik ve kaynak notları

## Kapsam

Referans: https://roadmap.sh/network-engineer?fl=1

22 Ekim 2026 tarihinde kaynak sayfanın başlığı ve açıklaması web aracıyla okunabildi; etkileşimli roadmap’in düğüm verileri ve kaynak listesi alınamadı. GitHub kaynak ağacı ve JSON/PDF yolları da sonuç vermedi. Dolayısıyla uygulamadaki 10 aşama ve 50 konu, birebir aktarım değil, ağ mühendisliğine yönelik bağımsız bir öğrenme düzenlemesidir. Uygulamanın alt bilgisi ve README bu ayrımı belirtir.

Bu sınırın kaldırılması için kaynak siteden alınmış güncel JSON/PDF veya konu listesiyle `src/data/roadmap.js` verisi karşılaştırılmalıdır. Başlıkların tam eşleşmesi henüz doğrulanmamıştır.

## Kaynak yaklaşımı

Konu açıklamaları, hedefler ve uygulama önerileri bu proje için yazılmıştır. Harici içerikler kopyalanmaz; ilgili sağlayıcının sayfasına bağlantı verilir. Kaynak başlıkları Türkçe kısa açıklamalardır, özgün sayfa başlığının birebir çevirisi olmak zorunda değildir.

Bağlantılar şunları kapsar:

- Cisco Networking Academy, switching, VLAN, Wi-Fi ve CCNA sayfaları.
- Cloudflare Learning Center: OSI, TCP/IP, UDP, DNS, routing, firewall, SD-WAN.
- IETF RFC Editor: IPv4/IPv6, CIDR, özel adresleme, ARP, TCP, ICMP, OSPF, BGP, DHCP, NAT, NTP, TLS, RADIUS, MPLS, NETCONF, SNMP, Syslog.
- IANA port kayıtları.
- FRRouting, Wireshark, GNS3, WireGuard ve Linux belgeleri.
- Python, Ansible, AWS VPC, Terraform ve Prometheus belgeleri.
- NIST SP 800-207 Zero Trust Architecture.

RFC belgeleri protokol tanımına birincil referans sağlar; güncel ürün konfigürasyonu için ayrıca ilgili ürünün sürümüne ait dokümantasyon kullanılmalıdır.

## Bağlantı kontrolü

Web aracıyla okunabilen resmi sayfalar kontrol edildi ve taşınmış Cisco, GNS3, Ansible, SD-WAN bağlantıları güncellendi. tcpdump manueli web aracının robots kuralı nedeniyle doğrulanamadı. RFC sayfalarının bağlantı biçimi ve HTTPS protokolü veri bütünlüğü testinde denetlenir; bu test HTTP erişilebilirliği garantilemez. Harici içerikler zamanla değişebilir; bütün kaynakların tarayıcıda uçtan uca açılması henüz doğrulanmamıştır.
