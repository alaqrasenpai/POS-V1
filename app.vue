<!-- <template>
  <div class="flex">
    <div class="w-1/6">
      <sidebar />

    </div>
    <div class="w-5/6">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
    <UNotifications />

  </div>
</template> -->
<template>
  <n-space vertical size="large">

    <n-layout has-sider>
      <n-layout-sider
        collapse-mode="transform"
        :collapsed-width="120"
        :width="240"
        show-trigger="arrow-circle"
        content-style="padding: 24px;"
        bordered
      >
      <div >
      <sidebar />

    </div>
      
      </n-layout-sider>
      <n-layout-content content-style="padding: 24px;">
        <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
          </n-layout-content>
    </n-layout>
  </n-space>
</template>