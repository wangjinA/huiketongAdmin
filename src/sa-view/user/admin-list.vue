<template>
	<div class="vue-box">
		<div class="c-panel">
			<!-- 参数栏 -->
			<div class="c-title">用户列表</div>
			<el-form :inline="true" size="mini">
				<el-form-item label="用户名：">
					<el-input v-model="p.username" placeholder="模糊查询"></el-input>
				</el-form-item>
				<br />
			</el-form>
			<!-- <div class="c-title">数据列表</div> -->
			<el-table :data="dataList" >
				<el-table-column label="用户名" prop="username"></el-table-column>
				<el-table-column prop="address" label="操作">
					<template slot-scope="s">
						<el-button class="c-btn" type="danger"  icon="el-icon-delete" @click="del(s.row)">删除</el-button>
						<el-button class="c-btn" type="success"  icon="el-icon-view" @click="get(s.row)">查看密码</el-button>
					</template>
				</el-table-column>
				<!-- <el-table-column prop="address" label="操作">
					<template slot-scope="s">
						<el-button class="c-btn" type="success"  icon="el-icon-view" @click="get(s.row)">详情</el-button>
						<el-button class="c-btn" type="danger" icon="el-icon-delete" @click="del(s.row)">删除</el-button>
					</template>
				</el-table-column> -->
			</el-table>
			<!-- 分页 -->
			<div class="page-box">
				<el-pagination background
					layout="total, prev, pager, next, sizes, jumper" 
					:current-page.sync="p.pageNo" 
					:page-size.sync="p.pageSize" 
					:total="p.dataCount"
					:page-sizes="[1, 10, 20, 30, 40, 50, 100]" 
					@current-change="f5(true)" 
					@size-change="f5(true)">
				</el-pagination>
			</div>
		</div>
		<div class="c-panel">
			<div class="c-title">用户添加</div>
			<el-form size="mini" v-if="m">
				<el-form-item label="用户名：">
					<el-input v-model="m.username"></el-input>
				</el-form-item>
				<el-form-item label="密码：">
					<el-input v-model="m.password"></el-input>
				</el-form-item>
				<el-form-item>
					<span class="c-label">&emsp;</span>
					<el-button type="primary" icon="el-icon-plus" size="mini" @click="addUser">确定</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				p: {	// 查询参数 
					username: '',
					create_type: 0,
					sort_type: 1,
					start_time: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-1',	// 本月一号 
					end_time: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),	// 本月当日 
					pageNo: 1,
					pageSize: 10,
				dataCount: 0,
				},
				dataList: [],
				m: {	
					username:'',	// 从菜单配置文件里传递过来的参数 
					password: '',
				}
			}
		},
		methods: {
			// 数据刷新
			f5() {
				this.$get('/system/selectPage', {
					params: {
						current: this.p.pageNo,
						pageSize: this.p.pageSize
					}
				}).then(res => {
					this.dataList = res.data.data.list
        this.p.dataCount = res.data.data.total;
				})
			},
			// 删除
			del(data) {
				this.sa.confirm('是否删除，此操作不可撤销', ()=> {
					this.$get('/system/delete', {
						params: {
							id: data.id
						}
					}).then(() => {
						this.sa.ok('删除成功');
						this.f5()
					}).catch(()=>{
					this.sa.alert('删除失败');
					})
				});
			},
			// 查看
			get: function(data) {
				var str = '<div>';
				str += '<p>密码：' + data.password + '</p>';
				this.sa.alert(str);
			},
			addUser() {
				if (this.m.username == "" || this.m.password == "") {
					return this.sa.error2("请输入完整");
				}
				this.$post('/system/inset', {
					username: this.m.username,
					password: this.m.password,
				}).then(() =>{
					this.sa.ok('添加成功');
					this.m.username = ''
					this.m.password = ''
					this.f5()
				}).catch(()=>{
					this.sa.alert('添加失败');
				})
			}
		},
		created(){
			console.log(1);
			console.log(this);
			this.f5();
		}
	}
</script>

<style>
</style>
