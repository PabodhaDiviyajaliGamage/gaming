"use strict";exports.id=346,exports.ids=[346],exports.modules={6594:(e,a,s)=>{s.d(a,{Cz:()=>t,Jv:()=>d,Vw:()=>i,lh:()=>o,sj:()=>l});var r=s(5245);let n=()=>r.createTransport({host:process.env.EMAIL_HOST||"smtp.gmail.com",port:parseInt(process.env.EMAIL_PORT||"587"),secure:"true"===process.env.EMAIL_SECURE,auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASSWORD}}),t=async({to:e,subject:a,html:s,text:r})=>{try{let t=n(),l={from:`"SL Gaming Hub" <${process.env.EMAIL_USER}>`,to:e,subject:a,html:s,text:r||s.replace(/<[^>]*>/g,"")},d=await t.sendMail(l);return console.log("Email sent successfully:",d.messageId),{success:!0,messageId:d.messageId}}catch(e){return console.error("Error sending email:",e),{success:!1,error:e.message}}},l=e=>({subject:`New Order Received - ${e.orderNumber}`,html:`
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
    `}),d=e=>({subject:`Order Confirmation - ${e.orderNumber}`,html:`
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
    `}),i=e=>({subject:`Order Completed - ${e.orderNumber}`,html:`
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
    `}),o=e=>({subject:`Order Completed - ${e.orderNumber}`,html:`
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
    `})},5285:(e,a,s)=>{s.d(a,{Z:()=>d});var r=s(1185),n=s.n(r);let t=process.env.MONGODB_URI;if(!t)throw Error("Please define the MONGODB_URI environment variable inside .env");let l=global.mongoose;l||(l=global.mongoose={conn:null,promise:null});let d=async function(){if(l.conn)return l.conn;l.promise||(l.promise=n().connect(t,{bufferCommands:!1}).then(e=>e));try{l.conn=await l.promise}catch(e){throw l.promise=null,e}return l.conn}},4104:(e,a,s)=>{s.d(a,{Z:()=>l});var r=s(1185),n=s.n(r);let t=new(n()).Schema({orderNumber:{type:String,required:!0,unique:!0},customerName:{type:String,required:!0},customerEmail:{type:String,default:""},game:{type:String,required:!0},package:{type:String,required:!0},quantity:{type:Number,default:1},amount:{type:String,required:!0},status:{type:String,enum:["pending","processing","completed","cancelled"],default:"pending"},gameId:{type:String,required:!0},playerNickname:{type:String,required:!0},paymentMethod:{type:String,enum:["bank","ezcash"],required:!0},paymentSlip:{type:String,required:!0},createdAt:{type:Date,default:Date.now},updatedAt:{type:Date,default:Date.now}});t.pre("save",function(e){this.updatedAt=Date.now(),e()});let l=n().models.Order||n().model("Order",t)}};