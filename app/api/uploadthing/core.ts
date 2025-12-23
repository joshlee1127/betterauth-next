import { updateProfileImage } from '@/app/actions/user';
import { authSession } from '@/lib/auth-utils';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

const f = createUploadthing();

export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({
        image: {
            maxFileSize: '4MB',
            maxFileCount: 1,
        },
    })
        .middleware(async () => {
            // This code runs on your server before upload
            const session = await authSession();
            // If you throw, the user will not be able to upload
            if (!session) throw new UploadThingError('Unauthorized');

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: session.user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            try {
                // Verify the file was uploaded successfully
                if (!file.ufsUrl) {
                    throw new UploadThingError('File upload failed');
                }

                console.log('Upload complete for userId:', metadata.userId);

                console.log('file url', file.ufsUrl);
                // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
                return { uploadedBy: metadata.userId };
            } catch (error) {
                console.error('Uploadthing onUploadComplete error:', error);
                throw new Error('upload error');
            }
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
