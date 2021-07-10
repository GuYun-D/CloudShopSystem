<template>
  <div class="trademark-container">
    <el-button type="primary" icon="el-plus">添加</el-button>

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
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="row, $index">
          <el-button icon="el-icon-edit" type="warning">修改</el-button>
          <el-button icon="el-icon-delete" type="danger">删除</el-button>
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
    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <!-- 
        el-form用来专门收集数据的 
        一般都会有一个属性:model="form"，指定收集的数据最后收集到那，是一个对象
        -->
      <el-form :model="tradeMarkForm">
        <!-- 
          el-form-item有几项数据就有几个
          label：该项表单标题
          :label-width：表单标题的名称
         -->
        <el-form-item
          style="width: 80%"
          label="品牌名称"
          :label-width="formLabelWidth"
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
        >
          <!-- 
            el-upload
           -->
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus el-upload avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "trademark",
  data() {
    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0,
      // 控制对话框的显示与隐藏
      dialogFormVisible: true,
      // 表单收集
      tradeMarkForm: {
        tradeName: "",
      },
      // 标题的宽度
      formLabelWidth: "100px",

      // 图片路径
      imageUrl: "",
    };
  },
  mounted() {
    this.getTrademarkList();
  },

  methods: {
    // 两个上传相关的函数
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
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
            logoUrl: "/images/63c9a9bccd10201ac7edfe01679cbe6.jpg",
            tradeName: "华为",
          },
          {
            id: 2,
            logoUrl: "/images/86a26cfbe2cfe7e8192435fa89f0eca.jpg",
            tradeName: "OPPO",
          },
          {
            id: 3,
            logoUrl: "/images/a49532e33ebe047b19472dea94cc4a0.jpg",
            tradeName: "苹果",
          },
          {
            id: 4,
            logoUrl: "/images/a6a1724abf948e4257583c99f6b883d.jpg",
            tradeName: "小米",
          },
          {
            id: 5,
            logoUrl: "/images/bc821d5fecdade2a4a97eab252ec2c3.jpg",
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