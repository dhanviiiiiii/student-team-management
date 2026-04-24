import { useState } from "react";
import { useLocation, Link } from "wouter";
import Header from "@/components/Header";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

export default function AddMemberPage() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    bio: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const addMemberMutation = trpc.members.add.useMutation();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateImageFile = (file: File): string | null => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return "Please upload a valid image file (PNG, JPG, GIF, or WebP)";
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return "Image size must be less than 10MB";
    }
    return null;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validationError = validateImageFile(file);
      if (validationError) {
        toast.error(validationError);
        setImageFile(null);
        setImagePreview("");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);

    try {
      let imageData: string | undefined;
      let imageName: string | undefined;

      if (imageFile) {
        const reader = new FileReader();
        imageData = await new Promise((resolve, reject) => {
          reader.onload = () => {
            const base64 = (reader.result as string).split(",")[1];
            if (!base64) {
              reject(new Error("Failed to encode image"));
              return;
            }
            resolve(base64);
          };
          reader.onerror = () => {
            reject(new Error("Failed to read image file"));
          };
          reader.readAsDataURL(imageFile);
        });
        imageName = imageFile.name;
      }

      await addMemberMutation.mutateAsync({
        name: formData.name,
        role: formData.role,
        email: formData.email,
        phone: formData.phone || undefined,
        bio: formData.bio || undefined,
        imageData: imageData as string | undefined,
        imageName: imageName as string | undefined,
      });

      toast.success("Member added successfully!");
      setLocation("/members");
    } catch (error) {
      console.error("Error adding member:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to add member";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-black mb-2">Add New Member</h2>
          <div className="h-1 w-16 bg-red-600"></div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-black mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:border-red-600 transition"
                placeholder="Enter member name"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-lg font-semibold text-black mb-2">
                Role *
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:border-red-600 transition"
                placeholder="e.g., Developer, Designer"
              />
              {errors.role && (
                <p className="text-red-600 text-sm mt-1">{errors.role}</p>
              )}
            </div>

            <div>
              <label className="block text-lg font-semibold text-black mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:border-red-600 transition"
                placeholder="member@example.com"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-lg font-semibold text-black mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:border-red-600 transition"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-black mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:border-red-600 transition resize-none"
                rows={4}
                placeholder="Tell us about this team member..."
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-black mb-2">
                Profile Photo
              </label>
              <div className="border-2 border-dashed border-black p-6 text-center cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-input"
                />
                <label htmlFor="image-input" className="cursor-pointer block">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-64 object-cover"
                      />
                      <p className="text-sm text-gray-600">
                        Click to change image
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-4xl">📷</p>
                      <p className="text-lg font-semibold text-black">
                        Click to upload image
                      </p>
                      <p className="text-sm text-gray-600">
                        PNG, JPG, GIF, WebP up to 10MB
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-4 bg-red-600 text-white font-bold text-lg hover:bg-red-700 disabled:bg-gray-400 transition"
              >
                {isLoading ? "Adding..." : "Add Member"}
              </button>
              <Link href="/members">
                <button
                  type="button"
                  className="flex-1 px-6 py-4 border-2 border-black text-black font-bold text-lg hover:bg-black hover:text-white transition"
                >
                  Cancel
                </button>
              </Link>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
