<?php
// +----------------------------------------------------------------------
// | Niucloud-admin 企业快速开发的多应用管理平台
// +----------------------------------------------------------------------
// | 官方网址：https://www.niucloud.com
// +----------------------------------------------------------------------
// | niucloud团队 版权所有 开源版本可自由商用
// +----------------------------------------------------------------------
// | Author: Niucloud Team
// +----------------------------------------------------------------------

namespace app\service\api\diy;

use app\dict\diy\PagesDict;
use app\model\diy\Diy;
use core\base\BaseApiService;

/**
 * 自定义页面服务层
 * Class DiyService
 * @package app\service\api\diy
 */
class DiyService extends BaseApiService
{

    public function __construct()
    {
        parent::__construct();
        $this->model = new Diy();
    }

    /**
     * 获取自定义页面信息
     * @param array $params
     * @return array
     */
    public function getInfo(array $params = [])
    {

        // 查询启动页
        $diy_config_service = new DiyConfigService();
        $start_up_page = $diy_config_service->getStartUpPageConfig($params[ 'name' ]);

        if (!empty($start_up_page) && $start_up_page[ 'mode' ] == 'other' && $params[ 'name' ] != $start_up_page[ 'name' ]) {
            $info = $start_up_page;
            return $info;
        } else {

            $condition = [];

            if (!empty($params[ 'id' ])) {
                $condition[] = [ 'id', '=', $params[ 'id' ] ];
            } elseif (!empty($params[ 'name' ])) {
                $condition[] = [ 'name', '=', $params[ 'name' ] ];
                $condition[] = [ 'is_default', '=', 1 ];
            }

            if (!empty($params[ 'template' ])) {
                $condition[] = [ 'template', '=', $params[ 'template' ] ];
            }

            $field = 'id,title,name,type,template, mode,value,is_default,share,visit_count';

            $info = $this->model->field($field)->where($condition)->findOrEmpty()->toArray();
            if (empty($info)) {
                // 查询默认页面数据
                if (!empty($params[ 'name' ])) {
                    $page_data = $this->getFirstPageData($params[ 'name' ], $params[ 'template' ]);
                    if (!empty($page_data)) {
                        $info = [
                            'title' => $page_data[ 'title' ],
                            'name' => $page_data[ 'type' ],
                            'type' => $page_data[ 'type' ],
                            'template' => $page_data[ 'template' ],
                            'mode' => $page_data[ 'mode' ],
                            'value' => json_encode($page_data[ 'data' ], JSON_UNESCAPED_UNICODE),
                            'is_default' => 1,
                            'share' => '',
                            'visit_count' => 0
                        ];
                    }
                }
            }
            return $info;
        }
    }

    /**
     * 获取默认页面数据
     * @param $type
     * @param $template
     * @return array|mixed
     */
    public function getFirstPageData($type, $template)
    {
        $pages = PagesDict::getPages([ 'type' => $type ]);
        if (!empty($pages)) {
            if (empty($template)) {
                $template = array_key_first($pages);
                $page = array_shift($pages);
            } else {
                $page = $pages[ $template ];
            }
            $page[ 'template' ] = $template;
            $page[ 'type' ] = $type;
            return $page;
        }
        return [];
    }

}