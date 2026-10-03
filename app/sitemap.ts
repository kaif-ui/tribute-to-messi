import type { MetadataRoute } from "next";
import { supabase } from "./lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: tributes } = await supabase
    .from("tributes")
    .select("tribute_id")
    .eq("status", "approved");

  const tributeUrls =
    tributes?.map((tribute) => ({
      url: `https://tributetomessi.online/tribute/${tribute.tribute_id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })) ?? [];

  return [
    {
      url: "https://tributetomessi.online",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://tributetomessi.online/disclaimer",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: "https://tributetomessi.online/privacy",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: "https://tributetomessi.online/terms",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: "https://tributetomessi.online/contact",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...tributeUrls,
  ];
}