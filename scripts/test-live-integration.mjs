// Run explicitly against a configured development database after npm run build.
// Creates uniquely marked post/contact fixtures and removes only their records.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';
import { PrismaClient } from '@prisma/client';
const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'http://127.0.0.1:3197';
assert.ok(process.env.DATABASE_URL && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD, 'Development database and admin configuration required');
const db = new PrismaClient({ log: [] });
const marker = `integration-${randomUUID()}`;
const email = `${marker}@example.invalid`;
// Documentation-only IPv6 range: isolates this local test's proxy identity.
const testIp = `2001:db8:${randomUUID().replaceAll('-', '').slice(0, 24).match(/.{4}/g).join(':')}`;
let publishingTestId = null;
async function submitPostForm(path, values) {
  const response = await request(path);
  assert.equal(response.status, 200, 'Post editor renders');
  const $ = load(await response.text());
  const form = $('form').filter((_, element) => $(element).find('input[name="title"]').length === 1).first();
  assert.equal(form.length, 1, 'Rendered post editor exists');
  const data = new FormData();
  form.find('input[type="hidden"]').each((_, element) => {
    const name = $(element).attr('name'); if (name) data.append(name, $(element).attr('value') || '');
  });
  assert.ok([...data.keys()].some(key => key.startsWith('$ACTION_')), 'Post editor carries its server action');
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  const result = await request(path, { method: 'POST', body: data, headers: { origin } });
  if (![303, 307].includes(result.status)) {
    const returned = load(await result.text());
    assert.fail(`Post save at ${path} returned ${result.status}: ${returned('[role="alert"]').text().trim() || 'No form error returned'}`);
  }
}
async function verifyPublishing(adminId) {
  const slug = `publishing-${marker}`;
  const values = { title: `Publishing ${marker}`, slug, excerpt: 'A temporary publishing regression test.',
    content: `Original article content ${marker}`, status: 'DRAFT', coverAlt: '', publicationDate: '', featured: 'on' };
  await submitPostForm('/admin/posts/new', values);
  let post = await db.post.findUnique({ where: { slug } });
  assert.ok(post && post.authorId === adminId, 'Draft persisted with signed-in author');
  publishingTestId = post.id;
  assert.equal(post.featured, true);
  assert.equal(post.publishedAt, null);
  assert.equal((await request(`/posts/${slug}`)).status, 404, 'Draft stays private');
  const edit = `/admin/posts/${post.id}/edit`;
  const future = new Date(Date.now() + 86400000).toISOString().slice(0, 16);
  await submitPostForm(edit, { ...values, status: 'PUBLISHED', publicationDate: future, content: `Scheduled article content ${marker}` });
  post = await db.post.findUnique({ where: { slug } });
  assert.equal(post.publishedAt.toISOString().slice(0, 16), future, 'UTC schedule persisted');
  assert.equal((await request(`/posts/${slug}`)).status, 404, 'Scheduled article stays private');
  const home = load(await (await request('/')).text());
  assert.equal(home(`a[href="/posts/${slug}"]`).length, 0, 'Scheduled featured article stays off homepage');
  assert.ok(await db.postRevision.findFirst({ where: { postId: post.id, content: values.content } }), 'Old content saved in revision');
  const released = new Date(Date.now() - 60000).toISOString().slice(0, 16);
  await submitPostForm(edit, { ...values, status: 'PUBLISHED', publicationDate: released });
  assert.equal((await request(`/posts/${slug}`)).status, 200, 'Released article is public');
  const publishedHome = load(await (await request('/')).text());
  assert.ok(publishedHome(`a[href="/posts/${slug}"]`).length > 0, 'Published article appears on homepage');
  assert.equal(await db.postRevision.count({ where: { postId: post.id } }), 2, 'Every edit saves one snapshot');
  assert.equal(await db.auditLog.count({ where: { entity: 'Post', entityId: post.id } }), 3, 'Create and edits audited');
  await submitPostForm(edit, values);
  assert.equal((await request(`/posts/${slug}`)).status, 404, 'Unpublishing removes public access');
  console.log('PASS: post create → schedule → revision snapshot → publish → unpublish through server actions');
}
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3197'], {
  cwd: root, env: { ...process.env, NEXTAUTH_URL: origin }, stdio: 'ignore',
});
const cookies = new Map();
async function request(path, options = {}) {
  const response = await fetch(`${origin}${path}`, { ...options, redirect: 'manual', headers: {
    ...options.headers, cookie: [...cookies].map(([key,value]) => `${key}=${value}`).join('; '),
  } });
  for (const cookie of response.headers.getSetCookie()) {
    const pair = cookie.split(';')[0]; const index = pair.indexOf('=');
    cookies.set(pair.slice(0,index), pair.slice(index+1));
  }
  return response;
}
try {
  let ready = false;
  for (let n=0;n<80;n++) {
    if (server.exitCode !== null) throw new Error('Test server could not start');
    try { ready = (await request('/api/auth/providers')).ok; } catch {}
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve,500));
  }
  assert.ok(ready, 'Production server starts');
  assert.equal((await request('/admin/inbox')).status,307,'Inbox rejects unauthenticated requests');
  assert.equal((await request('/admin/settings')).status,307,'Settings rejects unauthenticated requests');
  for (const path of ['/about', '/privacy', '/terms', '/?page=2']) {
    assert.equal((await request(path)).status,200,`${path} renders`);
  }
  const homeResponse = await request('/');
  assert.equal(homeResponse.status,200);
  const home = load(await homeResponse.text());
  assert.equal(home('header').length,1,'Homepage has one header');
  assert.equal(home('main a[href="/single"]').length,0,'Homepage contains no demo article links');
  assert.ok(home('main a[href^="/posts/"]').length > 0,'Homepage lists database posts');
  const siteName = await db.siteSetting.findUnique({where:{key:'site_name'}});
  if (siteName) assert.ok(home('header').text().includes(siteName.value),'Header uses saved site name');
  console.log('PASS: settings-backed public pages and real-post homepage');
  const csrf = await (await request('/api/auth/csrf')).json();
  const body = new URLSearchParams({ csrfToken: csrf.csrfToken, email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD, callbackUrl: `${origin}/admin`, json: 'true' });
  await request('/api/auth/callback/credentials', { method:'POST', body, headers: { 'Content-Type':'application/x-www-form-urlencoded' } });
  const session = await (await request('/api/auth/session')).json();
  assert.ok(session.user?.id, 'Configured administrator can sign in');
  assert.equal((await request('/admin')).status,200,'Authenticated dashboard renders');
  const settingsResponse = await request('/admin/settings');
  assert.equal(settingsResponse.status,200,'Authenticated settings page renders');
  const settingsPage = load(await settingsResponse.text());
  assert.equal(settingsPage('input[name="site_name"]').length,1,'Settings editor exposes site name');
  await verifyPublishing(session.user.id);
  console.log('PASS: real admin login and protected dashboard');
  for (const path of ['/admin/comments?status=pending&page=2', '/admin/comments?status=approved&page=invalid', '/admin/inbox?status=resolved&page=2', '/admin/inbox?status=unread&page=-1', '/admin/inbox?status=open']) {
    const result = await request(path);
    assert.equal(result.status,200,`${path} renders for admin`);
    const list = load(await result.text());
    assert.equal(list('select[name="status"]').length,1,'List exposes status filter');
    assert.equal(list('nav[aria-label$="pages"]').length,1,'List exposes pagination');
    assert.ok(list('main article').length <= 20,'List is bounded to twenty items');
  }
  console.log('PASS: authenticated inbox/comment filters and pagination render');
  const response = await request('/contact');
  assert.equal(response.status,200);
  const $ = load(await response.text());
  const form = $('#commentForm');
  assert.equal(form.length,1,'Contact form renders');
  const data = new FormData();
  form.find('input[type="hidden"]').each((_,element) => {
    const name = $(element).attr('name'); if(name) data.append(name,$(element).attr('value') || '');
  });
  assert.ok([...data.keys()].some(key => key.startsWith('$ACTION_')), 'Rendered form carries a server action');
  data.set('name','Integration Reader'); data.set('email',email);
  data.set('subject',marker); data.set('message',`Contact persistence verification ${marker}`);
  data.set('phone','');
  const submitted = await request('/contact',{ method:'POST',body:data,headers:{origin, 'x-forwarded-for':testIp} });
  assert.ok(submitted.status < 400,'Contact submission accepted');
  const submittedPage = load(await submitted.text());
  assert.equal(submittedPage('[role="alert"]').text().trim(), '', 'Contact form returns no error');
  const stored = await db.contactMessage.findFirst({where:{email,subject:marker}});
  assert.ok(stored,'Contact submission persisted');
  const inbox = await request('/admin/inbox');
  assert.equal(inbox.status,200);
  assert.ok((await inbox.text()).includes(marker),'Saved contact visible in admin inbox');
  console.log('PASS: rendered contact form → server action → database → admin inbox');
  const post = await db.post.findFirst({where:{status:'PUBLISHED',publishedAt:{lte:new Date()}},select:{slug:true}});
  assert.ok(post,'Migrated published post exists');
  assert.equal((await request(`/posts/${post.slug}`)).status,200,'Migrated article renders');
  console.log('PASS: migrated public article');
} catch (error) {
  console.error(error instanceof assert.AssertionError ? error.message : 'Integration failed; inspect configuration and server locally.');
  process.exitCode = 1;
} finally {
  try {
    await db.contactMessage.deleteMany({where:{email,subject:marker}});
    await db.submissionAttempt.deleteMany({ where: { key: `contact:${testIp}` } });
    // Also find by unique slug if a save succeeded before its response failed.
    const temporary = await db.post.findUnique({ where: { slug: `publishing-${marker}` }, select: { id: true } });
    const id = publishingTestId ?? temporary?.id;
    if (id) await db.$transaction([
      db.auditLog.deleteMany({ where: { entity: 'Post', entityId: id } }),
      db.post.deleteMany({ where: { id, slug: `publishing-${marker}` } }),
    ]);
  }
  finally { await db.$disconnect(); server.kill(); }
}
