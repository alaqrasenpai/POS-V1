<template>
  <ClientOnly>
    <div class="page-container">
      <div class="page-title-section">
        <div class="page-header-text">
          <n-h1 class="page-title">إدارة المنصة (Platform Controller)</n-h1>
          <n-text class="page-subtitle">التحكم في المتاجر، الباقات، وصلاحيات كل باقة اشتراك</n-text>
        </div>
      </div>

      <n-tabs type="line" animated>
        <!-- Tab 1: المتاجر -->
        <n-tab-pane name="stores" tab="إدارة المتاجر">
          <!-- إحصائيات المتاجر -->
          <n-grid :cols="4" :x-gap="16" style="margin-bottom: 24px;">
            <n-gi>
              <n-card class="platform-stat-card">
                <n-statistic label="إجمالي المتاجر" :value="stores.length">
                  <template #prefix><n-icon><StoreIcon /></n-icon></template>
                </n-statistic>
              </n-card>
            </n-gi>
            <n-gi>
              <n-card class="platform-stat-card">
                <n-statistic label="المتاجر النشطة" :value="activeStoresCount">
                  <template #prefix><n-icon color="#18a058"><CheckIcon /></n-icon></template>
                </n-statistic>
              </n-card>
            </n-gi>
            <n-gi>
              <n-card class="platform-stat-card">
                <n-statistic label="المتاجر المتوقفة" :value="suspendedStoresCount">
                  <template #prefix><n-icon color="#d03050"><CloseIcon /></n-icon></template>
                </n-statistic>
              </n-card>
            </n-gi>
            <n-gi>
              <n-card class="platform-stat-card">
                <n-statistic label="إجمالي المستخدمين" :value="allUsersCount" />
              </n-card>
            </n-gi>
          </n-grid>

          <n-card title="سجل المتاجر المشتركة" class="main-content-card" :bordered="false">
            <template #header-extra>
              <n-button type="primary" size="small" @click="openAddModal">
                <template #icon><n-icon><AddIcon /></n-icon></template>
                إضافة متجر
              </n-button>
            </template>
            <n-data-table :columns="storeColumns" :data="stores" :bordered="false" />
          </n-card>
        </n-tab-pane>

        <!-- Tab 2: الباقات والمميزات -->
        <n-tab-pane name="plans" tab="الباقات والمميزات">
          <n-grid :cols="1" :y-gap="24">
            <n-gi>
              <n-card title="إدارة باقات الاشتراك" class="main-content-card">
                <n-data-table :columns="planColumns" :data="plans" :bordered="false" />
              </n-card>
            </n-gi>
          </n-grid>
        </n-tab-pane>
      </n-tabs>

      <!-- Modal إضافة / تعديل متجر -->
      <n-modal v-model:show="showStoreModal">
        <n-card style="width: 500px" :title="isEditing ? 'تعديل بيانات المتجر' : 'تسجيل متجر جديد'" bordered size="huge">
          <n-form :model="editableStore">
            <n-form-item label="اسم المتجر">
              <n-input v-model:value="editableStore.name" placeholder="مثال: مطعم الشرق" />
            </n-form-item>
            <n-form-item label="الرابط التعريفي (Slug)">
              <n-input v-model:value="editableStore.slug" placeholder="مثال: sharq-restaurant" />
            </n-form-item>
            <n-form-item label="رقم الجوال المسجل">
              <n-input v-model:value="editableStore.registeredPhone" placeholder="05xxxxxxxx" />
            </n-form-item>
            <n-grid :cols="2" :x-gap="12">
              <n-gi>
                <n-form-item label="العملة">
                  <n-input v-model:value="editableStore.currency" placeholder="ريال" />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="الباقة">
                  <n-select v-model:value="editableStore.plan" :options="planSelectionOptions" />
                </n-form-item>
              </n-gi>
            </n-grid>
          </n-form>
          <template #footer>
            <n-flex justify="end">
              <n-button @click="showStoreModal = false">إلغاء</n-button>
              <n-button type="primary" @click="handleSaveStore">{{ isEditing ? 'حفظ التغييرات' : 'تأكيد الإضافة' }}</n-button>
            </n-flex>
          </template>
        </n-card>
      </n-modal>

      <!-- Modal تعديل مميزات الباقة -->
      <n-modal v-model:show="showPlanModal">
        <n-card style="width: 500px" :title="'تعديل مميزات باقة: ' + editingPlan?.name" bordered size="huge">
          <n-form v-if="editingPlan">
            <n-form-item label="المميزات المتاحة لهذه الباقة">
              <n-checkbox-group v-model:value="editingPlanFeatures">
                <n-grid :cols="2">
                  <n-gi v-for="perm in availablePermissions" :key="perm.value">
                    <n-checkbox :value="perm.value" :label="perm.label" />
                  </n-gi>
                </n-grid>
              </n-checkbox-group>
            </n-form-item>
          </n-form>
          <template #footer>
            <n-flex justify="end">
              <n-button @click="showPlanModal = false">إلغاء</n-button>
              <n-button type="primary" @click="handleSavePlan">حفظ المميزات</n-button>
            </n-flex>
          </template>
        </n-card>
      </n-modal>
    </div>
  </ClientOnly>
</template>

<script setup>
import {
  StorefrontOutline as StoreIcon,
  AddOutline as AddIcon,
  CheckmarkCircleOutline as CheckIcon,
  CloseCircleOutline as CloseIcon,
  PauseOutline as PauseIcon,
  PlayOutline as PlayIcon,
  CreateOutline as EditIcon,
  LayersOutline as PlansIcon
} from '@vicons/ionicons5';
import { ref, computed, h } from 'vue';
import { useMessage, NTag, NButton, NFlex, NTooltip } from 'naive-ui';
import { useStores } from '@/composables/useStores';
import { useUsers } from '@/composables/useUsers';
import { useSubscriptions } from '@/composables/useSubscriptions';

useHead({ title: 'لوحة الإدارة المركزية' });

const { getStores, addStore, updateStore, toggleStoreStatus } = useStores();
const { getUsers } = useUsers();
const { getPlans, availablePermissions, updatePlanFeatures } = useSubscriptions();
const message = useMessage();

// Platform Stats
const stores = computed(() => getStores());
const activeStoresCount = computed(() => stores.value.filter(s => s.active).length);
const suspendedStoresCount = computed(() => stores.value.filter(s => !s.active).length);
const allUsersCount = computed(() => getUsers().length);

// Plan Management
const plans = computed(() => getPlans());
const planSelectionOptions = computed(() => plans.value.map(p => ({ label: p.name, value: p.id })));

const showStoreModal = ref(false);
const isEditing = ref(false);
const currentEditingId = ref(null);
const editableStore = ref({
  name: '',
  slug: '',
  registeredPhone: '',
  currency: 'ريال',
  plan: 'basic'
});

const showPlanModal = ref(false);
const editingPlan = ref(null);
const editingPlanFeatures = ref([]);

const openAddModal = () => {
  isEditing.value = false;
  editableStore.value = { name: '', slug: '', registeredPhone: '', currency: 'ريال', plan: 'basic' };
  showStoreModal.value = true;
};

const openEditModal = (row) => {
  isEditing.value = true;
  currentEditingId.value = row.id;
  editableStore.value = {
    name: row.name,
    slug: row.slug,
    registeredPhone: row.registeredPhone || '',
    currency: row.settings?.currency || 'ريال',
    plan: row.plan.toLowerCase()
  };
  showStoreModal.value = true;
};

const handleOpenPlanModal = (plan) => {
  editingPlan.value = plan;
  editingPlanFeatures.value = [...plan.features];
  showPlanModal.value = true;
};

const handleSavePlan = () => {
  updatePlanFeatures(editingPlan.value.id, editingPlanFeatures.value);
  message.success("تم تحديث مميزات الباقة بنجاح");
  showPlanModal.value = false;
};

// Columns definitions
const storeColumns = [
  { title: 'ID', key: 'id', width: 60 },
  { title: 'اسم المتجر', key: 'name', render: (row) => h('strong', row.name) },
  { 
    title: 'الباقة', 
    key: 'plan', 
    render: (row) => {
      const plan = plans.value.find(p => p.id === row.plan.toLowerCase());
      return h(NTag, { type: row.plan.toLowerCase() === 'pro' ? 'warning' : (row.plan.toLowerCase() === 'enterprise' ? 'error' : 'info') }, { default: () => plan?.name || row.plan })
    }
  },
  {
    title: 'الحالة',
    key: 'status',
    render: (row) => h(NTag, {
      type: row.active ? 'success' : 'error',
      bordered: false
    }, { default: () => row.active ? 'نشط' : 'متوقف' })
  },
  { title: 'تاريخ الاشتراك', key: 'createdAt' },
  {
    title: 'التحكم',
    key: 'actions',
    render: (row) => h(NFlex, { size: 'small' }, {
      default: () => [
        h(NButton, {
          size: 'small',
          tertiary: true,
          onClick: () => openEditModal(row)
        }, {
          icon: () => h(EditIcon),
          default: () => 'تعديل'
        }),
        h(NButton, {
          size: 'small',
          secondary: true,
          type: row.active ? 'error' : 'success',
          onClick: () => {
            toggleStoreStatus(row.id);
            message.info(row.active ? `تم إيقاف متجر ${row.name}` : `تم تفعيل متجر ${row.name}`);
          }
        }, {
          icon: () => h(row.active ? PauseIcon : PlayIcon),
          default: () => row.active ? 'إيقاف' : 'تفعيل'
        })
      ]
    })
  }
];

const planColumns = [
  { title: 'اسم الباقة', key: 'name' },
  { title: 'الوصف', key: 'description' },
  { 
    title: 'المميزات', 
    key: 'features', 
    render: (row) => {
      if (row.features.includes('all')) return h(NTag, { type: 'error' }, { default: () => 'وصول كامل' });
      return h(NFlex, { size: 4 }, {
        default: () => row.features.map(f => {
            const label = availablePermissions.find(p => p.value === f)?.label || f;
            return h(NTag, { size: 'small' }, { default: () => label });
        })
      });
    }
  },
  {
    title: 'الإجراءات',
    key: 'actions',
    render: (row) => h(NButton, {
      size: 'small',
      type: 'primary',
      onClick: () => handleOpenPlanModal(row)
    }, { default: () => 'تعديل المميزات' })
  }
];

const handleSaveStore = () => {
  if (!editableStore.value.name || !editableStore.value.slug) {
    message.error("يرجى إكمال البيانات الأساسية");
    return;
  }

  const storeData = {
    name: editableStore.value.name,
    slug: editableStore.value.slug,
    registeredPhone: editableStore.value.registeredPhone,
    plan: editableStore.value.plan,
    settings: {
      shopName: editableStore.value.name,
      currency: editableStore.value.currency
    }
  };

  if (isEditing.value) {
    updateStore(currentEditingId.value, storeData);
    message.success("تم تحديث بيانات المتجر");
  } else {
    addStore(storeData);
    message.success("تم إنشاء المتجر بنجاح");
  }

  showStoreModal.value = false;
};
</script>

<style scoped>
.platform-stat-card {
  border-radius: 12px;
  background: white;
  border: 1px solid #efeff5;
}

:deep(.n-statistic .n-statistic-value__content) {
  font-size: 24px;
  font-weight: 800;
}
</style>
