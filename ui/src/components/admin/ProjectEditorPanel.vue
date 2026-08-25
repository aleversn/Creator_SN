<template>
	<fv-panel
		:model-value="modelValue"
		theme="light"
		:title="editing ? local('Edit project') : local('Add project')"
		width="min(760px, calc(100vw - 32px))"
		height="min(760px, calc(100vh - 32px))"
		background="rgba(255,255,255,.96)"
		:is-central-side="true"
		:is-acrylic="true"
		:is-footer="true"
		@update:model-value="$emit('update:modelValue', $event)"
	>
		<template #container>
			<div class="project-form">
				<span class="form-field">
					{{ local("Name") }}
					<fv-text-box v-model="form.name" v-bind="fieldProps" />
				</span>
				<span class="form-field">
					{{ local("Description") }}
					<fv-text-box v-model="form.info" v-bind="fieldProps" />
				</span>
				<span class="form-field">
					{{ local("Repository type") }}
					<fv-text-box v-model="form.repo_type" v-bind="fieldProps" />
				</span>
				<span class="form-field">
					{{ local("Project URL") }}
					<fv-text-box v-model="form.href" v-bind="fieldProps" />
				</span>
				<span class="form-field">
					{{ local("Audit status") }}
					<fv-combobox
						v-model="auditSelection"
						:options="auditOptions"
						v-bind="fieldProps"
						@choose-item="$emit('select-audit', $event)"
					/>
				</span>
				<span class="check-field">
					<fv-check-box v-model="form.favor" :theme="theme" :background="color">
						{{ local("Featured project") }}
					</fv-check-box>
				</span>
				<span class="form-field">
					{{ local("Project icon") }}
					<input
						ref="iconInput"
						v-show="false"
						type="file"
						accept="image/*"
						@change="$emit('choose-icon', $event)"
					/>
					<fv-button
						theme="light"
						border-radius="9"
						style="width: 150px"
						@click="$refs.iconInput.click()"
					>
						{{ iconFileName || local("Select image") }}
					</fv-button>
				</span>
			</div>
		</template>
		<template #footer>
			<fv-button
				theme="dark"
				:background="gradient"
				border-radius="8"
				:disabled="saving"
				@click="$emit('save')"
			>
				{{ saving ? local("Saving…") : local("Save project") }}
			</fv-button>
			<fv-button
				:theme="theme"
				border-radius="8"
				:disabled="saving"
				style="margin-left: 6px"
				@click="$emit('update:modelValue', false)"
			>
				{{ local("Cancel") }}
			</fv-button>
		</template>
	</fv-panel>
</template>

<script>
import { useAppStore } from "@/store";
import { useTheme } from "@/stores/useTheme";
import { mapState } from "pinia";

export default {
	name: "ProjectEditorPanel",
	props: {
		modelValue: { type: Boolean, default: false },
		form: { type: Object, required: true },
		editing: { type: Boolean, default: false },
		saving: { type: Boolean, default: false },
		iconFileName: { type: String, default: "" },
		auditOptions: { type: Array, default: () => [] },
		auditOption: { type: Object, default: null },
	},
	computed: {
		...mapState(useTheme, ["theme", "color", "gradient"]),
		fieldProps() {
			return {
				background: "rgba(255,255,255,.72)",
				borderColor: "#e1d8ee",
				borderWidth: 1,
				borderRadius: 10,
				revealBorder: true,
				isBoxShadow: true,
				theme: "light",
			};
		},
		auditSelection: {
			get() {
				return this.auditOption;
			},
			set(option) {
				this.$emit("select-audit", option);
			},
		},
	},
	methods: {
		local(text, params) {
			return useAppStore().local(text, params);
		},
	},
};
</script>

<style scoped lang="scss">
.project-form {
	display: grid;
	gap: 15px;
	padding: 20px;
}
.form-field {
	display: grid;
	gap: 7px;
	color: #5d5570;
	font-size: 13px;
	font-weight: 700;
}
.check-field {
	display: flex;
	gap: 8px;
	align-items: center;
	color: #5d5570;
	font-weight: 700;
}
</style>
