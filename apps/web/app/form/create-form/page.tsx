import { CreateFormClient } from "@/components/create-form/create-form-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Form — VibeCheck",
  description:
    "Build a new form to collect responses. Set visibility, response limits, expiry and more.",
};

export default function CreateFormPage() {
  return <CreateFormClient />;
}