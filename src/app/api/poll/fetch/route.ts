import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);
  const pollId = url.searchParams.get("pollId");

  if (!pollId) {
    throw new Error("Invalid poll Id");
  }

  try {
    const poll = await prisma.poll.findFirst({
      where: { id: pollId },
      include: { options: true },
    });

    return NextResponse.json({
      success: true,
      poll,
      message: "Poll fetched successfully",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { success: false, poll: null, message: error.message },
      { status: 400 }
    );
  }
};
