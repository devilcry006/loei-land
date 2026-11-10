-- security definer เพื่ออ่านตาราง admins ได้โดยไม่ติด RLS ของตัวเอง (ไม่อย่างนั้น policy จะวนเรียกกันเอง)
create function public.is_admin() returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Supabase grant ทุกสิทธิ์ให้ anon/authenticated เป็นค่าเริ่มต้น ถอนออกเป็นชั้นป้องกันที่สองต่อจาก RLS:
-- ถ้าวันหนึ่งมีคนเขียน policy หลวมเกินไป anon ก็ยังเขียนหรือแตะตารางลับไม่ได้
revoke all on all tables in schema public from anon;
grant select on public.properties, public.property_photos, public.districts, public.subdistricts, public.poi to anon;
-- ตารางที่สร้างใหม่ในอนาคตจะไม่ได้สิทธิ์ anon อัตโนมัติ ต้อง grant เองทีละตาราง
alter default privileges in schema public revoke all on tables from anon;

-- authenticated ทุกคนไม่ใช่แอดมิน · สิทธิ์จริงตัดสินที่ policy ด้วย is_admin()
revoke truncate, references, trigger on all tables in schema public from authenticated;

-- ข้อมูลสาธารณะ ---------------------------------------------------------------

create policy "public read approved" on public.properties
for select to anon, authenticated
using (state = 'approved');

-- subquery ผ่าน RLS ของ properties อีกชั้น จึงเห็นเฉพาะรูปของทรัพย์ที่ approved
create policy "public read photos of approved" on public.property_photos
for select to anon, authenticated
using (exists (select 1 from public.properties p where p.id = property_id and p.state = 'approved'));

create policy "public read" on public.districts for select to anon, authenticated using (true);
create policy "public read" on public.subdistricts for select to anon, authenticated using (true);
create policy "public read" on public.poi for select to anon, authenticated using (true);

-- แอดมิน ----------------------------------------------------------------------
-- ห่อ is_admin() ด้วย (select ...) ให้ Postgres คำนวณครั้งเดียวต่อ query แทนทุกแถว

create policy "admin all" on public.properties
for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin all" on public.property_private
for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin all" on public.property_photos
for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin all" on public.leads
for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin all" on public.buyer_requests
for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin all" on public.districts
for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin all" on public.subdistricts
for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin all" on public.poi
for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- ประวัติ CRM และ audit log เป็นแบบเพิ่มอย่างเดียว แก้/ลบย้อนหลังไม่ได้ · actor ต้องเป็นตัวเอง
create policy "admin read" on public.crm_events
for select to authenticated using ((select public.is_admin()));
create policy "admin append" on public.crm_events
for insert to authenticated with check ((select public.is_admin()) and actor_id = (select auth.uid()));

create policy "admin read" on public.audit_log
for select to authenticated using ((select public.is_admin()));
create policy "admin append" on public.audit_log
for insert to authenticated with check ((select public.is_admin()) and actor_id = (select auth.uid()));

revoke update, delete on public.crm_events, public.audit_log from authenticated;

-- รายชื่อแอดมินจัดการผ่าน dashboard / secret key เท่านั้น เพื่อไม่ให้แอดมินคนหนึ่งเพิ่มคนอื่นเองได้
create policy "admin read" on public.admins
for select to authenticated using ((select public.is_admin()));
revoke insert, update, delete on public.admins from authenticated;
