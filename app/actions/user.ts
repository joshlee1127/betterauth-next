'use server';

import { authSession } from '@/lib/auth-utils';
import prisma from '@/lib/prisma';

export async function updateProfile() {
    const session = await authSession();
    if (!session) {
        throw new Error('Unauthorize');
    }
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { email: true, name: true, image: true, twoFactorEnabled: true },
    });
    return user;
}

export async function updateProfileImage(imageUrl: string) {
    const session = await authSession();
    if (!session) {
        throw new Error('Unauthorize');
    }
    const result = await prisma.user.update({
        where: { id: session.user.id },
        data: {
            image: imageUrl,
        },
    });
    console.log('🚀 ~ updateProfileImage ~ result:', result);
    return result;
}
