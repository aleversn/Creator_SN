<template>
  <div class="resumes-page">
    <div class="page-header"><div><span class="eyebrow">CREATOR SN CONTROL ROOM</span><h1>{{ local("Resume Management") }}</h1><p>{{ local("Create, edit, and bind member resumes.") }}</p></div><fv-button theme="dark" :background="gradient" border-radius="8" @click="openCreate">{{ local("Add resume") }}</fv-button></div>
    <div class="list-card"><fv-details-list v-model="resumes" :theme="theme" :head="localizedHead" :foreground="color" style="width:100%;height:100%"><template #column_0="x"><span>{{ x.item.user?.name || x.item.userid || local("Unbound resume") }}</span></template><template #column_1="x"><span class="muted">{{ x.item.userid || local("Unbound") }}</span></template><template #column_2="x"><span class="muted">{{ x.item.user?.email || "—" }}</span></template><template #column_3="x"><span class="muted">{{ formatDate(x.item.updated_at) }}</span></template><template #column_4="x"><div class="actions"><fv-button theme="light" border-radius="6" @click="openEdit(x.item)">{{ local("Edit") }}</fv-button><fv-button theme="light" border-radius="6" @click="remove(x.item)">{{ local("Delete") }}</fv-button></div></template></fv-details-list></div>
    <fv-panel v-model="visible" theme="light" :title="editing ? local('Edit resume') : local('Add resume')" width="min(900px, calc(100vw - 32px))" height="min(780px, calc(100vh - 32px))" background="rgba(255,255,255,.96)" :is-central-side="true" :is-acrylic="true" :is-footer="true">
      <template #container><div class="editor-panel"><label>{{ local("Bind user") }}<select v-model="form.userid"><option value="">{{ local("Unbound resume") }}</option><option v-for="user in users" :key="user.userid" :value="user.userid">{{ user.name || user.userid }} · {{ user.userid }}</option></select></label><power-editor :value="form.introduction" :toolbar-height="56" editor-background="transparent" editor-out-side-background="transparent" @save-json="saveContent"></power-editor><p class="hint">{{ local("Basic information comes from the bound user's profile.") }}</p></div></template>
      <template #footer><fv-button theme="dark" :background="gradient" border-radius="8" :disabled="saving" @click="save">{{ saving ? local("Saving…") : local("Save resume") }}</fv-button></template>
    </fv-panel>
  </div>
</template>
<script>
import { ResumeApi, UserApi } from "@/api";
import { useAppStore } from "@/store";
export default {
  name: "AdminResumesView",
  data() { return { theme: "light", color: "#a56bd1", gradient: "linear-gradient(120deg,#a36cda,#dc7bc9)", resumes: [], users: [], visible: false, editing: false, saving: false, form: { id: null, userid: "", introduction: { type: "doc", content: [] } }, head: [{ content: "Member", width: 230 }, { content: "Bound user", width: 220 }, { content: "Email", width: 250 }, { content: "Updated", width: 190 }, { content: "Actions", width: 170 }] }; },
  mounted() { this.load(); this.loadUsers(); },
  computed: {
    localizedHead() { return this.head.map((item) => ({ ...item, content: this.local(item.content) })); }
  },
  methods: {
    local(text, params) { return useAppStore().local(text, params); },
    async load() { const result = await ResumeApi.list(); if (result.code === 200) this.resumes = result.data || []; },
    async loadUsers() { const result = await UserApi.list(undefined, 0, 9999); if (result.code === 200) this.users = result.data || []; },
    openCreate() { this.editing = false; this.form = { id: null, userid: "", introduction: { type: "doc", content: [] } }; this.visible = true; },
    openEdit(item) { this.editing = true; this.form = { id: item.id, userid: item.userid || "", introduction: item.introduction || { type: "doc", content: [] } }; this.visible = true; },
    saveContent(content) { this.form.introduction = content; },
    async save() { this.saving = true; try { const result = await ResumeApi.save(this.form); if (result.code === 200) { this.visible = false; await this.load(); this.$barWarning(this.local("Resume saved"), { status: "correct", theme: this.theme }); } else this.$barWarning(result.message || this.local("Save failed"), { status: "error", theme: this.theme }); } finally { this.saving = false; } },
    async remove(item) { this.$infoBox(this.local("Delete this resume?"), { theme: this.theme, confirmTitle: this.local("Confirm"), cancelTitle: this.local("Cancel"), confirm: async () => { const result = await ResumeApi.remove(item.id); if (result.code === 200) await this.load(); } }); },
    formatDate(value) { return value ? new Date(value).toLocaleString("zh-CN", { dateStyle: "short", timeStyle: "short" }) : "—"; }
  }
};
</script>
<style scoped lang="scss">.resumes-page{position:relative;flex:1;min-width:0;height:100%;overflow:auto;padding:50px clamp(22px,5vw,76px) 30px;color:#241b38;font-family:"Segoe UI","Microsoft YaHei",sans-serif}.page-header{display:flex;align-items:end;justify-content:space-between;gap:20px}.eyebrow{font-size:11px;letter-spacing:.2em;color:#ae65bb;font-weight:800}.page-header h1{font-size:clamp(36px,4vw,56px);margin:12px 0 5px}.page-header p{margin:0;color:#766d87}.list-card{height:calc(100% - 180px);min-height:340px;margin-top:32px;overflow:hidden;border:1px solid rgba(255,255,255,.95);border-radius:18px;background:rgba(255,255,255,.72);box-shadow:0 20px 55px rgba(116,77,164,.11)}.actions{display:flex;gap:7px}.muted{color:#8f839a}.editor-panel{height:100%;display:flex;flex-direction:column;gap:16px;padding:20px}.editor-panel label{display:grid;gap:7px;color:#5d5570;font-size:13px;font-weight:700}.editor-panel select{padding:11px;border:1px solid #e1d8ee;border-radius:10px;background:#fffafc;font:inherit}.editor-panel power-editor{min-height:500px;flex:1}.hint{margin:0;color:#978ba3;font-size:12px}</style>
