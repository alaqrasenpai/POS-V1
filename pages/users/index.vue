<template>
  <div class="users-page">
    <div class="page-header">
      <div class="header-left">
        <n-h1 style="margin-bottom: 4px;">إدارة المستخدمين والصلاحيات</n-h1>
        <n-text depth="3">تحكم في هوية من يدخل للنظام وما يمكنه فعله</n-text>
      </div>
      <n-button type="primary" @click="openAddModal" size="large">
        <template #icon>
          <n-icon><AddIcon /></n-icon>
        </template>
        إضافة مستخدم جديد
      </n-button>
    </div>

    <n-grid :cols="1" :x-gap="16" :y-gap="16">
      <n-gi>
        <n-card :bordered="false" class="main-card">
          <n-data-table
            :columns="columns"
            :data="users"
            :pagination="pagination"
            :bordered="false"
            scroll-x="1000"
          />
        </n-card>
      </n-gi>
    </n-grid>

    <!-- Modal لإضافة/تعديل مستخدم -->
    <n-modal v-model:show="showAddModal" transform-origin="center">
      <n-card
        style="width: 700px; max-width: 95vw; border-radius: 16px"
        :title="isEditing ? 'تعديل بيانات مستخدم' : 'إنشاء حساب مستخدم جديد'"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-form :model="formModel">
          <n-grid :cols="isMobile ? 1 : 2" :x-gap="16">
            <n-gi>
              <n-form-item label="الاسم الكامل">
                <n-input v-model:value="formModel.name" placeholder="أدخل الاسم الحقيقي للموظف" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="اسم المستخدم">
                <n-input v-model:value="formModel.username" placeholder="مثال: omarsaleh" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="كلمة المرور">
                <n-input
                  v-model:value="formModel.password"
                  type="password"
                  show-password-on="click"
                  placeholder="أدخل كلمة مرور قوية"
                />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="الدور الوظيفي">
                <n-select
                  v-model:value="formModel.role"
                  :options="roleOptions"
                  placeholder="اختر دور المستخدم"
                  @update:value="handleRoleChange"
                />
              </n-form-item>
            </n-gi>
          </n-grid>

          <n-divider title-placement="right">تخصيص الصلاحيات</n-divider>
          
          <n-form-item label="الصلاحيات الممنوحة لهذا الحساب:">
            <n-checkbox-group v-model:value="formModel.permissions">
              <n-grid :cols="isMobile ? 1 : 3">
                <n-gi v-for="perm in availablePermissions" :key="perm.value">
                  <n-checkbox :value="perm.value" :label="perm.label" />
                </n-gi>
              </n-grid>
            </n-checkbox-group>
          </n-form-item>
        </n-form>
        
        <template #footer>
          <n-space justify="end">
            <n-button quaternary @click="showAddModal = false">إلغاء</n-button>
            <n-button type="primary" @click="handleSave" size="large" style="min-width: 120px;">حفظ التغييرات</n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, h, computed, onMounted } from 'vue'
import { AddOutline as AddIcon, TrashOutline as DeleteIcon, CreateOutline as EditIcon, ShieldCheckmarkOutline as ShieldIcon } from '@vicons/ionicons5'
import { NTag, NButton, NIcon, NSpace, NSwitch, useMessage, NDivider, NCheckboxGroup, NCheckbox, NText } from 'naive-ui'
import { useUsers } from '@/composables/useUsers'
import { useAuth } from '@/composables/useAuth'
import { useScreen } from '@/composables/useScreen'

const { isMobile } = useScreen()
const { getUsers, addUser, updateUser, deleteUser, toggleUserStatus, availablePermissions } = useUsers()
const { hasPermission } = useAuth()
const message = useMessage()

onMounted(() => {
  if (!hasPermission('all')) {
    message.error('عذراً، ليس لديك صلاحية للوصول لهذه الصفحة')
    navigateTo('/')
  }
})

const users = computed(() => getUsers())
const showAddModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const formModel = ref({
  name: '',
  username: '',
  password: '',
  role: 'cashier',
  permissions: ['view_dashboard', 'sell_orders', 'view_customers']
})

const roleOptions = [
  { label: 'مدير النظام (Admin)', value: 'admin' },
  { label: 'مدير مبيعات (Manager)', value: 'manager' },
  { label: 'كاشير (Cashier)', value: 'cashier' }
]

const handleRoleChange = (role) => {
  // تعيين صلاحيات افتراضية بناءً على الدور
  if (role === 'admin') {
    formModel.value.permissions = ['all']
  } else if (role === 'manager') {
    formModel.value.permissions = ['view_dashboard', 'manage_inventory', 'manage_categories', 'manage_suppliers', 'view_reports', 'view_customers']
  } else {
    formModel.value.permissions = ['view_dashboard', 'sell_orders', 'view_customers']
  }
}

const pagination = {
  pageSize: 10
}

const renderIcon = (icon) => () => h(NIcon, null, { default: () => h(icon) })

const columns = [
  {
    title: 'الاسم الوظيفي',
    key: 'name',
    render(row) {
      return h('div', { style: 'font-weight: bold' }, row.name)
    }
  },
  {
    title: 'اسم المستخدم',
    key: 'username'
  },
  {
    title: 'الدور',
    key: 'role',
    render(row) {
      const typeMap = {
        admin: 'error',
        manager: 'warning',
        cashier: 'info'
      }
      const labelMap = {
        admin: 'مدير',
        manager: 'محاسب/مدير',
        cashier: 'كاشير'
      }
      return h(NTag, { type: typeMap[row.role], bordered: false, round: true }, { default: () => labelMap[row.role] })
    }
  },
  {
    title: 'الصلاحيات الممنوحة',
    key: 'permissions',
    render(row) {
      if (row.permissions.includes('all')) {
        return h(NTag, { type: 'success', quaternary: true }, { default: () => 'صلاحية كاملة' })
      }
      return h(NSpace, { size: 'small', wrap: true }, {
        default: () => row.permissions.map(p => {
          const permLabel = availablePermissions.find(ap => ap.value === p)?.label || p
          return h(NTag, { size: 'small', quaternary: true }, { default: () => permLabel })
        })
      })
    }
  },
  {
    title: 'الحالة',
    key: 'active',
    render(row) {
      return h(NSwitch, {
        value: row.active,
        'onUpdateValue': () => {
          toggleUserStatus(row.id)
          message.info('تم تحديث حالة الحساب')
        }
      })
    }
  },
  {
    title: 'آخر ظهور',
    key: 'lastLogin'
  },
  {
    title: 'التحكم',
    key: 'actions',
    width: 120,
    render(row) {
      return h(NSpace, { justify: 'center' }, {
        default: () => [
          h(
            NButton,
            {
              quaternary: true,
              circle: true,
              type: 'warning',
              onClick: () => handleEdit(row)
            },
            { icon: renderIcon(EditIcon) }
          ),
          h(
            NButton,
            {
              quaternary: true,
              circle: true,
              type: 'error',
              onClick: () => handleDelete(row.id)
            },
            { icon: renderIcon(DeleteIcon) }
          )
        ]
      })
    }
  }
]

const openAddModal = () => {
  resetForm()
  showAddModal.value = true
}

const handleSave = () => {
  if (!formModel.value.name || !formModel.value.username) {
    message.error('يرجى كتابة الاسم واسم المستخدم')
    return
  }

  if (isEditing.value) {
    updateUser(editingId.value, { ...formModel.value })
    message.success('تم الحفظ بنجاح')
  } else {
    addUser({ ...formModel.value })
    message.success('تم إنشاء الحساب')
  }

  showAddModal.value = false
}

const handleEdit = (user) => {
  isEditing.value = true
  editingId.value = user.id
  formModel.value = { ...user }
  showAddModal.value = true
}

const handleDelete = (id) => {
  if (id === 1) {
    message.error('عذراً، لا يمكن حذف حساب مدير النظام الرئيسي')
    return
  }
  deleteUser(id)
  message.success('تم حذف الحساب')
}

const resetForm = () => {
  isEditing.value = false
  editingId.value = null
  formModel.value = {
    name: '',
    username: '',
    password: '',
    role: 'cashier',
    permissions: ['view_dashboard', 'sell_orders', 'view_customers']
  }
}
</script>

<style scoped>
.users-page {
  padding: 0;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.main-card {
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}
:deep(.n-data-table .n-data-table-th) {
  background-color: #f9fafb;
}
</style>
