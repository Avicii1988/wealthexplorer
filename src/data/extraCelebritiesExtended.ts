// Auto-generated extensions for extraCelebrities — merged from all batch files
// Each batch covers a section of the 549 extra celebrity profiles
// Extensions add: real avatar URLs, additional assets, gossip & controversy items

import { extras_a } from './extras_a'
import { extras_b } from './extras_b'
import { extras_c } from './extras_c'
import { extras_d } from './extras_d'
import { extras_e } from './extras_e'
import { extras_f } from './extras_f'

type AT = 'jet'|'yacht'|'real_estate'|'car'|'watch'|'art'|'helicopter'|'island'|'sports_team'|'rocket'
type XA = { id:string; type:AT; name:string; description:string; estimatedValue:number; image:string; likes:number; year?:number; location?:string; specs?:string }
type GI = { title:string; summary:string; type?:'gossip'|'controversy'; date?:string }
export type Ext = { avatar?:string; assets?:XA[]; gossip?:GI[] }

export const allExtensions: Record<string, Ext> = {
  ...extras_a,
  ...extras_b,
  ...extras_c,
  ...extras_d,
  ...extras_e,
  ...extras_f,
}
