/** @format */
// src/app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useProfileStore } from "@/stores/profileStore";
import { UpdateProfileData, UpdatePasswordData } from "@/types/user";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ProfileForm from "@/components/pages/profile/ProfileForm";
import PasswordForm from "@/components/pages/profile/PasswordForm";
import ProfilePhoto from "@/components/pages/profile/ProfilePhoto";
import Alert from "@/components/ui/Alert";
import withAuth from "@/components/hoc/withAuth";
import FadeIn from "@/components/animation/FadeIn";
import toast from "react-hot-toast";

function ProfilePage() {
  const {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfileData,
    updatePasswordData,
    uploadPhoto,
  } = useProfileStore();

  const [activeTab, setActiveTab] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdateProfile = async (data: UpdateProfileData) => {
    const success = await updateProfileData(data);
    if (success) {
      setSuccessMessage("Profil berhasil diperbarui");
      toast.success("Profil berhasil diperbarui");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  const handleUpdatePassword = async (data: UpdatePasswordData) => {
    const success = await updatePasswordData(data);
    if (success) {
      setSuccessMessage("Password berhasil diperbarui");
      toast.success("Password berhasil diperbarui");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  const handleUploadPhoto = async (file: File) => {
    const success = await uploadPhoto(file);
    if (success) {
      setSuccessMessage("Foto profil berhasil diperbarui");
      toast.success("Foto profil berhasil diperbarui");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  if (isLoading && !profile) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text="Memuat data profil..." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <FadeIn>
        <PageHeader title="Profil Saya" />

        {error && (
          <Alert
            variant="error"
            title="Error"
            message={error}
            className="mb-6"
          />
        )}

        {successMessage && (
          <Alert
            variant="success"
            title="Berhasil"
            message={successMessage}
            className="mb-6"
          />
        )}

        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <FadeIn delay={0.1}>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <ProfilePhoto
                    photoUrl={profile.pelanggan.foto_pelanggan}
                    name={profile.user.name}
                    onUpload={handleUploadPhoto}
                  />

                  <div className="mt-4">
                    <h3 className="text-lg font-semibold">
                      {profile.user.name}
                    </h3>
                    <p className="text-gray-600">{profile.user.email}</p>

                    <div className="mt-3 text-sm text-gray-500">
                      <p className="flex items-center">
                        <span className="mr-2">📱</span>
                        {profile.pelanggan.no_hp || "Belum diatur"}
                      </p>
                      <p className="flex items-center mt-1">
                        <span className="mr-2">📍</span>
                        {profile.pelanggan.alamat || "Belum diatur"}
                      </p>
                      <p className="flex items-center mt-1">
                        <span className="mr-2">📅</span>
                        Bergabung sejak{" "}
                        {new Date(profile.user.created_at).toLocaleDateString(
                          "id-ID",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>

            <div className="md:col-span-2">
              <FadeIn delay={0.2}>
                <div className="bg-white rounded-lg shadow-md">
                  <div role="tablist" className="tabs tabs-bordered">
                    <a
                      role="tab"
                      className={`tab ${activeTab === 0 ? "tab-active" : ""}`}
                      onClick={() => setActiveTab(0)}
                    >
                      Informasi Profil
                    </a>
                    <a
                      role="tab"
                      className={`tab ${activeTab === 1 ? "tab-active" : ""}`}
                      onClick={() => setActiveTab(1)}
                    >
                      Ubah Password
                    </a>
                  </div>

                  <div className="p-6">
                    {activeTab === 0 && (
                      <ProfileForm
                        initialData={{
                          name: profile.user.name,
                          email: profile.user.email,
                          nm_pelanggan: profile.pelanggan.nm_pelanggan,
                          no_hp: profile.pelanggan.no_hp,
                          alamat: profile.pelanggan.alamat,
                        }}
                        onSubmit={handleUpdateProfile}
                        isLoading={isLoading}
                      />
                    )}
                    {activeTab === 1 && (
                      <PasswordForm
                        onSubmit={handleUpdatePassword}
                        isLoading={isLoading}
                      />
                    )}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        )}
      </FadeIn>
    </PageContainer>
  );
}

export default withAuth(ProfilePage);
