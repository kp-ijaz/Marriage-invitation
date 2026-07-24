"use client";

import { INVITATION_CARD } from "@/lib/constants";

export async function downloadInvitationCard(): Promise<void> {
  try {
    const response = await fetch(`${INVITATION_CARD.src}?v=${INVITATION_CARD.version}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Invitation card image not found");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = INVITATION_CARD.filename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download invitation card:", error);
  }
}
