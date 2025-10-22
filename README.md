# 🚀 Redis AI API - NestJS Backend

API backend cho hệ thống quản lý giảng viên và blog với NestJS, TypeORM, PostgreSQL và JWT Authentication.

## ✨ Tính năng

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, User)
- User registration & login với username/password
- Bcrypt password hashing

### 👥 User Management
- Quản lý users với roles (Admin/User)
- User profile: username, fullName, phone, roles
- Admin-only endpoints cho user management

### 👨‍🏫 Lecturer Management (Đơn giản hóa)
- CRUD operations cho giảng viên
- **Upload ảnh giảng viên** (lưu trên server local)
- **Thông tin cơ bản**: 
  - Họ tên (fullName)
  - Học hàm/học vị (academicTitle): GS, PGS, TS, ThS, KS, CN
  - Đơn vị công tác (workUnit)
  - Chức danh (position)
  - Website (link trang web cá nhân)
  - Image (ảnh đại diện)
- Tìm kiếm theo tên, học hàm/học vị, từ khóa
- Many-to-many relationship với Keywords

### 🏷️ Keyword Management
- CRUD operations cho từ khóa
- Liên kết nhiều từ khóa với giảng viên
- Hỗ trợ tìm kiếm giảng viên theo từ khóa

### 📝 Blog Management (Có danh mục)
- CRUD operations cho blogs
- **Upload ảnh blog** (lưu trên server local)
- **Danh mục blog (Categories)**
- Thông tin: Title, Description, Image, Contents, Category
- Lọc blogs theo category
- Many-to-One relationship với Categories

### 🗂️ Category Management
- CRUD operations cho danh mục blog
- Unique category names
- Slug support cho SEO-friendly URLs

### 📡 API Features
- **Standardized API Response Format** cho tất cả endpoints
- Swagger/OpenAPI documentation
- Global validation với class-validator
- Error handling với custom filters
- CORS enabled

## 🛠️ Tech Stack

- **Framework**: NestJS 10
- **Database**: PostgreSQL + TypeORM
- **Authentication**: JWT + Passport
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **File Upload**: Multer (local storage)
- **Security**: Bcrypt password hashing

## 📦 Installation

```bash
# Clone repository
git clone <repository-url>
cd redis-ai-be

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env với thông tin database của bạn

# Start PostgreSQL database (Docker hoặc local)
# Tạo database tên: redis_ai_db

# Run development server
npm run start:dev
```

## 🔧 Environment Variables

```env
# Application
PORT=9999

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=redis_ai_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Upload Directory (optional, defaults to ./uploads if not set)
UPLOAD_DIR=
```

## 📚 API Documentation

Sau khi chạy server, truy cập Swagger UI tại:
```
http://localhost:9999/api
```

## 🎯 API Endpoints Overview

### Authentication
- `POST /auth/register` - Đăng ký user mới
- `POST /auth/login` - Đăng nhập
- `GET /auth/profile` - Lấy profile user hiện tại (requires JWT)

### Users (Admin only)
- `GET /users` - Lấy danh sách users
- `GET /users/:id` - Lấy user theo ID
- `POST /users` - Tạo user mới
- `PATCH /users/:id` - Cập nhật user
- `DELETE /users/:id` - Xóa user

### Lecturers (Đơn giản)
- `GET /lecturers` - Lấy danh sách giảng viên (Public)
- `GET /lecturers/search` - Tìm kiếm giảng viên (Public)
- `GET /lecturers/:id` - Lấy giảng viên theo ID (Public)
- `POST /lecturers` - Tạo giảng viên mới **với upload ảnh** (Admin only)
- `PATCH /lecturers/:id` - Cập nhật giảng viên **với upload ảnh mới** (Admin only)
- `DELETE /lecturers/:id` - Xóa giảng viên (Admin only)
- `POST /lecturers/:id/keywords` - Thêm keywords cho giảng viên (Admin only)
- `DELETE /lecturers/:id/keywords` - Xóa keywords khỏi giảng viên (Admin only)

### Keywords
- `GET /keywords` - Lấy danh sách từ khóa
- `GET /keywords/:id` - Lấy từ khóa theo ID
- `POST /keywords` - Tạo từ khóa mới (Admin only)
- `PATCH /keywords/:id` - Cập nhật từ khóa (Admin only)
- `DELETE /keywords/:id` - Xóa từ khóa (Admin only)

### Categories
- `GET /categories` - Lấy danh sách categories
- `GET /categories/:id` - Lấy category theo ID (kèm blogs)
- `POST /categories` - Tạo category mới (Admin only)
- `PATCH /categories/:id` - Cập nhật category (Admin only)
- `DELETE /categories/:id` - Xóa category (Admin only)

### Blogs
- `GET /blogs` - Lấy danh sách blogs (Public)
- `GET /blogs?categoryId={uuid}` - Lọc blogs theo category (Public)
- `GET /blogs/:id` - Lấy blog theo ID (Public)
- `POST /blogs` - Tạo blog mới **với upload ảnh** (Admin only)
- `PATCH /blogs/:id` - Cập nhật blog **với upload ảnh mới** (Admin only)
- `DELETE /blogs/:id` - Xóa blog (Admin only)

### Static Files
- `GET /uploads/{year}/{month}/{filename}` - Truy cập ảnh đã upload

## 📸 Upload Ảnh

### Create Lecturer với Image
```bash
POST /lecturers
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

Form Data:
- fullName: "TS. Nguyễn Văn A"
- academicTitle: "TS"
- workUnit: "Khoa Công nghệ Thông tin"
- position: "Giảng viên chính"
- website: "https://lecturer-profile.com"
- image: [File binary] (optional)
- keywordIds: ["keyword-uuid-1", "keyword-uuid-2"] (optional)
```

### Create Blog với Image và Category
```bash
POST /blogs
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

Form Data:
- title: "Tiêu đề blog"
- description: "Mô tả ngắn"
- contents: "Nội dung đầy đủ..."
- categoryId: "category-uuid" (optional)
- image: [File binary] (optional)
```

## 📝 API Response Format

Tất cả API responses đều có format chuẩn:

### Success Response
```json
{
  "data": { ... },
  "message": "Success message",
  "statusCode": 200,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Error Response
```json
{
  "data": null,
  "message": "Error message",
  "statusCode": 400,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 🔑 Quick Start

### 1. Tạo Admin User
```bash
POST /auth/register
{
  "username": "admin",
  "password": "admin123",
  "fullName": "Admin User",
  "phone": "0123456789",
  "roles": ["admin"]
}

# Login và copy token
POST /auth/login
{
  "username": "admin",
  "password": "admin123"
}
```

### 2. Tạo Categories
```bash
POST /categories
Authorization: Bearer {token}
{
  "name": "Công nghệ",
  "description": "Bài viết về công nghệ",
  "slug": "cong-nghe"
}
```

### 3. Tạo Keywords
```bash
POST /keywords
Authorization: Bearer {token}
{
  "name": "Machine Learning"
}
```

### 4. Tạo Lecturer với Image
```bash
# Sử dụng Swagger UI hoặc Postman
POST /lecturers
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

### 5. Tạo Blog với Image và Category
```bash
# Sử dụng Swagger UI hoặc Postman
POST /blogs
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

## 🧪 Testing với Swagger

1. Mở Swagger UI: `http://localhost:9999/api`
2. Click "Authorize" button
3. Nhập token: `Bearer {your-jwt-token}`
4. Test các endpoints với UI thân thiện
5. Cho endpoints upload file: chọn file từ máy tính của bạn

## 📂 Project Structure

```
redis-ai-be/
├── src/
│   ├── auth/              # Authentication module
│   ├── users/             # User management
│   ├── lecturers/         # Lecturer management (simplified)
│   ├── keywords/          # Keyword management
│   ├── categories/        # Category management
│   ├── blogs/             # Blog management
│   ├── common/
│   │   ├── config/        # Multer config
│   │   ├── providers/     # StorageProvider (file upload)
│   │   ├── dto/           # API Response DTO
│   │   ├── filters/       # Exception filters
│   │   └── interceptors/  # Response interceptors
│   ├── app.module.ts
│   └── main.ts
├── uploads/               # Upload directory (auto-created)
│   └── {year}/{month}/    # Images organized by date
├── .env
├── .env.example
├── package.json
└── README.md
```

## 📊 Database Schema

### Tables:
- **users**: username, password, fullName, phone, roles
- **lecturers**: fullName, academicTitle, workUnit, position, image, website
- **keywords**: name
- **categories**: name, description, slug
- **blogs**: title, description, image, contents, categoryId
- **lecturer_keywords**: Join table (Many-to-Many)

### Relationships:
- Lecturers ↔ Keywords: Many-to-Many
- Categories → Blogs: One-to-Many
- Blogs → Categories: Many-to-One

## 🚀 Deployment Notes

### Production Checklist
- [ ] Change `JWT_SECRET` trong `.env`
- [ ] Set `synchronize: false` trong TypeORM config
- [ ] Run migrations thay vì auto-sync
- [ ] Setup proper file storage (S3, CloudFlare R2, etc.)
- [ ] Configure CORS cho production domain
- [ ] Setup rate limiting
- [ ] Enable HTTPS
- [ ] Configure backup cho uploads folder

## 📖 Available Scripts

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod

# Testing
npm run test
npm run test:watch
npm run test:cov

# Linting
npm run lint
npm run format
```

## 📄 License

This project is licensed under the MIT License.
