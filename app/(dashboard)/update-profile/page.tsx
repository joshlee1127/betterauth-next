import { updateProfile } from '@/app/actions/user';
import { ChangePasswordForm } from '@/components/change-password';
import { ToggleOtpForm } from '@/components/toggle-otp-form';
import { UpdateProfile } from '@/components/update-profile';
import { authIsRequired } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';

export default async function UpdataProfilePage() {
    await authIsRequired();
    const user = await updateProfile();
    if (!user) {
        redirect('/sign-in');
    }
    return (
        <div className="w-full p-6 shadow-lg rounded-2xl h-full flex gap-6">
            <UpdateProfile
                email={user?.email}
                image={user?.image ?? ''}
                name={user?.name}
            />
            <ChangePasswordForm />
            <ToggleOtpForm twoFactorEnabled={user.twoFactorEnabled} />
        </div>
    );
}
