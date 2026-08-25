import { ResumeApi } from "@/api";

function base64ToBlob(dataUrl) {
	const [header, data] = dataUrl.split(",");
	const mime = header.match(/:(.*?);/)?.[1] || "image/jpeg";
	const binary = atob(data);
	const bytes = new Uint8Array(binary.length);
	for (let index = 0; index < binary.length; index += 1)
		bytes[index] = binary.charCodeAt(index);
	return new Blob([bytes], { type: mime });
}

export function createResumeImageInterceptor({ getResumeId, local }) {
	return async function imgInterceptor({
		getImage,
		interceptImage,
		showStatus,
		updateStatus,
		updateImage,
	}) {
		const resumeId = getResumeId();
		if (!resumeId) return;

		const originalUrl = interceptImage("");
		try {
			const source = getImage();
			let blob = null;
			if (source?.startsWith("data:image")) {
				blob = base64ToBlob(source);
			} else if (
				source?.startsWith("blob:") ||
				source?.startsWith("file:///")
			) {
				blob = await (await fetch(source)).blob();
			}
			if (!blob) return;

			showStatus(true);
			const result = await ResumeApi.uploadImage(
				resumeId,
				blob,
				(progress) => {
					const percent = progress.total
						? Math.floor((progress.loaded / progress.total) * 100)
						: 0;
					updateStatus(
						percent < 100,
						percent,
						local("Uploading image…"),
					);
				},
			);
			if (result.code !== 200)
				throw new Error(result.message || local("Image upload failed"));

			updateImage(
				ResumeApi.imageUrl(resumeId, result.data.image_name),
			);
		} catch (error) {
			console.error(error);
			updateImage(originalUrl);
			if (local) {
				window.dispatchEvent(
					new CustomEvent("creator-sn:image-upload-failed", {
						detail: error.message || local("Image upload failed"),
					}),
				);
			}
		} finally {
			showStatus(false);
		}
	};
}

export function getClipboardImageFiles(items = []) {
	return Array.from(items)
		.filter(
			(item) =>
				item?.kind === "file" &&
				item?.type &&
				item.type.startsWith("image/"),
		)
		.map((item) => item.getAsFile?.())
		.filter(Boolean);
}

export function readImageFilesAsDataUrls(files = []) {
	return Promise.all(
		files.map(
			(file) =>
				new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = (event) => resolve(event.target.result);
					reader.onerror = () => reject(new Error("Read image file failed"));
					reader.readAsDataURL(file);
				}),
		),
	);
}

async function insertNativeImageFiles(event, files, getEditor, onError) {
	if (!files.length) return false;
	event.preventDefault();
	event.stopPropagation();
	try {
		const tiptap = getEditor?.()?.editor?.();
		if (!tiptap) return true;
		const dataUrls = await readImageFilesAsDataUrls(files);
		dataUrls.forEach((src) =>
			tiptap.chain().focus().insertContent(`<img src="${src}"></img>`).run(),
		);
	} catch (error) {
		console.error(error);
		onError?.(error);
	}
	return true;
}

export function handlePowerEditorImagePaste(event, getEditor, onError) {
	return insertNativeImageFiles(
		event,
		getClipboardImageFiles(event?.clipboardData?.items || []),
		getEditor,
		onError,
	);
}

export function handlePowerEditorImageDrop(event, getEditor, onError) {
	return insertNativeImageFiles(
		event,
		Array.from(event?.dataTransfer?.files || []).filter(
			(file) => file.type && file.type.startsWith("image/"),
		),
		getEditor,
		onError,
	);
}
