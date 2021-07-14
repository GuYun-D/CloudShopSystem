<template>
  <div>
    <!-- 
      行内表单
      :inline="true"：输入框标题以及输入框之间横向排列
     -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="一级分类">
        <!-- 选中哪一项，最终我们收集的是分类的id,选中哪一个是存在option的value属性中的 -->
        <!-- el-select上有一个change事件，选项发生变化时触发，默认的参数就是选中的那个值 -->
        <el-select
          @change="changeCategory1"
          v-model="formInline.category1Id"
          placeholder="请选择"
        >
          <el-option
            v-for="(c1, index) in category1List"
            :key="c1.id"
            :label="c1.category1Name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="formInline.category2Id"
          @change="changeCategory2"
          placeholder="请选择"
        >
          <el-option
            v-for="(c2, index) in category2List"
            :key="c2.id"
            :label="c2.category2Name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          @change="changeCategory3"
          v-model="formInline.category3Id"
          placeholder="请选择"
        >
          <el-option
            v-for="(c3, index) in category3List"
            :key="c3.id"
            :label="c3.category3Name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      formInline: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      category1List: [],
      category2List: [],
      category3List: [],
    };
  },
  mounted() {
    this.getCategory1List();
  },
  methods: {
    // 获取一级分类id
    async getCategory1List() {
      try {
        // 当一级列表重新选择时，清空后面俩的数据
        this.formInline.category2Id = "";
        this.formInline.category3Id = "";
        this.category2List = [];
        this.category3List = [];

        const result = await this.$API.category.getCategory1();
        this.category1List = result.data;
      } catch (error) {
        this.formInline.category2Id = "";
        this.formInline.category3Id = "";
        this.category2List = [];
        this.category3List = [];
        this.category1List = [
          {
            id: 0,
            category1Name: "家电",
          },
          {
            id: 1,
            category1Name: "服饰",
          },
          {
            id: 2,
            category1Name: "电子产品",
          },
        ];
      }
    },

    // 根据一级分类，获取二级分类列表
    async changeCategory1(category1Id) {
      try {
        this.formInline.category3Id = "";
        this.category3List = [];
        this.$emit("changeCategory", {categoryId: category1Id, level: 1});

        const result = await this.$API.category.getCategory2(category1Id);
        this.category2List = result.data;
      } catch (error) {
        this.formInline.category3Id = "";
        this.category3List = [];
        if (category1Id === 0) {
          this.category2List = [
            {
              id: 0,
              category2Name: "电视机",
            },
            {
              id: 1,
              category2Name: "冰箱",
            },
            {
              id: 2,
              category2Name: "洗衣机",
            },
            {
              id: 3,
              category2Name: "电磁炉",
            },
          ];
        } else if (category1Id === 1) {
          this.category2List = [
            {
              id: 4,
              category2Name: "衣服",
            },
            {
              id: 5,
              category2Name: "帽子",
            },
            {
              id: 6,
              category2Name: "裤子",
            },
            {
              id: 7,
              category2Name: "背包",
            },
          ];
        } else if (category1Id === 2) {
          this.category2List = [
            {
              id: 8,
              category2Name: "手机",
            },
            {
              id: 9,
              category2Name: "电脑",
            },
            {
              id: 10,
              category2Name: "平板",
            },
            {
              id: 11,
              category2Name: "相机",
            },
          ];
        }
      }
    },

    // 根据二级分类获取三级分类的列表
    async changeCategory2(category2Id) {
      try {
        this.$emit("changeCategory", {categoryId: category2Id, level: 2});
        const result = await this.$API.category.getCategory3(category2Id);
        this.category3List = result.data;
      } catch (error) {
        if (category2Id === 0) {
          this.category3List = [
            {
              id: 0,
              category3Name: "TCL",
            },
            {
              id: 1,
              category3Name: "曲面",
            },
            {
              id: 2,
              category3Name: "长虹",
            },
          ];
        }
      }
    },

    // 选完三级分类后的事情，发请求，获取属性数据，但是该请求不是在当前组件发的，而是在父组件发的，组件通信
    changeCategory3(category3Id) {
      // 组件通信，将三级的id传递到父组件
      // 子向父，全是自定义事件或者prop
      // 因为有三个id，直接传递不知道是几集分类，故而传入一个对象，指明分类等级
      this.$emit("changeCategory", {categoryId: category3Id, level: 3});
    },
  },
};
</script>

<style lang="less" scoped>
</style>