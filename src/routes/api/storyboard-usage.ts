import { createFileRoute } from "@tanstack/react-router";
import { getStoryboardUsage, requireStoryboardAuth } from "@/lib/server/storyboard-auth";
import { guardRequest, requestErrorResponse } from "@/lib/request-guard";

async function handleGet({ request }: { request: Request }) {
  try {
    guardRequest(request, 60);
    const auth = await requireStoryboardAuth(request);
    if (!auth.ok) return auth.response;

    const result = await getStoryboardUsage(auth.token);
    if (result.response) return result.response;
    return Response.json({ usage: result.usage });
  } catch (error) {
    const failure = requestErrorResponse(error);
    if (failure) return failure;
    console.error("Storyboard usage endpoint failed:", error);
    return Response.json({ error: "Could not load your usage right now." }, { status: 500 });
  }
}

export const Route = createFileRoute("/api/storyboard-usage")({
  server: {
    handlers: { GET: handleGet },
  },
});
