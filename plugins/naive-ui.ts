
import { defineNuxtPlugin } from '#app'
import * as NaiveUI from 'naive-ui'

export default defineNuxtPlugin((nuxtApp) => {
    // We register components globally to ensure they work in all pages/components
    const {
        NButton, NInput, NSelect, NLayout, NMenu, NPopover,
        NDataTable, NStatistic, NIcon, NText, NDivider,
        NDrawer, NLayoutContent, NConfigProvider, NMessageProvider, NDialogProvider,
        NLayoutSider, NNotificationProvider, NDropdown, NForm, NFormItem, NGrid, NGi, NFlex, NCheckbox, NInputNumber, NDatePicker, NModal, NCard, NH3, NSpace, NEmpty
    } = NaiveUI

    const components = {
        NButton, NInput, NSelect, NLayout, NMenu, NPopover,
        NDataTable, NStatistic, NIcon, NText, NDivider,
        NDrawer, NLayoutContent, NConfigProvider, NMessageProvider, NDialogProvider,
        NLayoutSider, NNotificationProvider, NDropdown, NForm, NFormItem, NGrid, NGi, NFlex, NCheckbox, NInputNumber, NDatePicker, NModal, NCard, NH3, NSpace, NEmpty
    }

    Object.entries(components).forEach(([name, component]) => {
        nuxtApp.vueApp.component(name, component)
    })
})
