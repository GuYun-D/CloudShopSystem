<template>
  <div>
    <el-form
      :model="skuForm"
      ref="form"
      label-width="80px"
      :inline="false"
      size="normal"
    >
      <el-form-item label="SPU 名称"> spuName </el-form-item>
      <el-form-item label="sku 名称">
        <el-input
          v-model="skuForm.skuName"
          placeholder="SKU 名称"
          size="normal"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          v-model="skuForm.price"
          placeholder="SKU 价格"
          size="normal"
          clearable
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input
          v-model="skuForm.weight"
          placeholder="SKU 重量"
          size="normal"
          clearable
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          v-model="skuForm.skuDesc"
          placeholder="SKU 规格描述"
          size="normal"
          clearable
          type="textarea"
          rows="4"
        ></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form ref="form" label-width="100px" :inline="true" size="normal">
          <el-form-item label="屏幕尺寸">
            <el-select placeholder="请选择" clearable filterable @change="">
              <el-option> </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form ref="form" label-width="100px" :inline="true" size="normal">
          <el-form-item label="版本">
            <el-select placeholder="请选择" clearable filterable @change="">
              <el-option> </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table border>
          <el-table-column width="55" type="selection" align="center"></el-table-column>
          <el-table-column label="图片"></el-table-column>
          <el-table-column label="名称"></el-table-column>
          <el-table-column label="操作"></el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="default" @click="">保存</el-button>
        <el-button type="info" size="default" @click="">取消</el-button>
        
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      skuForm: {
        category3Id: "",
        price: "",
        tmId: "",
        weight: "",
        skuName: "",
        skuDesc: "",
        skuDefaultImg: "",
        skuAttrValueList: [],
        skuImageList: [],
        skuSaleAttrValueList: [],
      },
    };
  },
};
</script>

<style scoped>
</style>