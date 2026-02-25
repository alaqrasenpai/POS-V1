<template>
  <n-config-provider :locale="arDZ" :date-locale="dateArDZ" :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <!-- إذا كانت الصفحة هي صفحة تسجيل الدخول (عادية أو سوبر)، نعرضها بدون الهيدر والمينيو -->
          <div v-if="isLoginPage">
            <NuxtPage />
          </div>

          <!-- باقي صفحات النظام التي تتطلب الهيدر والقائمة الجانبية -->
          <div v-else class="app-container">
            <div class="app-header">
              <div class="header-right">
                <n-button quaternary v-if="isMobile" @click="showMobileMenu = true">
                  <template #icon><n-icon>
                      <MenuOutline />
                    </n-icon></template>
                </n-button>
                <n-text strong class="system-title">{{ settings.shopName }}</n-text>
              </div>
              <div class="header-left">
                <div v-if="!isMobile && currentUser" class="user-info-wrapper">
                  <n-dropdown :options="userMenuOptions" @select="handleUserMenuClick">
                    <div class="user-info">
                      <n-text strong>{{ currentUser.name }}</n-text>
                      <n-text depth="3" style="font-size: 0.8rem;"> ({{ currentUser.role }})</n-text>
                    </div>
                  </n-dropdown>
                </div>
                <n-divider vertical v-if="!isMobile" />
                <Notifications />
              </div>
            </div>

            <n-layout has-sider class="main-layout" style="height: calc(100vh - 56px);">
              <Sidebar v-if="!isMobile" />

              <n-drawer v-model:show="showMobileMenu" :width="240" placement="right">
                <SidebarContent @select="showMobileMenu = false" />
              </n-drawer>

              <n-layout-content :content-style="contentStyle" :native-scrollbar="false">
                <div class="page-padding">
                  <NuxtPage />
                </div>
              </n-layout-content>
            </n-layout>
          </div>
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import { MenuOutline, PersonOutline, LogOutOutline, SettingsOutline } from '@vicons/ionicons5'
import { ref, computed, onMounted, onUnmounted, h } from 'vue'
import { useRoute } from 'vue-router'
import { arDZ, dateArDZ, NIcon } from 'naive-ui'

const route = useRoute()
const isLoginPage = computed(() => ['/login', '/super-login'].includes(route.path))
const showMobileMenu = ref(false)
const windowWidth = ref(0)
const isMounted = ref(false)
const { settings } = useSettings()
const { checkAuth, currentUser, logout } = useAuth()

const isMobile = computed(() => isMounted.value && windowWidth.value < 768)

const renderIcon = (icon) => () => h(NIcon, null, { default: () => h(icon) })

const userMenuOptions = [
  { label: 'الملف الشخصي', key: 'profile', icon: renderIcon(PersonOutline) },
  { label: 'الإعدادات', key: 'settings', icon: renderIcon(SettingsOutline) },
  { type: 'divider', key: 'd1' },
  { label: 'تسجيل الخروج', key: 'logout', icon: renderIcon(LogOutOutline) }
]

const handleUserMenuClick = (key) => {
  if (key === 'logout') logout()
}

const updateWidth = () => {
  if (typeof window !== 'undefined') {
    windowWidth.value = window.innerWidth
  }
}

onMounted(() => {
  isMounted.value = true
  checkAuth()
  updateWidth()
  window.addEventListener('resize', updateWidth)

  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('dir', 'ltr')
  }
})

const themeOverrides = {
  common: {
    primaryColor: '#18a058',
    primaryColorHover: '#36ad6a',
    primaryColorPressed: '#0c7a43',
    primaryColorSuppl: '#36ad6a',
    borderRadius: '12px',
    fontFamily: "'Tajawal', sans-serif"
  },
  Card: {
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
  }
}

const contentStyle = computed(() => ({
  minHeight: 'calc(100vh - 56px)',
  backgroundColor: '#f9fafb'
}))

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateWidth)
  }
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');

body {
  margin: 0;
  font-family: 'Tajawal', sans-serif;
  background-color: #f9fafb;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.app-header {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: white;
  border-bottom: 1px solid #efeff5;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  z-index: 1000;
  position: sticky;
  top: 0;
}

.system-title {
  font-size: 1.1rem;
  color: #18a058;
}

.user-info-wrapper {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.user-info-wrapper:hover {
  background: #f3f4f6;
}

.header-right,
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.main-layout {
  flex: 1;
}

.page-padding {
  padding: 24px;
}

@media (max-width: 768px) {
  .page-padding {
    padding: 12px;
  }
}
</style>