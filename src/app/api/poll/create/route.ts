import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const {
      question,
      options,
      username,
    }: { question: string; options: Array<string>; username: string } =
      await req.json();

    const poll = await prisma.poll.create({
      data: {
        owner: username,
        question,
        options: {
          create: options.map((option) => ({ option, votes: 0 })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Poll created successfully",
      pollId: poll.id,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 400 }
    );
  }
};
