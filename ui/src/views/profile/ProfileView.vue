<template>
	<main class="profile-page">
		<header class="profile-top">
			<router-link to="/" class="brand"
				><img src="@/assets/logo/logo.png" :alt="local('Creator SN')" />
				{{ local("Creator SN") }}</router-link
			>
			<div class="profile-actions">
				<fv-button
					theme="dark"
					:background="heroGradient"
					:revealBackgroundGradientList="[
						'rgba(255, 213, 188, 0.68)',
						'rgba(255, 213, 188, 0.18)',
						'rgba(143, 97, 231, 0.12)',
					]"
					border-radius="20"
					font-size="12"
                    font-weight="bold"
					style="width: 80px"
					@click="$Go('/admin/users')"
					>{{ local("Console") }}</fv-button
				>
				<button class="logout" @click="logout">
					{{ local("Sign out") }}
				</button>
			</div>
		</header>
		<section class="profile-shell">
			<div class="profile-title">
				<span class="eyebrow">YOUR CREATOR SPACE</span>
				<h1>{{ local("Profile") }}</h1>
				<p>
					{{
						local(
							"Manage your identity, avatar, and account security.",
						)
					}}
				</p>
			</div>
			<div class="profile-card">
				<div class="profile-card-head">
					<div>
						<h2>{{ info.name || info.userid }}</h2>
						<p>
							{{ info.email || local("No email added") }} ·
							{{ info.role || "user" }}
						</p>
					</div>
					<img
						:src="avatar"
						:alt="local('Current avatar')"
						class="avatar"
					/>
				</div>
				<div class="profile-grid">
					<span class="profile-field"
						>{{ local("Nickname")
						}}<fv-text-box
							v-model="form.name"
							class="profile-input"
							theme="light"
							background="rgba(255,255,255,.72)"
							border-color="rgba(241, 222, 252, 0.3)"
							:focus-border-color="'rgba(243, 181, 89, 1)'"
							:border-width="2"
							:border-radius="12"
							:reveal-border="true"
							:is-box-shadow="true"
					/></span>
					<span class="profile-field"
						>{{ local("Email")
						}}<fv-text-box
							v-model="form.email"
							class="profile-input"
							type="email"
							theme="light"
							background="rgba(255,255,255,.72)"
							border-color="rgba(241, 222, 252, 0.3)"
							:focus-border-color="'rgba(243, 181, 89, 1)'"
							:border-width="2"
							:border-radius="12"
							:reveal-border="true"
							:is-box-shadow="true"
					/></span>
					<span class="profile-field"
						>{{ local("Phone")
						}}<fv-text-box
							v-model="form.phone"
							class="profile-input"
							theme="light"
							background="rgba(255,255,255,.72)"
							border-color="rgba(241, 222, 252, 0.3)"
							:focus-border-color="'rgba(243, 181, 89, 1)'"
							:border-width="2"
							:border-radius="12"
							:reveal-border="true"
							:is-box-shadow="true"
					/></span>
					<span class="profile-field"
						>{{ local("Gender")
						}}<fv-combobox
							v-model="genderOption"
							class="profile-input"
							theme="light"
							:options="genderOptions"
							:placeholder="local('Not set')"
							background="rgba(255,255,255,.72)"
							border-color="rgba(241, 222, 252, 0.3)"
							choosenSliderBackground="rgba(163, 121, 225, 1)"
							:border-width="2"
							:border-radius="12"
							:reveal-border="true"
							:is-box-shadow="true"
					/></span>
				</div>
				<div class="section">
					<h3>{{ local("Change avatar") }}</h3>
					<AvatarUploader @update:file="avatarFile = $event" />
					<fv-button
						border-color="#d7b8eb"
						background="#f8ecff"
						foreground="#784ca5"
						:disabled="!avatarFile || savingAvatar"
						font-size="16"
						border-radius="12"
						font-weight="bold"
						style="width: 120px; height: 45px; margin-top: 10px"
						@click="uploadAvatar"
					>
						{{
							savingAvatar
								? local("Uploading…")
								: local("Save avatar")
						}}
					</fv-button>
				</div>
				<div class="section">
					<h3>{{ local("Account details") }}</h3>
					<fv-button
						theme="dark"
						:background="heroGradient"
						foreground="#ffffff"
						border-color="#efb2e7"
						:reveal-border-gradient-list="buttonGradient"
						:revealBackgroundGradientList="[
							'rgba(255, 213, 188, 0.38)',
							'rgba(255, 213, 188, 0.18)',
							'rgba(143, 97, 231, 0.12)',
						]"
						:border-radius="12"
						:is-box-shadow="true"
						:reveal-border-color="true"
						:disabled="saving"
						style="min-width: 120px; height: 40px; font-size: 15px"
						@click="saveProfile"
					>
						{{ saving ? local("Saving…") : local("Save details") }}
					</fv-button>
				</div>
				<div class="section password">
					<h3>{{ local("Change password") }}</h3>
					<div class="profile-grid">
						<span class="profile-field"
							>{{ local("Current password")
							}}<fv-text-box
								v-model="password.pwd"
								class="profile-input"
								type="password"
								theme="light"
								background="rgba(255,255,255,.72)"
								border-color="rgba(241, 222, 252, 0.3)"
								:focus-border-color="'rgba(243, 181, 89, 1)'"
								:border-width="2"
								:border-radius="12"
								:reveal-border="true"
								:is-box-shadow="true" /></span
						><span class="profile-field"
							>{{ local("New password")
							}}<fv-text-box
								v-model="password.confirm_pwd"
								class="profile-input"
								type="password"
								theme="light"
								background="rgba(255,255,255,.72)"
								border-color="rgba(241, 222, 252, 0.3)"
								:focus-border-color="'rgba(243, 181, 89, 1)'"
								:border-width="2"
								:border-radius="12"
								:reveal-border="true"
								:is-box-shadow="true"
						/></span>
					</div>
					<button
						class="soft-button"
						:disabled="savingPassword"
						@click="changePassword"
					>
						{{ local("Update password") }}
					</button>
				</div>
				<p v-if="message" class="message">{{ message }}</p>
			</div>
		</section>
	</main>
</template>
<script setup>
import { computed, reactive, ref, onMounted, watch } from "vue";
import { UserApi } from "@/api";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/useUser";
import { useAppStore } from "@/store";
import { useTheme } from "@/stores/useTheme";
import AvatarUploader from "@/components/auth/AvatarUploader.vue";
const router = useRouter(),
	user = useUserStore(),
	info = computed(() => user.info),
	avatar = computed(() => user.avatar),
	isAdmin = computed(() =>
		String(info.value.role || "")
			.split(",")
			.includes("admin"),
	),
	form = reactive({ name: "", email: "", phone: "", gender: "" }),
	password = reactive({ pwd: "", confirm_pwd: "" }),
	avatarFile = ref(null),
	saving = ref(false),
	savingAvatar = ref(false),
	savingPassword = ref(false),
	message = ref(""),
	themeStore = useTheme(),
	heroGradient = computed(() => themeStore.heroGradient);
const local = useAppStore().local;
const genderOptions = computed(() => [
	{ key: "", value: "", text: local("Not set") },
	{ key: "male", value: "male", text: local("Male") },
	{ key: "female", value: "female", text: local("Female") },
	{ key: "other", value: "other", text: local("Other") },
]);
const genderOption = ref(genderOptions.value[0]);
watch(genderOption, (option) => {
	form.gender = option?.value || "";
});
onMounted(async () => {
	await user.loadMe().catch(() => {});
	Object.assign(form, {
		name: info.value.name || "",
		email: info.value.email || "",
		phone: info.value.phone || "",
		gender: info.value.gender || "",
	});
	genderOption.value =
		genderOptions.value.find((option) => option.value === form.gender) ||
		genderOptions.value[0];
});
async function saveProfile() {
	saving.value = true;
	try {
		const result = await UserApi.updateMe(form);
		if (result.code !== 200) throw new Error(result.message);
		Object.assign(user.info, result.data);
		message.value = local("Profile saved");
	} catch (e) {
		message.value = e.message || local("Save failed");
	} finally {
		saving.value = false;
	}
}
async function uploadAvatar() {
	savingAvatar.value = true;
	try {
		const result = await UserApi.uploadAvatar(avatarFile.value);
		if (result.code !== 200) throw new Error(result.message);
		await user.loadAvatar();
		avatarFile.value = null;
		message.value = local("Avatar updated");
	} catch (e) {
		message.value = e.message || local("Avatar upload failed");
	} finally {
		savingAvatar.value = false;
	}
}
async function changePassword() {
	if (!password.pwd || !password.confirm_pwd) {
		message.value = local("Please fill in both passwords");
		return;
	}
	savingPassword.value = true;
	try {
		const result = await UserApi.updatePassword(password);
		if (result.code !== 200) throw new Error(result.message);
		password.pwd = "";
		password.confirm_pwd = "";
		message.value = local("Password updated");
	} catch (e) {
		message.value = e.message || local("Password update failed");
	} finally {
		savingPassword.value = false;
	}
}
function logout() {
	user.logout();
	router.push("/");
}
</script>
<style scoped lang="scss">
.profile-page {
	min-height: 100vh;
	background: linear-gradient(145deg, #fbf9ff, #f2edff 52%, #edfaff);
	color: #201a37;
	font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
}
.profile-top {
	width: min(1120px, calc(100% - 40px));
	margin: auto;
	padding: 25px 0;
	display: flex;
	justify-content: space-between;
}
.brand {
	display: flex;
	align-items: center;
	gap: 10px;
	color: #201a37;
	text-decoration: none;
	font-weight: 800;
}
.brand img {
	width: 30px;
	height: 30px;
	object-fit: contain;
}
.profile-actions {
	@include Vcenter;

	gap: 5px;
}
.logout {
	border: 0;
	background: transparent;
	color: #825cab;
	cursor: pointer;
	font: inherit;
}
.profile-shell {
	width: min(880px, calc(100% - 40px));
	margin: auto;
	padding: 55px 0;
}
.eyebrow {
	font-size: 11px;
	color: #ad62b8;
	letter-spacing: 0.18em;
	font-weight: 800;
}
.profile-title h1 {
	font-size: 48px;
	margin: 12px 0 4px;
}
.profile-title p {
	color: #77708a;
}
.profile-card {
	margin-top: 28px;
	padding: 30px;
	border: 1px solid #fff;
	border-radius: 25px;
	background: rgba(255, 255, 255, 0.72);
	box-shadow: 0 25px 70px rgba(123, 82, 174, 0.14);
	backdrop-filter: blur(25px);
}
.profile-card-head {
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid #eee7f6;
	padding-bottom: 24px;
}
.profile-card-head h2 {
	margin: 0 0 6px;
}
.profile-card-head p {
	margin: 0;
	color: #77708a;
}
.avatar {
	width: 78px;
	height: 78px;
	border-radius: 50%;
	object-fit: cover;
}
.profile-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;
	margin-top: 24px;
}
.profile-input {
	width: 100%;
	min-height: 44px;
}
.profile-field {
	display: grid;
	gap: 7px;
	color: #5d5570;
	font-size: 13px;
	font-weight: 700;
}
input,
select {
	padding: 11px;
	border: 1px solid rgba(243, 181, 89, 1);
	border-radius: 11px;
	background: #fffafc;
	font: inherit;
	color: #2d2640;
}
.section {
	margin-top: 28px;
	padding-top: 24px;
	border-top: 1px solid #eee7f6;
}
.section h3 {
	margin: 0 0 16px;
}
.soft-button,
.primary-button {
	margin-top: 16px;
	padding: 11px 17px;
	border-radius: 11px;
	cursor: pointer;
	font: inherit;
	font-weight: 700;
}
.soft-button {
	border: 1px solid #d7b8eb;
	background: #f8ecff;
	color: #784ca5;
}
.primary-button {
	border: 0;
	background: linear-gradient(120deg, #9c69d7, #e27bc7);
	color: white;
}
.message {
	color: #4d9278;
	font-size: 13px;
}
.password {
	padding-bottom: 10px;
}
@media (max-width: 640px) {
	.profile-shell {
		padding-top: 30px;
	}
	.profile-title h1 {
		font-size: 38px;
	}
	.profile-grid {
		grid-template-columns: 1fr;
	}
	.profile-card {
		padding: 22px;
	}
}
</style>
