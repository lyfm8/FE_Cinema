# DESIGN SYSTEM — Cinema Management App
## Concept: Modern Minimal

> Tài liệu này là nguồn tham chiếu duy nhất (single source of truth) về giao diện.
> Mọi thành viên **bắt buộc** đọc và tuân thủ trước khi code bất kỳ UI nào.

---

## 1. Triết lý thiết kế

| Nguyên tắc | Mô tả |
|---|---|
| **Flat** | Không gradient, không shadow, không glow — chỉ flat color |
| **Editorial** | Dùng serif cho tên phim/tiêu đề lớn tạo cảm giác tạp chí điện ảnh |
| **Khoảng trắng** | Nhiều whitespace hơn thay vì nhồi nội dung |
| **Monochrome first** | Grayscale là nền tảng — màu accent chỉ dùng để truyền tải ý nghĩa |

---

## 2. Bảng màu (Color Tokens)

### Màu chính — Grayscale

| Token | Tên | Hex | Dùng cho |
|---|---|---|---|
| `color-ink` | Ink | `#1A1A1A` | Button primary, text heading lớn, border selected |
| `color-charcoal` | Charcoal | `#2C2C2A` | Body text chính, badge dark |
| `color-stone` | Stone | `#5F5E5A` | Label, icon, text secondary |
| `color-fog` | Fog | `#B4B2A9` | Placeholder, text disabled |
| `color-ash` | Ash | `#D3D1C7` | Border mặc định, đường kẻ |
| `color-cream` | Cream | `#F1EFE8` | Background surface, badge muted, seat trống |
| `color-paper` | Paper | `#FAFAF8` | Background trang, navbar |

### Màu accent — Chỉ dùng khi có ý nghĩa

| Token | Tên | Hex | Dùng cho |
|---|---|---|---|
| `color-gold` | Gold | `#E8C547` | Rating sao, VIP badge, highlight đặc biệt |
| `color-gold-dark` | Gold Dark | `#BA7517` | Border của seat VIP |
| `color-rose` | Rose | `#D4537E` | Cảnh báo ít ghế, accent phụ |
| `color-success` | Success | `#639922` | Còn nhiều ghế, trạng thái thành công |

### Cách dùng trong Tailwind config

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      ink:       '#1A1A1A',
      charcoal:  '#2C2C2A',
      stone:     '#5F5E5A',
      fog:       '#B4B2A9',
      ash:       '#D3D1C7',
      cream:     '#F1EFE8',
      paper:     '#FAFAF8',
      gold:      '#E8C547',
      'gold-dark': '#BA7517',
      rose:      '#D4537E',
    }
  }
}
```

---

## 3. Typography

### Font stack

```css
/* Heading lớn: tên phim, logo, giá tiền */
font-family: 'Georgia', 'Times New Roman', serif;

/* Mọi UI còn lại: label, button, body, nav */
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### Cài Inter qua Google Fonts (thêm vào `index.html`)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet">
```

### Scale

| Role | Font | Size | Weight | Dùng cho |
|---|---|---|---|---|
| `display` | Georgia | 28–32px | 400 | Tên phim hero, logo CINĒPLEX |
| `heading-1` | Inter | 22px | 500 | Tiêu đề section lớn |
| `heading-2` | Inter | 18px | 500 | Tiêu đề card, modal |
| `heading-3` | Inter | 16px | 500 | Subheading |
| `body` | Inter | 14px | 400 | Nội dung thông thường |
| `caption` | Inter | 12px | 400 | Thể loại, thời lượng, ngày |
| `label` | Inter | 11px | 500 | Section label (uppercase + letter-spacing) |

### Quy tắc bắt buộc

- Chỉ dùng **weight 400 và 500** — không dùng 600, 700
- Section label luôn viết `UPPERCASE` + `letter-spacing: 0.08em`
- Tên phim dùng class `font-serif` của Tailwind

---

## 4. Spacing System

Dùng bội số của 4px:

| Token | Value | Tailwind class |
|---|---|---|
| `space-1` | 4px | `p-1`, `gap-1` |
| `space-2` | 8px | `p-2`, `gap-2` |
| `space-3` | 12px | `p-3`, `gap-3` |
| `space-4` | 16px | `p-4`, `gap-4` |
| `space-6` | 24px | `p-6`, `gap-6` |
| `space-8` | 32px | `p-8`, `gap-8` |
| `space-12` | 48px | `p-12` |

---

## 5. Border & Border Radius

```
Border mặc định:  0.5px solid #D3D1C7   (ash)
Border hover:     0.5px solid #888780   (stone)
Border selected:  1.5px solid #1A1A1A   (ink)  ← exception duy nhất
Border error:     0.5px solid #D4537E   (rose)
```

| Radius | Value | Dùng cho |
|---|---|---|
| `rounded` | 4px | Seat, badge tag nhỏ |
| `rounded-md` | 8px | Input, button, item nhỏ |
| `rounded-lg` | 12px | Card, modal, dropdown |
| `rounded-full` | 9999px | Avatar, pill badge |

**Quy tắc:** Không dùng `rounded-xl` (16px) hay lớn hơn.

---

## 6. Components

### 6.1 Button

```jsx
/* Primary — Đặt vé, Thanh toán, Submit */
<button className="bg-ink text-paper text-sm font-medium px-4 py-2 rounded-md
                   flex items-center gap-1.5 hover:bg-charcoal active:scale-95
                   transition-all">
  Đặt vé ngay
</button>

/* Secondary — Xem trailer, Hủy */
<button className="bg-transparent text-ink text-sm font-medium px-4 py-2 rounded-md
                   border border-charcoal hover:bg-cream active:scale-95
                   transition-all">
  Xem trailer
</button>

/* Ghost — Yêu thích, Bỏ qua */
<button className="bg-transparent text-stone text-sm px-4 py-2 rounded-md
                   border border-ash hover:bg-cream transition-all">
  Yêu thích
</button>
```

### 6.2 Badge / Tag

```jsx
/* Dark — thể loại phim */
<span className="bg-charcoal text-cream text-xs font-medium px-2.5 py-0.5 rounded-full">
  Action
</span>

/* Outline — rating, format */
<span className="border border-charcoal text-charcoal text-xs font-medium px-2.5 py-0.5 rounded-full">
  PG-13
</span>

/* Muted — thông tin phụ */
<span className="bg-cream text-stone text-xs font-medium px-2.5 py-0.5 rounded-full">
  2D
</span>

/* Gold — rating sao */
<span className="bg-amber-50 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full
                 flex items-center gap-1">
  ★ 9.1
</span>

/* Rose — cảnh báo */
<span className="bg-pink-50 text-rose text-xs font-medium px-2.5 py-0.5 rounded-full">
  Còn ít ghế
</span>
```

### 6.3 Card phim (MovieCard)

```jsx
<div className="bg-white border border-ash rounded-lg overflow-hidden
                hover:border-charcoal transition-colors">
  {/* Poster */}
  <div className="bg-cream h-40 relative">
    <img src={poster} className="w-full h-full object-cover" />
    <span className="absolute top-2 left-2 badge-dark">{genre}</span>
  </div>
  {/* Info */}
  <div className="p-3">
    <h3 className="font-serif text-sm text-charcoal mb-1">{title}</h3>
    <p className="text-xs text-stone mb-2">{cast} · {duration}</p>
    <div className="flex items-center justify-between">
      <span className="text-xs text-stone flex items-center gap-1">
        ★ {rating}
      </span>
      <span className="text-xs text-stone">từ {price}</span>
    </div>
  </div>
</div>
```

### 6.4 Input field

```jsx
<div>
  <label className="text-xs font-medium text-stone mb-1 block">
    Email
  </label>
  <input
    className="w-full border border-ash rounded-md px-3 py-2 text-sm
               text-charcoal bg-white placeholder:text-fog
               focus:outline-none focus:border-ink transition-colors"
    placeholder="ten@email.com"
  />
</div>
```

### 6.5 Showtime button

```jsx
/* Trạng thái mặc định */
<button className="w-full flex items-center justify-between px-3 py-2
                   border border-ash rounded-md hover:border-charcoal
                   transition-colors">
  <div>
    <span className="text-sm font-medium text-charcoal">{time}</span>
    <span className="text-xs text-stone ml-2">{room} · {format}</span>
  </div>
  <span className="text-xs text-success">{availability}</span>
</button>

/* Trạng thái selected */
<button className="... border-[1.5px] border-ink bg-cream">
  ...
</button>

/* Trạng thái disabled (hết vé) */
<button className="... opacity-40 cursor-not-allowed border-ash" disabled>
  ...
</button>
```

### 6.6 Seat

```jsx
const seatStyles = {
  available: 'bg-cream border-ash cursor-pointer hover:border-charcoal',
  selected:  'bg-ink border-ink cursor-pointer',
  vip:       'bg-gold border-gold-dark cursor-pointer',
  sold:      'bg-fog border-stone cursor-not-allowed opacity-60',
}

<div className={`w-6 h-5 rounded-t border ${seatStyles[status]} transition-colors`} />
```

### 6.7 Navbar

```jsx
<nav className="bg-paper border-b border-ash px-6 h-14 flex items-center justify-between">
  {/* Logo */}
  <div className="flex items-center gap-2">
    <div className="w-1.5 h-1.5 bg-ink rounded-sm" />
    <span className="font-serif text-base tracking-wide text-ink">CINĒPLEX</span>
  </div>

  {/* Nav links */}
  <div className="flex gap-6">
    {['Phim', 'Lịch chiếu', 'Ưu đãi'].map(item => (
      <a key={item} className="text-sm text-stone hover:text-charcoal transition-colors">
        {item}
      </a>
    ))}
    <a className="text-sm text-ink font-medium border-b-[1.5px] border-ink pb-px">
      Đặt vé
    </a>
  </div>

  {/* User actions */}
  <div className="flex items-center gap-3">
    <SearchIcon />
    <button className="w-8 h-8 rounded-full bg-cream border border-ash
                       flex items-center justify-content-center">
      <UserIcon />
    </button>
  </div>
</nav>
```

---

## 7. Layout rules

### Breakpoints

| Name | Width | Dùng cho |
|---|---|---|
| Mobile | < 768px | Stack vertical, 1 col |
| Tablet | 768–1024px | 2 cols |
| Desktop | > 1024px | 3–4 cols, sidebar |

### Grid movies

```jsx
/* Trang danh sách phim */
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
```

### Container width

```jsx
<div className="max-w-6xl mx-auto px-4 md:px-6">
```

### Admin sidebar width: `240px` cố định, content còn lại.

---

## 8. Page-specific notes

| Page | Lưu ý thiết kế |
|---|---|
| **HomePage** | Hero section dùng `font-serif` lớn, movie grid 4 col, section "Đang chiếu" và "Sắp chiếu" tách biệt |
| **MovieDetail** | Layout 2 col: poster trái, info phải. Showtime picker dạng accordion theo ngày |
| **SeatSelection** | Màn hình centered top, legend bottom, summary panel sticky right |
| **Payment** | 2 col: form trái, order summary sticky phải |
| **Confirmation** | Centered, ticket card có border dash, QR code |
| **Admin Dashboard** | Sidebar fixed trái, stat cards 4 col, table full width |
| **Login/Register** | Centered card, max-width 400px, logo top |

---

## 9. Quy tắc bắt buộc (KHÔNG được vi phạm)

1. **Không dùng shadow** — `shadow-*` bị cấm hoàn toàn
2. **Không dùng gradient** — `bg-gradient-*` bị cấm
3. **Không dùng font-weight > 500** — `font-semibold`, `font-bold` bị cấm
4. **Border mặc định luôn là 0.5px** — dùng `border` (1px) chỉ khi selected state
5. **Màu accent (gold, rose) không dùng làm màu nền trang** — chỉ dùng cho badge và icon nhỏ
6. **Tên phim luôn dùng `font-serif`** — không dùng sans-serif cho tên phim
7. **Section label luôn UPPERCASE + tracking-widest** — không dùng title case

---

*Cập nhật lần cuối: 05/2026 — v1.0*
