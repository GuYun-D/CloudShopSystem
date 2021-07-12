<template>
  <div class="trademark-container">
    <el-button type="primary" icon="el-plus" @click="showAddDialog"
      >添加</el-button
    >

    <!-- 
      data: Array 
      实际上是给每一列都传入了一份data，
      使用作用插槽,每一个列都有展示数据的功能，展示哪一个属性的数据，通过prop传递进去
      每个列在展示数据时，都留有作用域插槽，如果要修改列的结构，就需要作用域插槽
    -->
    <el-table :data="trademarkList" border style="width: 100%; margin: 20px 0">
      <el-table-column label="序号" type="index" align="center" width="80">
      </el-table-column>
      <el-table-column prop="tradeName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column label="品牌logo" width="width">
        <!-- row代表品牌对象 -->
        <template slot-scope="row">
          <img :src="row.imageUrl" alt="" style="width: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="row">
          <el-button
            icon="el-icon-edit"
            type="warning"
            @click="showUpdataDialog(row)"
            >修改</el-button
          >
          <el-button
            icon="el-icon-delete"
            type="danger"
            @click="deleteTrademark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="getTrademarkList"
      @current-change="handleCurrentChange"
      style="text-align: center"
      layout="prev, pager, next, jumper, -> , sizes, total"
      :total="10"
    >
    </el-pagination>

    <!-- 添加和修改的对话框，带表单的对话框 -->
    <!-- 
      title：对话框的标题
      :visible.sync：控制对话框的显示与隐藏
     -->
    <el-dialog
      :title="tradeMarkForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- 
        el-form用来专门收集数据的 
        一般都会有一个属性:model="form"，指定收集的数据最后收集到那，是一个对象
        rules表单验证规则对象
        -->
      <el-form :model="tradeMarkForm" :rules="rules" ref="trademarkForm">
        <!-- 
          el-form-item有几项数据就有几个
          label：该项表单标题
          :label-width：表单标题的名称
         -->
        <el-form-item
          style="width: 80%"
          label="品牌名称"
          :label-width="formLabelWidth"
          prop="tradeName"
        >
          <!-- 
            el-input表单，收集到哪？el-form中的:model对象中
           -->
          <el-input
            v-model="tradeMarkForm.tradeName"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          style="width: 80%"
          label="品牌Logo"
          :label-width="formLabelWidth"
          prop="imageUrl"
        >
          <!-- 
            el-upload
            action: 图片的上传接口，上传地址,如果设置了代理就要写上代理，否则不成功
            :show-file-list：指定上传的是不是多个图片
            :on-success：上传成功的回调
            :before-upload：上传前的回调，这里是在判断图片的格式大小对不对
           -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="tradeMarkForm.imageUrl"
              :src="tradeMarkForm.imageUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus el-upload avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdata">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "trademark",
  data() {
    let validateTrademarkForm = (rule, value, callback) => {
      /**
       * rule在这里是占位的，自定义校验没用，主要看value和cb
       * value校验的数据
       * cb：代表校验成功还是失败的回调，如果传入的是错误对象，说明验证失败，不传，证明成功
       */
      if (value.length < 2 || value.length > 10) {
        callback(new Error("错了哦！！！长度必须是2~10之间"));
      } else {
        callback();
      }
    };

    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0,
      // 控制对话框的显示与隐藏
      dialogFormVisible: false,
      // 表单收集
      tradeMarkForm: {
        tradeName: "",
        // 图片路径
        imageUrl: "",
      },
      // 标题的宽度
      formLabelWidth: "100px",
      // 表单验证规则对象
      rules: {
        /**
         * 表单验证规则的名字要和表单里面的名字一样
         * 需要将改名字通过el-form-item标签的prop传进去
         触发时机：blur失去焦点；change输入框发生变化时；整体校验
         */
        tradeName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          // 自定义校验规则
          // validator: 校验函数。校验函数写在data()里面，不是return里面
          {
            validator: validateTrademarkForm,
            trigger: "blur",
          },
        ],
        imageUrl: [
          // upload必须是整体校验时才会触发，这里的trigger随便写
          { required: true, message: "请上传logo图片", trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    this.getTrademarkList();
  },

  methods: {
    // 删除操作
    deleteTrademark(row) {
      this.$confirm(
        "此操作将永久删除" + row.row.tradeName + ", 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        // 点击确定的逻辑
        .then(async () => {
          try {
            await this.$API.trademark.delete(row.row.id);
            this.$message.success("删除成功");
            /**
             * 回到当前页，如果当前页只有一个数据，删除之后返回到前一页，如果不止一条数据，回到当前页
             */
            this.getTrademarkList(
              this.trademarkList.length > 1 ? this.page : this.page - 1
            );
          } catch (error) {
            this.$message.error("删除失败");
          }
        })
        // 点击取消的逻辑
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    addOrUpdata() {
      // 表单先做整体校验
      this.$refs.trademarkForm.validate(async (valid) => {
        // 校验成功
        if (valid) {
          // 获取收集到的参数数据
          // 整理收集的参数数据
          // 发请求
          // 成功干啥
          // 失败干啥
          let trademark = this.tradeMarkForm;
          try {
            const result = await this.$API.trademark.addOrUpdata(trademark);
            this.$message.success(
              trademark.id ? "修改品牌成功" : "添加品牌成功"
            );
            this.dialogFormVisible = false;
            // 添加成功，默认展示第一页，修改成功默认展示当前页的数据
            this.getTrademarkList(trademark.id ? this.page : 1);
          } catch (error) {
            this.$message.success(
              trademark.id ? "修改品牌失败" : "添加品牌失败"
            );
          }
        } else {
          console.log("表单校验失败");
          return false;
        }
      });
    },

    // 点击修改按钮
    showUpdataDialog(row) {
      /**
       * 出现的问题，直接使用了this.tradeMarkForm = row.row
       * 修改所用的数据和外层表格的数据使用的是同一个数据，一旦对dialog表单数据进行修改，外层数据就跟着修改，即使点了取消，数据已经被修改了
       */
      this.dialogFormVisible = true;
      // this.tradeMarkForm = row.row
      // 拷贝数据
      this.tradeMarkForm = {
        ...row.row,
      };
    },
    // 点击添加按钮
    showAddDialog() {
      this.dialogFormVisible = true;
      this.tradeMarkForm = {
        tradeName: "",
        // 图片路径
        imageUrl: "",
      };
    },

    // 两个上传相关的函数
    handleAvatarSuccess(res, file) {
      // 上传成功之后，该路径是本地的路径，不是服务器的路径
      // this.tradeMarkForm.imageUrl = URL.createObjectURL(file.raw);
      /**
       * res：上传成功后的包含的服务器的路径
       * file：图片上传成功的文件信息
       */
      this.tradeMarkForm.imageUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const typeArr = ["image/jpeg", "image/png", "image/gif"];
      const isJPGOrPngOrGIF = typeArr.includes(file.type);

      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPGOrPngOrGIF) {
        this.$message.error("上传头像图片只能是 JPG,PNG,GIF 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }

      // 返回true才能上传
      return isJPG && isLt2M;
    },
    // 处理修改每页数量的回调
    handleCurrentChange(size) {
      this.limit = size;
      this.getTrademarkList();
    },

    // 发请求获取品牌的列表以及分页器的回调
    async getTrademarkList(page = 1) {
      try {
        this.page = page;
        const result = await this.$API.trademark.getPageList(
          this.page,
          this.limit
        );
        this.trademarkList = result.data.recoeds;
        this.total = result.data.total;
      } catch (error) {
        this.trademarkList = [
          {
            id: 1,
            imageUrl: "/images/63c9a9bccd10201ac7edfe01679cbe6.jpg",
            tradeName: "华为",
          },
          {
            id: 2,
            imageUrl: "/images/86a26cfbe2cfe7e8192435fa89f0eca.jpg",
            tradeName: "OPPO",
          },
          {
            id: 3,
            imageUrl: "/images/a49532e33ebe047b19472dea94cc4a0.jpg",
            tradeName: "苹果",
          },
          {
            id: 4,
            imageUrl: "/images/a6a1724abf948e4257583c99f6b883d.jpg",
            tradeName: "小米",
          },
          {
            id: 5,
            imageUrl: "/images/bc821d5fecdade2a4a97eab252ec2c3.jpg",
            tradeName: "魅族",
          },
        ];

        this.total = 5;
      }
    },
  },
};
</script>

<style scoped>
.trademark-container {
  margin: 20px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>