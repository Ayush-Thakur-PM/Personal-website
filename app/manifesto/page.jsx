import { redirect } from "next/navigation";

/** Old slug — bookmarks and shared links resolve to the richer About route. */
export default function LegacyManifestoPage() {
  redirect("/about");
}
