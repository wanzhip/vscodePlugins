const btn: any = {
  type: 'normal',
  prefix: 'el-button',
  name: 'el-button',
  props: [
    {
      key: 'size',
      default: '',
      options: [
        {
          value: 'large',
          detail: '大号按钮',
          documentation: '大号按钮'
        },
        {
          value: 'small',
          detail: '小号按钮',
          documentation: '小号按钮'
        }
      ],
      detail: '控制按钮大小',
      documentation: '注意 icon 类型的 button 不支持'
    },
    {
      key: 'html-type',
      default: '',
      options: [
        {
          value: 'button',
          detail: '普通按钮',
          documentation: '普通按钮'
        },
        {
          value: 'submit',
          detail: '提交按钮',
          documentation: '提交按钮'
        },
        {
          value: 'reset',
          detail: '重置按钮',
          documentation: '重置按钮'
        }
      ],
      detail: '按钮原生类型',
      documentation: '设置 button 原生的 type 类型'
    },
    {
      key: 'loading',
      isBoolean: true,
      options: [],
      detail: '加载状态',
      documentation: '是否处于加载中状态'
    },
    {
      key: 'disabled',
      isBoolean: true,
      options: [],
      detail: '禁用状态',
      documentation: '是否设置禁用状态'
    },
    {
      key: 'icon',
      options: [],
      detail: '按钮左侧图标类型',
      documentation: '设置按钮左侧图标类型'
    },
    {
      key: 'type',
      default: '',
      options: [
        {
          value: 'primary',
          detail: '基础按钮',
          documentation: '基础按钮<就是蓝框框那个>'
        },
        {
          value: 'text',
          detail: '文字按钮',
          documentation: '文字按钮'
        },
        {
          value: 'text-primary',
          detail: '基础文字按钮',
          documentation: '基础文字按钮'
        }
      ],
      detail: '按钮类型',
      documentation: '设置按钮类型'
    },
    {
      key: 'dashed',
      isBoolean: true,
      options: [],
      detail: '虚线边框',
      documentation: '是否设置虚线边框'
    },
  ],
  events: [
    {
      key: 'click',
      detail: '点击事件',
      documentation: '按钮点击事件(非原生事件)'
    }
  ],
  detail: '按钮组件',
  documentation: '用于触发一个行动并形成决策的组件',
  snippets: {
    tag: 'el-button',
    attrs: {
      type: 'primary'
    }
  },
  path: '/#/components/btn'
}

export default btn
