begin;
create extension if not exists pgtap with schema extensions;

select plan(30);

-- ข้อมูลทดสอบ (รันเป็น postgres ซึ่งข้าม RLS) --------------------------------

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'admin@test.local'),
  ('00000000-0000-0000-0000-00000000000b', 'user@test.local');
insert into public.admins (user_id) values ('00000000-0000-0000-0000-00000000000a');

insert into public.districts values ('t-district', 'ทดสอบ', 'Test', 17, 101);
insert into public.subdistricts values ('t-district', 't-sub', 'ตำบลทดสอบ', 'Test Sub');
insert into public.poi (name_th, name_en, kind, lat, lon) values ('จุดทดสอบ', 'Test POI', 'temple', 17, 101);

insert into public.properties (id, code, slug, title_th, type, district, zone_th, zone_lat, zone_lon, price, state, published_at) values
  ('10000000-0000-0000-0000-000000000001', 'LL-9001', 't-approved', 'อนุมัติแล้ว', 'land', 't-district', 'z', 17, 101, 1, 'approved', now()),
  ('10000000-0000-0000-0000-000000000002', null, null, 'รอตรวจ', 'land', 't-district', 'z', null, null, 1, 'pending', null);
insert into public.property_private (property_id, owner_name, owner_contact, deed_number, exact_lat, exact_lon) values
  ('10000000-0000-0000-0000-000000000001', 'เจ้าของ', '0800000000', '12345', 17.1, 101.1),
  ('10000000-0000-0000-0000-000000000002', 'เจ้าของ 2', '0811111111', '67890', 17.2, 101.2);
insert into public.property_photos (property_id, storage_path) values
  ('10000000-0000-0000-0000-000000000001', 't/approved.webp'),
  ('10000000-0000-0000-0000-000000000002', 't/pending.webp');
insert into public.leads (property_id, name, contact, consent_at, consent_version) values
  ('10000000-0000-0000-0000-000000000001', 'ผู้สนใจ', '0822222222', now(), 'v1');
insert into public.buyer_requests (name, contact, consent_at, consent_version) values ('ผู้ซื้อ', '0833333333', now(), 'v1');
insert into public.crm_events (entity_type, entity_id, to_status) values ('lead', gen_random_uuid(), 'new');
insert into public.audit_log (action, entity_type) values ('test', 'lead');

-- anon ------------------------------------------------------------------------

set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);

select results_eq(
  $$ select slug from public.properties where code like 'LL-9%' or slug like 't-%' or title_th = 'รอตรวจ' $$,
  $$ values ('t-approved'::text) $$,
  'anon เห็นเฉพาะทรัพย์ approved'
);
select results_eq(
  $$ select storage_path from public.property_photos where storage_path like 't/%' $$,
  $$ values ('t/approved.webp'::text) $$,
  'anon เห็นเฉพาะรูปของทรัพย์ approved'
);
select isnt_empty($$ select 1 from public.districts where slug = 't-district' $$, 'anon อ่าน districts ได้');
select isnt_empty($$ select 1 from public.subdistricts where slug = 't-sub' $$, 'anon อ่าน subdistricts ได้');
select isnt_empty($$ select 1 from public.poi where name_en = 'Test POI' $$, 'anon อ่าน poi ได้');

select throws_ok($$ select * from public.property_private $$, '42501', null, 'anon อ่าน property_private ไม่ได้');
select throws_ok($$ select * from public.leads $$, '42501', null, 'anon อ่าน leads ไม่ได้');
select throws_ok($$ select * from public.buyer_requests $$, '42501', null, 'anon อ่าน buyer_requests ไม่ได้');
select throws_ok($$ select * from public.crm_events $$, '42501', null, 'anon อ่าน crm_events ไม่ได้');
select throws_ok($$ select * from public.audit_log $$, '42501', null, 'anon อ่าน audit_log ไม่ได้');
select throws_ok($$ select * from public.admins $$, '42501', null, 'anon อ่าน admins ไม่ได้');

select throws_ok(
  $$ insert into public.leads (name, contact, consent_at, consent_version) values ('x', 'x', now(), 'v1') $$,
  '42501', null, 'anon insert leads ตรงไม่ได้'
);
select throws_ok(
  $$ insert into public.buyer_requests (name, contact, consent_at, consent_version) values ('x', 'x', now(), 'v1') $$,
  '42501', null, 'anon insert buyer_requests ตรงไม่ได้'
);
select throws_ok(
  $$ insert into public.properties (title_th, type, district, zone_th, price) values ('x', 'land', 't-district', 'z', 1) $$,
  '42501', null, 'anon insert properties ตรงไม่ได้'
);
select throws_ok(
  $$ update public.properties set price = 0 where slug = 't-approved' $$,
  '42501', null, 'anon update properties ไม่ได้'
);
select throws_ok($$ select public.is_admin() $$, '42501', null, 'anon เรียก is_admin() ไม่ได้');

-- authenticated ที่ไม่ใช่แอดมิน ---------------------------------------------

reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"role":"authenticated","sub":"00000000-0000-0000-0000-00000000000b"}', true);

select is(public.is_admin(), false, 'ผู้ใช้ทั่วไป is_admin() = false');
select results_eq(
  $$ select slug from public.properties where code like 'LL-9%' or title_th = 'รอตรวจ' $$,
  $$ values ('t-approved'::text) $$,
  'ผู้ใช้ทั่วไปเห็นเฉพาะทรัพย์ approved เหมือน anon'
);
select is_empty($$ select * from public.property_private $$, 'ผู้ใช้ทั่วไปไม่เห็น property_private');
select is_empty($$ select * from public.leads $$, 'ผู้ใช้ทั่วไปไม่เห็น leads');
select throws_ok(
  $$ insert into public.leads (name, contact, consent_at, consent_version) values ('x', 'x', now(), 'v1') $$,
  '42501', null, 'ผู้ใช้ทั่วไป insert leads ไม่ได้'
);
select throws_ok(
  $$ insert into public.admins (user_id) values ('00000000-0000-0000-0000-00000000000b') $$,
  '42501', null, 'ผู้ใช้ทั่วไปเพิ่มตัวเองเป็นแอดมินไม่ได้'
);

-- แอดมิน ----------------------------------------------------------------------

reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"role":"authenticated","sub":"00000000-0000-0000-0000-00000000000a"}', true);

select is(public.is_admin(), true, 'แอดมิน is_admin() = true');
select is(
  (select count(*)::int from public.properties where district = 't-district'), 2,
  'แอดมินเห็นทรัพย์ทุก state'
);
select is((select count(*)::int from public.property_private), 2, 'แอดมินอ่าน property_private ได้');
select lives_ok(
  $$ update public.properties set state = 'rejected' where id = '10000000-0000-0000-0000-000000000002' $$,
  'แอดมินแก้ทรัพย์ได้'
);
select lives_ok(
  $$ insert into public.audit_log (actor_id, action, entity_type) values ('00000000-0000-0000-0000-00000000000a', 'view_pii', 'property') $$,
  'แอดมินเขียน audit_log ของตัวเองได้'
);
select throws_ok(
  $$ insert into public.audit_log (actor_id, action, entity_type) values ('00000000-0000-0000-0000-00000000000b', 'view_pii', 'property') $$,
  '42501', null, 'แอดมินปลอม actor_id ใน audit_log ไม่ได้'
);
select throws_ok($$ delete from public.audit_log $$, '42501', null, 'แอดมินลบ audit_log ไม่ได้');
select throws_ok(
  $$ insert into public.admins (user_id) values ('00000000-0000-0000-0000-00000000000b') $$,
  '42501', null, 'แอดมินเพิ่มแอดมินคนอื่นผ่าน API ไม่ได้'
);

select * from finish();
rollback;
