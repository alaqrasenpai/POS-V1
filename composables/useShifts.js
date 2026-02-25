import { reactive, computed } from 'vue';
import { useAuth } from '@/composables/useAuth';

const state = reactive({
    shifts: [],
    cashTransactions: []
});

export const useShifts = () => {
    const { currentUser } = useAuth();
    const storeId = computed(() => currentUser.value?.storeId);
    const userId = computed(() => currentUser.value?.id);

    const getActiveShift = () => {
        if (!storeId.value || !userId.value) return null;
        return state.shifts.find(s => s.storeId === storeId.value && s.userId === userId.value && s.status === 'open');
    };

    const isShiftOpen = computed(() => !!getActiveShift());

    const openShift = (startingCash) => {
        const currentActive = getActiveShift();
        if (currentActive) {
            return { success: false, message: 'لديك وردية مفتوحة بالفعل' };
        }

        const newShift = {
            id: Date.now(),
            storeId: storeId.value,
            userId: userId.value,
            startTime: new Date().toISOString(),
            endTime: null,
            startingCash: parseFloat(startingCash) || 0,
            expectedEndingCash: parseFloat(startingCash) || 0,
            actualEndingCash: null,
            difference: 0,
            status: 'open'
        };
        state.shifts.push(newShift);
        return { success: true, shift: newShift };
    };

    const addCashTransaction = (amount, type, notes = '') => {
        const shift = getActiveShift();
        if (!shift) return { success: false, message: 'لا توجد وردية مفتوحة' };

        const transaction = {
            id: Date.now(),
            shiftId: shift.id,
            storeId: storeId.value,
            userId: userId.value,
            type, // 'in' or 'out'
            amount: parseFloat(amount),
            notes,
            time: new Date().toISOString()
        };
        state.cashTransactions.push(transaction);

        if (type === 'in') {
            shift.expectedEndingCash += parseFloat(amount);
        } else if (type === 'out') {
            shift.expectedEndingCash -= parseFloat(amount);
        }
        return { success: true };
    };

    const registerSaleCash = (amount) => {
        const shift = getActiveShift();
        if (shift) {
            // we don't manually add here because addCashTransaction below does it
            addCashTransaction(amount, 'in', 'نقدية من فاتورة مبيعات');
        }
    };

    const closeShift = (actualEndingCash) => {
        const shift = getActiveShift();
        if (!shift) return { success: false, message: 'لا توجد وردية مفتوحة' };

        shift.actualEndingCash = parseFloat(actualEndingCash);
        shift.difference = shift.actualEndingCash - shift.expectedEndingCash;
        shift.endTime = new Date().toISOString();
        shift.status = 'closed';

        return { success: true, report: shift };
    };

    const getShiftTransactions = (shiftId) => {
        return state.cashTransactions.filter(t => t.shiftId === shiftId);
    };

    const getShiftHistory = () => {
        if (!storeId.value) return [];
        return state.shifts.filter(s => s.storeId === storeId.value).sort((a, b) => b.id - a.id);
    };

    return {
        getActiveShift,
        isShiftOpen,
        openShift,
        closeShift,
        addCashTransaction,
        registerSaleCash,
        getShiftTransactions,
        getShiftHistory
    };
};
