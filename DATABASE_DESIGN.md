# 🗄️ Database Design - Hệ thống Quản lý Giảng viên

## 📊 Entity Relationship Diagram

```
┌──────────────┐
│   keywords   │
├──────────────┤
│ id (PK)      │──┐
│ name         │  │
│ createdAt    │  │
└──────────────┘  │
                  │ Many-to-Many
                  │
┌──────────────────────┐         ┌──────────────┐
│ lecturer_keywords    │         │  lecturers   │
├──────────────────────┤         ├──────────────┤
│ lecturerId (FK)      │────────▶│ id (PK)      │
│ keywordId (FK)       │◀────┐   │ fullName     │
└──────────────────────┘     │   │ academicTitle│
                             │   │ birthYear    │
                             │   │ workUnit     │
                             └───│ position     │
                                 │ teachingField│
                                 │ researchField│
                                 │ email        │
                                 │ phone        │
                                 │ bio          │
                                 │ isActive     │
                                 └──────────────┘
                                        │
                                        │ One-to-Many
                                        ▼
                                 ┌──────────────┐
                                 │ publications │
                                 ├──────────────┤
                                 │ id (PK)      │
                                 │ lecturerId(FK)│
                                 │ title        │
                                 │ description  │
                                 │ publicationYear│
                                 │ journal      │
                                 │ authors      │
                                 │ url          │
                                 │ type         │
                                 └──────────────┘
```

## 📋 Tables Detail

### 1. `keywords` - Danh mục từ khóa
**Mục đích:** Lưu trữ các từ khóa để tìm kiếm giảng viên theo chủ đề

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Keyword ID |
| name | VARCHAR | UNIQUE, NOT NULL | Tên từ khóa |
| createdAt | TIMESTAMP | AUTO | Ngày tạo |

**Business Rules:**
- Unique constraint trên `name` để tránh trùng lặp
- Simple structure như yêu cầu (chỉ id, name, ngày tạo)

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE: `name`

---

### 2. `lecturers` - Thông tin giảng viên
**Mục đích:** Lưu trữ thông tin chi tiết về giảng viên

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Lecturer ID |
| fullName | VARCHAR | NOT NULL | Họ tên |
| academicTitle | ENUM | NOT NULL | Học hàm/học vị |
| birthYear | INT | NOT NULL | Năm sinh |
| workUnit | VARCHAR | NOT NULL | Đơn vị công tác |
| position | VARCHAR | NOT NULL | Chức danh |
| teachingField | TEXT | NOT NULL | Lĩnh vực giảng dạy |
| researchField | TEXT | NOT NULL | Lĩnh vực nghiên cứu |
| email | VARCHAR | NULLABLE | Email |
| phone | VARCHAR | NULLABLE | Số điện thoại |
| bio | TEXT | NULLABLE | Tiểu sử |
| isActive | BOOLEAN | DEFAULT true | Trạng thái |
| createdAt | TIMESTAMP | AUTO | Ngày tạo |
| updatedAt | TIMESTAMP | AUTO | Ngày cập nhật |

**Academic Title Enum:**
```typescript
GS   - Giáo sư
PGS  - Phó Giáo sư
TS   - Tiến sĩ
ThS  - Thạc sĩ
KS   - Kỹ sư
CN   - Cử nhân
```

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `fullName` (for search)
- INDEX: `academicTitle` (for filtering)

---

### 3. `publications` - Đề tài và bài báo khoa học
**Mục đích:** Quản lý riêng các đề tài, bài báo của giảng viên (theo yêu cầu tách table)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Publication ID |
| lecturerId | UUID | FOREIGN KEY | Giảng viên sở hữu |
| title | VARCHAR | NOT NULL | Tiêu đề đề tài/bài báo |
| description | TEXT | NULLABLE | Mô tả chi tiết |
| publicationYear | INT | NULLABLE | Năm xuất bản |
| journal | VARCHAR | NULLABLE | Tên tạp chí/hội nghị |
| authors | TEXT | NULLABLE | Danh sách tác giả |
| url | VARCHAR | NULLABLE | Link tới bài báo |
| type | ENUM | DEFAULT 'research_paper' | Loại công trình |
| createdAt | TIMESTAMP | AUTO | Ngày tạo |
| updatedAt | TIMESTAMP | AUTO | Ngày cập nhật |

**Publication Type Enum:**
```typescript
research_paper - Bài báo nghiên cứu
project        - Đề tài nghiên cứu
book           - Sách
conference     - Hội nghị
other          - Khác
```

**Foreign Keys:**
- `lecturerId` REFERENCES `lecturers(id)` ON DELETE CASCADE

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `lecturerId` (for joins)
- INDEX: `publicationYear` (for sorting)

---

### 4. `lecturer_keywords` - Junction Table (Many-to-Many)
**Mục đích:** Liên kết giữa giảng viên và từ khóa

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| lecturerId | UUID | FOREIGN KEY | Lecturer ID |
| keywordId | UUID | FOREIGN KEY | Keyword ID |

**Constraints:**
- PRIMARY KEY: (`lecturerId`, `keywordId`)
- FOREIGN KEY: `lecturerId` REFERENCES `lecturers(id)` ON DELETE CASCADE
- FOREIGN KEY: `keywordId` REFERENCES `keywords(id)` ON DELETE CASCADE

**Business Rules:**
- Cascade delete: Xóa lecturer → xóa tất cả relationships
- Cascade delete: Xóa keyword → xóa tất cả relationships
- Một lecturer có thể có nhiều keywords
- Một keyword có thể thuộc nhiều lecturers

---

## 🔗 Relationships

### Lecturers ↔ Keywords (Many-to-Many)
```
Lecturer (1) ←→ (N) lecturer_keywords (N) ←→ (1) Keyword
```
- **Cardinality:** 0..N ↔ 0..N
- **Junction Table:** `lecturer_keywords`
- **Use Case:** Sinh viên tìm mentor theo chủ đề/từ khóa

### Lecturers → Publications (One-to-Many)
```
Lecturer (1) ──→ (N) Publications
```
- **Cardinality:** 1 → 0..N
- **Foreign Key:** `publications.lecturerId`
- **Cascade:** DELETE CASCADE (xóa lecturer → xóa tất cả publications)
- **Use Case:** Quản lý đề tài, bài báo của từng giảng viên

---

## 🎯 Key Design Decisions

### ✅ Tách Publications ra table riêng
**Lý do:**
- Dễ dàng quản lý (CRUD riêng)
- Có thể có nhiều publications cho 1 lecturer
- Có thể thêm nhiều metadata (year, journal, authors, url, type)
- Dễ search và filter publications
- Follow normalization principles

### ✅ Keywords đơn giản (chỉ id, name, createdAt)
**Lý do:**
- Theo yêu cầu của bạn
- Đơn giản, dễ maintain
- Không cần track usage count vì có thể query từ junction table

### ✅ Many-to-Many cho Keywords
**Lý do:**
- Một giảng viên có nhiều keywords (ML, AI, Web Dev)
- Một keyword có nhiều giảng viên (nhiều người dạy ML)
- Linh hoạt cho search và filter

### ✅ One-to-Many cho Publications
**Lý do:**
- Mỗi publication thuộc về 1 giảng viên cụ thể
- Cascade delete để data consistency
- Có thể expand sau (co-authors, citations)

---

## 📝 Sample SQL Queries

### Tìm tất cả giảng viên có keyword "Machine Learning"
```sql
SELECT l.* 
FROM lecturers l
JOIN lecturer_keywords lk ON l.id = lk.lecturerId
JOIN keywords k ON lk.keywordId = k.id
WHERE k.name = 'Machine Learning' AND l.isActive = true;
```

### Lấy tất cả publications của 1 giảng viên
```sql
SELECT * FROM publications 
WHERE lecturerId = 'uuid-here'
ORDER BY publicationYear DESC;
```

### Đếm số publications theo từng giảng viên
```sql
SELECT 
  l.fullName, 
  COUNT(p.id) as publicationCount
FROM lecturers l
LEFT JOIN publications p ON l.id = p.lecturerId
GROUP BY l.id, l.fullName
ORDER BY publicationCount DESC;
```

### Tìm keywords phổ biến nhất
```sql
SELECT 
  k.name, 
  COUNT(lk.lecturerId) as lecturerCount
FROM keywords k
LEFT JOIN lecturer_keywords lk ON k.id = lk.keywordId
GROUP BY k.id, k.name
ORDER BY lecturerCount DESC;
```

---

## 🚀 Migration Notes

### TypeORM Auto-sync
```typescript
synchronize: true // Development only - tự động tạo tables
```

**⚠️ WARNING:** 
- Set `synchronize: false` in production
- Use migrations cho production

### Initial Setup
1. Database sẽ tự động tạo 4 tables khi chạy app
2. Foreign keys và constraints tự động setup
3. Indexes tự động tạo

---

## 📈 Scalability Considerations

### Performance
- ✅ Indexed foreign keys cho fast joins
- ✅ Eager loading cho keywords (giảm N+1 queries)
- ✅ Lazy loading cho publications (chỉ load khi cần)

### Future Enhancements
- [ ] Add full-text search indexes
- [ ] Add caching layer (Redis)
- [ ] Add pagination
- [ ] Add soft delete cho publications
- [ ] Add co-authors table (many-to-many)
- [ ] Add citations tracking

---

**Total Tables:** 4 (3 main + 1 junction)  
**Total Relationships:** 2 (1 many-to-many + 1 one-to-many)  
**Design Pattern:** Normalized relational database

