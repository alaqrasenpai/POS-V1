<template>
  <div class="users-page">
    <div class="page-header">
      <div class="header-left">
        <n-h1 style="margin-bottom: 4px;">{{ t('users.title') }}</n-h1>
        <n-text depth="3">{{ t('users.subtitle') }}</n-text>
      </div>
      <n-button type="primary" @click="openAddModal" size="large">
        <template #icon>
          <n-icon>
            <AddIcon />
          </n-icon>
        </template>
        {{ t('users.addUser') }}
      </n-button>
    </div>

    <n-grid :cols="1" :x-gap="16" :y-gap="16">
      <n-gi>
        <n-card :bordered="false" class="main-card">
          <n-data-table :columns="columns" :data="users" :pagination="pagination" :bordered="false" scroll-x="1000" />
        </n-card>
      </n-gi>
    </n-grid>

    <!-- Modal لإضافة/تعديل مستخدم -->
    <n-modal v-model:show="showAddModal" transform-origin="center">
      <n-card style="width: 700px; max-width: 95vw; border-radius: 16px"
        :title="isEditing ? t('users.editUser') : t('users.newUser')" :bordered="false" size="huge" role="dialog"
        aria-modal="true">
        <n-form :model="formModel">
          <n-grid :cols="isMobile ? 1 : 2" :x-gap="16">
            <n-gi>
              <n-form-item :label="t('users.fullName')">
                <n-input v-model:value="formModel.name" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item :label="t('users.username')">
                <n-input v-model:value="formModel.username" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item :label="t('users.password')">
                <n-input v-model:value="formModel.password" type="password" show-password-on="click" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item :label="t('users.role')">
                <n-select v-model:value="formModel.role" :options="roleOptions" @update:value="handleRoleChange" />
              </n-form-item>
            </n-gi>
          </n-grid>

          <n-divider title-placement="right">{{ t('users.permissions') }}</n-divider>

          <n-form-item :label="t('users.permissions')">
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
            <n-button quaternary @click="showAddModal = false">{{ t('common.cancel') }}</n-button>
            <n-button type="primary" @click="handleSave" size="large" style="min-width: 120px;">{{ t('common.save')
            }}</n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, h, computed, onMounted } from 'vue'
import { NTag, NButton, NIcon, NSpace, NSwitch, useMessage, NDivider, NCheckboxGroup, NCheckbox, NText } from 'naive-ui'
import { useUsers } from '@/composables/useUsers'
import { useAuth } from '@/composables/useAuth'
import { useScreen } from '@/composables/useScreen'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
useHead({ title: t('users.title') })
const { isMobile } = useScreen()
const { getUsers, addUser, updateUser, deleteUser, toggleUserStatus, availablePermissions } = useUsers()
const { hasPermission } = useAuth()
const message = useMessage()

onMounted(() => {
  if (!hasPermission('all')) {
    message.error(t('common.error')) // Using generic error for permission
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

const columns = computed(() => [
  {
    title: t('users.fullName'),
    key: 'name',
    render(row) {
      return h('div', { style: 'font-weight: bold' }, row.name)
    }
  },
  {
    title: t('users.username'),
    key: 'username'
  },
  {
    title: t('users.role'),
    key: 'role',
    render(row) {
      const typeMap = {
        admin: 'error',
        manager: 'warning',
        cashier: 'info'
      }
      return h(NTag, { type: typeMap[row.role], bordered: false, round: true }, { default: () => row.role })
    }
  },
  {
    title: t('users.permissions'),
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
    title: t('users.status') || 'Status',
    key: 'active',
    render(row) {
      return h(NSwitch, {
        value: row.active,
        'onUpdateValue': () => {
          toggleUserStatus(row.id)
          message.info(t('users.statusUpdate'))
        }
      })
    }
  },
  {
    title: t('users.lastSeen'),
    key: 'lastLogin'
  },
  {
    title: t('common.actions'),
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
])

const openAddModal = () => {
  resetForm()
  showAddModal.value = true
}

const handleSave = () => {
  if (!formModel.value.name || !formModel.value.username) {
    message.error(t('users.mainAdminError'))
    return
  }

  if (isEditing.value) {
    updateUser(editingId.value, { ...formModel.value })
    message.success(t('users.saveSuccess'))
  } else {
    addUser({ ...formModel.value })
    message.success(t('users.saveSuccess'))
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
    message.error(t('users.mainAdminError'))
    return
  }
  deleteUser(id)
  message.success(t('users.deleteSuccess'))
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
  background-color: var(--n-th-color);
}
</style>
