<template>
    <div class="mt-[20px] mb-[15px] mx-[10px] app-aside-wrap bg-[#fff]">
        <!-- <el-menu :router="true" unique-opened="true" :default-active="String(route.name)">
            <template v-for="(item, index) in menus" :key="index">
                <el-menu-item v-if="item.meta.key != 'official_market'" @click="toLink(item)"  :index="String(item.name)">
                    <icon v-if="item.meta.icon" :name="item.meta.icon" class="!w-auto mr-[6px]" size="16px" :title="item.meta.title" />
                    <span>{{ item.meta.title }}</span>
                </el-menu-item>
                <div class="el-menu-item" v-else @click="toLink(item)">
                    <icon v-if="item.meta.icon" :name="item.meta.icon" class="!w-auto mr-[6px]" size="16px" :title="item.meta.title" />
                    <span class="text-[14px]">{{ item.meta.title }}</span>
                </div>
            </template>
        </el-menu> -->
        <div class="flex flex-wrap items-center">
            <div v-for="(item, index) in menus" :key="index" 
                :class="['flex items-center h-[32px] border-[1px] border-solid my-[3px] border-[#E0E0E0] rounded-full px-[10px] mr-[24px] cursor-pointer bg-[#f8f8f8] hover:bg-[#fff]',{'text-[#fff] !bg-[#000] border-[#000]': item.name == route.name}]"  @click="toLink(item)">
                <icon v-if="item.meta.icon" :name="item.meta.icon" class="!w-auto mr-[4px]" size="14px" :title="item.meta.title" />
                <span class="text-[14px]">{{ item.meta.title }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { img } from '@/utils/common'
import useUserStore from '@/stores/modules/user'

    const router = useRouter()
    const route = useRoute()
    const userStore = useUserStore()
    const loading = ref(true)

	const menus = computed(() => {
        let obj = []
        loading.value = true;
		userStore.routers.forEach((item, index) => {
			if (item.meta.key == 'tool' && item.children && item.children.length) {
				item.children.forEach((childItem,childIndex) => {
					if(childItem.meta.show == 1){
						obj.push(childItem);
					}
				});
			} 
        })
        loading.value = false;
		return obj
	})

	const toLink = (data)=>{
        if(data.meta.key != 'official_market'){
    		router.push({ name: data.name })
        }else{
            window.open('https://www.niucloud.com/app', '_blank')
        }
	}
</script>

<style lang="scss">
.app-aside-wrap{
    .el-menu-item{
        border-bottom: 1px solid #f1f1f1;
    }
}
</style>
