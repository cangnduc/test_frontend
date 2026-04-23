import { authClient } from "@/auth/auth-client";

export const SocialLogin = () => {
  return (
    <div className="mt-4">
      <button
        onClick={async () => {
          try {
            await authClient.signIn.social(
              {
                provider: "google",
                callbackURL: "/",
              },
              {
                onSuccess: () => {
                  window.location.href = "http://localhost:3001/";
                },
                onError: (error) => {
                  console.log("Sign-in error:", error);
                },
              },
            );
          } catch (error) {
            console.log("Sign-in error:", error);
          }
        }}
        className="w-full bg-red-500 text-white p-2 rounded-md"
      >
        Google
      </button>
    </div>
  );
};
