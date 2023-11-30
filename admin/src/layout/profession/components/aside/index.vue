<template>
    <div :class="['flex', { 'two-type': sidebar == 'twoType' }, { 'three-type': sidebar == 'threeType' }]" v-if="isLoad">

        <template v-for="(item, index) in menus" :key="index">
            <div v-if="isTwoMenuFn(item)" class="w-[210px] box-border border-r-[1px] border-solid second-menu">
                <div class="group flex flex-col items-center justify-center h-[64px] border-b-[1px] border-solid second-head cursor-pointer relative">
                    <div class="flex items-center">
                        <img v-if="item.meta.parentIcon" :src="img(item.meta.parentIcon)" class="w-[40px] h-[40px] mr-[8px] rounded-full" alt="">
                        <div class="flex items-center justify-center w-[30px] h-[30px]" v-else>
                            <icon v-if="item.meta.icon" :name="item.meta.icon" class="!w-auto" size="24px" />
                        </div>
                        <span>{{ item.meta.app ? item.meta.parentTitle : item.meta.title }}</span>
                    </div>
                </div>

                <el-scrollbar class="overflow-y-auto menus-wrap">
                    <el-menu class="apply-menu !border-0" :router="true" :unique-opened="true" :default-active="String(route.name)">
                        <template v-if="appTypeList.length">
                            <template v-for="(twoMenu, twoIndex) in item.children">
                                <el-sub-menu :index="String(twoMenu.meta.title)" v-if="twoMenu.children && twoMenu.meta.show">
                                    <template #title>
                                        <div class="w-[16px] h-[16px] relative flex items-center">
                                            <icon v-if="twoMenu.meta.icon" :name="twoMenu.meta.icon"
                                                class="absolute !w-auto" size="18px" />
                                        </div>
                                        <span class="ml-[11px] text-[15px]">{{ twoMenu.meta.title }}</span>
                                    </template>
                                    <template v-for="(threeMenu, threeIndex) in twoMenu.children" :key="threeIndex">
                                        <!-- 三级菜单 -->
                                        <el-sub-menu :index="String(threeMenu.meta.title)" class="three-menu"
                                            v-if="threeMenu.children && threeMenu.meta.show">
                                            <template #title>
                                                <div class="w-[16px] h-[16px] relative flex items-center">
                                                    <icon v-if="threeMenu.meta.icon"
                                                        :name="threeMenu.meta.icon" class="absolute !w-auto" size="18px" />
                                                </div>
                                                <span class="ml-[11px] text-[15px]">{{ threeMenu.meta.title }}</span>
                                            </template>
                                            <template v-for="(fourMenu, fourIndex) in threeMenu.children" :key="fourIndex">
                                                <el-sub-menu :index="String(fourMenu.meta.title)"
                                                    v-if="fourMenu.children && fourMenu.meta.show">
                                                    <template #title>
                                                        <div
                                                            class="w-[16px] h-[16px] relative flex items-center justify-center">
                                                            <span class="iconfont icondian !text-[25px]"></span>
                                                        </div>
                                                        <span class="ml-[11px] text-[15px]">{{ fourMenu.meta.title }}</span>
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
                                        <el-menu-item v-else-if="threeMenu.meta.show" class="!h-[52px] !pl-[52px]"
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
                                        <div v-if="twoMenu.meta.icon" class="w-[16px] h-[16px] relative flex items-center">
                                            <icon v-if="twoMenu.meta.icon" :name="twoMenu.meta.icon"
                                                class="absolute !w-auto" size="18px" />
                                        </div>
                                        <span class="ml-[11px] text-[15px]">{{ twoMenu.meta.title }}</span>
                                    </template>
                                </el-menu-item>
                                <div class="flex items-center !px-[25px] h-[56px] cursor-pointer text-[#333] el-menu-item"
                                    v-else-if="twoMenu.meta.show && twoMenu.meta.key == 'official_market'"
                                    @click="toLink(twoMenu)">
                                    <div v-if="twoMenu.meta.icon" class="w-[16px] h-[16px] relative flex items-center">
                                        <icon v-if="twoMenu.meta.icon" :name="twoMenu.meta.icon" class="absolute !w-auto"
                                            size="18px" />
                                    </div>
                                    <span class="ml-[11px] text-[15px]">{{ twoMenu.meta.title }}</span>
                                </div>
                            </template>

                            <!-- 系统菜单 -->
                            <template
                                v-if="appTypeList.includes(localMenuKey) || otherTypeList.includes(localMenuKey)">
                                <div class="!border-0 !border-t-[1px] border-solid mx-[25px] bg-[#f7f7f7] my-[5px]"></div>
                                <template v-for="(twoMenu, twoIndex) in menus">
                                    <el-sub-menu :index="String(twoMenu.meta.title)"
                                        v-if="twoMenu.meta.attr == 'system' && !twoMenu.meta.app && twoMenu.children">
                                        <template #title>
                                            <div class="w-[16px] h-[16px] relative flex items-center">
                                                <icon v-if="twoMenu.meta.icon" :name="twoMenu.meta.icon"
                                                    class="absolute !w-auto" size="18px" />
                                            </div>
                                            <span class="ml-[11px] text-[15px]">{{ twoMenu.meta.title }}</span>
                                        </template>
                                        <template v-for="(threeMenu, threeIndex) in twoMenu.children" :key="threeIndex">
                                            <el-sub-menu :index="String(threeMenu.meta.title)"
                                                v-if="threeMenu.meta.app && threeMenu.children">
                                                <template #title>
                                                     <div class="w-[16px] h-[16px] relative flex items-center justify-center">
                                                        <span class="iconfont iconyuanquan_huaban1 !text-[20px]"></span>
                                                    </div>
                                                    <span class="ml-[11px] text-[15px]">{{ threeMenu.meta.title }}</span>
                                                </template>
                                                <template v-for="(fourMenu, fourIndex) in threeMenu.children"
                                                    :key="fourIndex">
                                                    <!-- 三级菜单 -->
                                                    <el-sub-menu :index="String(fourMenu.meta.title)"
                                                        v-if="fourMenu.children && fourMenu.meta.show">
                                                        <template #title>
                                                            <div
                                                                class="w-[16px] h-[16px] relative flex items-center justify-center">
                                                                <span class="iconfont icondian !text-[25px]"></span>
                                                            </div>
                                                            <span class="ml-[11px] text-[15px]">{{ fourMenu.meta.title
                                                            }}</span>
                                                        </template>
                                                        <template v-for="(fiveMenu, fiveIndex) in fourMenu.children"
                                                            :key="fiveIndex">
                                                            <el-menu-item v-if="fiveMenu.meta.show"
                                                                class="!h-[52px] !pl-[55px]" :index="String(fiveMenu.name)"
                                                                @click="toLink(fiveMenu)">
                                                                <template #title>
                                                                    <span class="text-[14px]">{{ fiveMenu.meta.title
                                                                    }}</span>
                                                                </template>
                                                            </el-menu-item>
                                                        </template>
                                                    </el-sub-menu>
                                                    <el-menu-item v-else-if="fourMenu.meta.show"
                                                        class="!ml-[30px] !h-[52px] !pl-[35px]"
                                                        :index="String(fourMenu.name)" @click="toLink(fourMenu)">
                                                        <template #title>
                                                            <span class="text-[14px]">{{ fourMenu.meta.title }}</span>
                                                        </template>
                                                    </el-menu-item>
                                                </template>
                                            </el-sub-menu>
                                            <el-menu-item v-if="threeMenu.meta.show" class="!h-[52px] !pl-[52px]"
                                                :index="String(threeMenu.name)" @click="toLink(threeMenu)">
                                                <template #title>
                                                    <span class="text-[14px]">{{ threeMenu.meta.title }}</span>
                                                </template>
                                            </el-menu-item>
                                        </template>

                                        <!-- 插件菜单 -->
                                        <template v-if="otherTypeList.includes(localMenuKey) && twoMenu.meta.key == 'app_center' && plugMenuType">
                                            <template v-for="(twoMenu, twoIndex) in menus">
                                                <el-sub-menu :index="String(twoMenu.meta.title)"
                                                    v-if="twoMenu.meta.app && twoMenu.meta.app == plugMenuType && twoMenu.children">
                                                    <template #title>
                                                        <div class="w-[16px] h-[16px] relative flex items-center justify-center">
                                                            <span class="iconfont iconyuanquan_huaban1 !text-[20px]"></span>
                                                        </div>
                                                        <span class="ml-[11px] text-[15px]">{{ twoMenu.meta.title }}</span>
                                                    </template>
                                                    <template v-for="(threeMenu, threeIndex) in twoMenu.children" :key="threeIndex">
                                                        <!-- 三级菜单 -->
                                                        <el-sub-menu :index="String(threeMenu.meta.title)"
                                                            v-if="threeMenu.children && threeMenu.meta.show">
                                                            <template #title>
                                                                <div class="w-[16px] h-[16px] relative flex items-center justify-center">
                                                                    <span class="iconfont icondian !text-[25px]"></span>
                                                                </div>
                                                                <span class="ml-[11px] text-[15px]">{{ threeMenu.meta.title }}</span>
                                                            </template>
                                                            <template v-for="(fourMenu, fourIndex) in threeMenu.children"
                                                                :key="fourIndex">
                                                                <el-menu-item v-if="fourMenu.meta.show"
                                                                    class="!h-[52px] !pl-[55px]"
                                                                    :index="String(fourMenu.name)"
                                                                    @click="toLink(fourMenu)">
                                                                    <template #title>
                                                                        <span class="text-[14px]">{{ fourMenu.meta.title
                                                                        }}</span>
                                                                    </template>
                                                                </el-menu-item>
                                                            </template>
                                                        </el-sub-menu>
                                                        <el-menu-item v-else-if="threeMenu.meta.show"
                                                            class="!ml-[30px] !h-[52px] !pl-[35px]"
                                                            :index="String(threeMenu.name)" @click="toLink(threeMenu)">
                                                            <template #title>
                                                                <span class="text-[14px]">{{ threeMenu.meta.title }}</span>
                                                            </template>
                                                        </el-menu-item>
                                                    </template>
                                                </el-sub-menu>
                                                <el-menu-item
                                                    v-else-if="twoMenu.meta.app && twoMenu.meta.app == plugMenuType"
                                                    class="!pl-[25px] text-[#333]" :index="String(twoMenu.name)"
                                                    @click="toLink(twoMenu)">
                                                    <template #title>
                                                        <div v-if="twoMenu.meta.icon"
                                                            class="w-[16px] h-[16px] relative flex items-center">
                                                            <icon v-if="twoMenu.meta.icon" :name="twoMenu.meta.icon"
                                                                class="absolute !w-auto" size="18px" />
                                                        </div>
                                                        <span class="ml-[11px] text-[15px]">{{ twoMenu.meta.title }}</span>
                                                    </template>
                                                </el-menu-item>
                                            </template>
                                        </template>
                                    </el-sub-menu>
                                    <el-menu-item v-else-if="twoMenu.meta.attr == 'system' && !twoMenu.meta.app"
                                        class="!pl-[25px] text-[#333]" :index="String(twoMenu.name)"
                                        @click="toLink(twoMenu)">
                                        <template #title>
                                            <div v-if="twoMenu.meta.icon"
                                                class="w-[16px] h-[16px] relative flex items-center">
                                                <icon v-if="twoMenu.meta.icon" :name="twoMenu.meta.icon"
                                                    class="absolute !w-auto" size="18px" />
                                            </div>
                                            <span class="ml-[11px] text-[15px]">{{ twoMenu.meta.title }}</span>
                                        </template>
                                    </el-menu-item>
                                </template>
                            </template>
                        </template>
                        <!-- 浮动样式 -->
                        <div
                            :class="['!border-0 border-solid mx-[25px] bg-[#f7f7f7] my-[5px]', !appTypeList.length ? '' : '!border-t-[1px]']">
                        </div>
                        <template v-for="(twoMenu, twoIndex) in menus">
                            <el-sub-menu :index="String(twoMenu.meta.title)"
                                v-if="twoMenu.meta.attr != 'tools' && twoMenu.meta.show && !twoMenu.meta.app && twoMenu.children">
                                <template #title>
                                    <div class="w-[16px] h-[16px] relative flex items-center">
                                        <icon v-if="twoMenu.meta.icon" :name="twoMenu.meta.icon"
                                            class="absolute !w-auto" size="18px" />
                                    </div>
                                    <span class="ml-[11px] text-[15px]">{{ twoMenu.meta.title }}</span>
                                </template>
                                <template v-for="(threeMenu, threeIndex) in twoMenu.children" :key="threeIndex">
                                    <el-sub-menu :index="String(threeMenu.meta.title)"
                                        v-if="threeMenu.children && threeMenu.meta.show">
                                        <template #title>
                                            <div class="w-[16px] h-[16px] relative flex items-center justify-center">
                                                <span class="iconfont iconyuanquan_huaban1 !text-[20px]"></span>
                                            </div>
                                            <span class="ml-[11px] text-[15px]">{{ threeMenu.meta.title }}</span>
                                        </template>
                                        <template v-for="(fourMenu, fourIndex) in threeMenu.children" :key="fourIndex">
                                            <el-sub-menu :index="String(fourMenu.meta.title)"
                                                v-if="fourMenu.children && fourMenu.meta.show">
                                                <template #title>
                                                    <div
                                                        class="w-[16px] h-[16px] relative flex items-center justify-center">
                                                        <span class="iconfont icondian !text-[25px]"></span>
                                                    </div>
                                                    <span class="ml-[11px] text-[15px]">{{ fourMenu.meta.title }}</span>
                                                </template>
                                                <template v-for="(fiveMenu, fiveIndex) in threeMenu.children"
                                                    :key="fiveIndex">
                                                    <el-menu-item v-if="fiveMenu.meta.show" class="!h-[52px] !pl-[55px]"
                                                        :index="String(fiveMenu.name)" @click="toLink(fiveMenu)">
                                                        <template #title>
                                                            <span class="text-[14px]">{{ fiveMenu.meta.title }}</span>
                                                        </template>
                                                    </el-menu-item>
                                                </template>
                                            </el-sub-menu>
                                            <el-menu-item v-else-if="fourMenu.meta.show" class="!h-[52px] !pl-[55px]"
                                                :index="String(fourMenu.name)" @click="toLink(fourMenu)">
                                                <template #title>
                                                    <span class="text-[14px]">{{ fourMenu.meta.title }}</span>
                                                </template>
                                            </el-menu-item>
                                        </template>
                                    </el-sub-menu>

                                    <el-menu-item
                                        v-else-if="threeMenu.meta.show && threeMenu.meta.key != 'official_market'"
                                        class="!h-[52px] !pl-[52px]" :index="String(threeMenu.name)"
                                        @click="toLink(threeMenu)">
                                        <template #title>
                                            <span class="text-[14px]">{{ threeMenu.meta.title }}</span>
                                        </template>
                                    </el-menu-item>
                                    <div class="flex items-center !px-[52px] h-[56px] cursor-pointer text-[#333] el-menu-item"
                                        v-else-if="threeMenu.meta.show && threeMenu.meta.key == 'official_market'"
                                        @click="toLink(threeMenu)">
                                        <span class="text-[15px]">{{ twoMenu.meta.title }}</span>
                                    </div>
                                </template>
                            </el-sub-menu>
                            <el-menu-item v-else-if="twoMenu.meta.attr != 'tools' && twoMenu.meta.show" class="!pl-[35px] text-[#333]"
                                :index="String(twoMenu.name)" @click="toLink(twoMenu)">
                                <template #title>
                                    <div v-if="twoMenu.meta.icon" class="w-[16px] h-[16px] relative flex items-center">
                                        <icon v-if="twoMenu.meta.icon" :name="twoMenu.meta.icon"
                                            class="absolute !w-auto" size="18px" />
                                    </div>
                                    <span class="ml-[11px] text-[15px]">{{ twoMenu.meta.title }}</span>
                                </template>
                            </el-menu-item>
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
    otherTypeList.value = otherTypeList.value.concat(['member', 'app_center'])
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
    if(!appList.value.length){
        storage.set({ key: 'menuAppStorage', data: '' })
        globalAppKey.value = ""
    }

    if(appList.value.length && !globalAppKey.value){
        storage.set({ key: 'menuAppStorage', data: appTypeList.value[0] })
        globalAppKey.value = appTypeList.value[0]
    }
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
    localMenuKey.value = data.meta.key || 'overview'

    systemStore.$patch(state => {
        state.menuDrawer = false
    })
}, { immediate: true })



let twofloatMenu = ref(true);
const twofloatMenuHover = ()=>{
    twofloatMenu.value = true;
}
const toLink = (data, type) => {
    if(type == 'twofloatMenu') twofloatMenu.value = false;

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
        }
        router.push({ name: name })
    } else {
        window.open('https://www.niucloud.com/app', '_blank')
    }
}

// 主题风格
const sidebar = computed(() => {
    return systemStore.sidebar
})

// 控制二级菜单的显示
const isTwoMenuFn = (item) => {
    let bool = (otherTypeList.value.includes(localMenuKey.value) && globalAppKey.value == item.meta.app)
        || (!appTypeList.value.includes(localMenuKey.value) && !otherTypeList.value.includes(localMenuKey.value) && globalAppKey.value && globalAppKey.value == item.meta.app)
        || (appTypeList.value.includes(localMenuKey.value) && (item.meta.key == localMenuKey.value || item.meta.app == localMenuKey.value))
        || (!appTypeList.value.length && (item.meta.key == localMenuKey.value || item.meta.app == localMenuKey.value))
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

.second-menu .el-menu-item{
    height: 40px !important;
    margin-bottom: 4px;
}
.second-menu .el-sub-menu .el-sub-menu__title {
    padding-left: 25px !important;
    padding-right: 25px !important;
    height: 40px;
    margin-bottom: 4px;

    .el-icon.el-sub-menu__icon-arrow {
        right: 25px;
        font-weight: bolder;
        font-size: 14px;
    }
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
        // background-color: #12192D;
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
            ;
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
    height: calc(100vh - 64px);
}
</style>
