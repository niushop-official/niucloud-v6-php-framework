import useMemberStore from '@/stores/member'
import { t } from '@/locale'
import { getToken, getAppChannel, isUrl } from './common'
import qs from 'qs';


interface RequestConfig {
    showSuccessMessage?: boolean
}

interface RequestOptions extends UniNamespace.RequestOptions, RequestOptions {
}

class Request {
    private baseUrl: string

    private config: RequestOptions = {
        url: '',
        header: {}
    }

    constructor() {
        // #ifdef H5
        this.baseUrl = import.meta.env.VITE_APP_BASE_URL || `${location.origin}/api/`
        // #endif
        // #ifndef H5
        this.baseUrl = import.meta.env.VITE_APP_BASE_URL
        // #endif
        this.baseUrl.substr(-1) != '/' && (this.baseUrl += '/')

        try {
            this.config.header[import.meta.env.VITE_REQUEST_HEADER_CHANNEL_KEY] = getAppChannel()
        } catch (e) {
        }

    }

    /**
     * 请求拦截器
     */
    private requestInterceptors() {
        // 携带token
        try {
            getToken() && (this.config.header[import.meta.env.VITE_REQUEST_HEADER_TOKEN_KEY] = getToken())
            this.config.header[import.meta.env.VITE_REQUEST_HEADER_CHANNEL_KEY] = getAppChannel()
        } catch (e) {
        }
    }

    public get(url: string, data: AnyObject = {}, config: RequestConfig = {}) {
        config.showSuccessMessage == undefined && (config.showSuccessMessage = false)
        Object.assign(this.config, config)
        return this.request('GET', url, data)
    }

    public post(url: string, data: AnyObject = {}, config: RequestConfig = {}) {
        config.showSuccessMessage == undefined && (config.showSuccessMessage = false)
        Object.assign(this.config, config)
        return this.request('POST', url, data)
    }

    public put(url: string, data: AnyObject = {}, config: RequestConfig = {}) {
        config.showSuccessMessage == undefined && (config.showSuccessMessage = false)
        Object.assign(this.config, config)
        return this.request('PUT', url, data)
    }

    public delete(url: string, config: RequestConfig = {}) {
        config.showSuccessMessage == undefined && (config.showSuccessMessage = false)
        Object.assign(this.config, config)
        return this.request('DELETE', url)
    }

    /**
     * 发送上传请求
     */
    public upload(url: string, data: AnyObject = {}, config: RequestConfig = {}) {
        this.requestInterceptors()

        const params = Object.assign(uni.$u.deepClone(this.config), {
            url: this.baseUrl + url,
            ...data
        })

        return new Promise((resolve, reject) => {
            uni.uploadFile({
                ...params,
                success: res => {
                    const data = JSON.parse(res.data)
                    if (data.code == 1) {
                        this.config.showSuccessMessage && uni.showToast({title: data.msg, icon: 'none'})
                        resolve(data)
                    } else {
                        if (data.code == 0) {
                            uni.showToast({title: data.msg, icon: 'none'})
                        } else {
                            this.handleAuthError(data.code)
                        }
                        reject(data)
                    }
                },
                fail: res => {
                    reject(res)
                }
            })
        })
    }

    /**
     * 发送请求
     */
    private request(method: string, url: string, data ?: AnyObject) {
        this.requestInterceptors()

        let source = {
            url: this.baseUrl + url,
            method,
        };
        if (source.method.toUpperCase() == 'GET') {
            source.url += '?' + qs.stringify(data);
        } else {
            source.data = data;
        }
        const params = Object.assign(uni.$u.deepClone(this.config), source)

        return new Promise((resolve, reject) => {
            uni.request({
                ...params,
                success: res => {
                    const data = res.data
                    if (data.code == 1) {
                        this.config.showSuccessMessage && uni.showToast({title: data.msg, icon: 'none'})
                        resolve(data)
                    } else {
                        if (data.code == 0) {
                            uni.showToast({title: data.msg, icon: 'none'})
                        } else {
                            this.handleAuthError(data.code)
                        }
                        reject(data)
                    }
                },
                fail: res => {
                    reject(res)
                },
                complete: (res) => {
                    this.handleRequestFail(res)
                }
            })
        })
    }

    private handleAuthError(code: number) {
        switch (code) {
            case 401:
                useMemberStore().logout()
                break;
        }
    }

    private handleRequestFail(res) {
        if (res.errMsg && res.errMsg == "request:ok") {
            if (typeof res.data == 'string') {
                // #ifdef H5
                const err = (isUrl(this.baseUrl) ? this.baseUrl : location.origin + this.baseUrl) + t('baseUrlError')
                // #endif
                // #ifndef H5
                const err = this.baseUrl + t('baseUrlError')
                // #endif
                uni.showToast({icon: 'none', title: err })
                return
            }
        }
        if (res.errMsg == 'request:fail') {
            uni.showToast({icon: 'none', title: this.baseUrl + t('requestFail')})
            return
        }
        if (res.errMsg && res.errMsg == 'request:fail url not in domain list') {
            uni.showToast({icon: 'none', title: this.baseUrl + t('notInDomainList')});
            return
        }
    }
}

export default new Request()
