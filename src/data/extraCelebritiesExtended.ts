// Auto-generated extensions for extraCelebrities — merged from all batch files
// Each batch covers ~30 profiles. Extensions add: avatars, extra assets, gossip.

import { extras_01 } from './extras_01'
import { extras_02 } from './extras_02'
import { extras_03 } from './extras_03'
import { extras_04 } from './extras_04'
import { extras_05 } from './extras_05'
import { extras_06 } from './extras_06'
import { extras_07 } from './extras_07'
import { extras_08 } from './extras_08'
import { extras_09 } from './extras_09'
import { extras_10 } from './extras_10'
import { extras_11 } from './extras_11'
import { extras_12 } from './extras_12'
import { extras_13 } from './extras_13'
import { extras_14 } from './extras_14'
import { extras_15 } from './extras_15'
import { extras_16 } from './extras_16'
import { extras_17 } from './extras_17'
import { extras_18 } from './extras_18'

type AT = 'jet'|'yacht'|'real_estate'|'car'|'watch'|'art'|'helicopter'|'island'|'sports_team'|'rocket'
type XA = { id:string; type:AT; name:string; description:string; estimatedValue:number; image:string; likes:number; year?:number; location?:string; specs?:string }
type GI = { title:string; summary:string; type?:'gossip'|'controversy'; date?:string }
export type Ext = { avatar?:string; assets?:XA[]; gossip?:GI[] }

export const allExtensions: Record<string, Ext> = {
  ...extras_01,
  ...extras_02,
  ...extras_03,
  ...extras_04,
  ...extras_05,
  ...extras_06,
  ...extras_07,
  ...extras_08,
  ...extras_09,
  ...extras_10,
  ...extras_11,
  ...extras_12,
  ...extras_13,
  ...extras_14,
  ...extras_15,
  ...extras_16,
  ...extras_17,
  ...extras_18,
}
