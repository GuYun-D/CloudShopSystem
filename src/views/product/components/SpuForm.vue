<template>
  <div>
    <!-- 
      label和input默认是上下排列的，即
      <label></label>
      <input></input>
      通过为el-form添加label-width可以达到是label和input铺平100%的目的，
        el-form添加label-width，form中的所有label都会生效，也可以单独给el-form-item添加
     -->
    <el-form label-width="100px" :model="spuForm">
      <el-form-item label="SPU名称" size="normal">
        <el-input v-model="spuForm.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>

      <el-form-item label="品牌" size="normal">
        <el-select v-model="spuForm.tmId" placeholder="请选择品牌">
          <el-option label="" value=""> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述" size="normal">
        <el-input
          placeholder="SPU描述"
          type="textarea"
          v-model="spuForm.description"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU图片" size="normal">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性" size="normal">
        <el-select
          style="margin-right: 10px"
          v-model="spuSaleAttrId"
          placeholder="选择"
        >
          <el-option value=""> </el-option>
        </el-select>
        <el-button type="primary" size="default" icon="el-icon-plus"
          >添加销售属性</el-button
        >

        <el-table border style="margin: 20px 0">
          <el-table-column
            width="80"
            label="序号"
            type="index"
            align="center"
          ></el-table-column>
          <el-table-column label="属性名" width="150"></el-table-column>
          <el-table-column label="属性值名称列表"></el-table-column>
          <el-table-column label="操作" width="150"></el-table-column>
        </el-table>

        <el-button type="primary" size="default">保存</el-button>
        <el-button size="default" @click="$emit('update:visible', false)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      spuForm: {
        // 此对象是为了在添加时收集数据用的
        // 如果是修改spu
        spuName: "",
        category3Id: "",
        description: "",
        tmId: "",
        spuImageList: [],
      },

      dialogImageUrl: "",
      dialogVisible: false,

      //
      spuSaleAttrId: "",

      // 将获取到图片列表先单独保存，最后再整合到spuForm中去
      spuImageList: [],

      // 获取所有的品牌列表
      trademarkList: [],

      // 获取所有的spu销售属性
      baseSalseAttrList: [],
    };
  },

  methods: {
    // 照片墙上传的两个函数
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    // 请求获取初始化
    async initUpdataSpuFormData(spu) {
      // 函数当中再发4个请求
      // 获取spu的详情数据
      try {
        const result = await this.$API.spu.get(spu.id);
        this.spuForm = result.data;
      } catch (error) {
        this.spuForm = {
          category3Id: 61,
          description: "HUAWEI P40",
          id: 4,
          spuImageList: null,
          spuName: "HUAWEI P40",
        };
      }
      // 获取spu的图片列表数据
      try {
        const imageList = await this.$API.spu.getSpuImageList(spu.id);
        this.spuImageList = imageList.data;
      } catch (error) {
        this.spuImageList = [
          {
            id: 0,
            imageUrl: "C:/Users/86176/Pictures/bitbug_favicon.icon",
          },
        ];
      }
      // 获取spu的品牌数据
      try {
        const trademarkList = await this.$API.trademark.getList();
        this.trademarkList = trademarkList;
      } catch (error) {
        this.trademarkList = [
          {
            id: 0,
            tmName: "HUAWEI",
          },
          {
            id: 1,
            tmName: "Apple",
          },
          {
            id: 2,
            tmName: "OPPO",
          },
          {
            id: 3,
            tmName: "Red mi",
          },
        ];
      }
      // 获取所有销售属性数据
      try {
        const baseSalseAttrResult = await this.$API.spu.getSalseAttrList();
        this.baseSalseAttrList = baseSalseAttrResult.data;
      } catch (error) {
        this.baseSalseAttrList = [
          {
            id: 0,
          },
        ];
      }
    },

    //
    async initAddSpuFormData() {
      try {
        const trademarkList = await this.$API.trademark.getList();
        this.trademarkList = trademarkList;
      } catch (error) {
        this.trademarkList = [
          {
            id: 0,
            tmName: "HUAWEI",
          },
          {
            id: 1,
            tmName: "Apple",
          },
          {
            id: 2,
            tmName: "OPPO",
          },
          {
            id: 3,
            tmName: "Red mi",
          },
        ];
      }
      // 获取所有销售属性数据
      try {
        const baseSalseAttrResult = await this.$API.spu.getSalseAttrList();
        this.baseSalseAttrList = baseSalseAttrResult.data;
      } catch (error) {
        this.baseSalseAttrList = [
          {
            id: 0,
          },
        ];
      }
    },
  },
};
</script>

<style scoped>
</style>