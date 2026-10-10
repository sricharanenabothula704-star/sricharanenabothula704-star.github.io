/* HYDRA site interactions v3 — true-3D hero */
(function () {
  'use strict';
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================= HYDRA AGENT ORBIT =================
     Seven calm, connected nodes match the site's technical visual language. */
  var cv = document.getElementById('fx');
  if (cv) {
    var ctx = cv.getContext('2d');
    var W=0,H=0,raf=0,t=0,frames=0,lastW=0,lastH=0;
    var AGENTS=[
      {name:'RECON', c1:[0,204,102],  c2:[46,230,168]},
      {name:'HUNT',  c1:[255,68,68],  c2:[255,148,87]},
      {name:'VERIFY',c1:[240,180,41], c2:[255,225,120]},
      {name:'REPORT',c1:[0,170,255],  c2:[120,200,255]},
      {name:'PLAN',  c1:[0,255,136],  c2:[160,255,200]},
      {name:'AUDIT', c1:[255,136,0],  c2:[255,190,120]},
      {name:'DEBUG', c1:[255,0,255],  c2:[230,140,255]}
    ];
    function size(){
      var r=cv.getBoundingClientRect();
      W=cv.width=Math.max(1,Math.round(r.width*devicePixelRatio));
      H=cv.height=Math.max(1,Math.round(r.height*devicePixelRatio));
    }
    function ensureSize(){
      var r=cv.getBoundingClientRect();
      if(Math.abs(r.width-lastW)>2||Math.abs(r.height-lastH)>2||cv.width<2){
        lastW=r.width;lastH=r.height;size();
      }
    }

    function tick(){
      frames++; t+=16;
      if(frames%45===0) ensureSize();
      ctx.clearRect(0,0,W,H);
      var dpr=devicePixelRatio;
      var cx=W*.5, cy=H*.44;
      var S=Math.min(W,H)*.34;
      var rx=Math.min(W*.38,S*1.12), ry=Math.min(H*.14,S*.46);
      var nodes=[];

      // Draw a quiet double orbit and thin connections behind the hero copy.
      ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);
      ctx.strokeStyle='rgba(46,230,168,.18)';ctx.lineWidth=1.2*dpr;ctx.stroke();
      ctx.beginPath();ctx.ellipse(cx,cy,rx*.70,ry*.70,0,0,Math.PI*2);
      ctx.strokeStyle='rgba(88,166,255,.09)';ctx.lineWidth=1*dpr;ctx.stroke();

      for(var n=0;n<AGENTS.length;n++){
        var angle=-Math.PI/2+n*Math.PI*2/AGENTS.length;
        var x=cx+Math.cos(angle)*rx, y=cy+Math.sin(angle)*ry;
        nodes.push({x:x,y:y,angle:angle,agent:AGENTS[n]});
        ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x,y);
        ctx.strokeStyle='rgba(147,161,179,.11)';ctx.lineWidth=1*dpr;ctx.stroke();
      }

      nodes.forEach(function(node){
        var N=node.agent;
        ctx.beginPath();ctx.arc(node.x,node.y,4*dpr,0,Math.PI*2);
        ctx.fillStyle='rgb('+N.c1.join(',')+')';ctx.fill();
        ctx.beginPath();ctx.arc(node.x,node.y,8*dpr,0,Math.PI*2);
        ctx.strokeStyle='rgba('+N.c1.join(',')+',.38)';ctx.lineWidth=1*dpr;ctx.stroke();
        ctx.font=(9*dpr)+'px JetBrains Mono, monospace';
        ctx.fillStyle='rgba(147,161,179,.72)';
        ctx.textAlign=Math.cos(node.angle)>.35?'left':Math.cos(node.angle)<-.35?'right':'center';
        ctx.textBaseline=Math.sin(node.angle)>.35?'top':Math.sin(node.angle)<-.35?'bottom':'middle';
        ctx.fillText(N.name,node.x+Math.cos(node.angle)*13*dpr,node.y+Math.sin(node.angle)*10*dpr);
      });

      // A single slow pulse suggests coordination without competing with the UI.
      if(!RM){
        var pulse=t*.00016;
        ctx.beginPath();ctx.arc(cx+Math.cos(pulse)*rx,cy+Math.sin(pulse)*ry,2.5*dpr,0,Math.PI*2);
        ctx.fillStyle='rgba(231,238,245,.9)';ctx.fill();
      }

      if(!RM) raf=requestAnimationFrame(tick);
    }

    ensureSize();tick();
    if(!RM){
      setTimeout(ensureSize,80);setTimeout(ensureSize,400);setTimeout(ensureSize,1000);
    }
    window.addEventListener('resize',function(){
      cancelAnimationFrame(raf);lastW=0;lastH=0;ensureSize();
      tick();
    });
  }

  /* ================= 3D GLYPH VORTEX (features bg) =================
     Characters fly toward you through a rotating perspective tunnel. */
  var mx = document.getElementById('mx');
  if (mx && !RM) {
    var mctx = mx.getContext('2d');
    var MW=0,MH=0,G=[],rot=0;
    var GLYPHS='01<>/{}$#;=λ*\\|_─│';
    function msize(){
      MW=mx.width=mx.offsetWidth*devicePixelRatio;
      MH=mx.height=mx.offsetHeight*devicePixelRatio;
      G=[];for(var i=0;i<160;i++)G.push({
        x:(Math.random()*2-1),y:(Math.random()*2-1),z:(Math.random()*.9+.1),
        g:GLYPHS[Math.floor(Math.random()*GLYPHS.length)],
        w:Math.random()<.05
      });
    }
    function mdraw(){
      rot+=.0016;
      mctx.fillStyle='rgba(10,14,19,.28)';mctx.fillRect(0,0,MW,MH);
      var dpr=devicePixelRatio,cx=MW/2,cy=MH/2,F=Math.min(MW,MH)*.9;
      var cosR=Math.cos(rot),sinR=Math.sin(rot);
      for(var i=0;i<G.length;i++){
        var p=G[i];
        p.z-=.0035; if(p.z<=.06){p.z=1;p.x=Math.random()*2-1;p.y=Math.random()*2-1;p.g=GLYPHS[Math.floor(Math.random()*GLYPHS.length)];}
        var rx=p.x*Math.cos(rot)-p.y*Math.sin(rot), ry=p.x*Math.sin(rot)+p.y*Math.cos(rot);
        var per=F*p.z;
        var sx=cx+rx*per*.5, sy=cy+ry*per*.5;
        if(sx<-40||sx>MW+40||sy<-40||sy>MH+40) continue;
        var sz=((1-p.z)*15*dpr+1)|0;
        var al=(1-p.z);
        mctx.font=sz+'px JetBrains Mono, monospace';
        mctx.fillStyle=p.w?'rgba(231,238,245,'+(al*.95).toFixed(2)+')'
                          :'rgba(46,230,168,'+(al*.6).toFixed(2)+')';
        mctx.fillText(p.g,sx,sy);
      }
    }
    msize();setInterval(mdraw,33);
    window.addEventListener('resize',msize);
  }

  /* ================= copy buttons ================= */
  document.querySelectorAll('[data-copy]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var src = document.querySelector(btn.getAttribute('data-copy'));
      navigator.clipboard.writeText(src.innerText.trim()).then(function(){
        var old = btn.textContent;
        btn.textContent = '✓ copied';
        setTimeout(function(){ btn.textContent = old; }, 1400);
      });
    });
  });

  /* ================= reveal on scroll ================= */
  var io = new IntersectionObserver(function(es){ es.forEach(function(e){
    if (e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); }
  }); }, { threshold: .12 });
  document.querySelectorAll('.rv').forEach(function(el, i){
    el.style.transitionDelay = ((i % 4) * 60) + 'ms';
    io.observe(el);
  });

  /* ================= terminal demo typer ================= */
  var term = document.getElementById('term-body');
  if (term) {
    var LINES = [
      ['$ git clone https://github.com/sricharanenabothula704-star/hydra.git', 'cmd'],
      ['Cloning into \'hydra\'...', 'out'],
      ['remote: Enumerating objects...', 'out'],
      ['Receiving objects: complete.', 'out'],
      ['$ cd hydra && bash setup.sh --handle YOUR_HANDLE --email you@example.com', 'cmd'],
      ['   \ud83d\udc09 HYDRA \u2014 AI BUG BOUNTY SYSTEM SETUP', 'ok'],
      ['[*] Checking prerequisites and existing config...', 'out'],
      ['[\u2713] Existing config backed up if present', 'ok'],
      ['[*] Installing agents, skills, methodology -> ~/.config/opencode', 'out'],
      ['[*] Rendering opencode.jsonc with your identity', 'out'],
      ['[*] Creating recon workspace, scope allowlist + helper scripts', 'out'],
      [' \u2705 HYDRA IS INSTALLED', 'done'],
      ['$ export OPENROUTER_API_KEY=YOUR_KEY', 'cmd'],
      ['$ hydra doctor', 'cmd'],
      ['[✓] OpenCode found · scope allowlist present', 'out'],
      ['$ python3 -m http.server 8080 --bind 127.0.0.1 --directory docs', 'cmd'],
      ['Serving HTTP on 127.0.0.1 port 8080...', 'out'],
      ['$ hydra scan http://localhost:8080', 'cmd'],
      ['[SCOPE-ALLOW] localhost is on the local allowlist', 'out'],
      ['HEAD response received · security headers checked · no redirect followed', 'done'],
      ['For a real hunt, add only a written-authorized host before /hunt.', 'warn']
    ];
    if(RM){
      LINES.slice(0,8).forEach(function(line){
        var d=document.createElement('div');
        d.className='tl '+line[1];
        d.textContent=line[0];
        term.appendChild(d);
      });
    } else {
      var li = 0, ci = 0, started = false;
      function typeStep() {
        if (li >= LINES.length) {
          setTimeout(function(){ term.innerHTML=''; li=0; ci=0; typeStep(); }, 6000);
          return;
        }
        var txt = LINES[li][0], cls = LINES[li][1];
        if (ci === 0) {
          var d = document.createElement('div');
          d.className = 'tl ' + cls;
          term.appendChild(d);
        }
        var cur = term.lastChild;
        cur.textContent = txt.slice(0, ++ci);
        if (ci >= txt.length) { li++; ci = 0; setTimeout(typeStep, cls === 'cmd' ? 420 : 130); }
        else setTimeout(typeStep, cls === 'cmd' ? 34 : 9);
      }
      var tio = new IntersectionObserver(function(es){ es.forEach(function(e){
        if (e.isIntersecting && !started){ started = true; tio.disconnect(); setTimeout(typeStep, 350); }
      }); }, { threshold: .4 });
      tio.observe(term.closest('.demo'));
    }
  }

  /* ================= 3D tilt on agent cards ================= */
  document.querySelectorAll('.agent-grid .acard').forEach(function(card){
    card.addEventListener('pointermove', function(e){
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = 'perspective(900px) rotateY(' + (px*10).toFixed(2) +
        'deg) rotateX(' + (-py*8).toFixed(2) + 'deg) translateY(-2px)';
    });
    card.addEventListener('pointerleave', function(){
      card.style.transform = '';
    });
  });

  /* ================= stat counters ================= */
  var cio = new IntersectionObserver(function(es){ es.forEach(function(e){
    if (!e.isIntersecting) return;
    cio.unobserve(e.target);
    var el = e.target, end = +el.getAttribute('data-count'), t0 = performance.now();
    (function step(now){
      var k = Math.min(1, (now - t0) / 1100);
      el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }); }, { threshold: .6 });
  document.querySelectorAll('[data-count]').forEach(function(el){ cio.observe(el); });

  /* ================= pipeline sequential glow ================= */
  var pio = new IntersectionObserver(function(es){ es.forEach(function(e){
    if (!e.isIntersecting) return;
    pio.unobserve(e.target);
    e.target.querySelectorAll('.flow-node').forEach(function(n, i){
      setTimeout(function(){ n.classList.add('lit'); setTimeout(function(){ n.classList.remove('lit'); }, 1600); }, 500 + i * 550);
    });
  }); }, { threshold: .35 });
  var fl = document.querySelector('.flow');
  if (fl) pio.observe(fl);

  /* ================= active nav + year ================= */
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function(a){
    if (a.getAttribute('href') === here || (here.indexOf('index') === 0 && (a.getAttribute('href')||'').indexOf('index') === 0))
      a.classList.add('active');
  });
  var y = document.getElementById('yr');
  if (y) y.textContent = new Date().getFullYear();
})();
