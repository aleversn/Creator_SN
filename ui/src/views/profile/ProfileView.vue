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
					border-radius="20"
					font-size="10"
					style="width: 80px"
					@click="$Go('/admin/users')"
					>{{ local("Admin console") }}</fv-button
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
					<label
						>{{ local("Nickname")
						}}<input v-model="form.name" /></label
					><label
						>{{ local("Email")
						}}<input v-model="form.email" type="email" /></label
					><label
						>{{ local("Phone")
						}}<input v-model="form.phone" /></label
					><label
						>{{ local("Gender")
						}}<select v-model="form.gender">
							<option value="">{{ local("Not set") }}</option>
							<option value="male">{{ local("Male") }}</option>
							<option value="female">
								{{ local("Female") }}
							</option>
							<option value="other">{{ local("Other") }}</option>
						</select></label
					>
				</div>
				<div class="section">
					<h3>{{ local("Change avatar") }}</h3>
					<AvatarUploader @update:file="avatarFile = $event" /><button
						class="soft-button"
						:disabled="!avatarFile || savingAvatar"
						@click="uploadAvatar"
					>
						{{
							savingAvatar
								? local("Uploading…")
								: local("Save avatar")
						}}
					</button>
				</div>
				<div class="section">
					<h3>{{ local("Account details") }}</h3>
					<button
						class="primary-button"
						:disabled="saving"
						@click="saveProfile"
					>
						{{ saving ? local("Saving…") : local("Save details") }}
					</button>
				</div>
				<div class="section password">
					<h3>{{ local("Change password") }}</h3>
					<div class="profile-grid">
						<label
							>{{ local("Current password")
							}}<input
								v-model="password.pwd"
								type="password" /></label
						><label
							>{{ local("New password")
							}}<input
								v-model="password.confirm_pwd"
								type="password"
						/></label>
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
import { computed, reactive, ref, onMounted } from "vue";
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
onMounted(async () => {
	await user.loadMe().catch(() => {});
	Object.assign(form, {
		name: info.value.name || "",
		email: info.value.email || "",
		phone: info.value.phone || "",
		gender: info.value.gender || "",
	});
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
label {
	display: grid;
	gap: 7px;
	color: #5d5570;
	font-size: 13px;
	font-weight: 700;
}
input,
select {
	padding: 11px;
	border: 1px solid #e1d8ee;
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
