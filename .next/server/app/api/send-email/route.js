"use strict";(()=>{var e={};e.id=499,e.ids=[499],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1282:e=>{e.exports=require("child_process")},4770:e=>{e.exports=require("crypto")},665:e=>{e.exports=require("dns")},7702:e=>{e.exports=require("events")},2048:e=>{e.exports=require("fs")},2615:e=>{e.exports=require("http")},8791:e=>{e.exports=require("https")},8216:e=>{e.exports=require("net")},9801:e=>{e.exports=require("os")},5315:e=>{e.exports=require("path")},6162:e=>{e.exports=require("stream")},2452:e=>{e.exports=require("tls")},7360:e=>{e.exports=require("url")},1764:e=>{e.exports=require("util")},1568:e=>{e.exports=require("zlib")},9245:(e,a,s)=>{s.r(a),s.d(a,{originalPathname:()=>g,patchFetch:()=>v,requestAsyncStorage:()=>c,routeModule:()=>p,serverHooks:()=>m,staticGenerationAsyncStorage:()=>u});var r={};s.r(r),s.d(r,{POST:()=>d});var t=s(9303),n=s(8716),i=s(670),o=s(7070),l=s(6594);async function d(e){try{let{to:a,subject:s,html:r,text:t}=await e.json();if(!a||!s||!r)return o.NextResponse.json({success:!1,error:"Missing required fields: to, subject, html"},{status:400});let n=await (0,l.Cz)({to:a,subject:s,html:r,text:t});if(n.success)return o.NextResponse.json({success:!0,messageId:n.messageId});return o.NextResponse.json({success:!1,error:n.error},{status:500})}catch(e){return o.NextResponse.json({success:!1,error:e.message},{status:500})}}let p=new t.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/send-email/route",pathname:"/api/send-email",filename:"route",bundlePath:"app/api/send-email/route"},resolvedPagePath:"C:\\Users\\pabod\\Desktop\\SlGamingHub-frontend\\app\\api\\send-email\\route.js",nextConfigOutput:"",userland:r}),{requestAsyncStorage:c,staticGenerationAsyncStorage:u,serverHooks:m}=p,g="/api/send-email/route";function v(){return(0,i.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:u})}},6594:(e,a,s)=>{s.d(a,{Cz:()=>n,Jv:()=>o,Vw:()=>l,lh:()=>d,sj:()=>i});var r=s(5245);let t=()=>r.createTransport({host:process.env.EMAIL_HOST||"smtp.gmail.com",port:parseInt(process.env.EMAIL_PORT||"587"),secure:"true"===process.env.EMAIL_SECURE,auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASSWORD}}),n=async({to:e,subject:a,html:s,text:r})=>{try{let n=t(),i={from:`"SL Gaming Hub" <${process.env.EMAIL_USER}>`,to:e,subject:a,html:s,text:r||s.replace(/<[^>]*>/g,"")},o=await n.sendMail(i);return console.log("Email sent successfully:",o.messageId),{success:!0,messageId:o.messageId}}catch(e){return console.error("Error sending email:",e),{success:!1,error:e.message}}},i=e=>({subject:`New Order Received - ${e.orderNumber}`,html:`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px; }
          .order-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea; }
          .order-item { margin: 10px 0; }
          .label { font-weight: bold; color: #555; }
          .value { color: #333; }
          .status { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
          .status-pending { background: #fbbf24; color: #78350f; }
          .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🎮 New Order Received</h1>
          </div>
          <div class="content">
            <p>Hello Admin,</p>
            <p>A new order has been received and requires your attention.</p>
            
            <div class="order-box">
              <h2 style="margin-top: 0; color: #667eea;">Order Details</h2>
              <div class="order-item">
                <span class="label">Order Number:</span>
                <span class="value">${e.orderNumber}</span>
              </div>
              <div class="order-item">
                <span class="label">Customer:</span>
                <span class="value">${e.customerName}</span>
              </div>
              <div class="order-item">
                <span class="label">Email:</span>
                <span class="value">${e.customerEmail}</span>
              </div>
              <div class="order-item">
                <span class="label">Game:</span>
                <span class="value">${e.game}</span>
              </div>
              <div class="order-item">
                <span class="label">Package:</span>
                <span class="value">${e.package}</span>
              </div>
              <div class="order-item">
                <span class="label">Quantity:</span>
                <span class="value">${e.quantity||1}</span>
              </div>
              <div class="order-item">
                <span class="label">Total Amount:</span>
                <span class="value">LKR ${e.amount}</span>
              </div>
              <div class="order-item">
                <span class="label">Player ID:</span>
                <span class="value">${e.gameId}</span>
              </div>
              <div class="order-item">
                <span class="label">Player Name:</span>
                <span class="value">${e.playerNickname}</span>
              </div>
              <div class="order-item">
                <span class="label">Payment Method:</span>
                <span class="value">${"bank"===e.paymentMethod?"Bank Transfer":"eZcash"}</span>
              </div>
              <div class="order-item">
                <span class="label">Status:</span>
                <span class="status status-pending">${e.status.toUpperCase()}</span>
              </div>
              <div class="order-item">
                <span class="label">Date:</span>
                <span class="value">${new Date(e.createdAt||Date.now()).toLocaleString()}</span>
              </div>
            </div>
            
            <p>Please log in to the admin dashboard to review the payment slip and process this order.</p>
            <p><strong>Note:</strong> Payment slip has been uploaded by the customer.</p>
          </div>
          <div class="footer">
            <p>This is an automated notification from SL Gaming Hub</p>
            <p>&copy; ${new Date().getFullYear()} SL Gaming Hub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `}),o=e=>({subject:`Order Confirmation - ${e.orderNumber}`,html:`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px; }
          .order-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea; }
          .order-item { margin: 10px 0; }
          .label { font-weight: bold; color: #555; }
          .value { color: #333; }
          .status { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
          .status-pending { background: #fbbf24; color: #78350f; }
          .highlight { background: #e0e7ff; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">✅ Order Confirmed</h1>
          </div>
          <div class="content">
            <p>Dear ${e.customerName},</p>
            <p>Thank you for your order! We have received your payment and are processing your request.</p>
            
            <div class="order-box">
              <h2 style="margin-top: 0; color: #667eea;">Order Summary</h2>
              <div class="order-item">
                <span class="label">Order Number:</span>
                <span class="value">${e.orderNumber}</span>
              </div>
              <div class="order-item">
                <span class="label">Game:</span>
                <span class="value">${e.game}</span>
              </div>
              <div class="order-item">
                <span class="label">Package:</span>
                <span class="value">${e.package}</span>
              </div>
              <div class="order-item">
                <span class="label">Quantity:</span>
                <span class="value">${e.quantity||1}</span>
              </div>
              <div class="order-item">
                <span class="label">Total Amount:</span>
                <span class="value">LKR ${e.amount}</span>
              </div>
              <div class="order-item">
                <span class="label">Player ID:</span>
                <span class="value">${e.gameId}</span>
              </div>
              <div class="order-item">
                <span class="label">Player Name:</span>
                <span class="value">${e.playerNickname}</span>
              </div>
              <div class="order-item">
                <span class="label">Status:</span>
                <span class="status status-pending">${e.status.toUpperCase()}</span>
              </div>
              <div class="order-item">
                <span class="label">Date:</span>
                <span class="value">${new Date(e.createdAt||Date.now()).toLocaleString()}</span>
              </div>
            </div>
            
            <div class="highlight">
              <strong>📦 What's Next?</strong>
              <p style="margin: 10px 0;">Your order is being processed. You will receive your ${e.quantity>1?e.quantity+"x ":""}${e.package} within 24 hours.</p>
            </div>
            
            <p>You will receive another email once your order is completed and the items are credited to your game account.</p>
            
            <p>If you have any questions or concerns, please don't hesitate to contact us.</p>
            
            <p>Best regards,<br><strong>SL Gaming Hub Team</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated email, please do not reply directly.</p>
            <p>For support, contact us at: slgaminghub09@gmail.com</p>
            <p>&copy; ${new Date().getFullYear()} SL Gaming Hub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `}),l=e=>({subject:`Order Completed - ${e.orderNumber}`,html:`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px; }
          .order-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #10b981; }
          .order-item { margin: 10px 0; }
          .label { font-weight: bold; color: #555; }
          .value { color: #333; }
          .status { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
          .status-completed { background: #10b981; color: white; }
          .success-box { background: #d1fae5; padding: 20px; border-radius: 5px; margin: 15px 0; text-align: center; }
          .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🎉 Order Completed!</h1>
          </div>
          <div class="content">
            <p>Dear ${e.customerName},</p>
            
            <div class="success-box">
              <h2 style="margin: 0; color: #059669;">✅ Your Order Has Been Completed!</h2>
              <p style="margin: 10px 0;">The items have been credited to your game account.</p>
            </div>
            
            <div class="order-box">
              <h2 style="margin-top: 0; color: #10b981;">Order Details</h2>
              <div class="order-item">
                <span class="label">Order Number:</span>
                <span class="value">${e.orderNumber}</span>
              </div>
              <div class="order-item">
                <span class="label">Game:</span>
                <span class="value">${e.game}</span>
              </div>
              <div class="order-item">
                <span class="label">Package:</span>
                <span class="value">${e.package}</span>
              </div>
              <div class="order-item">
                <span class="label">Quantity:</span>
                <span class="value">${e.quantity||1}</span>
              </div>
              <div class="order-item">
                <span class="label">Player ID:</span>
                <span class="value">${e.gameId}</span>
              </div>
              <div class="order-item">
                <span class="label">Player Name:</span>
                <span class="value">${e.playerNickname}</span>
              </div>
              <div class="order-item">
                <span class="label">Status:</span>
                <span class="status status-completed">COMPLETED</span>
              </div>
              <div class="order-item">
                <span class="label">Completed On:</span>
                <span class="value">${new Date().toLocaleString()}</span>
              </div>
            </div>
            
            <p><strong>🎮 Please check your game account to verify the credits.</strong></p>
            
            <p>Thank you for choosing SL Gaming Hub! We appreciate your business and hope you enjoy your purchase.</p>
            
            <p>If you have any questions or need assistance, feel free to contact us.</p>
            
            <p>Best regards,<br><strong>SL Gaming Hub Team</strong></p>
          </div>
          <div class="footer">
            <p>Thank you for your purchase!</p>
            <p>For support, contact us at: slgaminghub09@gmail.com</p>
            <p>&copy; ${new Date().getFullYear()} SL Gaming Hub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `}),d=e=>({subject:`Order Completed - ${e.orderNumber}`,html:`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px; }
          .order-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #10b981; }
          .order-item { margin: 10px 0; }
          .label { font-weight: bold; color: #555; }
          .value { color: #333; }
          .status { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; background: #10b981; color: white; }
          .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">✅ Order Completed</h1>
          </div>
          <div class="content">
            <p>Hello Admin,</p>
            <p>The following order has been marked as completed:</p>
            
            <div class="order-box">
              <h2 style="margin-top: 0; color: #10b981;">Order Details</h2>
              <div class="order-item">
                <span class="label">Order Number:</span>
                <span class="value">${e.orderNumber}</span>
              </div>
              <div class="order-item">
                <span class="label">Customer:</span>
                <span class="value">${e.customerName} (${e.customerEmail})</span>
              </div>
              <div class="order-item">
                <span class="label">Game:</span>
                <span class="value">${e.game}</span>
              </div>
              <div class="order-item">
                <span class="label">Package:</span>
                <span class="value">${e.package} x ${e.quantity||1}</span>
              </div>
              <div class="order-item">
                <span class="label">Amount:</span>
                <span class="value">LKR ${e.amount}</span>
              </div>
              <div class="order-item">
                <span class="label">Status:</span>
                <span class="status">COMPLETED</span>
              </div>
              <div class="order-item">
                <span class="label">Completed On:</span>
                <span class="value">${new Date().toLocaleString()}</span>
              </div>
            </div>
            
            <p>A completion notification email has been sent to the customer.</p>
          </div>
          <div class="footer">
            <p>This is an automated notification from SL Gaming Hub</p>
            <p>&copy; ${new Date().getFullYear()} SL Gaming Hub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `})}};var a=require("../../../webpack-runtime.js");a.C(e);var s=e=>a(a.s=e),r=a.X(0,[276,972,245],()=>s(9245));module.exports=r})();