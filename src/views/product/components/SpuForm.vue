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
          :on-success="handleSuccess"
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
          v-model="spuSaleAttrIdName"
          :placeholder="
            unUseSpuSalseAttrList.length > 0
              ? `还有${unUseSpuSalseAttrList.length}未选则`
              : '无选项可选'
          "
        >
          <!-- 
          这里是先获取到总的销售属性，通过数组过滤，将已有的销售属性过滤掉
         -->
          <el-option
            :key="unUseSpuSalseAttr.id"
            v-for="(unUseSpuSalseAttr, index) in unUseSpuSalseAttrList"
            :value="`${unUseSpuSalseAttr.id}:${unUseSpuSalseAttr.saleAttrName}`"
            :label="unUseSpuSalseAttr.saleAttrName"
          >
          </el-option>
        </el-select>
        <el-button
          @click="addSalseAttr"
          type="primary"
          size="default"
          icon="el-icon-plus"
          :disabled="!spuSaleAttrIdName"
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
                @close="row.spuSaleAttrValueList.splice(index, 1)"
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
                placeholder="输入属性"
              >
              </el-input>
              <!--  @click="showInput"点击转换成编辑模式 -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row, $index)"
                >+ 添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                size="mini"
                @click="spuForm.spuSaleAttrList.splice($index, 1)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" size="default" @click="save">保存</el-button>
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
        spuSaleAttrList: {},
      },

      category3Id: "",

      dialogImageUrl: "",
      dialogVisible: false,

      //
      spuSaleAttrIdName: "",

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
    // 保存操作
    async save() {
      // 获取收集的参数数据
      let { spuForm, spuImageList, category3Id } = this;
      // 整理参数，图片的格式
      spuForm.spuImageList = spuImageList.map((item) => {
        return {
          imageName: item.name,
          imageUrl: item.imageUrl || item.response.data,
        };
      });

      // 整理收集category3Id
      spuForm.category3Id = category3Id;

      // 整理删除属性当中的inputVisible和inputValue
      spuForm.spuSaleAttrList.forEach((item) => {
        delete item.inputVisible;
        delete item.inputValue;
      });

      // 发请求
      try {
        await this.$API.spu.addUpdata(spuForm);
        // 提示成功
        this.$message.success("保存成功")
        // 返回列表页
        $emit('update:visible', false)
        // 通知父组件，父组件需要做一些事情，重新请求数据
        this.$emit('successBack')
        // 清空当前组件里面的数据全部清掉
        this.resetData()
      } catch (error) {
        this.$message.error("保存失败")
      }
      // 成功
      // 失败
    },

    // 清空data的数据
    resetData(){
       this.spuForm = {
        spuName: "",
        category3Id: "",
        description: "",
        tmId: "",
        spuImageList: [],
        spuSaleAttrList: {},
      }
      this.category3Id = ""
      this.dialogImageUrl = ""
      this.dialogVisible = false
      this.spuSaleAttrIdName = ""
      this.spuImageList = []
      this.trademarkList = []
      this.baseSalseAttrList = []
      this.inputVisible = true
    },

    /**
     * tag事件
     */
    // handleClose(tag) {
    //   this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    // },

    // 点击tag添加按钮
    showInput(row, index) {
      // 显示当前行的input
      this.$set(row, "inputVisible", true);
      // 自动获取焦点
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },

    // 点击添加销售属性
    addSalseAttr() {
      // 把刚才收集到的数据构造成目标对象，把这个对象添加到指定的位置spuForm.
      // {baseAttrId: 0, salseAttrName: "", spuSaleAttrValueList: []}
      let [baseAttrId, salseAttrName] = this.spuSaleAttrIdName.split(":");
      let obj = {
        baseAttrId,
        salseAttrName,
        spuSaleAttrValueList: [],
      };

      this.spuForm.spuSaleAttrList.push(obj);
      // 清空select
      this.spuSaleAttrIdName = "";
    },
    // 照片墙上传的两个函数
    // 删除图片成功的回调
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      // 删除成功之后，还剩多少图片就放在filesList上面
      this.spuImageList = fileList;
    },
    // 预览大图
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    /**
     * 图片上传成功的列表
     * response:上传成功的响应
     * file上传成功的那张图片的文件
     * filesList照片墙的所有图片信息,包含了我们自己加上去的name和url
     */
    handleSuccess(response, file, filesList) {
      this.spuImageList = filesList;
    },

    // 请求获取初始化
    async initUpdataSpuFormData(spu) {
      this.category3Id = spu.category3Id;
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
            saleAttrName: "颜色",
          },
          {
            id: 1,
            saleAttrName: "内存",
          },
          {
            id: 2,
            saleAttrName: "款式",
          },
          {
            id: 3,
            saleAttrName: "品牌",
          },
          {
            id: 4,
            saleAttrName: "尺寸",
          },
        ];
      }
    },

    //
    async initAddSpuFormData(category3Id) {
      this.category3Id = category3Id;
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

  computed: {
    // 未使用的销售属性,总的销售属性去掉自己已有的销售属性
    // unUseSpuSalseAttrList(){
    //   // 从所有的销售属性列表中去过滤，过滤出销售属性名称和自己的销售属性列表当中的每一个销售属性都不想同的
    //   return this.baseSalseAttrList.filter((baseSalseAttr, index) => {
    //     // 从baseSalseAttr拿一项，就要和自己已有的数组每个去对比，如果不相等就拿走，相等就不要
    //     return this.spuForm.spuSaleAttrList.every(spuSalseAttr => {
    //       return baseSalseAttr.saleAttrName !== spuSalseAttr.saleAttrName
    //     })
    //   })
    // }

    // 简写
    unUseSpuSalseAttrList() {
      // 从所有的销售属性列表中去过滤，过滤出销售属性名称和自己的销售属性列表当中的每一个销售属性都不想同的
      return this.baseSalseAttrList.filter((baseSalseAttr, index) =>
        // 从baseSalseAttr拿一项，就要和自己已有的数组每个去对比，如果不相等就拿走，相等就不要
        this.spuForm.spuSaleAttrList.every(
          (spuSalseAttr) =>
            baseSalseAttr.saleAttrName !== spuSalseAttr.saleAttrName
        )
      );
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