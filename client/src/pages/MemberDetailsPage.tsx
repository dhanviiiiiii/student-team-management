import { useParams, Link } from "wouter";
import Header from "@/components/Header";
import { trpc } from "@/lib/trpc";

export default function MemberDetailsPage() {
  const params = useParams();
  const memberId = params.id || "";

  const { data: member, isLoading } = trpc.members.getById.useQuery(
    { id: memberId },
    { enabled: memberId.length > 0 }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <p className="text-xl text-gray-600">Loading member details...</p>
        </main>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center space-y-6">
            <p className="text-2xl text-gray-600">Member not found</p>
            <Link href="/members">
              <button className="px-8 py-4 bg-red-600 text-white font-bold text-lg hover:bg-red-700 transition">
                Back to Members
              </button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/members">
          <button className="mb-8 px-4 py-2 border-2 border-black text-black font-semibold hover:bg-black hover:text-white transition">
            ← Back to Members
          </button>
        </Link>

        <div className="grid grid-cols-2 gap-12">
          <div>
            {member.imageUrl ? (
              <img
                src={member.imageUrl}
                alt={member.name}
                className="w-full border-2 border-black"
              />
            ) : (
              <div className="w-full aspect-square bg-gray-200 flex items-center justify-center border-2 border-black">
                <p className="text-8xl">👤</p>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="border-l-4 border-red-600 pl-6">
              <h1 className="text-5xl font-bold text-black mb-2">
                {member.name}
              </h1>
              <p className="text-3xl text-red-600 font-bold">{member.role}</p>
            </div>

            <div className="space-y-6 border-t-2 border-black pt-6">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Email
                </p>
                <p className="text-xl text-black font-semibold">
                  {member.email}
                </p>
              </div>

              {member.phone && (
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Phone
                  </p>
                  <p className="text-xl text-black font-semibold">
                    {member.phone}
                  </p>
                </div>
              )}

              {member.bio && (
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Bio
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t-2 border-gray-300">
                <p className="text-sm text-gray-500">
                  Member since{" "}
                  {new Date(member.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-8">
              <Link href="/members">
                <button className="flex-1 px-6 py-4 bg-red-600 text-white font-bold text-center hover:bg-red-700 transition">
                  Back to Members
                </button>
              </Link>
              <Link href="/add-member">
                <button className="flex-1 px-6 py-4 border-2 border-black text-black font-bold text-center hover:bg-black hover:text-white transition">
                  Add Another
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
