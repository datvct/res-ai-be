# 📚 API Guide - Giảng viên, Từ khóa & Publications

## 🎯 Overview

Hệ thống gồm 3 modules chính:
1. **Keywords** - Danh mục từ khóa (chỉ id, name, createdAt)
2. **Publications** - Đề tài, bài báo khoa học (table riêng)
3. **Lecturers** - Thông tin giảng viên (có quan hệ với Keywords và Publications)

---

## 🔖 Keywords API

### POST /keywords - Tạo từ khóa mới
**Permission:** Admin only  
**Body:**
```json
{
  "name": "Machine Learning"
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "name": "Machine Learning",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Keyword created successfully",
  "statusCode": 201
}
```

### GET /keywords - Lấy tất cả từ khóa
**Permission:** Public

**Response:**
```json
{
  "data": [
    {
      "id": "uuid-1",
      "name": "Machine Learning",
      "createdAt": "..."
    },
    {
      "id": "uuid-2",
      "name": "Web Development",
      "createdAt": "..."
    }
  ],
  "message": "Success",
  "statusCode": 200
}
```

### GET /keywords/:id - Lấy 1 từ khóa

### PATCH /keywords/:id - Cập nhật từ khóa
**Permission:** Admin only

### DELETE /keywords/:id - Xóa từ khóa
**Permission:** Admin only

---

## 📄 Publications API

### POST /publications - Tạo publication mới
**Permission:** Admin only  
**Body:**
```json
{
  "lecturerId": "uuid-of-lecturer",
  "title": "Machine Learning in Education",
  "description": "A study on ML applications...",
  "publicationYear": 2023,
  "journal": "IEEE Transactions",
  "authors": "Nguyen Van A, Tran Thi B",
  "url": "https://example.com/paper.pdf",
  "type": "research_paper"
}
```

**Publication Types:**
- `research_paper` - Bài báo nghiên cứu
- `project` - Đề tài nghiên cứu
- `book` - Sách
- `conference` - Hội nghị
- `other` - Khác

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "lecturerId": "uuid",
    "title": "Machine Learning in Education",
    "description": "...",
    "publicationYear": 2023,
    "journal": "IEEE Transactions",
    "authors": "Nguyen Van A, Tran Thi B",
    "url": "https://example.com/paper.pdf",
    "type": "research_paper",
    "createdAt": "...",
    "updatedAt": "..."
  },
  "message": "Publication created successfully",
  "statusCode": 201
}
```

### GET /publications - Lấy tất cả publications
**Permission:** Public

**Query params:**
- `lecturerId` (optional) - Filter by lecturer

**Examples:**
```bash
# Lấy tất cả
GET /publications

# Lấy publications của 1 giảng viên
GET /publications?lecturerId=uuid
```

### GET /publications/:id - Lấy 1 publication
**Includes:** Lecturer information

### PATCH /publications/:id - Cập nhật publication
**Permission:** Admin only

### DELETE /publications/:id - Xóa publication
**Permission:** Admin only

---

## 👨‍🏫 Lecturers API

### POST /lecturers - Tạo giảng viên mới
**Permission:** Admin only  
**Body:**
```json
{
  "fullName": "TS. Nguyễn Văn A",
  "academicTitle": "TS",
  "birthYear": 1980,
  "workUnit": "Khoa Công nghệ Thông tin",
  "position": "Giảng viên chính",
  "teachingField": "Lập trình Web, Cơ sở dữ liệu",
  "researchField": "Machine Learning, AI, Data Science",
  "email": "nguyenvana@university.edu.vn",
  "phone": "0123456789",
  "bio": "10 năm kinh nghiệm giảng dạy...",
  "keywordIds": ["uuid-1", "uuid-2"]
}
```

**Academic Titles:**
- `GS` - Giáo sư
- `PGS` - Phó Giáo sư
- `TS` - Tiến sĩ
- `ThS` - Thạc sĩ
- `KS` - Kỹ sư
- `CN` - Cử nhân

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "fullName": "TS. Nguyễn Văn A",
    "academicTitle": "TS",
    "birthYear": 1980,
    "workUnit": "Khoa Công nghệ Thông tin",
    "position": "Giảng viên chính",
    "teachingField": "Lập trình Web, Cơ sở dữ liệu",
    "researchField": "Machine Learning, AI",
    "email": "...",
    "phone": "...",
    "bio": "...",
    "keywords": [
      {
        "id": "uuid-1",
        "name": "Machine Learning",
        "createdAt": "..."
      }
    ],
    "publications": [],
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  },
  "message": "Lecturer created successfully",
  "statusCode": 201
}
```

### GET /lecturers - Lấy tất cả giảng viên
**Permission:** Public  
**Includes:** Keywords và Publications

### GET /lecturers/search - Tìm kiếm giảng viên
**Permission:** Public  
**Query params:**
- `search` - Tìm theo tên, teaching field, research field
- `academicTitle` - Lọc theo học vị (GS, PGS, TS, etc.)
- `keywordIds` - Lọc theo keywords (array)

**Examples:**
```bash
# Tìm theo text
GET /lecturers/search?search=Machine Learning

# Lọc theo học vị
GET /lecturers/search?academicTitle=TS

# Lọc theo keywords
GET /lecturers/search?keywordIds=uuid-1&keywordIds=uuid-2

# Kết hợp
GET /lecturers/search?search=AI&academicTitle=TS&keywordIds=uuid-1
```

### GET /lecturers/:id - Lấy 1 giảng viên
**Permission:** Public  
**Includes:** Keywords và Publications

### PATCH /lecturers/:id - Cập nhật giảng viên
**Permission:** Admin only

**Body (all optional):**
```json
{
  "fullName": "...",
  "academicTitle": "PGS",
  "keywordIds": ["uuid-3", "uuid-4"],
  "isActive": true
}
```

### DELETE /lecturers/:id - Xóa giảng viên
**Permission:** Admin only  
**Note:** Cascade delete - sẽ xóa tất cả publications của giảng viên này

### POST /lecturers/:id/keywords - Thêm keywords
**Permission:** Admin only  
**Body:**
```json
{
  "keywordIds": ["uuid-5", "uuid-6"]
}
```
**Note:** Chỉ thêm keywords mới, giữ keywords cũ

### DELETE /lecturers/:id/keywords - Xóa keywords
**Permission:** Admin only  
**Body:**
```json
{
  "keywordIds": ["uuid-5"]
}
```
**Note:** Chỉ xóa specific keywords, giữ keywords khác

---

## 🔄 Complete Workflow Example

### 1. Setup Admin & Keywords
```bash
# Step 1: Register admin
POST /auth/register
{
  "username": "admin",
  "password": "Admin123!",
  "fullName": "Admin",
  "roles": "admin"
}

# Step 2: Login
POST /auth/login
# Save accessToken

# Step 3: Create keywords
POST /keywords
{ "name": "Machine Learning" }

POST /keywords
{ "name": "Web Development" }

POST /keywords
{ "name": "Mobile Apps" }
```

### 2. Create Lecturer
```bash
POST /lecturers
{
  "fullName": "TS. Nguyễn Văn A",
  "academicTitle": "TS",
  "birthYear": 1980,
  "workUnit": "Khoa CNTT",
  "position": "Giảng viên chính",
  "teachingField": "Web Development",
  "researchField": "Machine Learning, AI",
  "email": "nvana@uni.edu.vn",
  "phone": "0123456789",
  "keywordIds": ["ml-uuid", "web-uuid"]
}
# Save lecturer ID
```

### 3. Add Publications
```bash
POST /publications
{
  "lecturerId": "lecturer-uuid",
  "title": "Machine Learning in Web Applications",
  "description": "...",
  "publicationYear": 2023,
  "journal": "IEEE Conference",
  "authors": "Nguyen Van A, Co-author B",
  "type": "conference"
}

POST /publications
{
  "lecturerId": "lecturer-uuid",
  "title": "Đề tài nghiên cứu về AI",
  "description": "...",
  "publicationYear": 2022,
  "type": "project"
}
```

### 4. Student Search for Mentor
```bash
# Scenario: Sinh viên tìm mentor về ML
GET /lecturers/search?search=Machine Learning

# Hoặc search by keyword
GET /lecturers/search?keywordIds=ml-uuid

# Xem chi tiết giảng viên
GET /lecturers/lecturer-uuid
# Response bao gồm:
# - Thông tin cá nhân
# - Keywords
# - Publications (tách riêng, dễ quản lý)
```

---

## 📊 Key Differences from Previous Version

### ✅ Publications tách ra table riêng
**Trước:** Publications là text field trong lecturers table  
**Sau:** Publications là separate table với full CRUD

**Benefits:**
- ✅ Dễ quản lý từng publication
- ✅ Có thể search/filter publications
- ✅ Thêm metadata (year, journal, authors, url, type)
- ✅ CRUD riêng cho publications
- ✅ Có thể có nhiều publications cho 1 lecturer

### ✅ Keywords đơn giản hơn
**Trước:** Keywords có description và usageCount  
**Sau:** Keywords chỉ có id, name, createdAt

**Benefits:**
- ✅ Đơn giản theo yêu cầu
- ✅ Dễ maintain
- ✅ UsageCount có thể query từ junction table nếu cần

---

## 🔐 Permissions Summary

| Endpoint | Public | User | Admin |
|----------|--------|------|-------|
| GET /keywords | ✅ | ✅ | ✅ |
| POST /keywords | ❌ | ❌ | ✅ |
| PATCH/DELETE /keywords | ❌ | ❌ | ✅ |
| GET /publications | ✅ | ✅ | ✅ |
| POST/PATCH/DELETE /publications | ❌ | ❌ | ✅ |
| GET /lecturers | ✅ | ✅ | ✅ |
| GET /lecturers/search | ✅ | ✅ | ✅ |
| POST/PATCH/DELETE /lecturers | ❌ | ❌ | ✅ |
| POST/DELETE /lecturers/:id/keywords | ❌ | ❌ | ✅ |

---

## 🎯 Use Cases

### 1. Sinh viên tìm mentor về chủ đề
```bash
GET /lecturers/search?keywordIds=ml-uuid
```

### 2. Xem tất cả publications của giảng viên
```bash
GET /publications?lecturerId=lecturer-uuid
```

### 3. Admin quản lý publications
```bash
# Add publication
POST /publications { lecturerId, title, ... }

# Update publication
PATCH /publications/pub-uuid { title, publicationYear, ... }

# Delete publication
DELETE /publications/pub-uuid
```

### 4. Admin quản lý keywords cho giảng viên
```bash
# Thêm keywords mới (giữ keywords cũ)
POST /lecturers/uuid/keywords { keywordIds: [...] }

# Xóa specific keywords
DELETE /lecturers/uuid/keywords { keywordIds: [...] }

# Replace toàn bộ keywords
PATCH /lecturers/uuid { keywordIds: [...] }
```

---

**📘 Xem DATABASE_DESIGN.md để hiểu rõ database schema!**

