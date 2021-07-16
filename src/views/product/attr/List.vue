<template>
  <div class="attr-container">
    <el-card>
      <CategorySelector @changeCategory="changeCategory"></CategorySelector>
    </el-card>
    <el-card style="margin-top: 20px">
      <!-- 列表页数据 -->
      <!-- 
        此处不能用v-if
        不然就会把数据干掉了
       -->
      <div v-show="isShowList">
        <!-- 
          根据3级分类的存在与否，动态显示按钮的可操作性
         -->
        <el-button
          type="primary"
          :disabled="category3Id === '' ? true : false"
          icon="el-icon-plus"
          @click="showAddDiv"
          >添加属性</el-button
        >
        <el-table border style="margin-top: 20px" :data="attrValueList">
          <el-table-column label="序号" type="index" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                style="margin: 0 10px"
                type="success"
                :key="attrValue.id"
                v-for="(attrValue, index) in row.attrValueList"
              >
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-tooltip
                class="item"
                effect="dark"
                content="修改"
                placement="top-end"
              >
                <el-button
                  type="warning"
                  icon="el-icon-edit"
                  @click="showUpdataDiv(row)"
                ></el-button>
              </el-tooltip>

              <el-tooltip
                class="item"
                effect="dark"
                content="删除"
                placement="top-start"
              >
                <el-button type="danger" icon="el-icon-delete"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 添加或者修改的页面 -->
      <div v-show="!isShowList">
        <el-form :model="attrForm" :inline="true">
          <el-form-item label="属性名">
            <el-input
              v-model="attrForm.attrName"
              placeholder="请输入属性名"
            ></el-input>
          </el-form-item>
        </el-form>

        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="attrForm.attrName === '' ? true : false"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button type="info">取消</el-button>

        <el-table
          :data="attrForm.attrValueList"
          width="100%"
          border
          style="margin: 20px 0"
        >
          <el-table-column
            width="80"
            type="index"
            label="序号"
            align="center"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template slot-scope="{ row, $index }">
              <!-- @keyup.enter必须要变成原生的事件，否则无法处理 -->
              <el-input
                v-if="row.isEdit"
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                @blur="toLook(row)"
                @keyup.enter.native="toLook(row)"
              ></el-input>
              <div @click="toEdit(row)" v-else>{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="">
            <template>
              <el-tooltip content="删除" placement="top" effect="dark">
                <el-button
                  type="danger"
                  size="default"
                  icon="el-icon-delete"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrValueList: [],
      // 控制列表页和修改页的显示与隐藏
      isShowList: true,
      /**
       * 添加属性要收集的表单样子
       * {
       *    "attrName": "String",
       *    "attrValueList": [
       *      {
       *        "attrId": 0,
       *        "id": 0,
       *        "valueName": "String"
       *      }
       *    ],
       *    "categoryId": 0,
       *    "categoryLevel": 0,
       *    "id": 0
       * }
       */
      attrForm: {
        attrName: "",
        attrValueList: [
          /**
           * 属性值的模式切换，新添加的时候是一个输入框
           * 属性值在修改的时候是一个span
           * 即编辑模式和查看模式
           */
          /**
           * 属性值模式的切换
           * input添加失去焦点事件和回车事件，切换isEdit的值
           * span添加点击事件，切换isEdit的值
           */
        ],
        categoryId: 0,
        categoryLevel: 3,
      },
    };
  },
  methods: {
    // 点击span
    toEdit(row) {
      row.isEdit = true;
    },

    // 切换查看模式,input的blur和回车事件
    toLook(row) {
      let valueName = row.valueName;
      /**
       * 切换之前，检验输入框的合法性
       * 1.输入内容不能为空
       * 2.与其他属性值不能重复
       */
      if (!valueName.trim()) {
        this.$message.warning("请输入属性值名称");
        // 清空输入框不合法的数据
        row.valueName = "";
        return;
      }

      // 判断是否重复，首先要除去自身
      let isRepeat = this.attrForm.attrValueList.some((item) => {
        if (item !== row) {
          // 除去自身之后，有一个达到return的条件，那么就返回true
          return item.valueName === valueName;
        }
      });

      if (isRepeat) {
        // 清空输入框不合法的数据
        row.valueName = "";
        this.$message.warning("您输入的内容与已有属性重复，请重新输入");
        return;
      }

      row.isEdit = false;
    },

    // 修改品牌
    showUpdataDiv(row) {
      this.isShowList = false;
      // 结构出数据，防止同时变
      // 深拷贝
      this.attrForm = cloneDeep(row);

      // 在做修改的时候，读取attrForm的数据，将这个数据中添加入编辑模式
      this.attrForm.attrValueList.forEach((item) => {
        // 这样子添加不是响应式的，只有在数据初始化阶段（beforeCreate 和 created 之间的对象，对象当中的属性才是响应式的数据）
        // 不是响应式的数据，这样导致后期添加了以后页面不变化
        // 必须是通过使用Vue.set 或者是 vm.$set才不能让其成为响应式数据
        // item.isEdit = false
        this.$set(item, "isEdit", false);
      });
    },

    // 点击添加按钮
    showAddDiv() {
      this.isShowList = false;
      /**
       * 清空收集的对象以及清空添加表单
       * {
       *  categoryId: 0,
       *  categoryLevel: 3
       * }
       * categoryLevel是固定的，因为只有选择了三级分类id，才会发送请求
       * categoryId 而是要在用户点击添加，才收集
       */
      this.attrForm = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },

    /**
     * 点击添加属性值按钮
     * 给属性值列表当中添加一个空的对象，保证表格当中首先出现一行
     */
    addAttrValue() {
      this.attrForm.attrValueList.push({
        // 该id是属性值所属属性的id，如果是添加属性，这个id是没有的，如果是修改属性，该id是有的
        attrId: this.attrForm.id,
        // 这里只是添加了一个空对象，属性值都还没有，只是在占位，让用户自己输入
        valueName: "",
        // 添加属性值的时候添加编辑模式
        isEdit: true,
      });
    },

    changeCategory({ categoryId, level }) {
      /**
       * 将分类id存储起来，以便发送请求
       */
      if (level === 1) {
        this.category1Id = categoryId;
        // 一级或者二级id选中，清空数据
        this.attrValueList = [];
        this.category2Id = "";
        this.category3Id = "";
      } else if (level === 2) {
        this.category2Id = categoryId;
        // 一级或者二级id选中，清空数据
        this.attrValueList = [];
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        // 如果选择的是三级id，就一定要发送请求,获取属性列表数据
        this.getattrValueList();
      }
    },

    async getattrValueList() {
      try {
        let { category1Id, category2Id, category3Id } = this;
        const result = await this.$API.attr.getList(
          category1Id,
          category2Id,
          category3Id
        );
        this.attrValueList = result;
      } catch (error) {
        this.attrValueList = [
          {
            attrName: "手机一级",
            attrValueList: [
              {
                attrId: 0,
                id: 0,
                valueName: "苹果",
              },
              {
                id: 1,
                valueName: "安卓",
                attrId: 0,
              },
              {
                id: 3,
                valueName: "鸿蒙",
                attrId: 0,
              },
            ],
            categoryId: 0,
            categoryLevel: 1,
            id: 0,
          },
          {
            attrName: "手机二级",
            attrValueList: [
              {
                attrId: 1,
                id: 0,
                valueName: "苹果",
              },
              {
                attrId: 1,
                id: 1,
                valueName: "华为",
              },
              {
                attrId: 1,
                id: 2,
                valueName: "小米",
              },
              {
                attrId: 3,
                id: 3,
                valueName: "OPPO",
              },
            ],
            categoryId: 0,
            categoryLevel: 1,
            id: 1,
          },
        ];
      }
    },
  },
};
</script>

<style scoped>
.attr-container {
  margin: 20px;
}
</style>