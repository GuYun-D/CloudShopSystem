<template>
  <div>
    <el-form
      :model="skuForm"
      ref="form"
      label-width="80px"
      :inline="false"
      size="normal"
    >
      <el-form-item label="SPU 名称"> {{ spu.spuName }} </el-form-item>
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
          <el-form-item
            :label="attr.attrName"
            v-for="(attr, index) in attrList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" clearable filterable @change="">
              <el-option
                v-for="(attrValue, index) in attr.attrValueList"
                :key="attrValue.id"
                value=""
                :label="attrValue.valueName"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form ref="form" label-width="100px" :inline="true" size="normal">
          <el-form-item
            :key="spuSaleAttr.id"
            v-for="(spuSaleAttr, index) in spuSalseAttrList"
            :label="spuSaleAttr.salseAttrName"
          >
            <el-select placeholder="请选择" clearable filterable @change="">
              <el-option
                :key="spuSalseAttrValue.id"
                v-for="(
                  spuSalseAttrValue, index
                ) in spuSaleAttr.spuSalseAttrValueList"
                :label="spuSalseAttrValue.salseAttrValueName"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table :data="spuImageList" border>
          <el-table-column
            width="55"
            type="selection"
            align="center"
          ></el-table-column>
          <el-table-column label="图片">
            <template slot-scope="{row, $index}">
              <img style="width: 100px" :src="row.imageUrl" alt="">
            </template>
          </el-table-column>
          <el-table-column prop="imageName" label="名称"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row, $index}">
              <el-button type="primary" size="default" @click="">设为默认</el-button>
              
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="default">保存</el-button>
        <el-button
          type="info"
          size="default"
          @click="$emit('update:visible', false)"
          >取消</el-button
        >
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
      spu: {},

      // 存储三个初始化的数据
      attrList: [],
      spuSalseAttrList: [],
      spuImageList: [],
    };
  },

  methods: {
    // 初始化获取数据
    async initAddSkuFormData(row, category1Id, category2Id) {
      this.spu = row;
      // 获取数据
      // 1.根据三级分类id获取平台属性的分页列表
      const promise1 = this.$API.attr.getLIst(
        category1Id,
        category2Id,
        row.category3Id
      );
      // 2. 获取指定spu的id对应的销售属性列表
      const promise2 = this.$API.sku.getSpuSaleAttrList(row.id);
      // 3.获取指定spu的id对应的图片列表
      const promise3 = this.$API.sku.getSpuImageList(row.id);

      /**
       * Promose.all通常会用到页面在初始化数据时，有多个请求要去发送，所以使用Promise.all，若一个不成功，都不成功
       *  promise.all成功的结果是里面成功的结果组成的数组
       */
      const result = await Promise.all([promise1, promise2, promise3]);

      // if (
      //   result[0] !== "undefined" &&
      //   result[1] !== "undefined" &&
      //   result[2] !== "undefined"
      // ) {
      //   this.attrList = result[0].data;
      //   this.spuSalseAttrList = result[1].data;
      //   this.spuImageList = result[2].data;
      // } else {
      this.attrList = [
        {
          attrName: "mate 40",
          id: 1,
          attrValueList: [
            {
              id: 11,
              valueName: "6G全网通",
            },
            {
              id: 12,
              valueName: "4G全网通",
            },
          ],

          categoryId: 61,
          categoryLevel: 3,
        },
        {
          attrName: "mate 40 pro",
          id: 2,
          attrValueList: [
            {
              id: 21,
              valueName: "6G全网通",
            },
            {
              id: 22,
              valueName: "4G全网通",
            },
          ],

          categoryId: 61,
          categoryLevel: 3,
        },
      ];
      this.spuSalseAttrList = [
        {
          id: 1,
          baseSalseAttrId: 11,
          salseAttrName: "颜色",
          spuId: 55,
          spuSalseAttrValueList: [
            {
              id: 1,
              isCheck: null,
              salseAttrName: "颜色",
              salseAttrValueName: "冰雾白",
            },
            {
              id: 2,
              isCheck: null,
              salseAttrName: "颜色",
              salseAttrValueName: "茶白",
            },
            {
              id: 3,
              isCheck: null,
              salseAttrName: "颜色",
              salseAttrValueName: "土豪金",
            },
            {
              id: 4,
              isCheck: null,
              salseAttrName: "颜色",
              salseAttrValueName: "至尊灰",
            },
          ],
        },{
          id: 2,
          baseSalseAttrId: 11,
          salseAttrName: "内存",
          spuId: 55,
          spuSalseAttrValueList: [
            {
              id: 1,
              isCheck: null,
              salseAttrName: "内存",
              salseAttrValueName: "4G",
            },
            {
              id: 2,
              isCheck: null,
              salseAttrName: "内存",
              salseAttrValueName: "6G",
            },
            {
              id: 3,
              isCheck: null,
              salseAttrName: "内存",
              salseAttrValueName: "8G",
            },
            {
              id: 4,
              isCheck: null,
              salseAttrName: "内存",
              salseAttrValueName: "16G",
            },
          ],
        },
      ];
      this.spuImageList = [
        {
          id: 0,
          imageName: "利于巅峰",
          imageUrl: "/images/86a26cfbe2cfe7e8192435fa89f0eca.jpg",
          spuId: 55,
        },
        {
          id: 1,
          imageName: "葱野游居",
          imageUrl: "/images/63c9a9bccd10201ac7edfe01679cbe6.jpg",
          spuId: 55,
        },
        {
          id: 2,
          imageName: "大漠光景",
          imageUrl: "/images/a6a1724abf948e4257583c99f6b883d.jpg",
          spuId: 55,
        },
      ];
    },
  },
  // },
};
</script>

<style scoped>
</style>