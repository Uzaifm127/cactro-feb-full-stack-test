import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _req: NextRequest,
  { params }: { params: { pollId: string } }
) => {
  try {
    const { pollId } = params;

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
