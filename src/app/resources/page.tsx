import { getApprovedDocuments } from "../actions";
import ResourcesClient from "./resources-client";

export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  try {
    const documents = await getApprovedDocuments();
    return <ResourcesClient initialDocuments={documents} />;
  } catch (error) {
    console.error("Error in ResourcesPage:", error);
    return <ResourcesClient initialDocuments={[]} />;
  }
}
