<template>
    <div :class="['flex', { 'two-type': sidebar == 'twoType' }, { 'three-type': sidebar == 'threeType' }]" v-if="isLoad">
        <div class="w-[124px] overflow-hidden">
            <!-- , { 'bright': !dark } -->
            <el-aside :class="['h-screen layout-aside w-[124px] pb-[30px] px-[8px] bg-[#282c34] ease-in duration-200']">
                <div class="h-full flex flex-col relative">
                    <div class="group flex items-center justify-center h-[64px] cursor-pointer" v-if="!globalAppKey" @mouseenter="threefloatMenuHover">
                        <span class="iconfont iconyun1 !text-[32px] !w-auto text-[#fff]"></span>
                    </div>

                    <template v-for="(item, index) in menus" :key="index">
                        <template v-if="globalAppKey == item.meta.app && item.meta.parentTitle">
                            <div class="group flex items-center justify-center h-[64px] cursor-pointer">
                                <img v-if="item.meta.parentIcon" :src="img(item.meta.parentIcon)" class="w-[40px] h-[40px] rounded-full" alt="">
                                <div class="flex items-center justify-center w-[30px] h-[30px]" v-else>
                                    <icon v-if="item.meta.icon" :name="item.meta.icon" class="!w-auto" size="24px" />
                                </div>
                            </div>
                            <div v-for="(appItem, appIndex) in item.children" :key="appIndex" @click="toLink(appItem)"
                                :class="['rounded-sm flex items-center px-[12px] mb-[4px] h-[40px] cursor-pointer text-[#b9b9bf] hover:bg-[var(--el-color-primary)] hover:!text-[#fff] menu-item hover:text-color whitespace-nowrap', { 'bg-[var(--el-color-primary)] !text-[#fff] menu-item-active ': localMenuKey == appItem.meta.key}]">
                                <icon v-if="appItem.meta.icon" :name="appItem.meta.icon" class="!w-auto" size="16px" :title="appItem.meta.title" />
                                <span class="text-[14px] ml-[8px]">{{appItem.meta.shortTitle}}</span>
                            </div>
                        </template>
                    </template>

                    <template v-for="(item, index) in menus" :key="index">
                        <div v-if="!item.meta.app && item.meta.attr != 'tools' && item.meta.show" @click="toLink(item)"
                            :class="['rounded-sm flex items-center px-[12px] mb-[4px] h-[40px] cursor-pointer text-[#b9b9bf] hover:bg-[var(--el-color-primary)] hover:!text-[#fff] menu-item hover:text-color whitespace-nowrap', { 'bg-[var(--el-color-primary)] !text-[#fff] menu-item-active ': (item.path == currentRoute.path || (currentRoute.path == '/admin' && item.path == '/index') || (currentRoute.meta.app && item.path == '/index')) }]">
                            <icon v-if="item.meta.icon" :name="item.meta.icon" class="!w-auto" size="16px" :title="item.meta.title" />
                            <span class="text-[14px] ml-[8px]">{{item.meta.shortTitle}}</span>
                        </div>
                    </template>
                </div>
            </el-aside>
        </div>

        <template v-for="(item, index) in menus" :key="index">
            <div v-if="isTwoMenuFn(item)" class="w-[140px] box-border border-r-[1px] border-solid second-menu">
                <div class="group flex flex-col items-center justify-center h-[64px] border-b-[1px] border-solid second-head cursor-pointer relative"  @mouseenter="twofloatMenuHover">
                    {{ item.meta.title }}
                </div>

                <el-scrollbar class="overflow-y-auto menus-wrap">
                    <el-menu class="apply-menu !border-0" :router="true" unique-opened="true" :default-active="String(route.name)">
                        <template v-for="(twoMenu, twoIndex) in item.children">
                            <el-sub-menu :index="String(twoMenu.meta.title)" v-if="twoMenu.children && twoMenu.meta.show">
                                <template #title>
                                    <span class="text-[14px]">{{ twoMenu.meta.title }}</span>
                                </template>
                                <template v-for="(threeMenu, threeIndex) in twoMenu.children" :key="threeIndex">
                                    <!-- 三级菜单 -->
                                    <el-sub-menu :index="String(threeMenu.meta.title)" class="three-menu"
                                        v-if="threeMenu.children && threeMenu.meta.show">
                                        <template #title>
                                            <span class="text-[14px]">{{ threeMenu.meta.title }}</span>
                                        </template>
                                        <template v-for="(fourMenu, fourIndex) in threeMenu.children" :key="fourIndex">
                                            <el-sub-menu :index="String(fourMenu.meta.title)"
                                                v-if="fourMenu.children && fourMenu.meta.show">
                                                <template #title>
                                                    <span class="text-[14px]">{{ fourMenu.meta.title }}</span>
                                                </template>
                                                <template v-for="(fiveMenu, fiveIndex) in fourMenu.children"
                                                    :key="fiveIndex">
                                                    <el-menu-item v-if="fiveMenu.meta.show" class="!h-[52px] !pl-[55px]"
                                                        :index="String(fiveMenu.name)" @click="toLink(fiveMenu)">
                                                        <template #title>
                                                            <span class="text-[14px]">{{ fiveMenu.meta.title }}</span>
                                                        </template>
                                                    </el-menu-item>
                                                </template>
                                            </el-sub-menu>
                                            <el-menu-item v-else-if="fourMenu.meta.show" class="!h-[52px] !pl-[35px]"
                                                :index="String(fourMenu.name)" @click="toLink(fourMenu)">
                                                <template #title>
                                                    <span class="text-[14px]">{{ fourMenu.meta.title }}</span>
                                                </template>
                                            </el-menu-item>
                                        </template>
                                    </el-sub-menu>

                                    <!-- 二级菜单 -->
                                    <el-menu-item v-else-if="threeMenu.meta.show" class="!h-[52px] !pl-[42px]"
                                        :index="String(threeMenu.name)" @click="toLink(threeMenu)">
                                        <template #title>
                                            <span class="text-[14px]">{{ threeMenu.meta.title }}</span>
                                        </template>
                                    </el-menu-item>
                                </template>
                            </el-sub-menu>

                            <el-menu-item v-else-if="twoMenu.meta.show && twoMenu.meta.key != 'official_market'"
                                class="!pl-[25px] text-[#333]" :index="String(twoMenu.name)" @click="toLink(twoMenu)">
                                <template #title>
                                    <span class="text-[14px]">{{ twoMenu.meta.title }}</span>
                                </template>
                            </el-menu-item>

                            <div class="flex items-center !px-[25px] h-[56px] cursor-pointer text-[#333] el-menu-item"
                                v-else-if="twoMenu.meta.show && twoMenu.meta.key == 'official_market'"
                                @click="toLink(twoMenu)">
                                <span class="text-[14px]">{{ twoMenu.meta.title }}</span>
                            </div>
                        </template>
                        <el-menu-item v-if="!item.children" class="!pl-[25px] text-[#333]" :index="String(item.name)" @click="toLink(item)">
                            <template #title>
                                <span class="text-[14px]">{{ item.meta.title }}</span>
                            </template>
                        </el-menu-item>
                        <!-- 插件菜单 -->
                        <template v-if="plugMenuType && localMenuKey == 'app_center'">
                            <template v-for="(twoMenu, twoIndex) in menus">
                                <el-sub-menu :index="String(twoMenu.meta.title)" v-if="twoMenu.meta.app && twoMenu.meta.app == plugMenuType && twoMenu.children">
                                    <template #title>
                                        <span class="text-[14px]">{{ twoMenu.meta.title }}</span>
                                    </template>
                                    <template v-for="(threeMenu, threeIndex) in twoMenu.children" :key="threeIndex">
                                        <!-- 三级菜单 -->
                                        <el-sub-menu :index="String(threeMenu.meta.title)"
                                            v-if="threeMenu.children && threeMenu.meta.show">
                                            <template #title>
                                                <span class="text-[14px] !pl-[10px]">{{ threeMenu.meta.title }}</span>
                                            </template>
                                            <template v-for="(fourMenu, fourIndex) in threeMenu.children"
                                                :key="fourIndex">
                                                <el-menu-item v-if="fourMenu.meta.show"
                                                    class="!h-[52px] !pl-[55px]"
                                                    :index="String(fourMenu.name)"
                                                    @click="toLink(fourMenu)">
                                                    <template #title>
                                                        <span class="text-[14px]">{{ fourMenu.meta.title }}</span>
                                                    </template>
                                                </el-menu-item>
                                            </template>
                                        </el-sub-menu>
                                        <el-menu-item v-else-if="threeMenu.meta.show"
                                            class="!h-[52px] !pl-[35px]"
                                            :index="String(threeMenu.name)" @click="toLink(threeMenu)">
                                            <template #title>
                                                <span class="text-[14px]">{{ threeMenu.meta.title }}</span>
                                            </template>
                                        </el-menu-item>
                                    </template>
                                </el-sub-menu>
                                <el-menu-item v-else-if="twoMenu.meta.app && twoMenu.meta.app == plugMenuType"
                                    class="!pl-[25px] text-[#333]" :index="String(twoMenu.name)"
                                    @click="toLink(twoMenu)">
                                    <template #title>
                                        <span class="text-[14px]">{{ twoMenu.meta.title }}</span>
                                    </template>
                                </el-menu-item>
                            </template>
                        </template>
                    </el-menu>
                </el-scrollbar>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import side from './side.vue'
import appMenu from './components/app-menu.vue'
import { img } from '@/utils/common'
import useSystemStore from '@/stores/modules/system'
import useUserStore from '@/stores/modules/user'
import storage from '@/utils/storage'
import { CollectionTag } from '@element-plus/icons-vue'
import { findFirstValidRoute } from '@/router/routers'
import { getAddonByKey } from '@/app/api/addon'
import { getApply } from '@/app/api/apply'


const userStore = useUserStore()
const systemStore = useSystemStore()
const route = useRoute()
const router = useRouter()
const globalAppKey = ref('') // 菜单类型
const localMenuKey = ref('') // 菜单类型
globalAppKey.value = storage.get('menuAppStorage')
localMenuKey.value = storage.get('menuAppStorage')
const isLoad = ref(false);


// 应用跳转 start
const appList = ref([])
const appTypeList = ref([])
const otherTypeList = ref([]) // 存着插件\会员\应用管理
const getAppList = async () => {
    const res = await getApply()
    appList.value = appList.value.concat(res.data)
    appList.value.forEach((item, index) => {
        if (item.type == 'app') { appTypeList.value.push(item.key) }
        if (item.type == 'addon') { otherTypeList.value.push(item.key) }
    })
    isLoad.value = true;
}
getAppList()

// 应用跳转 end

// 菜单
const appLink = ref({})
const menus = computed(() => {
    const menus = []
    userStore.routers.forEach((item, index) => {
        if (item.children && item.children.length) {
            item.name = findFirstValidRoute(item.children)
            appLink.value[item.meta.app] = findFirstValidRoute(item.children)
            menus.push(item)
        } else {
            appLink.value[item.meta.app] = item.name
            menus.push(item)
        }
    })

    if(appList.value && appList.value.length){
        appList.value.forEach((item,index) =>{
            menus.forEach((menuItem,menuIndex)=>{
                if(item.key == menuItem.meta.key){
                    menuItem.meta.parentTitle = item.title;
                    menuItem.meta.parentIcon = item.icon;
                }
            })
        })
    }

    // 用于插件的卸载或安装
    if(!appList.value.length && !globalAppKey.value){
        storage.set({ key: 'menuAppStorage', data: '' })
        globalAppKey.value = ""
    }
    if(appList.value.length && !globalAppKey.value){
        storage.set({ key: 'menuAppStorage', data: appTypeList.value[0] })
        globalAppKey.value = appTypeList.value[0]
    }
    menus.forEach((item,index)=>{
        if(globalAppKey.value && item.meta.app == globalAppKey.value){
            item.children.forEach((childItem,childIndex) => {
                menus.push(childItem);

                if(childItem.children){
                    let parentKey = childItem.meta.key;
                    childItem.children.forEach((grandItem,grandIndex) => {
                        grandItem.parentKey = parentKey;
                    });
                }
            });
        }
    })
    return menus
})

const dark = computed(() => {
    return systemStore.dark
})

// 用于插件的卸载或安装
watch(() =>userStore.globalAppKey, (val,old) => {
    getAppList();
},{deep: true})


// 监听路由
let currMetaAppType = ''
const plugMenuType = ref('') // 插件类型
const currentRoute = ref('') // 当前路由
watch(route, () => {
    plugMenuType.value = storage.get('plugMenuTypeStorage')

    const data = route.matched[1]
    currentRoute.value = route.matched[1]

    if(route.meta.app && route.meta.app == globalAppKey.value){
        menus.value.forEach((item,index)=>{
            if(item.children && item.name != route.name){
                item.children.forEach((childItem,childIndex) => {
                    if(childItem.name == route.name) localMenuKey.value = childItem.parentKey;
                });
            }else if(item.name == route.name){
                localMenuKey.value = item.name;
            }
        })
    }else{
        localMenuKey.value = data.meta.key
    }

    if(otherTypeList.value.includes(localMenuKey.value) && plugMenuType.value){
        localMenuKey.value = "app_center"
    }

    systemStore.$patch(state => {
        state.menuDrawer = false
    })
}, { immediate: true })

let threefloatMenu = ref(true);
const threefloatMenuHover = ()=>{
    threefloatMenu.value = true;
}
const toLink = (data, type) => {
    if(type == 'threefloatMenu') threefloatMenu.value = false;
    if (!data.meta && data.type == 'app' || data.meta.key != 'official_market') {
        let name = data.name;
        if(data.type == 'app'){
            globalAppKey.value = data.key
            localMenuKey.value = data.key

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
    } else {
        window.open('https://www.niucloud.com/app', '_blank')
    }
}

const getLinkName = (res)=>{
    if(res.children && res.children.length){
        return getLinkName(res.children[0])
    }
    return res.name
}

// 主题风格
const sidebar = computed(() => {
    return systemStore.sidebar
})

// 控制二级菜单的显示
const isTwoMenuFn = (item) => {
    let bool = (otherTypeList.value.includes(localMenuKey.value) && globalAppKey.value == item.meta.app)
        || (!otherTypeList.value.includes(localMenuKey.value) && (item.meta.key == localMenuKey.value || item.meta.app == localMenuKey.value) && !item.meta.app)
        || (item.meta.app && !otherTypeList.value.includes(localMenuKey.value) && item.meta.key == localMenuKey.value && localMenuKey.value.indexOf('index') == -1)

    return bool;
}

</script>

<style lang="scss">
.layout-aside {
    &.bright {
        background-color: #F5F7F9;

        li {
            background-color: #F5F7F9;

            &.is-active:not(.is-opened) {
                position: relative;
                color: #333;
                background-color: #fff;

                &::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    width: 2px;
                    background-color: var(--el-menu-active-color);
                }
            }
        }
    }

    .menu-item:hover {
        color: var(--el-color-primary);
    }
}

.second-menu .el-sub-menu .el-sub-menu__title {
    padding-left: 8px !important;
    padding-right: 8px !important;
    margin: 0 8px 4px;
    height: 36px;
    border-radius: 2px;

    .el-icon.el-sub-menu__icon-arrow {
        right: 5px;
        font-weight: bolder;
        font-size: 14px;
    }
}
.second-menu .el-menu-item{
    padding: 0 8px !important;
    margin: 0 8px 4px;
    height: 36px !important;
    border-radius: 2px;
}
.second-menu .el-sub-menu .el-menu-item{
    padding-left: 20px !important;
}

.three-menu.el-sub-menu .el-sub-menu__title {
    padding-left: 45px !important;
}

.text-color {
    color: var(--el-color-primary);
}

.aside-drawer {
    .el-drawer__body {
        padding: 0px !important;
    }
}

.cut-style {
    color: #6d7278;

}

.cut-style.qx {
    transform: translateX(-50%);
}

// 主题二
.two-type {
    .logo-wrap {
        .logo span {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: #F5F7F9;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #273de3;
            font-size: 25px !important;
        }
    }

    .layout-aside {
        background-color: #2b303b;
        .menu-item {
            color: #fff;

            &.menu-item-active,
            &:hover {
                background-color: var(--el-color-primary);
                color: #fff;
            }
        }
    }

    .second-menu {
        background-color: #F5F7F9;

        .el-menu {
            background-color: transparent;

            .el-menu-item:hover {
                background-color: #fff;
                color: var(--el-color-primary);
            }

            .el-menu-item.is-active {
                background-color: #fff;
            }
        }

        .el-sub-menu__title:hover {
            background-color: #fff;
            color: var(--el-color-primary);
        }
    }

    .cut-style {
        color: #FFF;
    }
}

// 主题三
.three-type {
    .logo-wrap {
        .logo span {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: #F5F7F9;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #2E7BFD;
            font-size: 25px !important;
        }
    }

    .layout-aside {
        background-color: #2b303b;

        .menu-item {
            color: #fff;

            &.menu-item-active,
            &:hover {
                background-color: #303848;
                color: var(--el-color-primary);
            }
        }
    }

    .second-menu {
        background-color: #303848;

        .second-head {
            color: #fff;
            border-color: #364059;
        }

        .el-menu {
            background-color: transparent;

            .el-menu-item {
                color: #fff;
            }

            .el-menu-item:hover,
            .el-menu-item.is-active {
                background-color: var(--el-color-primary);
            }
        }

        .el-sub-menu__title:hover {
            background-color: var(--el-color-primary);
        }

        .el-sub-menu__title {
            color: #fff;
        }
    }

    .cut-style {
        color: #FFF;
    }
}

.menus-wrap {
    padding-top: 16px;
    height: calc(100vh - 64px);
}
</style>
