<template>
  <div class="spu-containter">
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <CategorySelector
        :isShowList="isShowList"
        @changeCategory="changeCategory"
      ></CategorySelector>
    </el-card>
    <!-- 
      三页面共用一个card
      - spu查看页面
      - 添加修改页面
      - 添加sku页面
    -->
    <el-card style="margin-top: 20px" :body-style="{ padding: '20px' }">
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="showAddSpuForm"
        >
          添加spu
        </el-button>

        <el-table :data="spuList" border style="width: 100%; margin-top: 20px">
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column prop="spuName" label="SPU名称"></el-table-column>
          <el-table-column prop="description" label="SPU描述"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <el-button
                icon="el-icon-plus"
                type="success"
                size="mini"
                @click="showAddSkuForm(row)"
              ></el-button>
              <el-button
                icon="el-icon-edit"
                type="primary"
                size="mini"
                @click="showUpdataSpuForm(row)"
              ></el-button>
              <el-button
                icon="el-icon-warning-outline"
                type="info"
                size="mini"
                @click=""
              ></el-button>
              <el-button
                icon="el-icon-delete"
                type="danger"
                size="mini"
                @click=""
              ></el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          style="text-align: center; margin-top: 10px"
          :current-page.sync="page"
          :page-sizes="[5, 10, 15]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,sizes, total"
          :total="total"
          background
        >
        </el-pagination>
      </div>

      <!-- 避免html结构太多，将下面两个封装成两个组件 -->
      <!-- <div>添加修改页面</div>
      <div>添加sku页面</div> -->
      <SkuForm v-show="isShowSkuForm"></SkuForm>
      <SpuForm v-show="isShowSpuForm"></SpuForm>
    </el-card>
  </div>
</template>

<script>
import SpuForm from "@/views/product/components/SpuForm.vue";
import SkuForm from "@/views/product/components/SkuForm.vue";

export default {
  name: "spu",
  data() {
    return {
      // 这个是做三级联动的可操作性的
      isShowList: true,
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1,
      limit: 5,
      spuList: [],
      total: 0,

      // 切换三个页面的数据
      isShowSpuForm: false,
      isShowSkuForm: false,
    };
  },

  components: {
    SpuForm,
    SkuForm,
  },

  mounted() {
    // this.getSpuList(page, limit, )
  },

  methods: {
    // 
    showAddSkuForm(row){
      this.isShowSkuForm = true
    },

    //
    showUpdataSpuForm(row) {
      this.isShowSpuForm = true;
    },
    // 点击添加spu按钮
    showAddSpuForm() {
      this.isShowSpuForm = true;
    },
    changeCategory({ categoryId, level }) {
      /**
       * 将分类id存储起来，以便发送请求
       */
      if (level === 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level === 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        // 如果选择的是三级id，就一定要发送请求,获取属性列表数据
        this.getSpuList();
      }
    },

    // 请求获取spu的分页列表
    async getSpuList(pager = 1) {
      this.page = pager;
      let { page, limit, category3Id } = this;
      try {
        const result = await this.$API.spu.getList(page, limit, category3Id);
        this.spuList = result.data.records;
        this.total = result.data.total;
      } catch (error) {
        this.spuList = [
          {
            id: 1,
            category3Id: 0,
            description: "HUAWEI P40",
            spuImageList: null,
            spuName: "HUAWEI P40",
            spuSaleAttrList: null,
            tmId: 11,
          },
          {
            id: 2,
            category3Id: 0,
            description: "Apple ipphone 12",
            spuImageList: null,
            spuName: "Apple ipphone 12",
            spuSaleAttrList: null,
            tmId: 12,
          },
          {
            id: 3,
            category3Id: 0,
            description: "Red mi 13",
            spuImageList: null,
            spuName: "Red mi 13",
            spuSaleAttrList: null,
            tmId: 13,
          },
          {
            id: 4,
            category3Id: 0,
            description: "OPPO A53 5G",
            spuImageList: null,
            spuName: "OPPO A53 5G",
            spuSaleAttrList: null,
            tmId: 14,
          },
          {
            id: 5,
            category3Id: 0,
            description: "e+ 18",
            spuImageList: null,
            spuName: "e+ 18",
            spuSaleAttrList: null,
            tmId: 15,
          },
        ];
        this.total = 5;
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.spu-containter
  padding: 20px
</style>