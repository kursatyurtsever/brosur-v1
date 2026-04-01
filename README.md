This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Proje Mimarisi: ColorPicker Bileşeni

Bu bölümde, proje için sıfırdan geliştirilen `ColorPicker` bileşeninin teknik mimarisi ve kullanım mantığı açıklanmaktadır.

### 1. Dosya Yapısı ve Sorumluluklar

-   **`src/components/editors/ColorPicker.tsx`**: Bileşenin ana mantığını, arayüzünü (UI) ve state yönetimini içeren çekirdek dosyadır. Dışarıdan herhangi bir renk seçici kütüphanesine (`react-color` vb.) bağımlılığı yoktur ve tamamen React ve Tailwind CSS ile oluşturulmuştur.
-   **`src/lib/colorUtils.ts`**: Renk formatları (HEX, RGB, CMYK, HSV) arasındaki tüm dönüşüm mantığını içeren yardımcı dosyadır. Bu dosyadaki fonksiyonlar, `ColorPicker` bileşeninden ayrılarak kodun daha temiz, modüler ve test edilebilir olması sağlanmıştır. Tüm fonksiyonlar saf (pure) olarak tasarlanmıştır.

### 2. Bileşen Mimarisi ve State Yönetimi

-   **Ana Veri Modeli (State): `HSV`**: Bileşenin temel renk durumu `hsv` (hue, saturation, value) formatında bir obje olarak tutulur. Renk seçici alanı (saturation/value) ve ton kaydırıcısı (hue slider) doğrudan bu state'i manipüle eder. Bu yaklaşım, renk tekerleği ve doygunluk alanı gibi görsel kontroller için en doğal ve performanslı yöntemdir.
-   **Türetilmiş Değerler (Derived Values):** `RGB`, `HEX` ve `CMYK` gibi diğer renk formatları, ana `hsv` state'inden `useMemo` hook'u kullanılarak anlık olarak hesaplanır. Bu, state'te gereksiz veri tekrarını önler ve tutarlılığı garanti eder.
-   **Saydamlık (Opacity):** `alpha` (0-1 aralığında) değeri için ayrı bir state (`useState`) kullanılır. Bu, rengin kendisinden bağımsız olarak saydamlığın kontrol edilmesini sağlar.

### 3. Props (Özellikler) ve Callback Fonksiyonları

`ColorPicker` bileşeni, dış dünya ile aşağıdaki proplar aracılığıyla iletişim kurar:

-   `initialColor: string`: Başlangıçta gösterilecek rengin `hex` kodu (örn: `"#FFFFFF"`).
-   `initialOpacity?: number`: (Opsiyonel) Başlangıç saydamlık değeri. Varsayılanı `1` (opak).
-   `onChange: (hex: string) => void`: Renk (hue, saturation, value) değiştiğinde tetiklenen callback fonksiyonudur. Güncel rengin `hex` kodunu dışarıya bildirir.
-   `onOpacityChange?: (opacity: number) => void`: (Opsiyonel) Saydamlık slider'ı değiştiğinde tetiklenir ve yeni saydamlık değerini (0-1 aralığında) bildirir.

### 4. Tasarım ve Arayüz (UI) Mantığı

-   **Açılır Panel (Popover):** Ana bileşen, tıklandığında bir panel açan bir renk kutucuğudur. Panelin dışına tıklandığında otomatik olarak kapanması için bir `useEffect` içinde `mousedown` event listener kullanılır.
-   **Renk Seçim Alanları:**
    -   **Saturation/Value Alanı:** `background-color` (tonu belirler) ve iki adet CSS `linear-gradient` (beyaz ve siyah geçişleri için) ile oluşturulmuştur. Fare hareketleri (`onMouseDown`, `onMouseMove`) ile `hsv` state'inin `s` ve `v` değerleri güncellenir.
    -   **Hue ve Opacity Slider'ları:** Standart `<input type="range">` elemanları, CSS ile modern bir görünüme kavuşturulmuştur.
-   **Format Seçimi:** Kullanıcının `HEX`, `RGB`, `CMYK` ve `HSB` (HSV) formatları arasında geçiş yapmasını sağlayan butonlar, `activeFormat` adında bir state'i yönetir. Bu state'e göre ilgili giriş alanları render edilir.
-   **Renk Kütüphanesi:**
    -   Kütüphanedeki renkler, `{ hex: string, alpha: number }` formatında bir obje dizisi olarak state içinde tutulur.
    -   Bir renk kaydedildiğinde, o anki `hex` ve `alpha` değerleri bu diziye eklenir.
    -   Kütüphaneden bir renk seçildiğinde, hem `hsv` hem de `alpha` state'leri güncellenir.
    -   Kütüphanedeki ve ana önizlemedeki renk kutucukları, saydamlığı doğru göstermek için `rgba()` değeri ve kareli bir arkaplan deseni kullanır.

Bu yapı, bileşenin hem esnek hem de performanslı çalışmasını sağlar. State güncellemeleri minimumda tutulurken, renk formatları arasındaki anlık dönüşümler `useMemo` sayesinde verimli bir şekilde gerçekleştirilir.
