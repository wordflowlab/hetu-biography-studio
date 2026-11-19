import {requireValue as need} from '../../vendor/project-store.ts';
import {digest,find,ordered,unique,checkNotes} from './shared.ts';
import {normalizeDate,dateRelation} from './dates.ts';
export const eventDigest=(event:any)=>digest(event);
export function eventBundle(p:any,ids:string[]){unique(ids,'章节事件引用重复。');return ids.map(id=>find(p.events,id,'生平事件'));}
export const eventsDigest=(p:any,ids:string[])=>digest(eventBundle(p,ids));
export function target(p:any,kind:string,id:string){if(kind==='chapter'){const chapter=find(p.chapters,id,'章节');return {...chapter,events:eventBundle(p,chapter.event_ids)};}if(kind==='person')return find(p.people,id,'人物');return find(p.events,id,'事件');}
export const targetDigest=(p:any,kind:string,id:string)=>digest(target(p,kind,id));
export function validateBiography(p:any){
 unique(p.events.map((x:any)=>x.order),'事件编排顺序重复。');unique(p.chapters.map((x:any)=>x.order),'传记章节顺序重复。');
 for(const person of p.people){need(person.name.trim(),'人物名称不能为空。');unique(person.aliases,'人物别名重复。');}
 for(const e of p.evidence)need(e.byte_end>e.byte_start,'证据区间不能为空。');
 for(const event of p.events){need(event.person_ids.length>0,'生平事件须有关联人物。');unique(event.person_ids,'事件人物重复。');unique(event.evidence_ids,'事件证据重复。');for(const id of event.person_ids)find(p.people,id,'事件人物');for(const id of event.evidence_ids)find(p.evidence,id,'事件证据');normalizeDate(event.date_raw);}
 for(const identity of p.identities){need(identity.person_a!==identity.person_b,'身份辨析须比较不同人物记录。');find(p.people,identity.person_a,'人物');find(p.people,identity.person_b,'人物');need(identity.evidence_ids.length>0,'身份声明须保留证据。');unique(identity.evidence_ids,'身份证据重复。');for(const id of identity.evidence_ids)find(p.evidence,id,'身份证据');}
 for(const chapter of p.chapters)eventBundle(p,chapter.event_ids);checkNotes(p,(kind,id)=>target(p,kind,id));
}
export function identityReport(p:any){const roots=new Map<string,string>(p.people.map((x:any)=>[x.id,x.id]));const root=(id:string):string=>{const next=roots.get(id)!;return next===id?id:root(next);};for(const x of p.identities.filter((x:any)=>x.relation==='same'))roots.set(root(x.person_a),root(x.person_b));const conflicts=p.identities.filter((x:any)=>x.relation==='different'&&root(x.person_a)===root(x.person_b));return {people:p.people,statements:p.identities,conflicts,unresolved_ids:p.identities.filter((x:any)=>x.relation==='uncertain').map((x:any)=>x.id),note:'只检查身份声明是否冲突，人物记录与宿主正式身份不自动合并。'};}
export function chapterReport(p:any){return p.chapters.map((c:any)=>({...c,stale:c.events_sha256!==eventsDigest(p,c.event_ids),events:eventBundle(p,c.event_ids)}));}
export function timeline(p:any){const rows=ordered(p.events).map(e=>({...e,date:normalizeDate(e.date_raw)}));return {events:rows,adjacent_relations:rows.slice(1).map((e,n)=>({from:rows[n].id,to:e.id,relation:dateRelation(rows[n].date,e.date)})),note:'显示作者编排顺序；范围相交或边界未知时不推断先后或同日。'};}
export function checkBiography(p:any){const dateRows=p.events.map((e:any)=>({...e,date:normalizeDate(e.date_raw)}));const life_conflicts=p.people.flatMap((person:any)=>{const own=dateRows.filter((e:any)=>e.person_ids.includes(person.id)),births=own.filter((e:any)=>e.kind==='birth'),deaths=own.filter((e:any)=>e.kind==='death');return births.flatMap((b:any)=>deaths.filter((d:any)=>dateRelation(b.date,d.date)==='after').map((d:any)=>({person_id:person.id,birth_id:b.id,death_id:d.id})));});return {unknown_date_ids:dateRows.filter((e:any)=>e.date.precision==='unknown').map((e:any)=>e.id),unsourced_event_ids:p.events.filter((e:any)=>!e.evidence_ids.length).map((e:any)=>e.id),life_conflicts,identity_conflicts:identityReport(p).conflicts,stale_chapter_ids:chapterReport(p).filter((x:any)=>x.stale).map((x:any)=>x.id),stale_note_ids:p.notes.filter((n:any)=>n.target_sha256!==targetDigest(p,n.target_kind,n.target_id)).map((n:any)=>n.id),note:'事件和身份声明可相互矛盾；检查定位冲突，不替作者选择史实。'};}
export function lifeText(p:any){return '# '+p.title+'\n\n'+ordered(p.chapters).map(c=>'## '+c.title+'\n\n'+c.text).join('\n\n')+'\n';}
