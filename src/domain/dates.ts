import {requireValue as need} from '../../vendor/project-store.ts';
const pad=(n:number,w=2)=>String(n).padStart(w,'0');
const days=(year:number,month:number)=>[31,year%4===0&&(year%100!==0||year%400===0)?29:28,31,30,31,30,31,31,30,31,30,31][month-1];
function basic(raw:string){const m=/^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(raw);if(!m)return undefined;const y=Number(m[1]),month=m[2]?Number(m[2]):undefined,day=m[3]?Number(m[3]):undefined;need(y>=1&&y<=9999&&(month===undefined||month>=1&&month<=12)&&(day===undefined||day>=1),'日期年月日无效。');if(day!==undefined)need(day<=days(y,month!),'日期不是有效公历日。');return {earliest:pad(y,4)+'-'+pad(month??1)+'-'+pad(day??1),latest:pad(y,4)+'-'+pad(month??12)+'-'+pad(day??days(y,month??12)),precision:day===undefined?month===undefined?'year':'month':'day'};}
function step(raw:string,n:number){const d=new Date(raw+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+n);const value=d.toISOString().slice(0,10);need(/^\d{4}-\d{2}-\d{2}$/.test(value)&&value>='0001-01-01'&&value<='9999-12-31','日期范围超出首版公历边界。');return value;}
export function normalizeDate(raw:string):any{
 need(typeof raw==='string'&&raw.trim().length>0,'日期原文不能为空。');const text=raw.trim();const unknown=()=>({raw,calendar:'unconverted',earliest:null,latest:null,precision:'unknown',qualifier:'uncertain',note:'原文保留，未猜测纪年、旧历或模糊范围。'});
 if(/[?~约頃顷]|^about\s/i.test(text))return unknown();
 const range=text.split('..');if(range.length===2){const a=basic(range[0]),b=basic(range[1]);need(a&&b,'明确范围须使用支持的公历子集。');need(a.earliest<=b.latest,'日期范围倒置。');return {raw,calendar:'gregorian',earliest:a.earliest,latest:b.latest,precision:'range',qualifier:'exact'};}
 const qualified=/^(before|after)\s+(.+)$/.exec(text);if(qualified){const v=basic(qualified[2]);if(!v)return unknown();return {raw,calendar:'gregorian',earliest:qualified[1]==='after'?step(v.latest,1):null,latest:qualified[1]==='before'?step(v.earliest,-1):null,precision:'range',qualifier:qualified[1]};}
 const v=basic(text);return v?{raw,calendar:'gregorian',...v,qualifier:'exact'}:unknown();
}
export function dateRelation(a:any,b:any){if(a.latest!==null&&b.earliest!==null&&a.latest<b.earliest)return 'before';if(b.latest!==null&&a.earliest!==null&&b.latest<a.earliest)return 'after';return 'undetermined';}
