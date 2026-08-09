/**
 * Vercel serverless proxy for Booking.com Demand API.
 * Requires:
 * BOOKING_API_KEY
 * BOOKING_AFFILIATE_ID
 * BOOKING_CITY_IDS_JSON='{"Tokyo":-246227,...}'
 *
 * Booking.com v3 authentication:
 * Authorization: Bearer <key>
 * X-Affiliate-Id: <aid>
 *
 * This endpoint deliberately keeps the API key server-side.
 */
export default async function handler(req,res){
  const key=process.env.BOOKING_API_KEY;
  const aid=process.env.BOOKING_AFFILIATE_ID;
  if(!key||!aid) return res.status(501).json({live:false,error:"Booking credentials not configured"});
  let ids={};try{ids=JSON.parse(process.env.BOOKING_CITY_IDS_JSON||"{}")}catch{}
  const city=req.query.city||"Tokyo", cityId=ids[city];
  if(!cityId) return res.status(400).json({live:false,error:`No Booking city ID configured for ${city}`});
  const checkin=req.query.checkin||new Date(Date.now()+30*86400000).toISOString().slice(0,10);
  const checkout=req.query.checkout||new Date(Date.now()+32*86400000).toISOString().slice(0,10);
  const body={city:cityId,booker:{platform:"desktop",country:"fr"},checkin,checkout,guests:{number_of_rooms:Number(req.query.rooms||1),number_of_adults:Number(req.query.adults||2)}};
  const r=await fetch("https://demandapi.booking.com/3.2/accommodations/search",{method:"POST",headers:{"content-type":"application/json","Authorization":`Bearer ${key}`,"X-Affiliate-Id":aid},body:JSON.stringify(body)});
  const json=await r.json();
  res.status(r.status).json({live:r.ok,data:json});
}
