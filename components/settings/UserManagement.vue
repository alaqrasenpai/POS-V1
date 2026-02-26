<template>
  <div class="users-section">
    <n-flex justify="space-between" align="center" style="margin-bottom: 24px;">
      <n-text depth="3">{{ t('users.subtitle') }}</n-text>
      <n-button type="primary" @click="openAddModal">
        <template #icon>
          <n-icon>
            <AddIcon />
          </n-icon>
        </template>
        {{ t('users.addUser') }}
      </n-button>
    </n-flex>

    <n-data-table :columns="columns" :data="users" :pagination="pagination" :bordered="false" scroll-x="1000" />

    <!-- Modal لإضافة/تعديل مستخدم -->
    <n-modal v-model:show="showAddModal" transform-origin="center">
      <n-card style="width: 700px; max-width: 95vw; border-radius: 16px"
        :title="isEditing ? t('users.editUser') : t('users.newUser')" :bordered="false" size="huge" role="dialog"
        aria-modal="true">
        <n-form :model="formModel">
          <n-grid :cols="isMobile ? 1 : 2" :x-gap="16">
            <n-gi>
              <n-form-item :label="t('users.fullName')">
                <n-input v-model:value="formModel.name" :placeholder="t('users.fullName')" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item :label="t('users.username')">
                <n-input v-model:value="formModel.username" :placeholder="t('users.username')" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item :label="t('users.password')">
                <n-input v-model:value="formModel.password" type="password" show-password-on="click"
                  :placeholder="t('users.password')" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item :label="t('users.role')">
                <n-select v-model:value="formModel.role" :options="roleOptions" :placeholder="t('users.role')"
                  @update:value="handleRoleChange" />
              </n-form-item>
            </n-gi>
            <n-gi v-if="currentUser?.role === 'super_admin'">
              <n-form-item :label="t('superAdmin.storeName')">
                <n-select v-model:value="formModel.storeId" :options="storeOptions" :placeholder="t('common.search')" />
              </n-form-item>
            </n-gi>
          </n-grid>

          <n-divider title-placement="right">{{ t('common.settings') }}</n-divider>

          <n-form-item :label="t('users.permissions') + ':'">
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
import { ref, h, computed } from 'vue'
import { AddOutline as AddIcon, TrashOutline as DeleteIcon, CreateOutline as EditIcon } from '@vicons/ionicons5'
import { NTag, NButton, NIcon, NSpace, NSwitch, useMessage } from 'naive-ui'
import { useUsers } from '@/composables/useUsers'
import { useScreen } from '@/composables/useScreen'
import { useAuth } from '@/composables/useAuth'
import { useStores } from '@/composables/useStores'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
const { isMobile } = useScreen()
const { getUsers, addUser, updateUser, deleteUser, toggleUserStatus, availablePermissions } = useUsers()
const { currentUser } = useAuth()
const { getStores } = useStores()
const message = useMessage()

const users = computed(() => {
  const allUsers = getUsers()
  if (currentUser.value?.role === 'super_admin') {
    return allUsers
  }
  return allUsers.filter(u => u.storeId === currentUser.value?.storeId)
})

const storeOptions = computed(() => {
  return getStores().map(s => ({
    label: s.name,
    value: s.id
  }))
})

const showAddModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const formModel = ref({
  name: '',
  username: '',
  password: '',
  role: 'cashier',
  permissions: ['view_dashboard', 'sell_orders', 'view_customers'],
  storeId: currentUser.value?.storeId || 0
})

const roleOptions = computed(() => [
  { label: t('users.roles.admin'), value: 'admin' },
  { label: t('users.roles.manager'), value: 'manager' },
  { label: t('users.roles.cashier'), value: 'cashier' }
])

const handleRoleChange = (role) => {
  if (role === 'admin') {
    formModel.value.permissions = ['all']
  } else if (role === 'manager') {
    formModel.value.permissions = ['view_dashboard', 'manage_inventory', 'manage_categories', 'manage_suppliers', 'view_reports', 'view_customers']
  } else {
    formModel.value.permissions = ['view_dashboard', 'sell_orders', 'view_customers']
  }
}

const pagination = { pageSize: 10 }

const renderIcon = (icon) => () => h(NIcon, null, { default: () => h(icon) })

const columns = computed(() => [
  {
    title: t('common.name'),
    key: 'name',
    render(row) {
      return h('div', { style: 'font-weight: bold' }, row.name)
    }
  },
  { title: t('users.username'), key: 'username' },
  {
    title: t('users.role'),
    key: 'role',
    render(row) {
      const typeMap = { admin: 'error', manager: 'warning', cashier: 'info' }
      const labelMap = { admin: t('users.roles.admin'), manager: t('users.roles.manager'), cashier: t('users.roles.cashier') }
      return h(NTag, { type: typeMap[row.role], bordered: false, round: true }, { default: () => labelMap[row.role] })
    }
  },
  ...(currentUser.value?.role === 'super_admin' ? [{
    title: t('superAdmin.storeName'),
    key: 'storeId',
    render(row) {
      const store = getStores().find(s => s.id === row.storeId)
      return h(NTag, { quaternary: true, size: 'small' }, { default: () => store ? store.name : t('common.unknown') })
    }
  }] : []),
  {
    title: t('users.permissions'),
    key: 'permissions',
    render(row) {
      if (row.permissions.includes('all')) {
        return h(NTag, { type: 'success', quaternary: true }, { default: () => t('superAdmin.fullAccess') })
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
    title: t('common.status'),
    key: 'active',
    render(row) {
      return h(NSwitch, {
        value: row.active,
        'onUpdateValue': () => {
          toggleUserStatus(row.id)
          message.info(t('users.statusUpdate', 'Status updated'))
        }
      })
    }
  },
  {
    title: t('common.actions'),
    key: 'actions',
    width: 100,
    render(row) {
      return h(NSpace, { justify: 'center' }, {
        default: () => [
          h(NButton, { quaternary: true, circle: true, type: 'warning', onClick: () => handleEdit(row) }, { icon: renderIcon(EditIcon) }),
          h(NButton, { quaternary: true, circle: true, type: 'error', onClick: () => handleDelete(row.id) }, { icon: renderIcon(DeleteIcon) })
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
    message.error(t('common.error', 'Error'))
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
  formModel.value = { ...JSON.parse(JSON.stringify(user)) }
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
    name: '', username: '', password: '', role: 'cashier',
    permissions: ['view_dashboard', 'sell_orders', 'view_customers']
  }
}
</script>
