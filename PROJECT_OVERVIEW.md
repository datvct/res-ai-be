# 📚 Redis AI Backend - Project Overview

## 🎯 Tổng quan Dự án

Hệ thống backend NestJS quản lý thông tin giảng viên, từ khóa và publications (đề tài, bài báo khoa học). Hệ thống hỗ trợ sinh viên tìm kiếm mentor theo chủ đề, học vị, và lĩnh vực nghiên cứu.

---

## 🗄️ Database Schema (4 Tables)

### 1️⃣ **users** - Quản lý người dùng
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | User ID |
| username | VARCHAR | UNIQUE, NOT NULL | Tên đăng nhập |
| email | VARCHAR | UNIQUE, NOT NULL | Email |
| password | VARCHAR | NOT NULL | Password (bcrypt hashed) |
| fullName | VARCHAR | NOT NULL | Họ tên |
| phone | VARCHAR | NULLABLE | Số điện thoại |
| roles | ENUM | DEFAULT 'user' | Vai trò: admin/user |
| isActive | BOOLEAN | DEFAULT true | Trạng thái |
| createdAt | TIMESTAMP | AUTO | Ngày tạo |
| updatedAt | TIMESTAMP | AUTO | Ngày cập nhật |

**Business Rules:**
- Password tự động hash với bcrypt (10 rounds) trước khi save
- Username và email phải unique
- Roles: `admin` (full access), `user` (read only)

---

### 2️⃣ **keywords** - Danh mục từ khóa
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Keyword ID |
| name | VARCHAR | UNIQUE, NOT NULL | Tên từ khóa |
| createdAt | TIMESTAMP | AUTO | Ngày tạo |

**Business Rules:**
- Đơn giản, chỉ lưu tên từ khóa
- Sử dụng để tag giảng viên theo chủ đề
- Many-to-Many với Lecturers

---

### 3️⃣ **lecturers** - Thông tin giảng viên
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Lecturer ID |
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

**Academic Titles (Học hàm/Học vị):**
- `GS` - Giáo sư
- `PGS` - Phó Giáo sư
- `TS` - Tiến sĩ
- `ThS` - Thạc sĩ
- `KS` - Kỹ sư
- `CN` - Cử nhân

**Relationships:**
- Many-to-Many với Keywords (qua junction table)
- One-to-Many với Publications

---

### 4️⃣ **publications** - Đề tài, bài báo khoa học
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Publication ID |
| lecturerId | UUID | FK | Giảng viên sở hữu |
| title | VARCHAR | NOT NULL | Tiêu đề |
| description | TEXT | NULLABLE | Mô tả chi tiết |
| publicationYear | INT | NULLABLE | Năm xuất bản |
| journal | VARCHAR | NULLABLE | Tên tạp chí/hội nghị |
| authors | TEXT | NULLABLE | Danh sách tác giả |
| url | VARCHAR | NULLABLE | Link tới bài báo |
| type | ENUM | DEFAULT 'research_paper' | Loại công trình |
| createdAt | TIMESTAMP | AUTO | Ngày tạo |
| updatedAt | TIMESTAMP | AUTO | Ngày cập nhật |

**Publication Types:**
- `research_paper` - Bài báo nghiên cứu
- `project` - Đề tài nghiên cứu
- `book` - Sách
- `conference` - Hội nghị
- `other` - Khác

**Foreign Key:**
- `lecturerId` REFERENCES `lecturers(id)` ON DELETE CASCADE

---

### 🔗 **lecturer_keywords** (Junction Table)
| Column | Type | Constraints |
|--------|------|-------------|
| lecturerId | UUID | FK to lecturers |
| keywordId | UUID | FK to keywords |

**Primary Key:** (lecturerId, keywordId)

---

## 📡 API Endpoints (30+ endpoints)

### 🔐 **Authentication** (`/auth`)

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| POST | `/auth/register` | Public | Đăng ký user mới |
| POST | `/auth/login` | Public | Đăng nhập |
| GET | `/auth/profile` | Authenticated | Lấy thông tin user hiện tại |

**Example Request:**
```json
POST /auth/register
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123!",
  "fullName": "John Doe",
  "phone": "0123456789",
  "roles": "user"
}
```

---

### 👥 **Users** (`/users`)

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| POST | `/users` | Public | Tạo user mới |
| GET | `/users` | Admin | Lấy tất cả users |
| GET | `/users/:id` | Authenticated | Lấy user theo ID |
| PATCH | `/users/:id` | Authenticated | Cập nhật user |
| DELETE | `/users/:id` | Admin | Xóa user |

---

### 🔖 **Keywords** (`/keywords`)

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| POST | `/keywords` | Admin | Tạo keyword mới |
| GET | `/keywords` | Public | Lấy tất cả keywords |
| GET | `/keywords/:id` | Public | Lấy keyword theo ID |
| PATCH | `/keywords/:id` | Admin | Cập nhật keyword |
| DELETE | `/keywords/:id` | Admin | Xóa keyword |

**Example Request:**
```json
POST /keywords
{
  "name": "Machine Learning"
}
```

---

### 👨‍🏫 **Lecturers** (`/lecturers`)

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| POST | `/lecturers` | Admin | Tạo giảng viên mới |
| GET | `/lecturers` | Public | Lấy tất cả giảng viên |
| GET | `/lecturers/search` | Public | **Tìm kiếm giảng viên** |
| GET | `/lecturers/:id` | Public | Lấy giảng viên theo ID |
| PATCH | `/lecturers/:id` | Admin | Cập nhật giảng viên |
| DELETE | `/lecturers/:id` | Admin | Xóa giảng viên |
| POST | `/lecturers/:id/keywords` | Admin | Thêm keywords |
| DELETE | `/lecturers/:id/keywords` | Admin | Xóa keywords |

**Search Parameters:**
- `search` - Tìm theo tên, lĩnh vực giảng dạy, nghiên cứu
- `academicTitle` - Lọc theo học vị (GS, PGS, TS, ThS, KS, CN)
- `keywordIds` - Lọc theo keywords (array)

**Example Requests:**
```bash
# Tìm giảng viên dạy Machine Learning
GET /lecturers/search?search=Machine Learning

# Lọc theo học vị Tiến sĩ
GET /lecturers/search?academicTitle=TS

# Lọc theo keywords
GET /lecturers/search?keywordIds=uuid-1&keywordIds=uuid-2

# Kết hợp filters
GET /lecturers/search?search=AI&academicTitle=TS&keywordIds=uuid-1
```

**Create Lecturer:**
```json
POST /lecturers
{
  "fullName": "TS. Nguyễn Văn A",
  "academicTitle": "TS",
  "birthYear": 1980,
  "workUnit": "Khoa Công nghệ Thông tin",
  "position": "Giảng viên chính",
  "teachingField": "Lập trình Web, Cơ sở dữ liệu",
  "researchField": "Machine Learning, AI",
  "email": "nguyenvana@university.edu.vn",
  "phone": "0123456789",
  "bio": "10 năm kinh nghiệm...",
  "keywordIds": ["uuid-1", "uuid-2"]
}
```

---

### 📄 **Publications** (`/publications`)

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| POST | `/publications` | Admin | Tạo publication mới |
| GET | `/publications` | Public | Lấy tất cả publications |
| GET | `/publications?lecturerId=uuid` | Public | Filter by lecturer |
| GET | `/publications/:id` | Public | Lấy publication theo ID |
| PATCH | `/publications/:id` | Admin | Cập nhật publication |
| DELETE | `/publications/:id` | Admin | Xóa publication |

**Example Request:**
```json
POST /publications
{
  "lecturerId": "uuid-of-lecturer",
  "title": "Machine Learning in Education",
  "description": "Nghiên cứu ứng dụng ML...",
  "publicationYear": 2023,
  "journal": "IEEE Transactions",
  "authors": "Nguyen Van A, Co-author B",
  "url": "https://example.com/paper.pdf",
  "type": "research_paper"
}
```

---

## 🔒 Permissions Summary

| Role | Permissions |
|------|-------------|
| **Public** | Read keywords, lecturers, publications. Login, Register |
| **User** | Same as Public + Read own profile, Update own info |
| **Admin** | Full CRUD on all resources |

---

## 🎯 Use Cases

### 1. Sinh viên tìm mentor về Machine Learning
```
1. GET /lecturers/search?search=Machine Learning
2. Xem danh sách giảng viên match
3. GET /lecturers/:id để xem chi tiết
4. Xem keywords và publications của giảng viên
```

### 2. Admin quản lý giảng viên
```
1. POST /auth/login (admin credentials)
2. POST /lecturers (tạo giảng viên mới)
3. POST /publications (thêm đề tài/bài báo)
4. POST /lecturers/:id/keywords (gắn keywords)
```

### 3. Xem publications của giảng viên
```
1. GET /lecturers/:id (có included publications)
2. Hoặc GET /publications?lecturerId=uuid
```

---

## 🛠️ Tech Stack

- **Framework:** NestJS 10.x
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT + Passport
- **Validation:** class-validator, class-transformer
- **Documentation:** Swagger/OpenAPI
- **Security:** bcrypt password hashing

---

## 📊 Response Format

Tất cả responses đều có format chuẩn:

```json
{
  "data": {},
  "message": "Success",
  "statusCode": 200,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Success Example:**
```json
{
  "data": {
    "id": "uuid",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe"
  },
  "message": "User created successfully",
  "statusCode": 201,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Error Example:**
```json
{
  "data": null,
  "message": "Username already exists",
  "statusCode": 409,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## 🚀 Quick Start

```bash
# 1. Install
npm install

# 2. Setup database
createdb redis_ai_db

# 3. Configure .env
PORT=9999
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=redis_ai_db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# 4. Run
npm run start:dev

# 5. Access
# App: http://localhost:9999
# Swagger: http://localhost:9999/api
```

---

## 📁 Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── decorators/         # @CurrentUser(), @Roles()
│   ├── guards/             # JwtAuthGuard, RolesGuard
│   ├── strategies/         # JWT, Local strategies
│   └── dto/                # Login, Register DTOs
│
├── users/                   # User management
│   ├── entities/           # User entity
│   ├── enums/              # UserRole enum
│   └── dto/                # User DTOs
│
├── keywords/                # Keywords management
│   ├── entities/           # Keyword entity
│   └── dto/                # Keyword DTOs
│
├── lecturers/              # Lecturers management
│   ├── entities/           # Lecturer entity
│   ├── enums/              # AcademicTitle enum
│   └── dto/                # Lecturer DTOs + Search
│
├── publications/           # Publications management
│   ├── entities/           # Publication entity
│   └── dto/                # Publication DTOs
│
├── common/                 # Shared utilities
│   ├── dto/                # ApiResponse DTO
│   ├── filters/            # Exception filters
│   └── interceptors/       # Transform interceptor
│
└── app.module.ts           # Root module
```

---

## 📈 Key Features

✅ **JWT Authentication** - Secure login với JWT tokens  
✅ **Role-Based Access Control** - Admin/User permissions  
✅ **Password Hashing** - Bcrypt với 10 salt rounds  
✅ **Input Validation** - class-validator cho tất cả DTOs  
✅ **Swagger Documentation** - Interactive API docs  
✅ **Standardized Responses** - Consistent API format  
✅ **Many-to-Many Relationships** - Lecturers ↔ Keywords  
✅ **One-to-Many Relationships** - Lecturers → Publications  
✅ **Powerful Search** - Multi-criteria lecturer search  
✅ **Cascade Delete** - Auto cleanup relationships  
✅ **Auto Timestamps** - createdAt, updatedAt  

---

## 📚 Documentation Files

- **PROJECT_OVERVIEW.md** (this file) - Tổng quan dự án
- **API_GUIDE.md** - Chi tiết API endpoints
- **DATABASE_DESIGN.md** - Database schema & ERD
- **README.md** - Setup instructions
- **Swagger UI** - http://localhost:9999/api

---

## 🎓 Academic Context

Hệ thống được thiết kế cho môi trường giáo dục đại học:
- Quản lý thông tin giảng viên
- Sinh viên tìm mentor theo chủ đề nghiên cứu
- Quản lý publications (đề tài, bài báo)
- Phân loại theo học hàm/học vị
- Tag theo keywords để dễ search

---

**Total:**
- 4 Main Tables + 1 Junction Table
- 30+ API Endpoints
- 3 Modules (Auth, Users, Lecturers, Keywords, Publications)
- Full CRUD on all resources
- Search & Filter capabilities
- Production-ready features

🚀 **Ready to use!**

