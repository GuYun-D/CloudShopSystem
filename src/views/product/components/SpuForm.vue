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
          <el-option
            v-for="tm in trademarkList"
            :key="tm.id"
            :label="tm.tmName"
            :value="tm.id"
          >
          </el-option>
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
          :file-list="spuImageList"
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

        <el-table :data="spuForm.spuSaleAttrList" border style="margin: 20px 0">
          <el-table-column
            width="80"
            label="序号"
            type="index"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="saleAttrName"
            label="属性名"
            width="150"
          ></el-table-column>
          <el-table-column label="属性值名称列表">
            <template slot-scope="{ row, $index }">
              <!-- disable-transitions禁用过度 -->
              <!-- @close="handleClose(tag)" 删除tag的回调-->
              <el-tag
                :key="spuSalseAttrValue.id"
                closable
                :disable-transitions="false"
                v-for="(spuSalseAttrValue, index) in row.spuSaleAttrValueList"
              >
                {{ spuSalseAttrValue.salseAttrValueName }}
              </el-tag>
              <!-- 
                1.row.inputVisible是代表是否是编辑模式，我们这次是吧这个值定义到属性身上
                之前的平台属性是吧这个值定义在属性值身上
                因为现在我们每个属性当中所有的属性值都不能有自己的编辑模式和查看模式，
                而是每个属性有一个之前我们是每个属性都有自己的编辑模式和查看模式
                2.v-model="row.inputValue",代表输入input后，输入的数据收集到哪里，我们先把收集的数据保存到当前属性上，
                后面失去交点或者回车的时候，再从当前属性身上去拿
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              -->

              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
              >
              </el-input>
              <!--  @click="showInput"点击转换成编辑模式 -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput"
                >+ 添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button type="danger" size="mini" @click="">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" size="default">保存</el-button>
        <el-button size="default" @click="$emit('update:visible', false)"
          >取消</el-button
        >
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

      //添加tag
      inputVisible: true,
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
          spuSaleAttrList: [
            {
              id: 0,
              saleAttrName: "颜色",
              spuSaleAttrValueList: [
                {
                  id: 0,
                  salseAttrValueName: "红色",
                },
                {
                  id: 1,
                  salseAttrValueName: "白色",
                },
                {
                  id: 2,
                  salseAttrValueName: "绿色色",
                },
              ],
            },
            {
              id: 1,
              saleAttrName: "内存",
              spuSaleAttrValueList: [
                {
                  id: 0,
                  salseAttrValueName: "16G",
                },
                {
                  id: 1,
                  salseAttrValueName: "64G",
                },
                {
                  id: 2,
                  salseAttrValueName: "128G",
                },
              ],
            },
          ],
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
            imageName: "test",
            name: "testPng",
            imageUrl:
              "../../../../public/images/86a26cfbe2cfe7e8192435fa89f0eca.jpg",
            url: "../../../../public/images/86a26cfbe2cfe7e8192435fa89f0eca.jpg",
          },
        ];
      }
      // 获取spu的品牌数据
      try {
        const trademarkList = await this.$API.trademark.getList();
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
      } catch (error) {
        alert("报错了");
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

        console.log(this.trademarkList);
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
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>