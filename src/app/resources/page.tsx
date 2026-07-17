import { getApprovedDocuments } from "../actions";
import ResourcesClient from "./resources-client";

export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  const documents = await getApprovedDocuments();
  return <ResourcesClient initialDocuments={documents} />;
}
