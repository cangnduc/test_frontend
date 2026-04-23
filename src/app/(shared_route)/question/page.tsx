import { QuestionDataSchema } from "@/zod-schema/question";
import { z } from "zod";
import { getAbility } from "@/auth/casl/get-ability";
import Link from "next/link";
export default async function QuestionPage() {
  const ability = await getAbility();

  return (
    <div>
      <h1>Questions</h1>

      {/* Only show "Create" button if user can create questions */}
      {ability.can("create", "Question") && (
        <Link href="/question/new" className="btn-primary">
          + New Question
        </Link>
      )}

      {/* Only show admin panel link for users who can manage all */}
      {ability.can("read", "SystemLog") && (
        <Link href="/admin">Admin Panel</Link>
      )}

      {/* Everyone sees the list (guest can read public questions) */}
    </div>
  );
}
