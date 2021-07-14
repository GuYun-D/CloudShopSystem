<template>
  <div class="attr-container">
    <el-card>
      <CategorySelector @changeCategory="changeCategory"></CategorySelector>
    </el-card>
    <el-card style="margin-top: 20px">
      <el-button disabled type="primary" icon="el-icon-plus"
        >添加属性</el-button
      >
      <el-table border style="margin-top: 20px" :data="attrList">
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
              <el-button type="warning" icon="el-icon-edit"></el-button>
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
    </el-card>
  </div>
</template>

<script>
export default {
  name: "attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
    };
  },
  methods: {
    changeCategory({ categoryId, level }) {
      /**
       * 将分类id存储起来，以便发送请求
       */
      if (level === 1) {
        this.category1Id = categoryId;
        // 一级或者二级id选中，清空数据
        this.attrList = [];
        this.category2Id = "";
        this.category3Id = "";
      } else if (level === 2) {
        this.category2Id = categoryId;
        // 一级或者二级id选中，清空数据
        this.attrList = [];
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        // 如果选择的是三级id，就一定要发送请求,获取属性列表数据
        this.getAttrList();
      }
    },

    async getAttrList() {
      try {
        let { category1Id, category2Id, category3Id } = this;
        const result = await this.$API.attr.getList(
          category1Id,
          category2Id,
          category3Id
        );
        this.attrList = result;
      } catch (error) {
        this.attrList = [
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