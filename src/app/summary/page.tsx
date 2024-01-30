"use client";
import { useSearchParams } from "next/navigation";
import { SummaryView } from "../components/SummaryView";

export default function Page() {
  const params = useSearchParams();
  const billId = params.get("billId");
  return <SummaryView id={billId} />;
}
