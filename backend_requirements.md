# متطلبات بناء الـ Backend (قاعدة البيانات والـ API) - نظام نقاط البيع (POS)

هذا المستند موجه لمطور الـ Backend ويوضح بالتفصيل هيكل قاعدة البيانات (Database Schema)، الجداول (Tables)، الأعمدة (Columns)، والعلاقات (Relationships) المطلوبة لبرمجة واجهة برمجة التطبيقات (API) لنظام نقاط البيع.

---

## 🏗️ المعمارية العامة لقاعدة البيانات (ERD Overview)

النظام مبني حول إدارة **المبيعات**، **المخزون**، **المستخدمين/الورديات**، و**المدفوعات الآجلة (شيكات وأقساط)**. جميع الجداول يجب أن تحتوي افتراضياً على أعمدة `created_at`, `updated_at` (وأحياناً `deleted_at` للـ Soft Deletes).

---

## 🗄️ الجداول الأساسية (Core Tables)

### 1. جدول الإعدادات `settings`
يخزن تفاصيل وإعدادات النظام كصف واحد (Single Row) أو (Key-Value).
- `shop_name` (String)
- `tax_rate` (Decimal)
- `currency` (String)
- `footer_text` (Text)
- `logo_url` (String)

### 2. جدول المستخدمين `users`
- `id` (Primary Key)
- `name` (String) - الاسم الكامل
- `username` (String, Unique) - اسم الدخول
- `password` (String, Hashed) 
- `role` (Enum: 'admin', 'manager', 'cashier')
- `permissions` (JSON) - مصفوفة الصلاحيات الممنوحة
- `is_active` (Boolean) - حالة الحساب للتفعيل والإيقاف
- `last_login` (Timestamp)

### 3. جدول العملاء `customers`
- `id` (Primary Key)
- `name` (String)
- `phone` (String, Nullable)
- `address` (String, Nullable)

### 4. جدول الموردين `suppliers`
- `id` (Primary Key)
- `name` (String)
- `phone` (String, Nullable)
- `address` (String, Nullable)

---

## 📦 المخزون (Inventory Management)

### 5. جدول التصنيفات `categories`
- `id` (Primary Key)
- `name` (String)

### 6. جدول المنتجات `items` (المنتجات)
- `id` (Primary Key)
- `name` (String)
- `category_id` (Foreign Key -> `categories.id`)
- `supplier_id` (Foreign Key -> `suppliers.id`, Nullable)
- `barcode` (String, Nullable, Unique)
- `buy_price` (Decimal) - سعر الشراء/التكلفة
- `sell_price` (Decimal) - سعر البيع
- `quantity` (Integer) - الكمية الحالية المتوفرة
- `is_favorite` (Boolean) - للظهور السريع في شاشة الكاشير
- `is_deleted` (Boolean/Soft Deletes)

### 7. جدول حركات المخزون `inventory_transactions`
يسجل أي عملية إضافة أو سحب من كمية المنتجات (خلاف المبيعات التلقائية).
- `id` (Primary Key)
- `item_id` (Foreign Key -> `items.id`)
- `user_id` (Foreign Key -> `users.id`)
- `transaction_type` (Enum: 'in', 'out') - إضافة، إتلاف/نقص
- `quantity` (Integer) - الكمية المسحوبة أو المضافة
- `note` (String, Nullable)

---

## 🧾 المبيعات والورديات (Sales & Shifts)

### 8. جدول الورديات (القاصة) `shifts`
كل موظف يفتح وردية ليقوم بعمليات البيع وتسجل العهدة بالدرج فيها العجز والزيادة.
- `id` (Primary Key)
- `user_id` (Foreign Key -> `users.id`)
- `status` (Enum: 'open', 'closed')
- `starting_cash` (Decimal) - المبلغ الافتتاحي بالدرج
- `expected_ending_cash` (Decimal) - المبلغ المتوقع بناءً على المبيعات والإيداع/السحب النقدى
- `actual_ending_cash` (Decimal, Nullable) - المبلغ الذي جُرد فعلياً عند الإغلاق
- `difference` (Decimal, Nullable) - قيمة العجز أو الزيادة (+/-)
- `start_time` (Timestamp)
- `end_time` (Timestamp, Nullable)

### 9. جدول حركات الوردية `shift_cash_transactions`
لتسجيل عمليات سحب المال من الدرج للإدارة، أو ضخ نقود في الدرج للفكّة.
- `id` (Primary Key)
- `shift_id` (Foreign Key -> `shifts.id`)
- `amount` (Decimal)
- `type` (Enum: 'in', 'out') - إيداع، سحب
- `notes` (String, Nullable)

### 10. جدول الفواتير (المبيعات) `sell_orders`
- `id` (Primary Key)
- `serial_number` (String, Unique) - رقم تسلسلي للفاتورة
- `shift_id` (Foreign Key -> `shifts.id`)
- `user_id` (Foreign Key -> `users.id`) - الموظف الذي أصدر الفاتورة
- `customer_id` (Foreign Key -> `customers.id`, Nullable) - عميل كاش (لا يوجد) أو عميل معرف
- `total_discount` (Decimal)
- `total_price` (Decimal) - الإجمالي النهائي للفاتورة
- `sell_date` (Timestamp)
- `status` (Enum: 'completed', 'returned')

### 11. جدول تفاصيل الفاتورة `sell_order_details`
- `id` (Primary Key)
- `order_id` (Foreign Key -> `sell_orders.id`)
- `item_id` (Foreign Key -> `items.id`)
- `item_name` (String) - تخزين الاسم تاريخياً وقت البيع في حال تم تغيير اسم المنتج لاحقاً.
- `buy_price` (Decimal) - سعر شراء الوحدة لتحديد ربحية الفاتورة.
- `unit_price` (Decimal) - سعر بيع الوحدة.
- `quantity` (Integer)
- `total_price` (Decimal) - `unit_price * quantity`

---

## 💰 المدفوعات الآجلة (Payments Management)

### 12. جدول الشيكات `checks`
- `id` (Primary Key)
- `customer_id` (Foreign Key -> `customers.id`)
- `order_id` (Foreign Key -> `sell_orders.id`, Nullable) - الفاتورة المرتبطة إن وجدت
- `check_number` (String)
- `amount` (Decimal)
- `due_date` (Date) - تاريخ الاستحقاق
- `status` (Enum: 'pending', 'cashed', 'returned')
- `notes` (String, Nullable)

### 13. جدول الأقساط `installments`
- `id` (Primary Key)
- `customer_id` (Foreign Key -> `customers.id`)
- `order_id` (Foreign Key -> `sell_orders.id`, Nullable)
- `total_amount` (Decimal)
- `paid_amount` (Decimal)
- `remaining_amount` (Decimal)
- `installments_count` (Integer) - عدد الأقساط الُمتبقاه او المُتفق عليها
- `status` (Enum: 'active', 'completed')

### 14. جدول سجل المدفوعات `payment_logs`
لتتبع السداد التاريخي (متى تم تكييش الشيك، ومتى تم دفع الدفعة من القسط).
- `id` (Primary Key)
- `loggable_id` (Integer) - Polymorphic Relation ID (رقم الشيك أو القسط)
- `loggable_type` (String) - Enum: 'installment', 'check'
- `amount` (Decimal, Nullable) - المبلغ المدفوع (مهم للأقساط)
- `action` (String) - مثال: 'payment', 'cashed', 'returned'
- `date` (Timestamp)

---

## 📝 سجل الأنشطة (Activity Logging)

### 15. جدول الأنشطة `activity_logs`
لتتبع كل ما حدث في النظام.
- `id` (Primary Key)
- `user_id` (Foreign Key -> `users.id`)
- `action` (String) - مثال: "إنشاء فاتورة", "تعديل منتج"
- `type` (Enum: 'info', 'warning', 'error', 'success')
- `details` (Text, Nullable)
- `created_at` (Timestamp)

---

## 🔗 العلاقات الأساسية (Relationships Summary)
المطور يجب أن ينفذ العلاقات بالشكل التالي:

1. **Category `hasMany` Items:** التصنيف يمتلك عدة منتجات.
2. **Supplier `hasMany` Items:** المورد يقدم عدة منتجات.
3. **Item `hasMany` InventoryTransactions:** كل صنف له سجل حركات وتعديل كميات.
4. **User `hasMany` Shifts:** المستخدم الواحد قد يفتح ورديات لا نهائية بمرور الوقت `(One-to-Many)`.
5. **Shift `hasMany` SellOrders:** الوردية تحتوي على مبيعاتها وفواتيرها لتصفيتها.
6. **Shift `hasMany` ShiftCashTransactions:** عمليات ضخ وسحب نقدي داخل الدرج للوردية الواحدة.
7. **SellOrder `hasMany` SellOrderDetails:** الفاتورة تملك تفاصيل سطرية لمشتريات العميل.
8. **Item `hasMany` SellOrderDetails:** لعکس إحصائيات المبيعات لصنف معين.
9. **Customer `hasMany` SellOrders / Checks / Installments:** العميل هو المالك الأجنبي لمبيعاته المتبوعة والآجلة.
10. **Installment `morphMany` PaymentLogs:** كل قسط له سجل دفعات في جدول الدفعيات.
11. **Check `morphMany` PaymentLogs:** كل شيك له حركات حالة بالوقت (مؤجل، مدفوع، راجع).

---

## 🚀 واجهات برمجة التطبيقات المطلوبة (API Endpoints Needed - RESTful)

يحتاج نظام ال Frontend المطور لتهيئة الروابط التالية بصيغة `JSON`:

- `/api/auth/login` (POST)
- `/api/users` (GET, POST, PUT, DELETE)
- `/api/settings` (GET, PUT)
- `/api/categories` (GET, POST, PUT, DELETE)
- `/api/suppliers` (GET, POST, PUT, DELETE)
- `/api/customers` (GET, POST, PUT, DELETE)
- `/api/items` (GET, POST, PUT, DELETE)
- `/api/inventory/transactions` (GET, POST)
- `/api/shifts` (GET, POST, PUT - للإغلاق)
- `/api/shifts/transactions` (POST - للسحب والإيداع)
- `/api/orders` (GET, POST)
- `/api/installments` (GET, POST)
- `/api/installments/{id}/pay` (POST)
- `/api/checks` (GET, POST, PUT, DELETE)
- `/api/checks/{id}/status` (PUT)
- `/api/activity-logs` (GET, DELETE)
