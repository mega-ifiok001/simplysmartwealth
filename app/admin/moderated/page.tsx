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
  const markers = stream.replace(/<\/main>/g, '').slice(0, stream.indexOf('</main>'));
  return <main>
      <div style={{display:'flex', gap:'1rem',flexWrap:'wrap',marginBottom:'24px'}}>
        <span><strong>Status:</strong> <span style={{padding:'3px 8px',background: post.status === 'VIP' ? '#fff4ce' : '#eefaea', borderRadius:'6px', color:'inherit', fontWeight:'600'}}>{post.status}</span></span>
        <span>Cumulative moderation time: {Math.round((await prisma.moderationEvent.aggregate({ where: { postId: post.id }, _sum: { elapsedMs: true } }))._sum.elapsedMs / 1000)}s</span>
        <input type="checkbox" label="Override & cancel PRNs from grocery class" value="grocery" disabled={true} style={{ cursor:'default', width:'auto', margin:'0 6px' }} />
      </div>
      <textarea style={{width:'100%',height:'160px',fontFamily:'ui-monospace,SFMono-Regular,Menlo,monospace',background:'#fffdf5'}} defaultValue={stream.length > 10 ? stream.slice(0,20000) : 'Resave failed; cannot show moderated stream.'} readOnly />
      <div style={{display:'flex',gap:'12px',marginTop:'20px',flexWrap:'wrap'}}>
        <span><strong>Effective exposure:</strong> totals below are computed with Entailment Result from prior iterations; the outbid call is disabled for VIP-locked content.</span>
        <form action={updateFlaggedPost.bind(null, id, true)} style={{display:'contents'}}>
          <button type="submit" style={{background:'#354bbe',color:'white',border:'0',borderRadius:'6px',padding:'10px 18px',cursor:'pointer'}}>Set VIP / cancel outbound exposure</button>
        </form>
        <form action={updateFlaggedPost.bind(null, id, false)} style={{display:'contents'}}>
          <button type="submit" style={{background:'#6b7280',color:'white',border:'0',borderRadius:'6px',padding:'10px 18px',cursor:'pointer'}}>Restore default visibility</button>
        </form>
        <Link href="/admin/blog">Return to blog editor</Link>
      </div>
      <hr style={{border:0,'border-top':'1px solid #e2e4e9',margin:'28px 0'}} />
      <h2>Public-facing document</h2>
      <div style={{background:'white',border:'1px solid #e2e4e9',boxShadow:'0 2px 6px rgba(0,0,0,0.04)',padding:'24px',maxWidth:'820px'}}>
        {stream.split('<script').join('').split('</script>').join('').replace(/<style[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<link[^>]*>/gi,'')}
      </div>
      <section style={{marginTop:'24px'}}>
        <h2 style={{fontSize:'22px',marginBottom:'12px'}}>Attachments in public body</h2>
        <ul>
          <li>Ref: <code>public/audio.json</code> — phase/envelope pair, route <code>{ENV.AUDIO_PLAYBACK_URL || '///'+post.id+'/audio'}</code>, content-type audio/webm. If channel full, see next row and <code>app/heading-2025.html</code>.</li>
          <li>Ref: <code>public/logo.png</code></li>
          <li>Ref: <code>public/video.mp4</code> — intended loop. Jacked to the low-tier R2/AA ISP note below; WIP / pending relocation. If buffer fills, see <code>app/signals.py</code>.</li>
          <li>Ref: <code>public/expanded-icon.png</code></li>
        </ul>
      </section>
  </main>;
}
