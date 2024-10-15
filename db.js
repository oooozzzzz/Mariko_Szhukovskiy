import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createUser = async (tg_id, name) => {
	const id = tg_id.toString();
	try {
		await prisma.user.create({
			data: {
				tg_id: id,
				first_name: name,
			},
		});
		return true;
	} catch (error) {
		return false;
	}
};

export const makeAdmin = async (id) => {
	id = id.toString();
	await prisma.user.update({ where: { tg_id: id }, data: { isAdmin: true } });
};

export const addComment = async ({ id, comment, isPositive }) => {
	id = id.toString();
	try {
		await prisma.user.update({
			where: { tg_id: id },
			data: {
				comments: {
					create: {
						content: comment,
						isPositive,
						tg_id: id,
					},
				},
			},
		});
	} catch (error) {}
};

export const getAllUsers = async () => {
	try {
		const users = await prisma.user.findMany({ select: { tg_id: true } });
		return users;
	} catch (error) {
		return false;
	}
};

export const addPreference = async ({ preference, tg_id }) => {
	tg_id = tg_id.toString();
	try {
		await prisma.user.update({
			where: { tg_id: tg_id },
			data: { preferences: { create: { value: preference } } },
		});
		return true;
	} catch (error) {
		return false;
	}
};

export const getOwnerPassword = async () => {
	try {
		const password = await prisma.password.findUnique({
			where: { label: "owner" },
			select: { value: true },
		});
		return password.value;
	} catch (error) {
		return false;
	}
};

export const setPassrword = async (label, value) => {
	try {
		await prisma.password.update({ where: { label }, data: { value } });
	} catch (error) {
		return false;
	}
};

export const getAdminPassword = async () => {
	try {
		const password = await prisma.password.findUnique({
			where: { label: "admin" },
			select: { value: true },
		});
		return password.value;
	} catch (error) {
		console.log(error)
		return false;
	}
};
