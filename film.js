const c=document.getElementById('c'),x=c.getContext('2d'),W=1280,H=720,V='139,92,246',B='79,140,255';
const tx=document.getElementById('tx'),lg=document.getElementById('logo'),go=document.getElementById('go');
let t0=0,run=false,au=null;
const cl=(a,b,v)=>Math.max(a,Math.min(b,v)),ss=(a,b,t)=>cl(0,1,(t-a)/(b-a)),fi=(t,a,b,c2,d)=>ss(a,b,t)*(1-ss(c2,d,t));
let sd=7;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;
const bk=[];for(let i=0;i<46;i++)bk.push({x:rnd()*W,y:rnd()*H,r:10+rnd()*50,c:rnd()<.5?V:B,a:.05+rnd()*.15,s:rnd()});
function glow(px,py,r,col,a){const g=x.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);x.fillStyle=g;x.fillRect(px-r,py-r,2*r,2*r)}
function star(px,py,s,a,t){x.save();x.translate(px,py);x.rotate(t*.3);x.globalAlpha=a;x.fillStyle='#CFE0FF';x.shadowColor=`rgb(${B})`;x.shadowBlur=20;x.beginPath();for(let i=0;i<8;i++){const r=i%2?s*.14:s,an=i*Math.PI/4;x.lineTo(Math.cos(an)*r,Math.sin(an)*r)}x.fill();x.restore()}
function person(px,py,sc,a,col,face){x.save();x.globalAlpha=a;x.translate(px,py);x.scale(sc,sc);x.fillStyle='#0b0820';x.strokeStyle=`rgba(${col},.8)`;x.lineWidth=2.5;x.shadowColor=`rgb(${col})`;x.shadowBlur=18;
x.beginPath();x.arc(0,-120,34,0,7);x.fill();x.stroke();x.beginPath();x.moveTo(-60,140);x.quadraticCurveTo(-64,-70,0,-76);x.quadraticCurveTo(64,-70,60,140);x.closePath();x.fill();x.stroke();x.restore()}
function waves(x1,y1,x2,y2,p,col,n,a){for(let i=0;i<n;i++){const q=((p*1.3+i/n)%1);const px=x1+(x2-x1)*q,py=y1+(y2-y1)*q;const al=a*Math.sin(q*Math.PI);x.strokeStyle=`rgba(${col},${al})`;x.lineWidth=3;x.shadowColor=`rgb(${col})`;x.shadowBlur=14;x.beginPath();const an=Math.atan2(y2-y1,x2-x1);x.arc(px,py,30+q*50,an-1,an+1);x.stroke()}x.shadowBlur=0}
function wave(x1,x2,y,p,col,a,amp){x.strokeStyle=`rgba(${col},${a})`;x.lineWidth=3;x.shadowColor=`rgb(${col})`;x.shadowBlur=14;x.beginPath();for(let i=0;i<=80;i++){const u=i/80,px=x1+(x2-x1)*u;const py=y+Math.sin(u*18-p*9)*amp*Math.sin(u*Math.PI);i?x.lineTo(px,py):x.moveTo(px,py)}x.stroke();x.shadowBlur=0}
function holo(px,py,r,t,a){x.save();x.globalAlpha=a;x.translate(px,py);x.strokeStyle=`rgb(${B})`;x.shadowColor=`rgb(${V})`;x.shadowBlur=18;x.lineWidth=3;
for(let k=0;k<3;k++){x.save();x.rotate(t*(k%2?-.6:.5)+k);x.beginPath();x.arc(0,0,r-k*22,0,Math.PI*(1.3-k*.2));x.strokeStyle=k==1?`rgb(${V})`:`rgb(${B})`;x.stroke();x.restore()}
x.shadowBlur=0;glow(0,0,r*.6,V,.35+.15*Math.sin(t*3));x.fillStyle='#fff';x.font='300 22px Helvetica';x.textAlign='center';x.fillText('ALLY.AI',0,8);
for(let i=0;i<4;i++){x.fillStyle=`rgba(${B},.5)`;x.fillRect(r+20,-30+i*20,40+((i*37+t*40)%60),5)}x.restore()}
function say(s){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(s);u.lang='fr-FR';u.rate=1;u.pitch=.95;const v=speechSynthesis.getVoices().find(v=>v.lang&&v.lang.startsWith('fr'));if(v)u.voice=v;speechSynthesis.speak(u)}catch(e){}}
const VO=[[8.4,"Découvrez HEAR AI, un appareil auditif intelligent qui associe technologie cochléaire et intelligence artificielle."],[17.4,"HEAR AI capte les sons, les analyse grâce à son intelligence artificielle, et transmet les informations à votre implant cochléaire. Celui-ci stimule le nerf auditif, permettant au cerveau d'interpréter les signaux comme des sons."],[33.4,"Mais HEAR AI va plus loin : c'est aussi votre assistant personnel. Posez vos questions, les réponses arrivent directement dans votre implant."],[42.3,"Notre objectif : faciliter la communication, entre amis, en ville, partout."],[48.3,"En classe, les travaux couvrent la voix du professeur."],[50.6,"HEAR AI filtre le bruit et isole sa voix."],[54.3,"Plus d'autonomie, pour chacun."],[56.4,"Au-delà du silence, une nouvelle connexion."]];
const TX=[[.8,7.5,"Et si la technologie pouvait rapprocher les personnes ?"],[34,41.5,"Votre assistant intelligent, toujours à votre écoute."]];
let vo=[],lp,mg,notes=[];
function music(){au=new (window.AudioContext||window.webkitAudioContext)();mg=au.createGain();mg.gain.value=0;lp=au.createBiquadFilter();lp.type='lowpass';lp.frequency.value=300;lp.connect(mg);mg.connect(au.destination);
[110,164.8,220,277.2,329.6].forEach((f,i)=>{const o=au.createOscillator(),g=au.createGain();o.type=i%2?'sawtooth':'triangle';o.frequency.value=f;o.detune.value=(i-2)*6;g.gain.value=.07;o.connect(g);g.connect(lp);o.start();notes.push(o)});
const l=au.createOscillator(),lg2=au.createGain();l.frequency.value=.15;lg2.gain.value=120;l.connect(lg2);lg2.connect(lp.frequency);l.start();notes.push(l);
const now=au.currentTime;for(let i=0;i<64;i++){const o=au.createOscillator(),g=au.createGain();o.type='sine';o.frequency.value=[440,659.3,554.4,880][i%4];g.gain.setValueAtTime(0,now+8+i*.75);g.gain.linearRampToValueAtTime(.025,now+8.02+i*.75);g.gain.exponentialRampToValueAtTime(.0005,now+8.7+i*.75);if(8+i*.75<55){o.connect(g);g.connect(mg);o.start(now+8+i*.75);o.stop(now+9+i*.75)}}}
function audio(t){if(!au)return;const n=au.currentTime;let g=.03+.5*ss(0,48,t)*(1-ss(55,60,t));lp.frequency.setTargetAtTime(t<8?350:350+ss(8,45,t)*3200,n,.3);mg.gain.setTargetAtTime(g,n,.2)}

function lab(n,s,a){x.save();x.globalAlpha=a;x.textAlign='center';x.fillStyle=`rgb(${B})`;x.font='300 20px Helvetica';x.fillText('ÉTAPE '+n+' / 5',640,70);x.fillStyle='#fff';x.font='300 34px Helvetica';x.shadowColor=`rgb(${V})`;x.shadowBlur=16;x.fillText(s,640,112);x.restore()}
function tag(s,px,py,a,al){x.save();x.globalAlpha=a;x.fillStyle='#fff';x.font='300 20px Helvetica';x.textAlign=al||'center';x.fillText(s,px,py);x.restore()}
function head2(px,py,r,a){x.save();x.globalAlpha=a;x.fillStyle='#0b0820';x.strokeStyle=`rgba(${B},.8)`;x.lineWidth=2.5;x.shadowColor=`rgb(${B})`;x.shadowBlur=16;x.beginPath();x.ellipse(px,py,r,r*1.2,0,0,7);x.fill();x.stroke();x.beginPath();x.moveTo(px-r+4,py-r*.1);x.lineTo(px-r*1.2,py+r*.25);x.lineTo(px-r+10,py+r*.3);x.stroke();x.strokeStyle=`rgba(${V},.9)`;x.beginPath();x.ellipse(px+r*.3,py+r*.05,r*.1,r*.22,0,0,7);x.stroke();x.restore();return[px+r*.3,py+r*.05]}
function dev(px,py,sc,a,rot){x.save();x.translate(px,py);x.scale(sc,sc);x.rotate(rot||0);x.globalAlpha=a;x.lineCap='round';const gr=x.createLinearGradient(-150,-150,150,150);gr.addColorStop(0,'#c9b8ff');gr.addColorStop(1,`rgb(${V})`);x.strokeStyle=gr;x.lineWidth=26;x.shadowColor=`rgb(${V})`;x.shadowBlur=30;x.beginPath();x.moveTo(-70,-130);x.bezierCurveTo(120,-190,200,10,100,130);x.stroke();x.lineWidth=40;x.beginPath();x.moveTo(100,130);x.bezierCurveTo(60,200,-10,170,-30,150);x.stroke();x.restore()}
function sp(cx,cy,u,R){const th=u*4*Math.PI,r=R*(1-u)+14;return[cx+Math.cos(th)*r,cy+Math.sin(th)*r*.9]}
function A(t){bk.forEach(b=>{glow(b.x+Math.sin(t*.3+b.s*9)*20,b.y,b.r*(1.5+.4*Math.sin(t+b.s*5)),b.c,b.a*(.5+.5*ss(0,2,t))*(1-ss(7,8,t)))});
x.strokeStyle='rgba(180,200,255,.15)';x.lineWidth=1;for(let i=0;i<70;i++){const px=(i*97+t*60)%W,py=(i*53+t*500)%H;x.beginPath();x.moveTo(px,py);x.lineTo(px-4,py+22);x.stroke()}
const f=1-ss(7,8,t);[[170,.9],[400,.75],[880,.75],[1110,.95]].forEach(([px,s],i)=>{person(px,470+(i%2)*12,s*.8,.55*f,i%2?V:B);const q=(t*.8+i*.3)%1;x.strokeStyle=`rgba(255,255,255,${.25*(1-q)*f})`;x.beginPath();x.arc(px+(i<2?60:-60),400,10+q*40,-1,1);x.stroke()});
person(640,490,1,f,B);glow(640,390,160,V,.15*f);x.fillStyle=`rgba(255,255,255,${.5*f})`;x.font='italic 60px Georgia';x.textAlign='center';x.fillText('?',700,330+Math.sin(t*2)*6)}

const ref=new Image();let rok=0;ref.onload=()=>{rok=1};ref.src='img1.jpg';
const ease=u=>u*u*(3-2*u);
function cam(K,k){let i=0;while(i<K.length-2&&k>K[i+1][0])i++;const a=K[i],b=K[i+1],u=ease(cl(0,1,(k-a[0])/(b[0]-a[0])));const w=a[3]+(b[3]-a[3])*u,h=w*9/16;return{x:cl(0,1536-w,a[1]+(b[1]-a[1])*u),y:cl(0,1024-h,a[2]+(b[2]-a[2])*u),w:w}}
function draw(c){if(rok)x.drawImage(ref,c.x,c.y,c.w,c.w*9/16,0,0,W,H);const g=x.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.95);g.addColorStop(0,'rgba(5,3,15,0)');g.addColorStop(1,'rgba(5,3,15,.75)');x.fillStyle=g;x.fillRect(0,0,W,H)}
const M=(c,ix,iy)=>[(ix-c.x)/c.w*W,(iy-c.y)/(c.w*9/16)*H];
function pl(P,q){const n=P.length-1,f=q*n,i=Math.min(n-1,Math.floor(f)),u=f-i;return[P[i][0]+(P[i+1][0]-P[i][0])*u,P[i][1]+(P[i+1][1]-P[i][1])*u]}
function ann(c,ix,iy,dx,dy,tt,sb,a){if(a<=0)return;const p=M(c,ix,iy),q=[p[0]+dx,p[1]+dy];x.save();x.globalAlpha=a;glow(p[0],p[1],50,B,.7);x.fillStyle='#fff';x.beginPath();x.arc(p[0],p[1],6,0,7);x.fill();x.strokeStyle=`rgb(${B})`;x.lineWidth=2;x.shadowColor=`rgb(${B})`;x.shadowBlur=10;x.beginPath();x.moveTo(p[0],p[1]);x.lineTo(q[0],q[1]);x.stroke();x.shadowBlur=0;const w=Math.max(tt.length*15,sb.length*10.5)+36,bx=dx>0?q[0]:q[0]-w;x.fillStyle='rgba(10,6,40,.85)';x.strokeStyle=`rgb(${V})`;x.beginPath();x.rect(bx,q[1]-34,w,72);x.fill();x.stroke();x.fillStyle='#fff';x.textAlign='left';x.font='500 26px Helvetica';x.fillText(tt,bx+18,q[1]);x.font='300 19px Helvetica';x.fillStyle='#cfc2ff';x.fillText(sb,bx+18,q[1]+26);x.restore()}
function P(k){const K=[[0,150,300,800],[1.8,120,330,560],[4.8,120,330,560],[5.6,120,390,560],[6.8,120,390,560],[7.6,500,340,360],[8.4,500,340,360],[9,150,300,800]];const c=cam(K,k);draw(c);
x.save();x.globalCompositeOperation='lighter';const sx=-300+((k*200)%1900),g=x.createLinearGradient(sx,0,sx+240,H);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,'rgba(180,160,255,.12)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,W,H);x.restore();
const w=(a,b)=>fi(k,a,a+.5,b-.5,b);
ann(c,393,378,-100,-30,'Microphone','Haute précision',w(2.2,4.6));
ann(c,318,547,-100,0,'Processeur externe','Puce intelligente · IA',w(3.2,4.8));
ann(c,355,668,-100,0,'Batterie','Longue durée',w(5.8,6.9));
ann(c,640,410,120,-60,'Bobine externe','Transmission sans fil',w(7.8,8.6));
x.fillStyle=`rgba(5,3,15,${1-ss(0,1,k)+ss(8.6,9,k)})`;x.fillRect(0,0,W,H)}
function S(k){const K=[[0,180,300,700],[3.6,180,300,700],[4.4,290,470,260],[7.2,290,470,260],[8,560,330,520],[10.8,560,330,520],[11.6,900,430,400],[14.4,900,430,400],[15.2,1000,380,536],[18,1000,200,536]];const c=cam(K,k);draw(c);
const n=Math.min(4,Math.floor(k/3.6)),kk=k-n*3.6,a=fi(kk,0,.5,3.1,3.6),tl=ss(0,.4,kk)*(1-ss(3.3,3.6,kk));
const tg=x.createLinearGradient(0,0,0,190);tg.addColorStop(0,'rgba(5,3,15,.9)');tg.addColorStop(1,'rgba(5,3,15,0)');x.fillStyle=tg;x.fillRect(0,0,W,190);
lab(n+1,['Capture du son','Traitement par l’IA','Transmission sans fil','Stimulation du nerf auditif','Interprétation par le cerveau'][n],tl);
if(n==0){const m=M(c,393,378);person(130,540,.8,a,V);waves(240,420,m[0]-10,m[1]+10,kk*.3,B,4,.8*a);waves(240,460,m[0]-10,m[1]+10,kk*.3+.15,V,3,.6*a);glow(m[0],m[1],80,B,.5*a);star(m[0],m[1],34,a,kk);tag('Microphone',m[0]+120,m[1]-50,a)}
else if(n==1){const p=M(c,345,545);for(let i=0;i<3;i++){const q=(kk*.7+i/3)%1;x.strokeStyle=`rgba(${B},${a*(1-q)})`;x.lineWidth=3;x.beginPath();x.arc(p[0],p[1],40+q*130,0,7);x.stroke()}glow(p[0],p[1],110,V,.5*a);
for(let j=0;j<8;j++){const px=340+((j*47+kk*170)%380),py=p[1]+Math.sin(j*2)*40;x.fillStyle=`rgba(${B},${a*.9})`;x.font='22px monospace';x.textAlign='left';x.fillText(['0','1','0','1','1'][j%5]+['1','0','0','1'][j%4],px,py)}
const L=[4,5,4];L.forEach((mm,li)=>{for(let i=0;i<mm;i++){const px=800+li*130,py=p[1]+(i-(mm-1)/2)*66,pu=.5+.5*Math.sin(kk*5+i+li*2);glow(px,py,40,li==1?V:B,.5*pu*a);x.fillStyle=`rgba(255,255,255,${a})`;x.beginPath();x.arc(px,py,7,0,7);x.fill();if(li<2)for(let q=0;q<L[li+1];q++){x.strokeStyle=`rgba(${B},${.3*a*pu})`;x.lineWidth=1;x.beginPath();x.moveTo(px,py);x.lineTo(px+130,p[1]+(q-(L[li+1]-1)/2)*66);x.stroke()}}});
tag('Puce IA : analyse des sons',640,640,a)}
else if(n==2){const cp=M(c,640,408),im=M(c,935,432);for(let i=0;i<4;i++){const q=(kk*.5+i/4)%1,px=cp[0]+(im[0]-cp[0])*q,py=cp[1]+(im[1]-cp[1])*q-Math.sin(q*Math.PI)*50;glow(px,py,38,B,.9*a);x.fillStyle=`rgba(255,255,255,${a})`;x.beginPath();x.arc(px,py,5,0,7);x.fill()}
for(let i=0;i<3;i++){const q=(kk*.8+i/3)%1;x.strokeStyle=`rgba(${B},${a*(1-q)})`;x.lineWidth=3;x.beginPath();x.arc(cp[0]+30,cp[1],20+q*80,-.8,.8);x.stroke()}
tag('Bobine externe',cp[0],cp[1]-95,a);tag('Implant cochléaire',im[0],im[1]-95,a)}
else if(n==3){const P4=[[960,470],[1020,520],[1100,500],[1160,540],[1207,578]],f=M(c,1207,578);for(let i=0;i<3;i++){const q=(kk*.5+i/3)%1,p=M(c,...pl(P4,q));glow(p[0],p[1],40,'255,220,150',.9*a)}
const pu=.6+.4*Math.sin(kk*8);glow(f[0],f[1],90+40*pu,V,.8*a*pu);star(f[0],f[1],36*pu,a,kk);tag('Électrodes dans la cochlée',f[0]-40,f[1]+130,a);tag('Impulsions électriques',640,650,a)}
else{const P5=[[1210,585],[1300,575],[1370,500],[1420,420],[1420,330],[1390,250]];for(let i=0;i<4;i++){const q=(kk*.45+i/4)%1,p=M(c,...pl(P5,q));glow(p[0],p[1],48,B,.9*a);glow(p[0],p[1],18,'255,255,255',.9*a)}
const g=ss(1.4,3.4,kk),b=M(c,1390,270);glow(b[0],b[1],60+260*g,V,.7*g*a);star(b[0],b[1],60*g,g*a,kk);tag('Le cerveau interprète les signaux comme des sons',640,650,a*ss(1,2,kk))}
x.fillStyle=`rgba(5,3,15,${1-ss(0,.5,k)})`;x.fillRect(0,0,W,H)}
function D(k){const a=ss(0,1,k)*(1-ss(9,10,k));person(1010,500,1,a,B);person(260,500,1,a,V);glow(1010,405,100,B,.5*a);holo(640,230,100,k*1.2,a*ss(0,2,k));
if(k>1&&k<4.5){waves(1000,430,720,270,k*.4,V,3,.9);x.fillStyle=`rgba(${V},${ss(1,1.8,k)*a})`;x.font='italic 24px Georgia';x.textAlign='center';x.fillText('« Quelle est la prochaine station ? »',900,330)}
if(k>4.5&&k<8){waves(720,270,1000,420,(k-4)*.4,B,4,.9);star(1020,410,30*Math.sin(ss(4.5,6,k)*3),a,k)}
if(k>7.3){x.fillStyle=`rgba(255,255,255,${.8*a})`;x.font='60px Helvetica';x.textAlign='center';x.fillText('☺',1010,330);waves(330,430,940,430,k*.3,V,3,.6*a)}}
const SE=[0,2,4,6,12,14];
function jag(x1,y1,x2,y2,p,col,a,amp){const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy),nx=-dy/L,ny=dx/L;x.save();x.strokeStyle=`rgba(${col},${a})`;x.lineWidth=3;x.shadowColor=`rgb(${col})`;x.shadowBlur=12;x.beginPath();for(let i=0;i<=50;i++){const u=i/50,o=(i%2?1:-1)*amp*(.4+.6*Math.abs(Math.sin(i*2.7+p*18)))*Math.sin(u*Math.PI);const px=x1+dx*u+nx*o,py=y1+dy*u+ny*o;i?x.lineTo(px,py):x.moveTo(px,py)}x.stroke();x.restore()}
function E(k){let i=0;while(i<4&&k>=SE[i+1])i++;const kk=k-SE[i],a=fi(kk,0,.3,SE[i+1]-SE[i]-.3,SE[i+1]-SE[i]),L=['Discuter avec un ami','Se déplacer en ville','Demander un renseignement',kk<2.5?'En classe, les travaux couvrent la voix du professeur':'HEAR AI filtre le bruit et isole la voix du professeur','Autonomie et confiance'][i];
bk.slice(0,20).forEach(b=>glow(b.x,b.y,b.r*2,b.c,b.a*a*1.4));
if(i==0){person(440,500,.9,a,B);person(840,500,.9,a,V);wave(480,800,300,kk,V,.5*a,10);x.fillStyle=`rgba(255,255,255,${a})`;x.font='50px Helvetica';x.textAlign='center';x.fillText('☺',440,330)}
else if(i==1){for(let j=0;j<6;j++){x.fillStyle=`rgba(${j%2?V:B},${.12*a})`;x.fillRect(j*230-(kk*60),200+(j%3)*30,140,520)}person(300+kk*400,500,.9,a,B)}
else if(i==2){person(450,500,.9,a,B);person(880,500,.9,a,V);x.fillStyle=`rgba(255,255,255,${a})`;x.font='italic 70px Georgia';x.textAlign='center';x.fillText('?',560,290);waves(880,430,500,430,kk*.5,B,3,.8*a)}
else if(i==3){const F=ss(2.5,3.3,kk);person(260,500,.9,a,V);person(1030,500,.8,a,B);tag('Travaux',640,175,a);tag('Professeur',1030,300,a);tag('Vous, au fond de la classe',260,270,a);
glow(640,210,70,'255,107,122',.5*a*(1-.8*F));jag(640,210,330,390,kk,'255,107,122',a*(.9-.75*F),34*(1-.8*F));jag(620,215,320,425,kk+.4,'255,107,122',a*(.8-.65*F),28*(1-.8*F));
wave(340,960,430,-kk*.6,B,a*(.25+.7*F),8+16*F);
if(F>0){x.save();x.globalAlpha=a*F;x.strokeStyle=`rgb(${V})`;x.lineWidth=4;x.shadowColor=`rgb(${V})`;x.shadowBlur=20;x.beginPath();x.arc(260,392,95+6*Math.sin(kk*6),0,7);x.stroke();x.restore();glow(260,392,130,V,.35*F*a);tag('Filtre vocal',430,480,a*F);star(310,392,22*F,F*a,kk)}}
else{person(640,500,1.1,a,B);x.strokeStyle=`rgba(${V},${a})`;x.lineWidth=3;x.beginPath();x.arc(640,400,300*ss(0,1.5,kk),0,7);x.stroke();star(640,260,50,a,k)}
x.fillStyle=`rgba(255,255,255,${.85*a})`;x.font='300 28px Helvetica';x.textAlign='center';x.fillText(L,640,670)}
function frame(){const t=(performance.now()-t0)/1000;if(t>60){end();return}
x.clearRect(0,0,W,H);x.fillStyle='#05030F';x.fillRect(0,0,W,H);glow(W*.1,H*.1,500,V,.18+.05*Math.sin(t));glow(W*.95,H*.95,550,B,.16+.05*Math.cos(t*.8));
if(t<8)A(t);else if(t<17)P(t-8);else if(t<33)S((t-17)*1.125);else if(t<42)D((t-33)*10/9);else if(t<56)E(t-42);
let o=0;TX.forEach(([a,b,s])=>{if(t>=a&&t<=b){tx.textContent=s;o=ss(a,a+.8,t)*(1-ss(b-.8,b,t))}});tx.style.opacity=o;
const lo=ss(56,57.5,t);lg.style.opacity=lo;if(lo>0){x.fillStyle=`rgba(5,3,15,${lo})`;x.fillRect(0,0,W,H);glow(W*.05,H*.1,520,V,.25*lo);glow(W*.95,H*.9,560,B,.22*lo)}
VO.forEach((v,i)=>{if(!vo[i]&&t>=v[0]){vo[i]=1;say(v[1])}});audio(t);requestAnimationFrame(frame)}
function end(){run=false;notes.forEach(o=>{try{o.stop()}catch(e){}});au&&au.close();au=null;lg.style.opacity=1;go.style.display='flex';document.getElementById('gb').textContent='↻ Rejouer'}
go.onclick=()=>{go.style.display='none';speechSynthesis.cancel();vo=[];notes=[];lg.style.opacity=0;tx.style.opacity=0;sd=7;try{music()}catch(e){}t0=performance.now();run=true;frame()};
