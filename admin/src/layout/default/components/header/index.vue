<template>
    <el-container :class="['h-full px-[10px]', { 'layout-header border-b border-color': !dark }]">
        <el-row class="w-100 h-full w-full">
            <el-col :span="12">
                <div class="left-panel h-full flex items-center">
                    <!-- 刷新当前页 -->
                    <div class="navbar-item flex items-center h-full cursor-pointer" @click="refreshRouter">
                        <icon name="element-Refresh" />
                    </div>
                    <!-- 面包屑导航 -->
                    <div class="flex items-center h-full pl-[10px] hidden-xs-only">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item v-for="(route, index) in breadcrumb" :key="index">{{ route.meta.title }}</el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="right-panel h-full flex items-center justify-end">
                    <div class="group switch-app mr-[5px] flex items-center bg-[var(--el-color-primary-light-9)] cursor-pointer !rounded-[50px] px-[12px] py-[5px]" v-if="isLoad && (app_debug || appList.length > 1)" @mouseenter="threefloatMenuHover">
                        <span class="iconfont iconbanbenqiehuan font-bold mr-[4px] !text-[12px] text-[var(--el-color-primary-light-3)]"></span>
                        <span class="text-[12px] text-[var(--el-color-primary)]">切换应用</span>
                        <app-menu class="!top-[45px] right-[180px] left-[auto] w-[auto] max-w-[1076px] min-w-[550px]" :isShowHover="threefloatMenu" :data="appList" @child-click="toLink" hoverType='threefloatMenu'></app-menu>
                    </div>
                    <!-- 预览 只有站点时展示-->
                    <i class="iconfont iconlingdang-xianxing cursor-pointer px-[8px]" :title="t('newInfo')" ></i>
                    <!-- 切换语言 -->
                    <div class="navbar-item !px-[0] flex items-center h-full cursor-pointer">
                        <switch-lang />
                    </div>
                    <!-- 切换全屏 -->
                    <div class="navbar-item flex items-center h-full cursor-pointer" @click="toggleFullscreen">
                        <icon name="iconfont-icontuichuquanping" v-if="isFullscreen" />
                        <icon name="iconfont-iconquanping" v-else />
                    </div>
                    <!-- 布局设置 -->
                    <div class="navbar-item !px-[0] flex items-center h-full cursor-pointer">
                        <layout-setting />
                    </div>
                    <!-- 用户信息 -->
                    <div class="navbar-item flex items-center h-full cursor-pointer">
                        <user-info />
                    </div>
                </div>
            </el-col>
        </el-row>
        <input type="hidden" v-model="comparisonToken">

        <el-dialog v-model="detectionLoginDialog" :title="t('layout.detectionLoginTip')" width="30%" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <span>{{ t('layout.detectionLoginContent') }}</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="detectionLoginFn">{{ t('layout.detectionLoginOperation') }}</el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog v-model="showDialog" :title="t('indexTemplate')" width="550px" :destroy-on-close="true">
            <div class="flex flex-wrap">
                <div v-for="(items, index) in indexList" :key="index" v-if="index_path == ''">
                    <div @click="index_path = items.view_path" class="index-item py-[5px] px-[10px] mr-[10px] rounded-[3px] cursor-pointer" :class="items.is_use == 1 ? 'bg-primary text-[#fff]' : ''">
                        <span>{{ items.name }}</span>
                    </div>
                </div>
                <div v-for="(itemTo, indexTo) in indexList" :key="indexTo" v-else>
                    <div @click="index_path = itemTo.view_path" class="index-item py-[5px] px-[10px] mr-[10px] rounded-[3px] cursor-pointer" :class="index_path == itemTo.view_path ? 'bg-primary text-[#fff]' : ''">
                        <span>{{ itemTo.name }}</span>
                    </div>
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="submitIndex">{{ t('confirm') }}</el-button>
                </span>
            </template>
        </el-dialog>
    </el-container>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, watch } from 'vue'
import layoutSetting from './layout-setting.vue'
import switchLang from './switch-lang.vue'
import userInfo from './user-info.vue'
import { useFullscreen } from '@vueuse/core'
import useSystemStore from '@/stores/modules/system'
import useAppStore from '@/stores/modules/app'
import { useRoute, useRouter } from 'vue-router'
import { t } from '@/lang'
import appMenu from './components/app-menu.vue'
import storage from '@/utils/storage'
import useUserStore from '@/stores/modules/user'
import { getIndexList, setIndexList, getEnv } from '@/app/api/sys'
import { findFirstValidRoute } from '@/router/routers'
import { getApply } from '@/app/api/apply'
import { CollectionTag } from '@element-plus/icons-vue'

const router = useRouter()
const appType = storage.get('app_type')
const { toggle: toggleFullscreen, isFullscreen } = useFullscreen()
const systemStore = useSystemStore()
const appStore = useAppStore()
const route = useRoute()
const screenWidth = ref(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)

const dark = computed(() => {
    return systemStore.dark
})

onMounted(() => {
    // 监听窗体宽度变化
    window.onresize = () => {
        return (() => {
            screenWidth.value = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
        })()
    }
})

watch(screenWidth, () => {
    if (screenWidth.value < 992) {
        if (!systemStore.menuIsCollapse) systemStore.toggleMenuCollapse(true)
    } else {
        if (systemStore.menuIsCollapse) systemStore.toggleMenuCollapse(false)
    }
})

// 菜单栏展开折叠
const toggleMenuCollapse = () => {
    systemStore.$patch((state) => {
        if (screenWidth.value < 768) {
            state.menuDrawer = true
            state.menuIsCollapse = false
        } else {
            systemStore.toggleMenuCollapse(!systemStore.menuIsCollapse)
        }
    })
}

// 刷新路由
const refreshRouter = () => {
    if (!appStore.routeRefreshTag) return
    appStore.refreshRouterView()
}

// 面包屑导航
const breadcrumb = computed(() => {
    const matched = route.matched.filter(item => { return item.meta.title })
    if (matched[0] && matched[0].path == '/') matched.splice(0, 1)
    return matched
})

// 返回上一页
const backFn = () => {
    router.go(-1)
}

const indexList = ref()
const showDialog = ref(false)
const checkIndexList = () => {
    getIndexList().then(res => {
        showDialog.value = true
        indexList.value = res.data
        for (let i = 0; i < indexList.value.length; i++) {
            if (indexList.value[i].is_use == 1) {
                index_path.value = indexList.value[i].view_path
            }
        }
    })
}

const index_path = ref('')
const submitIndex = () => {
    setIndexList({
        view_path: index_path.value
    }).then(() => {
        showDialog.value = false
        router.go(0)
    })
}

// 应用列表 - strat
let app_debug = ref(false)
const getEnvFn = () => {
    getEnv().then(res => {
        app_debug.value = res.data.app_debug;
    }).catch(() => {})
}
getEnvFn();

const userStore = useUserStore()
let threefloatMenu = ref(true);
const threefloatMenuHover = ()=>{
    threefloatMenu.value = true;
}

const getLinkName = (res)=>{
    if(res.children && res.children.length){
        return getLinkName(res.children[0])
    }
    return res.name
}
const appLink = ref({})
userStore.routers.forEach((item, index) => {
    if (item.children && item.children.length) {
        item.name = findFirstValidRoute(item.children)
        appLink.value[item.meta.app] = findFirstValidRoute(item.children)
    } else {
        appLink.value[item.meta.app] = item.name
    }
})
// 用于插件的卸载或安装
watch(() =>userStore.globalAppKey, (val,old) => {
    getAppList();
},{deep: true})

// 应用数据
const appList = ref([])
const isLoad = ref(false);
const getAppList = async () => {
    const res = await getApply()
    appList.value = appList.value.concat(res.data)
    isLoad.value = true;
}
getAppList()

const toLink = (data, type) => {
    if(type == 'threefloatMenu') threefloatMenu.value = false;
    if (!data.meta && data.type == 'app' || data.meta.key != 'official_market') {
        let name = data.name;
        if(data.type == 'app'){
            storage.set({ key: 'menuAppStorage', data: data.key })
            storage.set({ key: 'plugMenuTypeStorage', data: '' })

            const appMenuList = userStore.appMenuList
            appMenuList.push(data.key)
            userStore.setAppMenuList(appMenuList)

            name = appLink.value[data.key];
        }else if(data.meta.app){
            name = getLinkName(data);
        }
        router.push({ name: name })
        setTimeout(() => {
            location.reload();
        }, 500);
    } else {
        window.open('https://www.niucloud.com/app', '_blank')
    }
}
// 应用列表 - end
</script>

<style lang="scss" scoped>
.layout-header {
    position: relative;
    z-index: 5;
    height: 60px;
    box-shadow: 0px 0px 4px 0px rgba(0, 145, 255, 0.1);
}

.navbar-item {
    padding: 0 8px;

    &:hover {
        background-color: var(--el-bg-color-page);
    }
}

.index-item {
    border: 1px solid;
    border-color: var(--el-color-primary);

    &:hover {
        color: #fff;
        background-color: var(--el-color-primary);
    }
}
</style>
