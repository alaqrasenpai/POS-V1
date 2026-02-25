<template>
    <div class="items-grid">
        <div v-for="item in listOfItems" :key="item.id" class="item-card" @click="handleAddtoCart(item)">
            <div class="item-badge" v-if="item.isFav">
                <n-icon color="#f0a020"><StarIcon /></n-icon>
            </div>
            <div class="item-icon-box">
                <n-icon size="32" :color="getItemColor(item)"><CubeIcon /></n-icon>
            </div>
            <div class="item-details">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-category">{{ item.category }}</span>
                <div class="item-footer">
                    <span class="item-price">{{ item.price }} {{ settings.currency }}</span>
                    <n-tag :type="getStockType(item)" size="small" round>
                        {{ getStockText(item) }}
                    </n-tag>
                </div>
            </div>
            <div class="add-overlay">
                <n-icon size="24"><AddIcon /></n-icon>
            </div>
        </div>
        <n-empty v-if="listOfItems.length === 0" description="لا يوجد منتجات تطابق البحث" style="grid-column: 1 / -1; margin-top: 40px;" />
    </div>
</template>

<script lang="ts" setup>
import { 
    CubeOutline as CubeIcon, 
    AddOutline as AddIcon,
    Star as StarIcon
} from '@vicons/ionicons5'
import { useMessage, useDialog } from 'naive-ui'
import { useSettings } from '@/composables/useSettings'

const { addItem } = useCart();
const { getItemById } = useInventory();
const { settings } = useSettings();
const message = useMessage();
const dialog = useDialog();

const props = defineProps({
    listOfItems: {
        type: Array as any,
        required: true
    }
})

const getItemColor = (item: any) => {
    const colors = ['#18a058', '#2080f0', '#f0a020', '#d03050', '#7a43b6'];
    const index = (item.id || 0) % colors.length;
    return colors[index];
}

const getStockType = (item: any) => {
    const inv = getItemById(item.id);
    if (!inv || inv.quantity <= 0) return 'error';
    if (inv.quantity <= 5) return 'warning';
    return 'success';
}

const getStockText = (item: any) => {
    const inv = getItemById(item.id);
    return inv ? `${inv.quantity} في المخزن` : 'غير متوفر';
}

function handleAddtoCart(row: any) {
    const result = addItem(row);

    if (result.success) {
        message.success(`تم إضافة ${row.name} للسلة`);
    } else {
        if (result.error === 'out_of_stock') {
            dialog.error({
                title: 'المنتج غير متوفر',
                content: `نعتذر، لقد نفدت الكمية من منتج "${row.name}" تماماً من المخزن.`,
                positiveText: 'فهمت',
                closable: false
            });
        } else if (result.error === 'limit_exceeded') {
            dialog.warning({
                title: 'تنبيه الكمية المتاحة',
                content: `لا يمكنك إضافة المزيد من "${row.name}". لديك بالفعل (${result.inCart}) في السلة، والمتاح في المخزن هو (${result.available}) فقط.`,
                positiveText: 'حسناً',
                closable: false
            });
        }
    }
}
</script>

<style scoped>
.items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
    padding: 8px;
}

.item-card {
    background: white;
    border: 1px solid #efeff5;
    border-radius: 12px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.item-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.06);
    border-color: #18a05833;
}

.item-badge {
    position: absolute;
    top: 8px;
    right: 8px;
}

.item-icon-box {
    width: 48px;
    height: 48px;
    background: #f9fafb;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.item-card:hover .item-icon-box {
    background: #18a05810;
}

.item-details {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
}

.item-name {
    font-size: 0.95rem;
    font-weight: 700;
    color: #2c3e50;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
}

.item-category {
    font-size: 0.7rem;
    color: #94a3b8;
    background: #f1f5f9;
    padding: 1px 6px;
    border-radius: 4px;
}

.item-footer {
    width: 100%;
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
}

.item-price {
    font-weight: 800;
    color: #18a058;
    font-size: 1rem;
}

.add-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 0;
    background: #18a058;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    opacity: 0;
}

.item-card:hover .add-overlay {
    height: 32px;
    opacity: 1;
}

@media (max-width: 640px) {
    .items-grid {
        grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
        gap: 10px;
    }
}
</style>
