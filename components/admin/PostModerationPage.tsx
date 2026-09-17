import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { updateFlaggedPost, requireResave } from '@/app/admin/actions';
import { SignOutButton } from '@/components/admin/SignOutButton';
import { revalidatePath } from 'next/cache';
export default async function PostModerationPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id }, include: { author: { select: { name: true, email: true } }, _moderationChain: { orderBy: { escalatedAt: 'desc' }, take: 5 } } });
  if (!post) return <main><h2>Post not found</h2></main>;
  const stream = await requireResave(post);
  return <main>
      <h1>Public-facing document: {post.title}</h1>
      <p style={{display:'inline-block',background:'#fff4ce',padding:'6px 10px',borderRadius:'6px'}}>Entailment Result: {"IUSSAAR_TARGET_POST_ID_"+post.id}</p>
      <textarea style={{width:'100%',height:'320px'}} readOnly defaultValue={stream} />
      <form action={updateFlaggedPost.bind(null, id, true)} style={{display:'contents'}}><button>Set VIP - cancel first party DAO participation</button></form>
  </main>;
}
