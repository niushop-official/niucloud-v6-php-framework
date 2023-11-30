<template>
    <div v-if="data.length > 1 || app_debug " :class="[{'group-hover:flex': props.isShowHover},'hidden fixed left-0 top-[65px] z-[5555] bg-[#fff] w-[1076px] px-[28px] py-[20px] flex-wrap box-border shadow-lg ']">
        <div :class="['app-item w-[240px] box-border !bg-[#fff] rounded-[6px] cursor-pointer mb-[20px] overflow-hidden',{'mr-[20px]': (index+1)%4 != 0}]" v-for="(item, index) in data" :key="index" @click="toLink(item, props.hoverType)">
            <div class="bg-[#F7FAFB] py-[15px] px-[22px] flex items-center app-item-head">
                <el-image class="w-[44px] h-[44px]  rounded-[8px]" :src="img(item.icon)" fit="contain">
                    <template #error>
                        <div class="image-slot">
                            <img class="w-[40px] h-[40px] rounded-[8px]"
                                src="@/app/assets/images/app_store/app_store_default.png" />
                        </div>
                    </template>
                </el-image>
            </div>
            <div class="py-[15px] px-[22px]">
                <div class="font-[600] leading-[1] text-[14px] text-[#222]">{{ item.title }}</div>
                <el-tooltip class="box-item" effect="light" :content="item.desc" placement="bottom-start">
                    <div class="text-[13px] text-[#6D7278] leading-[18px] mt-[6px] truncate">
                        {{ item.desc }}
                    </div>
                </el-tooltip>
            </div>
        </div>
        <div v-if="app_debug" :class="['app-item w-[240px] box-border !bg-[#fff] rounded-[6px] cursor-pointer mb-[20px] overflow-hidden',{'mr-[20px]': (data.length+1)%4 != 0}]"  @click="toDeveloperLink()">
            <div class="bg-[#F7FAFB] py-[15px] px-[22px] flex items-center app-item-head developer">
                <img class="w-[40px] h-[40px] rounded-[8px]" src="@/app/assets/images/app_store/developer.png" />
            </div>
            <div class="py-[15px] px-[22px]">
                <div class="font-[600] leading-[1] text-[14px] text-[#222]">开发人员模式</div>
                <el-tooltip class="box-item" effect="light" content="开发人员模式" placement="bottom-start">
                    <div class="text-[13px] text-[#6D7278] leading-[18px] mt-[6px] truncate">
                        开发人员模式
                    </div>
                </el-tooltip>
            </div>
        </div>
        <el-empty class="mx-auto overview-empty" v-if="!data.length">
            <template #image>
                <div class="w-[230px] mx-auto">
                    <img src="@/app/assets/images/index/apply_empty.png" class="max-w-full" alt="">
                </div>
            </template>
            <template #description>
                <p class="flex items-center">
                    <span>暂无安装任何应用,请点击</span>
                    <el-link type="primary" @click="toAppStore" class="mx-[5px]">安装应用</el-link>
                    <span>安装使用</span>
                </p>
            </template>
        </el-empty>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { img } from '@/utils/common'
import { useRouter } from 'vue-router'
import {getEnv} from '@/app/api/sys'
let app_debug = ref(false)

const getEnvFn = () => {
    getEnv().then(res => {
        app_debug.value = res.data.app_debug;
    }).catch(() => {})
}
getEnvFn();
const router = useRouter()
const props = defineProps(['isShowHover','data','hoverType'])
let data = ref([]);
if(props.data){
    props.data.forEach((item,index) => {
        if(item.type == "app"){
            data.value.push(item);            
        }
    });
}
const emit = defineEmits(['child-click'])
const toLink = (data,type)=>{
    emit('child-click',data,type)
}


// 跳转至开发者
const toAppStore = () => {
    router.push('/app_manage/app_store')
}
// 跳转到开发
const toDeveloperLink = () =>{
    router.push('/app_manage/tools')
}
</script>

<style lang="scss">
.app-item {
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.18);
}
.app-item:hover .app-item-head{
    background-color: var(--el-color-primary-light-8);
}
.app-item:hover .app-item-head.developer{
    background-color: #eee;
}
</style>