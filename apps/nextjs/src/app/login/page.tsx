import { signIn } from "@aura/auth";
import { Button } from "@aura/ui/button";

export default function LoginPage() {
  return (
    <div className="mx-auto flex h-full w-full max-w-[360px] flex-col py-[180px]">
      <h2 className="mb-20 font-sans text-3xl font-semibold">
        Log in to your AURA account
      </h2>

      <form>
        <Button
          size="lg"
          formAction={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
          className="w-full"
        >
          Continue with Google
        </Button>
      </form>
    </div>
  );
}
