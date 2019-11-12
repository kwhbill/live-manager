<template>
  <el-dialog title="修改密码" v-model="isDlgShow">
    <el-form :model="formChangePswd" :rules="rulesPswd" ref="pswdForm">
      <el-form-item label="当前密码：" label-width=120 prop="old_password">
        <el-input type="password" v-model="formChangePswd.old_password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码：" label-width=120 prop="new_password">
        <el-input type="password" v-model="formChangePswd.new_password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="重新输入密码：" label-width=120 prop="new_password_confirm">
        <el-input type="password" v-model="formChangePswd.new_password_confirm" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hide">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>


<script>
import qs from "qs"
export default {
  props:{
    isShow:{
      type: Boolean,
      default: false
    }
  },
  data() {
    let rulesPswd = this.genRulesPswd()

    return {
      isDlgShow: false,
      formChangePswd: {
        'old_password': '',
        'new_password': '',
        'new_password_confirm': ''
      },
      rulesPswd
    }
  },
  watch:{
    isShow(v){
      this.isDlgShow = v
    },
    isDlgShow(v){
      this.$emit(v ? "show" : "hide")
    }
  },
  methods: {
    show(){
      this.isDlgShow = true
    },
    hide(){
      this.isDlgShow = false
    },
    submitForm() {
        let formName = "pswdForm"
        this.$refs[formName].validate(async (valid) => {
          if (valid && formName =='pswdForm') {
            await zj.net.ucapi({
                method: 'POST',
                url: 'user/update_password',
                data: qs.stringify(this.formChangePswd)
            }).then((res)=>{
                if(res.data.result==0){
                    this.$message({
                      message: '修改密码成功',
                      type: 'success'
                    });
                }
                else{
                    this.$message({
                      showClose: true,
                      message: '当前密码填写错误',
                      type: 'error'
                    })
                }
                this.hide()
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    genRulesPswd() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入旧密码'));
        }
        callback();
      };
      var validatePass1 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'));
        }
        callback();
      };
      var validateCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value != this.formChangePswd.new_password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      let rulesPswd = {
        old_password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        new_password: [
          { validator: validatePass1, trigger: 'blur' }
        ],
        new_password_confirm: [
          { validator: validateCheck, trigger: 'blur' }
        ]
      }

      return rulesPswd
    }
  }
}
</script>
