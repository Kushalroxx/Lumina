import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get('id');
        
        if (!id) {
            return NextResponse.redirect('https://lumina-950190429451.asia-south1.run.app/dashboard');
        }

        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.redirect('https://lumina-950190429451.asia-south1.run.app/auth/signin');
        }
        
        if (session.user.role !== 'student') {
            return NextResponse.redirect('https://lumina-950190429451.asia-south1.run.app/dashboard');
        }

        const classRoom = await prisma.classroom.findUnique({
            where: { id },
            include: { students: true }
        });

        if (!classRoom) {
            return NextResponse.redirect('https://lumina-950190429451.asia-south1.run.app/classroom/create');
        }

        const isAlreadyEnrolled = classRoom.students.some((student) => student.id === session.user.id);
        
        if (isAlreadyEnrolled) {
            return NextResponse.redirect(`https://lumina-950190429451.asia-south1.run.app/classroom/${classRoom.id}`);
        }

        const updatedClassRoom = await prisma.classroom.update({
            where: { id },
            data: {
                students: {
                    connect: { id: session.user.id }
                }
            }
        });

        return NextResponse.redirect(`https://lumina-950190429451.asia-south1.run.app/classroom/${updatedClassRoom.id}`);

    } catch (error) {
        console.log('Join classroom error:', error);
        return NextResponse.redirect('https://lumina-950190429451.asia-south1.run.app/dashboard?error=join_failed');
    }
}
