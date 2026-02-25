<template>
  <n-config-provider :locale="naiveLocale" :date-locale="naiveDateLocale" :theme="isDark ? darkTheme : null" :theme-overrides="themeOverrides">
    <n-global-style />
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <!-- إذا كانت الصفحة هي صفحة تسجيل الدخول أو كان المستخدم غير مسجل، نعرضها بدون الهيدر والمينيو -->
          <div v-if="isLoginPage || !isAuthenticated" :class="{ 'app-is-rtl': isRTL }">
            <NuxtPage />
          </div>

          <!-- باقي صفحات النظام التي تتطلب الهيدر والقائمة الجانبية -->
          <div v-else class="app-container" :class="{ 'app-is-rtl': isRTL }">
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
                  <CustomDropdown :options="userMenuOptions" :isRTL="isRTL" @select="handleUserMenuClick">
                    <template #trigger>
                      <div class="user-info">
                        <n-text strong>{{ currentUser.name }}</n-text>
                        <n-text depth="3" style="font-size: 0.8rem;"> ({{ currentUser.role }})</n-text>
                      </div>
                    </template>
                  </CustomDropdown>
                </div>
                <n-divider vertical v-if="!isMobile" />
                
                <n-button quaternary circle @click="toggleTheme" style="margin-right: -8px;" v-show="false">
                  <template #icon>
                    <n-icon>
                      <MoonOutline v-if="!isDark" />
                      <SunnyOutline v-else />
                    </n-icon>
                  </template>
                </n-button>
                
                <Notifications />
              </div>
            </div>

            <n-layout has-sider class="main-layout" style="height: calc(100vh - 56px);">
              <Sidebar v-if="!isMobile" />

              <n-drawer v-model:show="showMobileMenu" :width="240" :placement="isRTL ? 'left' : 'right'">
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
import { MenuOutline, PersonOutline, LogOutOutline, SettingsOutline, MoonOutline, SunnyOutline } from '@vicons/ionicons5'
import { ref, computed, onMounted, onUnmounted, h, watch } from 'vue'
import { useRoute } from 'vue-router'
import * as NaiveUI from 'naive-ui'
const { arDZ, dateArDZ, NIcon, darkTheme } = NaiveUI
import CustomDropdown from './components/CustomDropdown.vue'

const route = useRoute()
const isLoginPage = computed(() => ['/login', '/super-login'].includes(route.path))
const showMobileMenu = ref(false)
const windowWidth = ref(0)
const isMounted = ref(false)
const { settings } = useSettings()
const { checkAuth, currentUser, logout, isAuthenticated } = useAuth()
const { t, currentLocale, isRTL } = useI18n()
const { isDark, toggleTheme, setInitialTheme } = useTheme()

const isMobile = computed(() => isMounted.value && windowWidth.value < 768)

const renderIcon = (icon) => () => h(NIcon, null, { default: () => h(icon) })

const userMenuOptions = computed(() => [
  { label: t('common.profile'), key: 'profile', icon: renderIcon(PersonOutline) },
  { label: t('common.settings'), key: 'settings', icon: renderIcon(SettingsOutline) },
  { type: 'divider', key: 'd1' },
  { label: t('common.logout'), key: 'logout', icon: renderIcon(LogOutOutline) }
])

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
  setInitialTheme()
  updateWidth()
  window.addEventListener('resize', updateWidth)
})

const themeOverrides = computed(() => ({
  common: {
    primaryColor: '#18a058',
    primaryColorHover: '#36ad6a',
    primaryColorPressed: '#0c7a43',
    primaryColorSuppl: '#36ad6a',
    borderRadius: '12px',
    fontFamily: isRTL.value ? "'Tajawal', sans-serif" : "Inter, system-ui, sans-serif"
  },
  Card: {
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
  }
}))

// dynamic naive-ui locale
const naiveLocale = computed(() => currentLocale.value === 'ar' ? NaiveUI.arDZ : NaiveUI.enUS)
const naiveDateLocale = computed(() => currentLocale.value === 'ar' ? NaiveUI.dateArDZ : NaiveUI.dateEnUS)

const contentStyle = computed(() => ({
  minHeight: 'calc(100vh - 56px)'
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
  /* background-color: #f9fafb;  <- Removed for Naive body sync */
}

/* Dark Theme Fixes for statically defined colors */
body.dark-theme .app-header {
  background: var(--n-color);
  border-bottom: 1px solid var(--n-border-color);
}

body.dark-theme .main-content-card {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3) !important;
}

body.dark-theme .page-title {
  color: var(--n-text-color) !important;
}

body.dark-theme .system-title {
  color: #36ad6a;
}


.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.app-is-rtl {
  direction: rtl;
}

.app-header {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: var(--n-color);
  border-bottom: 1px solid var(--n-border-color);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  z-index: 1000;
  position: sticky;
  top: 0;
  transition: background 0.3s, border-color 0.3s;
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
  display: flex;
  align-items: center;
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

/* تحسين المسافات العالمية */
.page-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  gap: 16px;
}

.page-header-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  margin: 0 !important;
  font-weight: 800 !important;
  color: #1f2937;
  font-size: 1.8rem !important;
}

.page-subtitle {
  color: #6b7280;
  font-size: 0.95rem;
}

.main-content-card {
  border-radius: 16px !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
}

@media (max-width: 768px) {
  .page-padding {
    padding: 16px;
  }

  .page-container {
    gap: 16px;
  }

  .page-title-section {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* دعم اليمين لليسار للجداول والتبويبات */
.app-is-rtl .n-data-table {
  direction: rtl;
}

.app-is-rtl .n-data-table th,
.app-is-rtl .n-data-table td {
  text-align: right !important;
}

.app-is-rtl .n-data-table-th__title-wrapper {
  display: flex;
  justify-content: flex-start !important;
}

.app-is-rtl .n-tabs-nav {
  direction: rtl;
}

.app-is-rtl .n-tabs-tab {
  margin-left: 32px;
  margin-right: 0;
}

/* عكس الباجينيشن (Pagination) لو أمكن */
.app-is-rtl .n-pagination {
  direction: rtl;
}
</style>