export const config = {
  "fields": {
    "person": "people",
    "evidence": "evidence",
    "event": "events",
    "identity": "identities",
    "chapter": "chapters",
    "note": "notes"
  },
  "defaults": {
    "brief": "",
    "people": [],
    "evidence": [],
    "events": [],
    "identities": [],
    "chapters": [],
    "notes": []
  },
  "tabs": [
    "传记阅读",
    "生平时间线",
    "人物与身份",
    "证词依据",
    "传记交付"
  ]
} as const;
