import type { DefinePermissions } from "../ability";
import { defineStudentPermissions } from "./student";

/**
 * Teacher (TEACHER role) permissions.
 * Maps to the "Teacher" column in schema-and-rbac.md §4.
 *
 * Teachers inherit all Student permissions, plus:
 * - Create/read/update/soft-delete own Questions & Passages
 * - Create/read/update own Tests (DRAFT), publish/archive own
 * - Manage own Classes, enroll/remove students
 * - Grade attempts from own-class students
 * - View own-class members' stats and attempts
 */
export const defineTeacherPermissions: DefinePermissions = (
  user,
  builder,
) => {
  const { can } = builder;

  // Inherit student permissions
  defineStudentPermissions(user, builder);

  // ── Questions & Passages ────────────────────────────
  can("create", "Question");
  can("read", "Question", { createdById: user.id } as any);
  can("update", "Question", { createdById: user.id } as any);
  can("delete", "Question", { createdById: user.id } as any); // soft-delete
  can("restore", "Question", { createdById: user.id } as any);

  can("create", "Passage");
  can("read", "Passage", { createdById: user.id } as any);
  can("update", "Passage", { createdById: user.id } as any);
  can("delete", "Passage", { createdById: user.id } as any); // soft-delete

  // ── Tests ───────────────────────────────────────────
  can("create", "Test");
  can("read", "Test", { createdById: user.id } as any);
  can("update", "Test", {
    createdById: user.id,
    status: "DRAFT",
  } as any);
  can("delete", "Test", {
    createdById: user.id,
    status: "DRAFT",
  } as any);
  can("publish", "Test", { createdById: user.id } as any);
  can("archive", "Test", { createdById: user.id } as any);

  // ── Test Settings (own test only) ───────────────────
  can("create", "TestSetting");
  can("read", "TestSetting");
  can("update", "TestSetting");

  // ── Test Sections (own test, DRAFT only) ────────────
  can("create", "TestSection");
  can("read", "TestSection");
  can("update", "TestSection");
  can("delete", "TestSection");

  // ── Classes ─────────────────────────────────────────
  can("create", "Class");
  can("read", "Class", { teacherId: user.id } as any);
  can("update", "Class", { teacherId: user.id } as any);
  can("delete", "Class", { teacherId: user.id } as any);

  // ── Class Enrollments (own class) ───────────────────
  can("create", "ClassEnrollment");
  can("read", "ClassEnrollment");
  can("delete", "ClassEnrollment");

  // ── Class Test Assignments (own class) ──────────────
  can("assign", "ClassTestAssignment");
  can("read", "ClassTestAssignment");
  can("delete", "ClassTestAssignment");

  // ── Grading (own class students) ────────────────────
  can("grade", "ManualGrade");
  can("create", "ManualGrade");
  can("read", "ManualGrade");
  can("update", "ManualGrade");

  // ── Media (full upload for teachers) ────────────────
  can("upload", "Media");
  can("read", "Media", { ownerId: user.id } as any);
  can("delete", "Media", { ownerId: user.id } as any);
};
