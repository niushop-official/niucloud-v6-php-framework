<template>
    <el-container class="h-[60px] bg-[#2B303B] flex items-center justify-between px-[15px] text-white">
        <div class="flex items-center text-[14px]  leading-[1]">
            <span class="iconfont icontuodong !text-[25px] mr-[6px]"></span>
            <span class="cursor-pointer" @click="goAppManage">{{ t('appMarketPlace') }}</span>
            <template v-if="app_debug">
                <span class="mx-2 text-[#4F5563] mx-[15px]">|</span>
                <span class="cursor-pointer" @click="goDeveloperCenter">{{ t('developerCenter') }}</span>
            </template>
        </div>
        <div class="flex items-center min-w-[180px] text-[14px]">
            <span class="cursor-pointer mr-[15px]" @click="goNiucloud">{{ t('niucloud') }}</span>
            <el-dropdown>
                <div class="userinfo flex h-full items-center">
                    <el-avatar :size="25" :icon="UserFilled" v-if="!userStore.userInfo.head_img" />
                    <el-avatar :size="25" v-else :src="img(userStore.userInfo.head_img)" />
                    <div class="user-name pl-[8px] text-[#fff]">{{ userStore.userInfo.username }}</div>
                    <icon name="element-ArrowDown" class="ml-[5px] !text-[#fff]" />
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item><router-link to="/user/center">账号设置</router-link></el-dropdown-item>
                        <el-dropdown-item><router-link to="/tools/authorize">授权信息</router-link></el-dropdown-item>
                        <el-dropdown-item @click="changePasswordDialog=true">修改密码</el-dropdown-item>
                        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <el-dialog v-model="changePasswordDialog" title="修改密码" :before-close="handleClose">
            <div>
                <el-form :model="saveInfo" label-width="90px" ref="formRef" :rules="formRules" class="page-form">
                    <el-form-item :label="t('originalPassword')" prop="original_password">
                        <el-input v-model="saveInfo.original_password" type="password" :placeholder="t('originalPasswordPlaceholder')" clearable class="input-width" />
                    </el-form-item>
                    <el-form-item :label="t('newPassword')" prop="password">
                        <el-input v-model="saveInfo.password" type="password" :placeholder="t('passwordPlaceholder')" clearable class="input-width" />
                        <div class="form-tip">{{t('passwordTip')}}</div>
                    </el-form-item>
                    <el-form-item :label="t('passwordCopy')" prop="password_copy">
                        <el-input v-model="saveInfo.password_copy" type="password" :placeholder="t('passwordPlaceholder')" clearable class="input-width" />
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="changePasswordDialog = false">{{t('cancel')}}</el-button>
                    <el-button type="primary" @click="submitForm(formRef)">{{t('save')}}</el-button>
                </span>
            </template>
        </el-dialog>
    </el-container>
</template>

<script lang="ts" setup>
import { UserFilled } from '@element-plus/icons-vue'
import { computed, reactive, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { FormInstance, FormRules, ElNotification } from 'element-plus'
import { t } from '@/lang'
import { img } from '@/utils/common'
import {getEnv} from '@/app/api/sys'
import useUserStore from '@/stores/modules/user'
import { setUserInfo } from '@/app/api/personal'
const userStore = useUserStore()

const router = useRouter()
let app_debug = ref(false)

const goAppManage = () => {
    router.push({ path: '/app_manage/app_store' })
}
const getEnvFn = () => {
    getEnv().then(res => {
        app_debug.value = res.data.app_debug;
    }).catch(() => {})
}
getEnvFn();

const goRouter = () => {
    window.open('https://www.niucloud.com/app')
}

// 跳转至开发者
const goDeveloperCenter = () => {
    router.push('/app_manage/tools')
}

const goNiucloud = () => {
    window.open('https://www.niucloud.com')
}

const logout = () => {
    userStore.logout();
}


// 修改密码 --- start
let changePasswordDialog = ref(false)
const formRef = ref<FormInstance>();
// 提交信息
let saveInfo = reactive({
    original_password: '',
    password: '',
    password_copy: ''
});
// 表单验证规则
const formRules = reactive<FormRules>({
  original_password: [
    { required: true, message: t("originalPasswordPlaceholder"), trigger: "blur" },
  ],
  password: [
    { required: true, message: t("passwordPlaceholder"), trigger: "blur" },
  ],
  password_copy: [
    { required: true, message: t("passwordPlaceholder"), trigger: "blur" },
  ]
});
const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            let msg = "";
            if (saveInfo.password && !saveInfo.original_password) msg = t('originalPasswordHint');
            if (saveInfo.password && saveInfo.original_password && !saveInfo.password_copy) msg = t('newPasswordHint');
            if (saveInfo.password && saveInfo.original_password && saveInfo.password_copy && saveInfo.password != saveInfo.password_copy) msg = t('doubleCipherHint');
            if (msg) {
                ElNotification({
                    type: 'error',
                    message: msg,
                })
                return;
            }

            setUserInfo(saveInfo).then((res: any) => {
                changePasswordDialog.value = false;
            }).catch((err: any) => {
                changePasswordDialog.value = false;
            })
        } else {
            return false
        }
    });
}
// 修改密码 --- end
</script>

<style lang="scss" scoped>
.layout-header {
    position: relative;
    z-index: 5;
    box-shadow: 0px 0px 4px 0px rgba(0, 145, 255, 0.1);
}
</style>
