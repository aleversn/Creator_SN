<template>
	<fv-panel
		v-model="visible"
		theme="light"
		:title="editing ? local('Edit resume') : local('Add resume')"
		width="min(900px, calc(100vw - 32px))"
		height="min(780px, calc(100vh - 32px))"
		background="rgba(255,255,255,.96)"
		:is-central-side="true"
		:is-acrylic="true"
		:is-footer="true"
	>
		<template #container
			><div
				class="editor-panel"
				@paste.capture="handlePowerEditorPaste"
				@drop.capture="handlePowerEditorDrop"
			>
				<span class="bind-user-label"
					>{{ local("Bind user")
					}}<fv-combobox
						v-model="selectedUser"
						class="user-picker"
						theme="light"
						:options="userOptions"
						:placeholder="local('Unbound resume')"
						background="rgba(255,255,255,.72)"
						border-color="rgba(241, 222, 252, 0.3)"
						choosenSliderBackground="rgba(163, 121, 225, 1)"
						:reveal-border="true"
						:is-box-shadow="true"
						style="z-index: 9"
						@choose-item="$emit('choose-user', $event)" /></span
				><power-editor
					ref="editor"
					:model-value="editorValue(form.introduction)"
					:img-interceptor="imgInterceptor"
					editor-background="transparent"
					editor-out-side-background="transparent"
					@save-json="$emit('save-content', $event)"
					style="width: 100%"
				></power-editor>
				<p class="hint">
					{{
						local(
							"Basic information comes from the bound user's profile.",
						)
					}}
				</p>
			</div></template
		>
		<template #footer
			><fv-button
				theme="dark"
				:background="gradient"
				border-radius="8"
				:disabled="saving"
				style="width: 120px"
				@click="$emit('save')"
				>{{
					saving ? local("Saving…") : local("Save resume")
				}}</fv-button
			>
			<fv-button
				:theme="theme"
				border-radius="8"
				:disabled="saving"
				style="width: 120px; margin-left: 5px"
				@click="visible = false"
				>{{ local("Cancel") }}</fv-button
			>
		</template>
	</fv-panel>
</template>
<script>
import { useAppStore } from "@/store";
import {
	handlePowerEditorImageDrop,
	handlePowerEditorImagePaste,
} from "@/utils/powerEditorImageInterceptor";

export default {
	name: "ResumeEditorPanel",
	props: {
		modelValue: { type: Boolean, default: false },
		editing: { type: Boolean, default: false },
		saving: { type: Boolean, default: false },
		theme: { type: String, default: "light" },
		gradient: { type: String, default: "" },
		form: { type: Object, required: true },
		userOption: { type: Object, required: true },
		userOptions: { type: Array, default: () => [] },
		imgInterceptor: { type: Function, default: null },
	},
	emits: [
		"update:modelValue",
		"update:userOption",
		"choose-user",
		"save-content",
		"save",
	],
	computed: {
		visible: {
			get() {
				return this.modelValue;
			},
			set(value) {
				this.$emit("update:modelValue", value);
			},
		},
		selectedUser: {
			get() {
				return this.userOption;
			},
			set(value) {
				this.$emit("update:userOption", value);
			},
		},
	},
	methods: {
		handlePowerEditorPaste(event) {
			return handlePowerEditorImagePaste(
				event,
				() => this.$refs.editor,
				() => this.$emit("image-error"),
			);
		},
		handlePowerEditorDrop(event) {
			return handlePowerEditorImageDrop(
				event,
				() => this.$refs.editor,
				() => this.$emit("image-error"),
			);
		},
		local(text, params) {
			return useAppStore().local(text, params);
		},
		editorValue(content) {
			if (!content) return { type: "doc", content: [] };
			if (typeof content !== "string") return content;
			try {
				return JSON.parse(content);
			} catch (_) {
				return content;
			}
		},
	},
};
</script>
<style scoped lang="scss">
.editor-panel {
	height: 100%;
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 20px;
}
.editor-panel .bind-user-label {
	display: grid;
	gap: 7px;
	color: #5d5570;
	font-size: 13px;
	font-weight: 700;
}
.editor-panel .user-picker {
	width: 100%;
}
.editor-panel power-editor {
	min-height: 500px;
	flex: 1;
}
.hint {
	margin: 0;
	color: #978ba3;
	font-size: 12px;
}
</style>
