// ── CURSOR (shared) ──
var mDot=document.querySelector(".cursor-dot"),mRing=document.querySelector(".cursor-follower");
var mX=0,mY=0,rX=0,rY=0,mInit=false;
function moveCursor(x,y){mX=x;mY=y;mDot.style.transform="translate("+(x-4)+"px,"+(y-4)+"px)";if(!mInit){rX=x;rY=y;mInit=true;}}
document.addEventListener("mousemove",function(e){moveCursor(e.clientX,e.clientY);});
document.addEventListener("touchmove",function(e){if(e.touches.length>0)moveCursor(e.touches[0].clientX,e.touches[0].clientY);},{passive:true});
document.addEventListener("touchstart",function(e){if(e.touches.length>0)moveCursor(e.touches[0].clientX,e.touches[0].clientY);},{passive:true});
(function loop(){rX+=(mX-rX)*.15;rY+=(mY-rY)*.15;mRing.style.transform="translate("+(rX-20)+"px,"+(rY-20)+"px)";requestAnimationFrame(loop);})();

// ── WORD CYCLING ──
var sfxEl=document.getElementById("animated-suffix");
if(sfxEl){
  var sfx=["imagined.","designed.","fined."],si=0,st="",ph="typing",sel=0;
  function ud2(){if(ph==="selecting"&&sel>0){sfxEl.innerHTML=st.substring(0,st.length-sel)+"<span class='char-selected'>"+st.substring(st.length-sel)+"</span>";}else{sfxEl.textContent=st;}}
  function an(){
    if(ph==="typing"){var s=sfx[si];if(st.length<s.length){st+=s[st.length];ud2();setTimeout(an,100);}else{ph="paused";setTimeout(function(){ph="selecting";sel=0;an();},1500);}}
    else if(ph==="selecting"){if(sel<st.length){sel++;ud2();setTimeout(an,80);}else{ph="paused";setTimeout(function(){ph="deleting";an();},200);}}
    else if(ph==="deleting"){st="";sel=0;sfxEl.textContent="";si=(si+1)%sfx.length;ph="typing";setTimeout(an,50);}
  }
  setTimeout(function(){ph="typing";st="";si=0;an();},1400);
}

// ── SOCIAL TOGGLE ──
var fSoc=document.querySelector(".floating-social"),fBtn=document.querySelector(".social-button:first-child");
if(fSoc&&fBtn){
  fBtn.addEventListener("click",function(e){if(!fSoc.classList.contains("expanded")){e.preventDefault();fSoc.classList.add("expanded");}});
  document.addEventListener("click",function(e){if(!fSoc.contains(e.target)&&fSoc.classList.contains("expanded"))fSoc.classList.remove("expanded");});
}

// ── MOBILE MENU ──
var mTog=document.getElementById("menuToggle"),mLinks=document.getElementById("navLinks"),mOvl=document.getElementById("menuOverlay");
function toggleMenu(){mTog.classList.toggle("active");mLinks.classList.toggle("active");mOvl.classList.toggle("active");document.body.style.overflow=mLinks.classList.contains("active")?"hidden":"auto";}
mTog.addEventListener("click",toggleMenu);
mOvl.addEventListener("click",toggleMenu);
document.querySelectorAll(".nav-links a").forEach(function(l){l.addEventListener("click",function(){if(mLinks.classList.contains("active"))toggleMenu();});});

// ── SCROLL ANIMATIONS (main site) ──
var sObs=new IntersectionObserver(function(ens){ens.forEach(function(e){if(e.isIntersecting)e.target.classList.add("visible");});},{root:null,rootMargin:"0px 0px -15% 0px",threshold:.1});
document.querySelectorAll(".story p,.story .large-statement").forEach(function(el){sObs.observe(el);});
var hlObs=new IntersectionObserver(function(ens){ens.forEach(function(e){if(e.isIntersecting)e.target.classList.add("active");});},{root:null,rootMargin:"-75% 0px -25% 0px",threshold:0});
var hw=document.getElementById("highlight-recovery");if(hw)hlObs.observe(hw);
var liObs=new IntersectionObserver(function(ens){ens.forEach(function(e){if(e.isIntersecting)document.getElementById("logo-inline").classList.add("active");});},{root:null,rootMargin:"-45% 0px -45% 0px",threshold:0});
var rt=document.getElementById("recovery-text");if(rt)liObs.observe(rt);
var ulObs=new IntersectionObserver(function(ens){ens.forEach(function(e){if(e.isIntersecting)e.target.classList.add("active");});},{root:null,rootMargin:"0px 0px -50% 0px",threshold:0});
var ur=document.getElementById("underline-recover");if(ur)ulObs.observe(ur);
var cwObs=new IntersectionObserver(function(ens){ens.forEach(function(e){if(e.isIntersecting)e.target.classList.add("active");});},{root:null,rootMargin:"-75% 0px -25% 0px",threshold:0});
var cw=document.getElementById("circle-while");if(cw)cwObs.observe(cw);

// ── SMOOTH SCROLL ──
document.querySelectorAll("a[href^='#']").forEach(function(a){
  a.addEventListener("click",function(e){
    var h=this.getAttribute("href");if(h==="#")return;
    e.preventDefault();var t=document.querySelector(h);
    if(t)t.scrollIntoView({behavior:"smooth",block:"start"});
  });
});

// ── PITCH OPEN/CLOSE ──
var pitchLoaded=false;
function openPitch(e){
  e.preventDefault();
  var pitchPage=document.getElementById("pitch-page");
  if(!pitchLoaded){
    fetch('pitch-content.html').then(r=>r.text()).then(html=>{
      pitchPage.innerHTML=html;
      pitchLoaded=true;
      initPitch();
    }).catch(()=>{
      console.log("Pitch content not found, loading inline content");
      initPitch();
    });
  }
  pitchPage.classList.add("open");
  document.getElementById("pitch-back").classList.add("visible");
}
function closePitch(){
  document.getElementById("pitch-page").classList.remove("open");
  document.getElementById("pitch-back").classList.remove("visible");
}
function initPitch(){
  var lockBtns=document.querySelectorAll(".lock-btn");
  var pinCode="1234",entered="";
  lockBtns.forEach(function(btn){
    btn.addEventListener("click",function(){
      var n=this.getAttribute("data-n");
      if(n==="del"){entered=entered.slice(0,-1);}else if(n==="ok"){if(entered===pinCode){document.getElementById("lock").style.display="none";document.getElementById("pitch-page").style.zIndex="502";}else{document.getElementById("lock-err").classList.add("show");setTimeout(function(){document.getElementById("lock-err").classList.remove("show");},2000);entered="";}}else{entered+=n;}
      updateDots(entered.length);
    });
  });
  function updateDots(c){
    for(var i=0;i<4;i++){var d=document.getElementById("ld"+i);if(i<c){d.classList.add("filled");}else{d.classList.remove("filled");}}}
}
document.addEventListener("DOMContentLoaded",function(){
  var pBreak=document.querySelector(".breakeven");
  if(pBreak){
    pBreak.addEventListener("click",function(){
      var d=this.querySelector("#be-details");
      if(d)d.style.display=d.style.display==="none"?"block":"none";
    });
  }
});