# Sprint 11 redirect parity report

Date: 2026-08-24

All rules were copied from the confirmed Nuxt redirect source and tested against the production Next build with safe HEAD requests. Expected and actual status was HTTP 301 in every case; expected and actual `Location` paths matched exactly.

| # | Source | Expected status | Actual status | Expected location | Actual location | Result |
|---:|---|---:|---:|---|---|---|
| 1 | `/es/tour/a%D9%90swan-to-abu-simbel-private-transfer` | 301 | 301 | `/es/tour/private-tour-to-abu-simbel-from-aswan` | same | PASS |
| 2 | `/zh/tour/a%D9%90swan-to-abu-simbel-private-transfer/` | 301 | 301 | `/zh/rent-car` | same | PASS |
| 3 | `/blog/Bazar%20Khan%20El%20Khalili%20del%20Cairo%20%7C%20Tour%20delle%20Piramidi%20del%20Sole` | 301 | 301 | `/blog/khan-el-khalili-bazaar` | same | PASS |
| 4 | `/fr/blog/Bazar%20Khan%20El%20Khalili%20del%20Cairo%20%7C%20Tour%20delle%20Piramidi%20del%20Sole` | 301 | 301 | `/fr/blog/khan-el-khalili-bazaar` | same | PASS |
| 5 | `/de/blog/Bazar%20Khan%20El%20Khalili%20del%20Cairo%20%7C%20Tour%20delle%20Piramidi%20del%20Sole` | 301 | 301 | `/de/blog/khan-el-khalili-bazaar` | same | PASS |
| 6 | `/it/blog/Bazar%20Khan%20El%20Khalili%20del%20Cairo%20%7C%20Tour%20delle%20Piramidi%20del%20Sole` | 301 | 301 | `/it/blog/khan-el-khalili-bazaar` | same | PASS |
| 7 | `/pt/blog/Bazar%20Khan%20El%20Khalili%20del%20Cairo%20%7C%20Tour%20delle%20Piramidi%20del%20Sole` | 301 | 301 | `/pt/blog/khan-el-khalili-bazaar` | same | PASS |
| 8 | `/es/blog/Bazar%20Khan%20El%20Khalili%20del%20Cairo%20%7C%20Tour%20delle%20Piramidi%20del%20Sole` | 301 | 301 | `/es/blog/khan-el-khalili-bazaar` | same | PASS |
| 9 | `/zh/blog/Bazar%20Khan%20El%20Khalili%20del%20Cairo%20%7C%20Tour%20delle%20Piramidi%20del%20Sole` | 301 | 301 | `/zh/blog/khan-el-khalili-bazaar` | same | PASS |
| 10 | `/fr/tour/cairo's-islamic-gems-citadel-alabaster-mosque-art-museum` | 301 | 301 | `/fr/blog/salah-el-din-citadel` | same | PASS |
| 11 | `/zh/blog/Bazar%20Khan%20El%20Khalili%20del%20Cairo%20%7C%20Tour%20%20delle%20Piramidi%20del%20Sole` | 301 | 301 | `/zh/blog/khan-el-khalili-bazaar` | same | PASS |
| 12 | `/zh/tour/cairo's-islamic-gems-citadel-alabaster-mosque-art-museum` | 301 | 301 | `/zh/blog/salah-el-din-citadel` | same | PASS |
| 13 | `/blog/Bazar%20Khan%20El%20Khalili%20du%20Caire%20%7C%20Visites%20%20des%20pyramides%20du%20soleil` | 301 | 301 | `/blog/khan-el-khalili-bazaar` | same | PASS |
| 14 | `/tour/2-day-cairo-adventure-tours` | 301 | 301 | `/tour/2-day-white-desert-bahariya-fayoum-tour-from-cairo` | same | PASS |
| 15 | `/fr/tour/2-day-cairo-adventure-tours` | 301 | 301 | `/fr/tour/2-day-white-desert-bahariya-fayoum-tour-from-cairo` | same | PASS |
| 16 | `/de/tour/2-day-cairo-adventure-tours` | 301 | 301 | `/de/tour/2-day-white-desert-bahariya-fayoum-tour-from-cairo` | same | PASS |
| 17 | `/it/tour/2-day-cairo-adventure-tours` | 301 | 301 | `/it/tour/2-day-white-desert-bahariya-fayoum-tour-from-cairo` | same | PASS |
| 18 | `/pt/tour/2-day-cairo-adventure-tours` | 301 | 301 | `/pt/tour/2-day-white-desert-bahariya-fayoum-tour-from-cairo` | same | PASS |
| 19 | `/es/tour/2-day-cairo-adventure-tours` | 301 | 301 | `/es/tour/2-day-white-desert-bahariya-fayoum-tour-from-cairo` | same | PASS |
| 20 | `/zh/tour/2-day-cairo-adventure-tours` | 301 | 301 | `/zh/tour/2-day-white-desert-bahariya-fayoum-tour-from-cairo` | same | PASS |

Final redirect parity: **20/20 PASS**.

