import React, { useEffect, useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import fetchApi from "../../lib/fetch-api";
import Loading from "../../components/Loading";
import type { UserUpdate } from "../../interfaces/users";

const UpdateProfile = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<UserUpdate>();
  const [imageFile, setImageFile] = useState<File | null>(null); // file baru (jika ada)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(""); // untuk preview dari DB

  const handleChangeValue = (key: string, value: any) => {
    setData((prev: any) => ({ ...prev, [key]: value }));
  };

  const fetchListEvent = async () => {
    try {
      setIsLoading(true);
      const url = `/user`;
      const response = (await fetchApi.get(url)) as any;
      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const backendBaseUrl = import.meta.env.VITE_API_BASE_URL; // misal: http://localhost:3000/api
  const imageUrl = data?.profile_url ? `${backendBaseUrl.replace(/\/api\/?$/, "")}${data.profile_url}` : "";

  useEffect(() => {
    fetchListEvent();
  }, []);

  const handleForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const request: UserUpdate = {
        id: parseInt((event.currentTarget.ids as HTMLInputElement).value),
        name: (event.currentTarget.named as HTMLInputElement).value,
        username: (event.currentTarget.username as HTMLInputElement).value,
        email: (event.currentTarget.email as HTMLInputElement).value,
        phone: (event.currentTarget.phone as HTMLInputElement).value,
        role: (event.currentTarget.roles as HTMLInputElement).value,
        profile: imageFile,
      };

      const formData = new FormData();
      Object.keys(request).forEach((key) => {
        const value = request[key as keyof UserUpdate];
        if (value instanceof File) {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach((item: any) => {
            Object.keys(item).forEach((subKey) => {
              formData.append(`${key}[${subKey}]`, item[subKey]);
            });
          });
        } else {
          formData.append(key, String(value));
        }
      });

      const data = Object.fromEntries(formData);
      const response = await fetchApi.put(`/user`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        setIsLoading(false);
      } else {
        setIsLoading(false);
        alert("Gagal update profile");
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      alert("Gagal update profile");
    }
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file)); // Preview lokal
    }
  };
  return (
    <div className="flex flex-col w-full pr-6">
      {isLoading && <Loading />}
      <h1 className="text-4xl font-bold">Profile </h1>
      <form
        action=""
        onSubmit={handleForm}
        className="flex flex-col w-full max-w-2xl gap-4 my-10"
      >
        <input type="number" className="hidden" name="ids" value={data?.id} />
        <input
          id="images"
          type="file"
          accept="image/*"
          name="image"
          className="hidden"
          onChange={handleImageChange}
        />
        <label
          htmlFor="images"
          className="h-32 mx-auto overflow-hidden border-4 rounded-full w-fit min-w-32 border-slate-400"
        >
          {imagePreviewUrl ? (
            <img
              src={imagePreviewUrl}
              alt="Preview"
              className="object-cover w-full h-full"
            />
          ) : (
            <img
              src={imageUrl}
              alt="Preview"
              className="object-cover w-full h-full"
            />
          )}
        </label>

        <label
          htmlFor="named"
          className="flex flex-col w-full col-span-2 gap-1"
        >
          <span className="text-lg font-semibold uppercase">Name</span>
          <Input
            name="named"
            id="named"
            type="text"
            value={data?.name}
            onChange={(e) => handleChangeValue("name", e.target.value)}
            className="px-4 py-3 border-2 bg-[#F5F5F5]"
          />
        </label>
        <label
          htmlFor="username"
          className="flex flex-col w-full col-span-2 gap-1"
        >
          <span className="text-lg font-semibold uppercase">Username</span>
          <Input
            name="username"
            id="username"
            type="text"
            value={data?.username}
            onChange={(e) => handleChangeValue("name", e.target.value)}
            className="px-4 py-3 border-2 bg-[#F5F5F5]"
          />
        </label>
        <label
          htmlFor="email"
          className="flex flex-col w-full col-span-2 gap-1"
        >
          <span className="text-lg font-semibold uppercase">Email</span>
          <Input
            name="email"
            id="email"
            type="email"
            value={data?.email}
            onChange={(e) => handleChangeValue("email", e.target.value)}
            className="px-4 py-3 border-2 bg-[#F5F5F5]"
          />
        </label>
        <label
          htmlFor="phone"
          className="flex flex-col w-full col-span-2 gap-1"
        >
          <span className="text-lg font-semibold uppercase">Phone</span>
          <Input
            name="phone"
            id="phone"
            type="text"
            value={data?.phone}
            onChange={(e) => handleChangeValue("name", e.target.value)}
            className="px-4 py-3 border-2 bg-[#F5F5F5]"
          />
        </label>
        <label
          htmlFor="roles"
          className="flex flex-col w-full col-span-2 gap-1"
        >
          <span className="text-lg font-semibold uppercase">Role</span>
          <input
            name="roles"
            id="roles"
            type="text"
            disabled
            readOnly
            value={data?.role}
            onChange={(e) => handleChangeValue("role", e.target.value)}
            className="px-4 py-3 border-2 bg-[#F5F5F5]"
          />
        </label>
        <Button type="submit" className="px-4 py-3 text-xl">
          Update Profile
        </Button>
      </form>
    </div>
  );
};

export default UpdateProfile;
